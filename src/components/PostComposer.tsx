'use client'

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { User } from "@supabase/supabase-js"
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';

export default function PostComposer({ user }: { user: User | null }) {
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [mediaFile, setMediaFile] = useState<File | null>(null)
    const [mediaPreview, setMediaPreview] = useState<string | null>(null)

    const router = useRouter()
    const supabase = createClient()
    const fileInputRef = useRef<HTMLInputElement>(null)

    if (!user) return null

    // Handlers
    const onEmojiClick = (emojiObject: EmojiClickData) => {
        setContent(prev => prev + emojiObject.emoji)
        setShowEmojiPicker(false)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setMediaFile(file)
            const url = URL.createObjectURL(file)
            setMediaPreview(url)
        }
    }

    const handleLinkClick = () => {
        const url = prompt("Enter URL:")
        if (url) {
            setContent(prev => prev + " " + url)
        }
    }

    const handlePost = async () => {
        if (!content.trim() && !mediaFile) return
        setLoading(true)
        try {
            let imageUrl = null

            if (mediaFile) {
                const fileExt = mediaFile.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${user.id}/${fileName}`

                // 1. Upload to 'posts' bucket
                const { error: uploadError } = await supabase.storage
                    .from('posts')
                    .upload(filePath, mediaFile)

                if (uploadError) {
                    // Fallback or ignore if bucket doesn't exist to prevent crash
                    console.error('Upload failed (bucket might be missing):', uploadError)
                    alert("Erro ao fazer upload da imagem. Verifique se o bucket 'posts' existe.")
                } else {
                    // 2. Get Public URL
                    const { data: publicUrlData } = supabase.storage
                        .from('posts')
                        .getPublicUrl(filePath)
                    imageUrl = publicUrlData.publicUrl
                }
            }

            const { error } = await supabase.from('posts').insert({
                content,
                user_id: user.id,
                ...(imageUrl && { image_url: imageUrl }) // Only add if successfully uploaded
            })

            if (error) {
                if (error.code === '23505' || error.message.includes('posts_one_per_day')) {
                    alert('Você já realizou sua postagem diária. O foco é qualidade! Volte amanhã.')
                } else {
                    console.error(error)
                    // If image_url column doesn't exist, retry without it
                    if (error.message.includes('image_url')) {
                        await supabase.from('posts').insert({
                            content,
                            user_id: user.id
                        })
                    }
                }
            }

            setContent("")
            setMediaFile(null)
            setMediaPreview(null)
            router.refresh()
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-soft border border-gray-50 dark:border-gray-800 transition-colors duration-300 relative">
            <div className="flex gap-4">
                <div className="size-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 shrink-0 flex items-center justify-center text-white font-bold text-sm">
                    {user.user_metadata?.username?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                    <textarea
                        className="w-full border-none focus:ring-0 text-lg dark:text-white dark:bg-gray-900 placeholder:text-slate-custom resize-none min-h-[80px] p-0 mb-4 bg-transparent outline-none"
                        placeholder="Share something with the world..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>

                    {/* Media Preview */}
                    {mediaPreview && (
                        <div className="relative mb-4 rounded-xl overflow-hidden max-h-64 inline-block">
                            <img src={mediaPreview} alt="Preview" className="h-full w-auto max-w-full object-contain bg-black" />
                            <button
                                onClick={() => { setMediaFile(null); setMediaPreview(null) }}
                                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800 pt-4">
                        <div className="flex gap-2 relative">
                            {/* Hidden File Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*,video/*"
                                onChange={handleFileSelect}
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 rounded-lg text-slate-custom hover:bg-background-light dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="material-symbols-outlined">image</span>
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 rounded-lg text-slate-custom hover:bg-background-light dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="material-symbols-outlined">videocam</span>
                            </button>
                            <button
                                onClick={handleLinkClick}
                                className="p-2 rounded-lg text-slate-custom hover:bg-background-light dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="material-symbols-outlined">link</span>
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="p-2 rounded-lg text-slate-custom hover:bg-background-light dark:hover:bg-gray-800 transition-colors"
                                >
                                    <span className="material-symbols-outlined">sentiment_satisfied</span>
                                </button>
                                {showEmojiPicker && (
                                    <div className="absolute top-full left-0 mt-2 z-50">
                                        <div onClick={(e) => { e.stopPropagation() }}> {/* Prevent close on click inside */}
                                            <EmojiPicker onEmojiClick={onEmojiClick} theme={Theme.AUTO} />
                                        </div>
                                        {/* Backdrop to close */}
                                        <div
                                            className="fixed inset-0 z-[-1]"
                                            onClick={() => setShowEmojiPicker(false)}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handlePost}
                            disabled={loading || (!content.trim() && !mediaFile)}
                            className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 flex items-center"
                        >
                            {loading ? 'Publicando...' : 'Publicar Globalmente'}
                            <span className="ml-1 opacity-80 text-xs font-normal hidden sm:inline">(Custo: 1 Crédito)</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
