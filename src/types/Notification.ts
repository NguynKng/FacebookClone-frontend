import { Friend } from "./Friend"

export interface Notification {
    _id: string
    user: Friend
    actor: Friend
    type: 'like_post' | 'comment_post' | 'new_post' | 'friend_request' | 'accepted_request'
    content: string
    post?: string
    isRead: boolean
    createdAt: Date
}