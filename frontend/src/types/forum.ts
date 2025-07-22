export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Comment {
  id: string;
  text: string;
  user: User;
  createdAt: string;
}

export interface Post {
  id: string;
  category: string;
  title: string;
  content: string;
  user: User;
  createdAt: string;
  views: number;
  likes: number;
  comments: Comment[];
}
