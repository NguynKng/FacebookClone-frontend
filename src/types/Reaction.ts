import { Friend } from "./Friend";

export interface Reaction {
    _id: string;
    post: string;
    user: Friend;
    type: 'Like' | 'Love' | 'Haha' | 'Care' | 'Wow' | 'Sad' | 'Angry';
    createdAt: Date;
}