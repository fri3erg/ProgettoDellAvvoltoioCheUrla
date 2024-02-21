import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { AccountService } from 'app/core/auth/account.service';
import { ChannelUserService } from 'app/entities/channel-user/service/channel-user.service';
import { SquealService } from 'app/entities/squeal/service/squeal.service';
import { Subject, takeUntil } from 'rxjs';
import { Account } from 'app/core/auth/account.model';
import { ISquealDTO } from 'app/shared/model/squealDTO-model';
import { CreateSquealComponent } from '../squeal/create-squeal/create-squeal.component';
import { SquealViewComponent } from '../squeal/squeal-view/squeal-view.component';
import SharedModule from 'app/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { ISquealDestination } from 'app/entities/squeal-destination/squeal-destination.model';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ObserveElementDirective } from 'app/shared/directive/observe-element-directive';
import { UserCharsService } from 'app/entities/user-chars/service/user-chars.service';
import { MenuItem } from 'primeng/api';
import { LoginService } from 'app/login/login.service';

@Component({
  selector: 'jhi-profile',
  standalone: true,
  imports: [SharedModule, ObserveElementDirective, FormsModule, CommonModule, CreateSquealComponent, SquealViewComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  isNavbarCollapsed = false;
  account: Account | null = null;
  myAccount: Account | null = null;
  nChannels = 0;
  squeals?: ISquealDTO[];
  profileName?: string;
  newphoto = false;
  edit = false;
  squealslength = 0;
  page = 0;
  sizeofpage = 5;
  hasMorePage = false;
  isApiCallInProgress = false;
  isLoad = false;
  response?: string;
  smm?: Account;
  results?: Account[];
  openmySearch = false;
  openEdit = false;
  remaining?: number;

  connectedDestination?: ISquealDestination;

  accountItems: MenuItem[];
  private readonly destroy$ = new Subject<void>();

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected channelService: ChannelService,
    private accountService: AccountService,
    protected channelUserService: ChannelUserService,
    protected squealService: SquealService,
    private messageService: MessageService,
    private userCharsService: UserCharsService,
    private router: Router,
    private loginService: LoginService
  ) {
    this.accountItems = [
      { label: 'Settings', icon: 'pi pi-cog', routerLink: ['/account/settings'] },
      { label: 'Password', icon: 'pi pi-lock', routerLink: ['/account/password'] },
      { label: 'Sign-in', icon: 'pi pi-sign-in', routerLink: ['/login'] },
      { label: 'Sign-out', icon: 'pi pi-sign-out' },
      { label: 'Register', icon: 'pi pi-user-plus', routerLink: ['/account/register'] },
    ];
  }

  ngOnInit(): void {
    this.profileName = this.activatedRoute.snapshot.paramMap.get('name')?.toString() ?? '';
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(a => {
        this.myAccount = a;
        if (this.profileName === '') {
          this.profileName = this.myAccount?.login;
          this.account = this.myAccount;

          this.loadOther();
        } else {
          this.accountService.getUser(this.profileName ?? '').subscribe(r => {
            if (r.body) {
              this.account = r.body;
              console.log(r.body);
              this.loadOther();
            }
          });
        }
        this.squealService.getSquealMadeByUser(this.profileName ?? '', this.page, this.sizeofpage).subscribe(r => {
          if (r.body) {
            this.squeals = r.body;
            this.hasMorePage = r.body.length >= this.sizeofpage;
            this.page++;
            console.log('users squeals:');
            console.log(this.squeals);
          }
        });
        this.squealService.countSquealMadeByUser(this.profileName ?? '').subscribe(r => {
          if (r.body) {
            this.squealslength = r.body;
            console.log('users squeals:');
            console.log(this.squeals);
          }
        });
        this.channelService.countChannelsUserIsSubbed(this.profileName ?? '').subscribe(r => {
          if (r.body) {
            this.nChannels = r.body;
          }
        });
      });
  }

  getRemainingChar(): void {
    this.userCharsService.getCharsUser(this.account?.login ?? '').subscribe(r => {
      if (r.body) {
        this.remaining = r.body.remainingChars ?? 0;
      }
    });
  }

  scrollToSqueals(): void {
    const squealsSection = document.getElementById('squeals');
    if (squealsSection) {
      squealsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  createdSqueal(): void {
    this.page = 0;
    this.squeals = [];
    this.squealService.getSquealMadeByUser(this.profileName ?? '', this.page, this.sizeofpage).subscribe(r => {
      if (r.body) {
        this.squeals = r.body;
        this.hasMorePage = r.body.length >= this.sizeofpage;
        this.page++;
        console.log('users squeals:');
        console.log(this.squeals);
      }
    });
  }

  search(event: any): void {
    const q: string = event.query;
    console.log(q);

    this.accountService.findSMM(q).subscribe(r => {
      this.results = [];
      if (r.body) {
        for (const dest of r.body) {
          this.results.push(dest);
        }
      }
    });
  }
  applyEdit(): void {
    if (this.account) {
      console.log(this.account);

      if (!this.isApiCallInProgress) {
        this.isApiCallInProgress = true;
        this.accountService.update(this.account).subscribe(r => {
          if (r.body) {
            this.openEdit = false;
            console.log(this.account);
          }
          this.isApiCallInProgress = false;
        });
      }
    }
  }

  addSMM(): void {
    this.accountService.addSMM(this.smm?.login).subscribe(r => {
      if (r.body) {
        console.log(this.account);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'SMM added' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'SMM not added' });
      }
    });
  }

  isVip(): boolean {
    // Assuming 'authorities' is an array of strings. Adjust the type if it's different.
    const authorities: string[] = this.account?.authorities ?? [];
    const a = authorities.includes('ROLE_VIP ') || authorities.includes('ROLE_ADMIN');
    return a;
  }

  loadOther(): void {
    this.connectedDestination = {
      destination: this.account?.login,
      destination_id: this.account?._id,
      destination_type: 'MESSAGE',
    };
    this.getRemainingChar();
  }

  setImage(): void {
    console.log(this.account?.img);
    if (this.account) {
      this.accountService.setPhoto(this.account).subscribe(r => {
        if (r.body) {
          this.account = r.body;
          this.newphoto = false;
          this.edit = false;
          console.log(this.account);
        }
      });
    }
  }

  setDefaultImage(event: any): void {
    event.target.src = 'content/images/default-img.jpg'; // Replace this with your default image path
  }

  setFileData(event: any): void {
    const eventTarget: HTMLInputElement | null = event.target as HTMLInputElement | null;
    if (eventTarget?.files?.[0]) {
      const file: File = eventTarget.files[0];
      if (!file.type.startsWith('image/')) {
        // message serivce errpr
        return;
      } else {
        this.toBase64(file, (base64Data: string) => {
          if (!this.account) {
            return;
          }
          this.account.img = base64Data;
          this.account.img_content_type = file.type;
          this.setImage();
          this.newphoto = true;
          console.log(this.account);
        });
      }
    } else {
      // message service no file selected
    }
  }

  rotateImage(): void {
    if (!this.account?.img_content_type || !this.account.img) {
      return;
    }
    this.newphoto = true;
    const prev = this.account.img;
    const base = 'data:' + this.account.img_content_type + ';base64,';
    let result = this.rotateBase64Image90deg(base + prev, true);
    result = result.replace(base, '');
    this.account.img = result;
  }

  rotateBase64Image90deg(base64Image: string, isClockwise: boolean): string {
    // create an off-screen canvas
    const offScreenCanvas = document.createElement('canvas');
    const offScreenCanvasCtx = offScreenCanvas.getContext('2d');

    // cteate Image
    const img = new Image();
    img.src = base64Image;

    // set its dimension to rotated size
    offScreenCanvas.height = img.width;
    offScreenCanvas.width = img.height;

    // rotate and draw source image into the off-screen canvas:
    if (isClockwise) {
      offScreenCanvasCtx?.rotate((90 * Math.PI) / 180);
      offScreenCanvasCtx?.translate(0, -offScreenCanvas.width);
    } else {
      offScreenCanvasCtx?.rotate((-90 * Math.PI) / 180);
      offScreenCanvasCtx?.translate(-offScreenCanvas.height, 0);
    }
    offScreenCanvasCtx?.drawImage(img, 0, 0);

    // encode image to data-uri with base64
    const ret = offScreenCanvas.toDataURL('image/jpeg', 100);
    return ret;
  }

  clearInputImage(): void {
    if (!this.account) {
      return;
    }
    this.newphoto = false;
    this.account.image_url = null;
    this.account.img_content_type = null;
    // if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
    // this.elementRef.nativeElement.querySelector('#' + idInput).value =null;
    // }
  }

  byteSize(base64String?: string | null): string {
    if (!base64String) {
      return '';
    }
    return this.formatAsBytes(this.size(base64String));
  }

  appendSqueals(): void {
    this.squealService.getSquealMadeByUser(this.profileName ?? '', this.page, this.sizeofpage).subscribe(r => {
      if (r.body) {
        this.hasMorePage = r.body.length >= this.sizeofpage;
        this.page++;
        if (!this.squeals) {
          this.squeals = [];
        }
        this.squeals = [...this.squeals.concat(r.body)];
      }
    });
  }

  isIntersecting(event: boolean): void {
    console.log(`Element is intersecting`);
    console.log(event);
    if (!event) {
      this.isLoad = true;
    } else if (this.isLoad && this.hasMorePage) {
      this.appendSqueals();
      this.isLoad = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  /**
   * Method to convert the file to base64
   */
  private toBase64(file: File, callback: (base64Data: string) => void): void {
    const fileReader: FileReader = new FileReader();
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      if (typeof e.target?.result === 'string') {
        const base64Data: string = e.target.result.substring(e.target.result.indexOf('base64,') + 'base64,'.length);
        callback(base64Data);
      }
    };
    fileReader.readAsDataURL(file);
  }

  private endsWith(suffix: string, str: string): boolean {
    return str.includes(suffix, str.length - suffix.length);
  }

  private paddingSize(value: string): number {
    if (this.endsWith('==', value)) {
      return 2;
    }
    if (this.endsWith('=', value)) {
      return 1;
    }
    return 0;
  }

  private size(value: string): number {
    return (value.length / 4) * 3 - this.paddingSize(value);
  }

  private formatAsBytes(size?: number | null): string {
    if (!size) {
      return '';
    }
    return size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' bytes'; // NOSONAR
  }
}
