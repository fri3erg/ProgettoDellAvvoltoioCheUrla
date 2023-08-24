// tweet.service.ts
import { Injectable } from '@angular/core';
import { Squeal } from 'app/interfaces/squeal.interface';
@Injectable({
  providedIn: 'root'
})
export class SquealService {
  private squeals: Squeal[] = [
    // Example tweets
    {
      id: 1,
      username: 'johndoe',
      profileImage: '',
      content: 'Hello, Squealer!',
      timestamp: new Date()
    },
    {
      id: 2,
      username: 'janesmith',
      profileImage: '',
      content: 'Angular is awesome! @johndoe RULES!',
      timestamp: new Date()
    },
    {
      id: 3,
      username: 'marco_rossi',
      profileImage: '',
      content: 'Hello, Squealer!',
      timestamp: new Date()
    },
    {
      id: 4,
      username: 'fabio_vitali',
      profileImage: '',
      content: 'Che figata!',
      timestamp: new Date()
    },
    {
      id: 5,
      username: 'luca_bennati',
      profileImage: '',
      content: 'SIUUUUM!',
      timestamp: new Date()
    },
    {
      id: 6,
      username: 'mia_khalifa',
      profileImage: '',
      content: '@johndoe, HI!',
      timestamp: new Date()
    },
    {
      id: 7,
      username: 'delusional',
      profileImage: '',
      content: '@johndoe u r n idiot!',
      timestamp: new Date()
    }
    // Add more tweets as needed
  ];

  getTweets(): Squeal[] {
    // Sort tweets by timestamp in descending order
    return this.squeals.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  getTweetsForUsers(username: string): Squeal[] {
    let squeals: Squeal[] = [];
    for (const squeal of this.squeals) {
      if (squeal.username == username) {
        squeals.push(squeal);
      }
    }
    return squeals;
  }

  getAnswersForUsers(username: string): Squeal[] {
    let squeals: Squeal[] = [];
    for (const squeal of this.squeals) {
      if (squeal.content.includes('@' + username)) {
        squeals.push(squeal);
      }
    }
    return squeals;
  }
  assignProfileImage(squeal: Squeal, url: string): void {
    squeal.profileImage = url;
  }
 }
