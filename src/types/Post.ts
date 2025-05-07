import { Reaction } from "./Reaction";

export interface Author {
    surname: string;
    firstName: string;
    avatar: string;
    _id: string;
  }
  
  export interface Post {
    _id: string;
    reactions: Reaction[];
    comments: number;
    author: Author;
    createdAt: string | Date;
    content: string;
    images?: [string];
  }