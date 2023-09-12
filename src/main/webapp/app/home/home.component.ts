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

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [SharedModule, RouterModule, CreateSquealComponent, SquealViewComponent],
})
export default class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;

  squeals: ISquealDTO[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router, protected squealService: SquealService) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    this.loadSqueals();
  }

  loadSqueals(): void {
    this.squealService.listSqueals().subscribe(r => {
      if (r.body) {
        this.squeals = r.body;
      }
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  createdSqueal(): void {
    this.loadSqueals();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
