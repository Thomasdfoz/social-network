'use client'

import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User } from "@supabase/supabase-js"

export default function AuthButton({ user }: { user: User | null }) {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    if (user) {
        return (
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border-2 border-primary/10 overflow-hidden cursor-pointer bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {user.user_metadata?.username?.[0]?.toUpperCase()}
                </div>
                <button onClick={handleSignOut} className="text-xs text-slate-custom hover:text-red-500 font-medium">Sair</button>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-bold text-primary hover:underline">
                Entrar
            </Link>
            <Link href="/login" className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-soft hover:bg-blue-600 transition-colors">
                Cadastrar
            </Link>
        </div>
    )
}
