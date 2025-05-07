export interface User {
  _id: string;
  firstName: string;
  surname: string;
  email: string;
  avatar: string;
  coverPhoto?: string;
  birth?: string;
  gender?: string;
  friends?: string[];
  friendRequests?: string[];
}

export interface RegisterData {
  firstName: string;
  surname: string;
  email: string;
  password: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  gender: string;
}

export interface LoginData {
  email: string;
  password: string;
}
