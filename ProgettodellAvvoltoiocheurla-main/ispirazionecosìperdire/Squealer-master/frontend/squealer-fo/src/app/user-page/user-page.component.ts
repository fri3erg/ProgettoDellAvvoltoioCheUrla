import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Account } from 'app/interfaces/account.interface';
import { SquealService } from 'app/services/squeal.service';
import { Squeal } from 'app/interfaces/squeal.interface';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'app/services/account.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  account: Account | undefined;
  answerers!: Account[];
  recentPosts!: Squeal[];
  taggedPosts!: Squeal[];
  userName!: string;

  constructor(
    private squealService: SquealService,
    private datePipe: DatePipe,
    public activeRoute: ActivatedRoute,
    private accountService: AccountService) {}

  ngOnInit() {
    this.userName = String(this.activeRoute.snapshot.paramMap.get("username"));
    this.getAccountData();
    this.getRecentPosts();
    this.getTaggedAnswers();
  }

  formatDate(date: Date | undefined): string | null{
    return this.datePipe.transform(date, 'dd/MM/yyyy'); // Change the format pattern as per your requirement
  }

  getAccountData() {
    this.account = this.accountService.getSpecificAccount(this.userName);
  }

  getRecentPosts() {
    this.recentPosts = this.squealService.getTweetsForUsers(this.userName);
  }

  getTaggedAnswers() {
    this.taggedPosts = this.squealService.getAnswersForUsers(this.userName);
    this.answerers = this.accountService.getAccounts();
    for (let tp of this.taggedPosts) {
      for (const answerer of this.answerers) {
        if (tp.username == answerer.username) {
          tp.profileImage = answerer.profileImage;
        }
      }
    }
  }
}
