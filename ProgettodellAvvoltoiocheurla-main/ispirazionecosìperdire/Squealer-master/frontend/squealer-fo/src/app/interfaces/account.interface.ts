export interface Account {
  id: number;
  name: string;
  username: string;
  profileImage: string | null;
  followerCount: number;
  followingCount: number,
  createdAt: Date
}


