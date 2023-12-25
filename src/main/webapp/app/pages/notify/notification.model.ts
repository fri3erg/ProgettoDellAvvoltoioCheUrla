// notification.model.ts

export interface Notification {
  _id: string;
  username?: string;
  reaction?: string;
  body?: string;
  destId?: string;
  timestamp?: number;
  type?: string;
  isRead?: boolean;
}
