// notification.model.ts

export interface Notification {
  _id: string;
  username?: string;
  reaction?: string;
  body?: string;
  profile_img?: string;
  profile_img_content_type?: string;
  destId?: string;
  timestamp?: number;
  type?: string;
  isRead?: boolean;
}
