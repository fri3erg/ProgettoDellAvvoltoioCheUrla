import { Injectable } from '@angular/core';
import { Account } from 'app/interfaces/account.interface';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accounts: Account[] = [
    // Example tweets
    {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      profileImage: null,
      followerCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 2,
      name: 'Jane Smith',
      username: 'janesmith',
      profileImage: null,
      followerCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 3,
      name: 'Lorenzo De Luise',
      username: 'delusional',
      profileImage: '../../assets/delusional.jpg',
      followerCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 4,
      name: 'Luca Bennati',
      username: 'simplyd',
      profileImage: null,
      followerCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 5,
      name: 'Fabio Vitali',
      username: 'fabiovitali',
      profileImage: '../../assets/vitali.jpg',
      followerCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 6,
      name: 'Carcarlo Pravettoni',
      username: 'gialappas',
      profileImage: '../../assets/gialappas.jpg',
      followerCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 7,
      name: 'Adrian LaSerieEvento',
      username: 'adrian',
      profileImage: '../../assets/trasferimento.jpg',
      followerCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    {
      id: 8,
      name: 'Darian Befana',
      username: 'darian',
      profileImage: '../../assets/darian.webp',
      followerCount: 1,
      followingCount: 10,
      createdAt: new Date()
    },
    // Add more tweets as needed
  ];

  getAccounts(): Account[] {
    // Sort tweets by timestamp in descending order
    return this.accounts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  getSpecificAccount(username: string): Account | undefined{
    let account: Account | undefined;
    account = this.accounts.find(element => element.username == username);
    return account;
  }
}

