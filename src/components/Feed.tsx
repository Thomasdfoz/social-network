import { createClient } from "@/utils/supabase/server"
import PostCard from "./PostCard"
import PostComposer from "./PostComposer"

export default async function Feed() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch initial posts
    const { data: posts } = await supabase
        .from('posts')
        .select(`
            *,
            profiles (username),
            likes (user_id)
        `)
        .order('created_at', { ascending: false })
        .limit(20)

    return (
        <div className="animate-fade-in">
            <PostComposer user={user} />

            {posts && posts.length > 0 ? (
                posts.map(post => (
                    <PostCard key={post.id} post={post} currentUserId={user?.id} />
                ))
            ) : (
                <div className="text-center text-gray-500 py-10">
                    Nenhum post ainda. Seja o primeiro a compartilhar algo!
                </div>
            )}

            {/* Load more would go here, implemented as client component or server action */}
            {posts && posts.length === 20 && (
                <div className="text-center py-4 text-sm text-gray-500">
                    Carregar mais... (Em breve)
                </div>
            )}
        </div>
    )
}
