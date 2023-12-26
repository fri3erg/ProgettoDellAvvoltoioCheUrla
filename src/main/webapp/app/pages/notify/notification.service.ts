// notification.service.ts

import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Notification } from './notification.model';
import { SocketService } from 'app/socket.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AccountService } from 'app/core/auth/account.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    protected http: HttpClient,
    private messageService: MessageService,
    private socketService: SocketService,
    private accountService: AccountService,
    protected applicationConfigService: ApplicationConfigService
  ) {}

  // Function to start listening for notifications
  public listen(): void {
    console.log('Listening for notifications');
    this.socketService.getNotificationObservable().subscribe((notification: any) => {
      console.log('Received notification from the socket:', notification);
      this.handleNotification(notification.message);
    });
  }

  setReadDirect(username: string): Observable<HttpResponse<number>> {
    const url = this.applicationConfigService.getEndpointFor(`api/notification/directsetread/${username}`);
    return this.http.get<number>(url, { observe: 'response' });
  }
  getNotifCount(username: string): Observable<HttpResponse<number>> {
    const url = this.applicationConfigService.getEndpointFor(`api/notification/direct/${username}`);
    return this.http.get<number>(url, { observe: 'response' });
  }
  getNotificationsUnRead(name: string): Observable<HttpResponse<Notification[]>> {
    const url = this.applicationConfigService.getEndpointFor(`api/notification/notread/${name}`);
    return this.http.get<Notification[]>(url, { observe: 'response' });
  }

  getNotifications(name: string, page: number, size: number): Observable<HttpResponse<Notification[]>> {
    const url = this.applicationConfigService.getEndpointFor(`/api/notification/${name}`);
    const params = new HttpParams().append('page', page).append('size', size);
    return this.http.get<Notification[]>(url, { params, observe: 'response' });
  }
  addMe(): void {
    this.accountService.getAuthenticationState().subscribe(user => {
      console.log('user', user);
      console.log('addMe');
      this.socketService.addUser(user);
    });
  }

  setRead(ids: string[]): Observable<HttpResponse<Notification[]>> {
    const url = this.applicationConfigService.getEndpointFor(`/api/notification/setread`);
    return this.http.post<Notification[]>(url, ids, { observe: 'response' });
  }

  getNotReadCount(name: string): Observable<HttpResponse<number>> {
    const url = this.applicationConfigService.getEndpointFor(`/api/notification/notread/${name}`);
    return this.http.get<number>(url, { observe: 'response' });
  }
  // Function to handle incoming notifications
  private handleNotification(notification: Notification): void {
    console.log('Handling notification:', notification);
    // Your logic to handle the notification
    const severity = 'info';
    let emoji = '';
    if (notification.reaction) {
      emoji = this.getReactionEmoji(notification.reaction);
      console.log(notification.reaction);
    }
    let summary: string;
    switch (notification.type) {
      case 'MESSAGE':
        summary = 'New Message';
        break;
      case 'COMMENT':
        summary = 'New Comment';
        break;
      case 'REACTION':
        // Set the detail with emoji based on the reaction
        summary = `New Reaction: ${emoji}`;
        break;
      default:
        summary = 'Notification';
        break;
    }
    const detail = `New notification: ${notification.body ?? 'New reaction: ' + emoji}`;

    this.messageService.add({ severity, summary, detail });
  }

  // Function to get emoji based on the reaction
  private getReactionEmoji(reaction: string): string {
    switch (reaction) {
      case 'clown':
        return '🤡';
      case 'nerd':
        return '🤓';
      case 'bored':
        return '🥱';
      case 'heart':
        return '❤️';
      case 'exploding':
        return '🤯';
      case 'cold':
        return '🥶';
      default:
        return '';
    }
  }
}
