// socket.service.ts

import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Notification } from './pages/notify/notification.model';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private notificationSubject: Subject<any> = new Subject<any>();

  constructor(private messageService: MessageService) {
    // Replace 'http://localhost:8000' with your Socket.IO server URL
    this.socket = io('http://localhost:8000');

    // Additional setup and event listeners if needed
    this.setupEventListeners();
  }
  addUser(user: any): void {
    // Emit the 'addUser' event to the server
    this.socket.emit('addUser', user);
  }
  // Expose an Observable for notifications
  public getNotificationObservable(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('getNotification', (data: any) => {
        observer.next(data);
      });
    });
  }

  private setupEventListeners(): void {
    // Listen for notification events
    this.socket.on('notification', (data: any) => {
      console.log('Received notification:', data);
      this.notificationSubject.next(data); // Emit the notification to the Observable
    });

    // Listen for disconnect event
    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      // Handle the disconnect event as needed
    });
  }
  // Add more methods as needed for your application
}
