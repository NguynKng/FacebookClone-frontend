import { Friend } from "./Friend"

export interface Comment {
    _id: string
    post: string
    content: string
    parent?: string | null
    createdAt: Date
    updatedAt: Date
    user: Friend
    replies: Comment[] // Nếu có trả về trong getCommentsByPostId
  }
  