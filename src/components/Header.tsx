'use client'

import Link from "next/link"
import AuthButton from "./AuthButton"
import { User } from "@supabase/supabase-js"

export default function Header({ user }: { user: User | null }) {
    return (
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-background-dark border-b border-gray-100 dark:border-gray-800 px-4 md:px-8 py-3 transition-colors duration-300">
            <div className="max-w-[1280px] mx-auto flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="text-primary transition-transform group-hover:scale-110">
                            <span className="material-symbols-outlined text-3xl font-bold">public</span>
                        </div>
                        <h2 className="text-charcoal dark:text-white text-xl font-extrabold tracking-tight">Global Feed</h2>
                    </Link>

                    {/* Search Bar - Hidden on small screens */}
                    <div className="hidden md:flex items-center">
                        <label className="relative flex items-center w-64 h-10 group">
                            <span className="material-symbols-outlined absolute left-3 text-slate-custom text-xl group-focus-within:text-primary transition-colors">search</span>
                            <input
                                className="w-full h-full pl-10 pr-4 rounded-xl border-none bg-background-light dark:bg-gray-800 text-charcoal dark:text-white focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-slate-custom transition-all"
                                placeholder="Search the world..."
                                type="text"
                            />
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button className="hidden sm:flex items-center justify-center p-2 rounded-xl bg-background-light dark:bg-gray-800 text-charcoal dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button className="hidden sm:flex items-center justify-center p-2 rounded-xl bg-background-light dark:bg-gray-800 text-charcoal dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <span className="material-symbols-outlined">mail</span>
                    </button>

                    <AuthButton user={user} />
                </div>
            </div>
        </header>
    )
}
