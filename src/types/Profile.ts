import { Friend } from "./Friend";

export interface Profile {
  _id: string;
  firstName: string;
  surname: string;
  email: string;
  avatar: string;
  coverPhoto?: string;
  birth?: string;
  gender?: string;
  friends: Friend[];
  friendRequests: Friend[];
}
