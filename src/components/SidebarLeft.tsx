'use client'

import Link from "next/link"
import { User } from "@supabase/supabase-js"

export default function SidebarLeft({ user }: { user: User | null }) {
    // Minimal logic to simulate the "Credit" check we have in backend
    // In a real app we would fetch this status
    // This is just UI state for now, backend enforces it.
    // We could fetch "last_post_at" from profile if we added it, or check posts.
    // For MVP visual matching, we'll assume state or mock it.

    return (
        <aside className="hidden lg:flex flex-col w-[320px] gap-6 shrink-0 h-fit sticky top-24">
            {/* User Profile Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-soft border border-gray-50 dark:border-gray-800">
                {user ? (
                    <>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="size-14 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                                {user.user_metadata?.username?.[0]?.toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg dark:text-white capitalize">{user.user_metadata?.username}</h3>
                                <p className="text-slate-custom text-sm">@{user.user_metadata?.username}</p>
                            </div>
                        </div>
                        <p className="text-sm text-charcoal dark:text-gray-400 leading-relaxed mb-4">
                            Exploring the intersection of high-stakes social systems and digital scarcity. 🌍✨
                        </p>
                        <button className="w-full py-2.5 rounded-xl border border-gray-100 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white">
                            Edit Profile
                        </button>
                    </>
                ) : (
                    <div className="text-center">
                        <h3 className="font-bold text-lg dark:text-white mb-2">Bem-vindo</h3>
                        <p className="text-sm text-slate-custom mb-4">Faça login para interagir.</p>
                        <Link href="/login" className="block w-full py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-blue-600 transition-colors">
                            Entrar
                        </Link>
                    </div>
                )}
            </div>

            {/* Posting Credits Module */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-soft border border-gray-50 dark:border-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-charcoal dark:text-white">Posting Credits</h3>
                    <span className="material-symbols-outlined text-primary">token</span>
                </div>
                <div className="flex flex-col items-center justify-center py-4 bg-background-light dark:bg-gray-800 rounded-xl mb-6">
                    <span className="text-6xl font-black text-primary">1</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-custom mt-2">Available Now</span>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <p className="text-sm font-medium dark:text-gray-300">Next credit in <span className="text-primary font-bold">24:00:00</span></p>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <p className="text-xs text-slate-custom leading-tight">
                        Credits recharge every 24 hours. Your content represents your unique voice.
                    </p>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold">
                    <span className="material-symbols-outlined fill-icon">home</span>
                    <span>Feed</span>
                </Link>
                <Link href="/explore" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-custom hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-outlined">explore</span>
                    <span>Explore</span>
                </Link>
                <Link href="/bookmarks" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-custom hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-outlined">bookmark</span>
                    <span>Bookmarks</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-custom hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span className="material-symbols-outlined">settings</span>
                    <span>Settings</span>
                </Link>
            </nav>
        </aside>
    )
}
