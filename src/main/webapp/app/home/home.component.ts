import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { CreateSquealComponent } from 'app/pages/squeal/create-squeal/create-squeal.component';
import { ISquealDTO } from 'app/shared/model/squealDTO-model';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { SquealViewComponent } from 'app/pages/squeal/squeal-view/squeal-view.component';
import { SquealService } from 'app/entities/squeal/service/squeal.service';
import { ObserveElementDirective } from 'app/shared/directive/observe-element-directive';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [SharedModule, RouterModule, CreateSquealComponent, SquealViewComponent, ObserveElementDirective],
})
export default class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;

  squeals: ISquealDTO[] = [];
  page = 0;
  size = 5;
  hasMorePage = false;
  isLoad = false;
  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router, protected squealService: SquealService) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account = account;
        this.loadSqueals();
      });
  }

  loadSqueals(): void {
    console.log('load');
    this.squealService.listSqueals(this.page, this.size).subscribe(r => {
      this.squeals = [];
      if (r.body) {
        this.hasMorePage = r.body.length >= this.size;
        this.page++;
        this.squeals = r.body;
      }
    });
  }

  appendSqueals(): void {
    console.log('load');
    this.squealService.listSqueals(this.page, 5).subscribe(r => {
      if (r.body) {
        this.hasMorePage = r.body.length >= this.size;
        this.page++;
        this.squeals = [...this.squeals.concat(r.body)];
      }
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  createdSqueal(): void {
    this.loadSqueals();
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
}
