'use client'

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export interface Post {
    id: string
    user_id: string
    content: string
    created_at: string
    likes?: { user_id: string }[]
    comments?: { count: number }[]
    profiles?: { username?: string }
}

export default function PostCard({ post, currentUserId }: { post: Post, currentUserId?: string }) {
    const supabase = createClient()
    const router = useRouter()

    // Likes logic
    const [liked, setLiked] = useState<boolean>(
        post.likes && currentUserId ? post.likes.some(l => l.user_id === currentUserId) : false
    )
    const [likesCount, setLikesCount] = useState<number>(post.likes ? post.likes.length : 0)

    const handleLike = async () => {
        if (!currentUserId) return
        const isLiking = !liked
        setLiked(isLiking)
        setLikesCount(prev => isLiking ? prev + 1 : prev - 1)

        const { error } = isLiking
            ? await supabase.from('likes').insert({ post_id: post.id, user_id: currentUserId })
            : await supabase.from('likes').delete().match({ post_id: post.id, user_id: currentUserId })

        if (error) {
            setLiked(!isLiking)
            setLikesCount(prev => isLiking ? prev - 1 : prev + 1)
        } else {
            router.refresh()
        }
    }

    // Comments Logic
    const [showComments, setShowComments] = useState(false)
    const [comments, setComments] = useState<any[]>([])
    const [loadingComments, setLoadingComments] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [localCommentsCount, setLocalCommentsCount] = useState(post.comments?.[0]?.count || 0)

    const handleToggleComments = async () => {
        const newState = !showComments
        setShowComments(newState)

        if (newState && comments.length === 0) {
            setLoadingComments(true)
            const { data, error } = await supabase
                .from('comments')
                .select('*, profiles(username)')
                .eq('post_id', post.id)
                .order('created_at', { ascending: true })

            if (data) {
                setComments(data)
            }
            setLoadingComments(false)
        }
    }

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || !currentUserId) return

        const { data, error } = await supabase
            .from('comments')
            .insert({
                content: newComment,
                post_id: post.id,
                user_id: currentUserId
            })
            .select('*, profiles(username)')
            .single()

        if (data) {
            setComments([...comments, data])
            setNewComment("")
            setLocalCommentsCount(prev => prev + 1)
        }
    }

    // Date formatting (e.g., "2h ago")
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        return `${Math.floor(diffInSeconds / 86400)}d ago`
    }

    return (
        <article className="bg-white dark:bg-gray-900 rounded-xl shadow-soft border border-gray-50 dark:border-gray-800 overflow-hidden group transition-colors duration-300">
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                            {post.profiles?.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-1">
                                <h4 className="font-bold text-charcoal dark:text-white capitalize">{post.profiles?.username || 'Anonymous'}</h4>
                                <span className="material-symbols-outlined text-blue-400 text-[14px] fill-icon">verified</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-custom">
                                <span>@{post.profiles?.username || 'user'}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">public</span>
                                    {formatDate(post.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                    {currentUserId === post.user_id && (
                        <button className="text-slate-custom p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <span className="material-symbols-outlined">more_horiz</span>
                        </button>
                    )}
                </div>

                <p className="text-lg font-medium text-charcoal dark:text-white leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </p>
            </div>

            {/* Action Bar */}
            <div className="px-5 py-4 border-t border-gray-50 dark:border-gray-800 flex items-center gap-6">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-colors ${liked ? 'text-red-500' : 'text-slate-custom hover:text-red-500'}`}
                >
                    <span className={`material-symbols-outlined text-xl ${liked ? 'fill-icon' : ''}`}>favorite</span>
                    <span className="text-sm font-semibold">{likesCount}</span>
                </button>
                <button
                    onClick={handleToggleComments}
                    className="flex items-center gap-2 text-slate-custom hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">chat_bubble</span>
                    <span className="text-sm font-semibold">{localCommentsCount}</span>
                </button>
                <button
                    onClick={() => alert('Compartilhar ainda não implementado!')}
                    className="flex items-center gap-2 text-slate-custom hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">ios_share</span>
                </button>
            </div>

            {/* Inline Comments Section */}
            {showComments && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-5 border-t border-gray-100 dark:border-gray-800">
                    {/* Add Comment */}
                    {currentUserId && (
                        <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none dark:text-white"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-blue-600 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">send</span>
                            </button>
                        </form>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                        {loadingComments ? (
                            <div className="text-center py-4 text-slate-custom text-sm">Loading comments...</div>
                        ) : comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                    <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300">
                                        {comment.profiles?.username?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="flex-1 bg-white dark:bg-gray-900 p-3 rounded-lg rounded-tl-none border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold text-xs text-charcoal dark:text-white">{comment.profiles?.username}</span>
                                            <span className="text-[10px] text-slate-custom">{formatDate(comment.created_at)}</span>
                                        </div>
                                        <p className="text-sm text-charcoal dark:text-gray-300">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-slate-custom text-sm">No comments yet.</div>
                        )}
                    </div>
                </div>
            )}
        </article>
    )
}
