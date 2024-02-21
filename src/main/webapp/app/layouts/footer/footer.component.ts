import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { NotificationService } from 'app/pages/notify/notification.service';
import { SocketService } from 'app/socket.service';
import { Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
})
export default class FooterComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  unreadNotificationCount = 0;
  @ViewChild('dingSound') dingSound?: ElementRef;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private notificationService: NotificationService,
    private accountService: AccountService,
    private socketService: SocketService,
    private ref: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(
        takeUntil(this.destroy$),
        switchMap(a => {
          this.account = a;
          return this.notificationService.getNotReadCount(this.account?.login ?? '');
        }),
        switchMap(r => {
          if (r.body) {
            this.unreadNotificationCount = r.body;
          }
          return this.socketService.getNotificationObservable();
        })
      )
      .subscribe((notification: any) => {
        console.log('Received notification from the socket:', notification);
        this.ref.detectChanges();
        this.generateBeep();
        this.notificationService.getNotReadCount(this.account?.login ?? '').subscribe(p => {
          if (p.body) {
            this.unreadNotificationCount = p.body;
            console.log('Unread notification count:', this.unreadNotificationCount);
          }
        });
      });
  }

  recalc(): void {
    console.log('recalc');
    this.unreadNotificationCount = 0;
    this.router.navigate(['/notification']);
  }

  generateBeep(): void {
    try {
      // In your Angular component// Create an AudioContext
      const audioContext = new window.AudioContext();

      // Create an oscillator
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine'; // Type of wave
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime); // Frequency in hertz (1000Hz is a clear "ding" sound)

      // Create a gain node (to control the volume)
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Set volume to 50%
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5); // Fade out after 1 second

      // Connect the oscillator to the gain node and the gain node to the audio context's destination (the speakers)
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Start the oscillator and schedule it to stop after 2 seconds
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 2); // Stop after 2 seconds to ensure it doesn't keep going indefinitely
    } catch (error) {
      console.error('Error playing the sound:', error);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
