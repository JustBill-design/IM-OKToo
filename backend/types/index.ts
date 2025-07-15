export interface Post {
  post_id: number;
  title: string;
  content: string;
  category: string;
  views: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user: {
    username: string;
  };
}

export interface Comment {
  comment_id: number;
  content: string;
  user: {
    username: string;
  };
  created_at: string;
}
