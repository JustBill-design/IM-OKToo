import type { Post, User } from '@/types/forum';

const users: User[] = [
  { id: 'user-1', name: 'Yuchuan', avatar: '' },
  { id: 'user-2', name: 'Bill', avatar: '' },
  { id: 'user-3', name: 'yeye', avatar: '' },
    { id: 'user-4', name: 'Natasha', avatar: '' },
    { id: 'user-5', name: 'Dora', avatar: '' },
    { id: 'user-6', name: 'Reece', avatar: '' },
    { id: 'user-7', name: 'Anth', avatar: '' },
    { id: 'user-8', name: 'Vaisha', avatar: '' },
];

export const posts: Post[] = [
  {
    id: 'post-1',
    category: 'General',
    title: 'Feeling cute today might delete later idk',
    content: 'image to be added later zzzzzzzzz',
    user: users[0],
    createdAt: '2025-07-12T10:00:00Z',
    views: 999,
    likes: 99,
    comments: [
      { id: 'comment-1', text: 'kys jk', user: users[1], createdAt: '2025-07-12T10:05:00Z' },
      { id: 'comment-2', text: 'gae', user: users[2], createdAt: '2025-07-12T10:10:00Z' },
    ],
  },
  {
    id: 'post-2',
    category: 'Anxiety',
    title: 'ur mom',
    content: 'i just got this yee yee haw haircut',
    user: users[2],
    createdAt: '2025-07-12T10:00:00Z',
    views: 250,
    likes: 30,
    comments: [
        { id: 'comment-3', text: 'wow!', user: users[4], createdAt: '2025-07-12T10:00:00Z' },
    ],
  },
  {
    id: 'post-3',
    category: 'Depression',
    title: 'im depressed',
    content: 'Today I managed to get out of bed and go school, but I still feel terrible and i just want to sleep all day.',
    user: users[2],
    createdAt: '2025-07-12T10:00:00Z',
    views: 80000,
    likes: 8000,
    comments: [],
  },
];
