import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { NotificationService } from 'app/pages/notify/notification.service';
import { SocketService } from 'app/socket.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
})
export default class FooterComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  unreadNotificationCount = 0;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private notificationService: NotificationService,
    private accountService: AccountService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(a => {
        this.account = a;
        this.notificationService.getNotReadCount(this.account?.login ?? '').subscribe(r => {
          if (r.body) {
            this.unreadNotificationCount = r.body;

            this.socketService.getNotificationObservable().subscribe((notification: Notification) => {
              console.log('Received notification from the socket:', notification);
              this.generateBeep();
              this.notificationService.getNotReadCount(this.account?.login ?? '').subscribe(p => {
                if (p.body) {
                  this.unreadNotificationCount = p.body;
                }
              });
            });
          }
        });
      });
  }

  recalc(): void {
    setTimeout(() => {
      this.notificationService.getNotReadCount(this.account?.login ?? '').subscribe(p => {
        if (p.body) {
          this.unreadNotificationCount = p.body;
        }
      });
    }, 1000);
  }

  generateBeep(duration = 200, frequency = 520): void {
    const audioContext = new window.AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.value = 0.1; // Reduce the volume
    oscillator.frequency.value = frequency; // Frequency in hertz (520Hz is a typical beep sound)
    oscillator.type = 'square'; // Square wave for a classic beep sound

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000); // Stop after the specified duration
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
