import { useEffect, useState } from 'react'
import { Comment } from '../types/Comment'
import { getCommentsByPostId } from '../services/commentApi'
import { ApiResponse } from '../types/ApiResponse'

export const useGetPostComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!postId) return

    const fetchComments = async () => {
      setLoading(true)
      setError(null)

      try {
        const response: ApiResponse<Comment[]> = await getCommentsByPostId(postId)

        if (response.success) {
          setComments(response.data || [])
        } else {
          setError(response.message || 'Không thể tải bình luận')
        }
      } catch (err: any) {
        setError(err?.message || 'Có lỗi xảy ra khi tải bình luận')
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [postId])

  return { comments, loading, error }
}
