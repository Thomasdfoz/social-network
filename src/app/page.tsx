import { createClient } from "@/utils/supabase/server"
import SidebarLeft from "@/components/SidebarLeft"
import SidebarRight from "@/components/SidebarRight"
import PostComposer from "@/components/PostComposer"
import PostCard, { Post } from "@/components/PostCard"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, profiles(username), likes(user_id), comments(count)')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-charcoal transition-colors duration-300">

      <main className="max-w-[1280px] mx-auto flex gap-8 px-4 md:px-8 py-8">
        {/* Left Sidebar */}
        <SidebarLeft user={user} />

        {/* Main Feed */}
        <section className="flex-1 max-w-[680px] space-y-8">
          {/* Composer Card */}
          <PostComposer user={user} />

          {/* Feed Filter */}
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold dark:text-white">Recent Posts</h2>
            <div className="flex gap-4 text-sm font-medium text-slate-custom">
              <button className="text-primary underline underline-offset-8 decoration-2">Global</button>
              <button className="hover:text-charcoal dark:hover:text-white transition-colors">Following</button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts?.map((post: Post) => (
              <PostCard key={post.id} post={post} currentUserId={user?.id} />
            ))}
            {!posts?.length && (
              <div className="text-center py-12 text-slate-custom">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">rss_feed</span>
                <p>No posts yet. Be the first to share something!</p>
              </div>
            )}
          </div>
        </section>

        {/* Right Sidebar */}
        <SidebarRight />
      </main>

      {/* Mobile Nav (Visible only on small screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-around py-3 z-50 shadow-lg">
        <button className="text-primary"><span className="material-symbols-outlined text-2xl fill-icon">home</span></button>
        <button className="text-slate-custom"><span className="material-symbols-outlined text-2xl">explore</span></button>
        <button className="bg-primary text-white size-10 rounded-full flex items-center justify-center -mt-8 border-4 border-background-light dark:border-background-dark shadow-xl"><span className="material-symbols-outlined">add</span></button>
        <button className="text-slate-custom"><span className="material-symbols-outlined text-2xl">token</span></button>
        <button className="text-slate-custom"><span className="material-symbols-outlined text-2xl">person</span></button>
      </div>
    </div >
  )
}
