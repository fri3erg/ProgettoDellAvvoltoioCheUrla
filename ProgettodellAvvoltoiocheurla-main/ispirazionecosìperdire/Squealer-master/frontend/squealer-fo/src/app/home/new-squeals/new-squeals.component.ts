import { Component, OnInit } from '@angular/core';
import { Squeal } from 'app/interfaces/squeal.interface';
import { SquealService } from 'app/services/squeal.service';
import { DatePipe } from '@angular/common';
import { Account } from 'app/interfaces/account.interface';
import { AccountService } from 'app/services/account.service';

@Component({
  selector: 'app-new-squeal',
  templateUrl: './new-squeals.component.html',
  styleUrls: ['./new-squeals.component.scss'],
})
export class NewSquealsComponent implements OnInit {
  squeals: Squeal[] = [];
  accounts: Account[] = [];

  newSqueal: Squeal = { id: 0, profileImage: null, username: '', content: '', timestamp: new Date() };

  isLoggedIn: boolean = false;

  isPostFormOpen: boolean = false;

  constructor(
    private squealService: SquealService,
    private datePipe: DatePipe,
    private accountService: AccountService) {}

  ngOnInit(): void {
    this.squeals = this.squealService.getTweets();
    this.accounts = this.accountService.getAccounts();
    for (let tp of this.squeals) {
      for (const acc of this.accounts) {
        if (tp.username == acc.username) {
          tp.profileImage = acc.profileImage;
        }
      }
    }

  }

  formatDate(date: Date): string | null{
    return this.datePipe.transform(date, 'dd-MM-yyyy'); // Change the format pattern as per your requirement
  }

  openPostForm() {
    this.isPostFormOpen = true;
  }

  closePostForm() {
    this.isPostFormOpen = false;
    this.newSqueal = { id: 0, profileImage: null, username: '', content: '', timestamp: new Date() };
  }

  login() {
    // Simulating login logic
    this.isLoggedIn = true;
  }

  addPost(): void {
    const newId = this.squeals.length + 1;
    const newSqueal: Squeal = {
      id: newId,
      profileImage: null,
      username: 'delusional',
      content: this.newSqueal.content,
      timestamp: new Date()
    };

    this.squeals.unshift(newSqueal); // Add the new post at the beginning of the array
    this.newSqueal.content = ''; // Clear the form field
    this.isPostFormOpen = false;
    for (let tp of this.squeals) {
      for (const acc of this.accounts) {
        if (tp.username == acc.username) {
          tp.profileImage = acc.profileImage;
        }
      }
    }
  }
}
