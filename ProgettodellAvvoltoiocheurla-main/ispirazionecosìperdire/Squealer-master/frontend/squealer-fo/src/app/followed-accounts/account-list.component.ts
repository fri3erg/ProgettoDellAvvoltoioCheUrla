// account-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Account } from 'app/interfaces/account.interface';
import { Router } from '@angular/router';
import { AccountService } from 'app/services/account.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
})
export class AccountListComponent implements OnInit{
  accounts: Account[] = [];
  constructor(private router: Router,
    private accountService: AccountService) {}
    ngOnInit(): void {
        this.accounts = this.accountService.getAccounts();
    }
}
