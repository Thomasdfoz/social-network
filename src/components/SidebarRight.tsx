export default function SidebarRight() {
    return (
        <aside className="hidden xl:flex flex-col w-[300px] gap-6 shrink-0 h-fit sticky top-24">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-soft border border-gray-50 dark:border-gray-800">
                <h3 className="font-bold text-charcoal dark:text-white mb-4">Trending Globally</h3>
                <div className="space-y-4">
                    <div className="cursor-pointer group">
                        <p className="text-xs text-slate-custom">Technology • Trending</p>
                        <p className="font-bold dark:text-white group-hover:text-primary transition-colors">#DigitalScarcity</p>
                        <p className="text-xs text-slate-custom mt-1">2.4k posts</p>
                    </div>
                    <div className="cursor-pointer group">
                        <p className="text-xs text-slate-custom">Environment • Trending</p>
                        <p className="font-bold dark:text-white group-hover:text-primary transition-colors">#RenewableFuture</p>
                        <p className="text-xs text-slate-custom mt-1">1.8k posts</p>
                    </div>
                    <div className="cursor-pointer group">
                        <p className="text-xs text-slate-custom">Arts • Trending</p>
                        <p className="font-bold dark:text-white group-hover:text-primary transition-colors">#MinimalistDesign</p>
                        <p className="text-xs text-slate-custom mt-1">942 posts</p>
                    </div>
                </div>
                <button className="w-full mt-6 text-primary text-sm font-bold hover:underline">Show more</button>
            </div>
            <div className="px-4 text-[11px] text-slate-custom flex flex-wrap gap-x-4 gap-y-2">
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Terms of Service</a>
                <a href="#" className="hover:underline">Cookie Policy</a>
                <a href="#" className="hover:underline">Accessibility</a>
                <span>© 2024 Global Feed Inc.</span>
            </div>
        </aside>
    )
}
