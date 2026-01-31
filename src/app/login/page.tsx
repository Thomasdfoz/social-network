'use client'

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const username = formData.get('username') as string

        try {
            if (isSignUp) {
                if (!username) throw new Error('Username é obrigatório')
                const { error } = await supabase.auth.signUp({
                    email, password, options: { data: { username } }
                })
                if (error) throw error
                alert('Cadastro realizado! Faça Login.')
                setIsSignUp(false)
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error
                // Force a hard reload to ensure layout updates with new session
                window.location.href = '/'
            }
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8">
                <Link href="/" className="flex items-center gap-2 justify-center mb-4 group">
                    <div className="text-primary transition-transform group-hover:scale-110">
                        <span className="material-symbols-outlined text-4xl font-bold">public</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-charcoal dark:text-white tracking-tight">Global Feed</h1>
                </Link>
                <p className="text-slate-custom max-w-sm mx-auto">Join the global conversation. One post per day. Make it count.</p>
            </div>

            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-soft border border-gray-50 dark:border-gray-800 p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-charcoal dark:text-white">
                    {isSignUp ? 'Create account' : 'Welcome back'}
                </h2>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">error</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-charcoal dark:text-gray-300">Username</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-custom font-medium">@</span>
                                <input name="username" className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="username" required />
                            </div>
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-charcoal dark:text-gray-300">Email</label>
                        <input name="email" type="email" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="you@example.com" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-charcoal dark:text-gray-300">Password</label>
                        <input name="password" type="password" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="••••••••" />
                    </div>

                    <button disabled={loading} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 mt-2 disabled:opacity-70 flex items-center justify-center gap-2">
                        {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center mt-6 pt-6 border-t border-gray-50 dark:border-gray-800">
                    <button
                        onClick={() => { setIsSignUp(!isSignUp); setError(null) }}
                        className="text-sm text-slate-custom hover:text-primary font-medium transition-colors"
                        type="button"
                    >
                        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                    </button>
                </div>
            </div>
        </div>
    )
}
