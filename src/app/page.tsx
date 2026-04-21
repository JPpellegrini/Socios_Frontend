
import { ArrowRight, Bell, Heart, Mail, Search, Share2, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-6 bg-background/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-full hover:bg-surface-variant transition-colors cursor-pointer">
            <Search className="w-5 h-5 text-on-surface-variant" />
          </div>
          <h1 className="text-xl font-medium tracking-tight">Material 3 Showcase</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full hover:bg-surface-variant transition-colors cursor-pointer relative">
            <Bell className="w-5 h-5 text-on-surface-variant" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold shadow-m3-1">
            P
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-8 space-y-12">
        {/* Hero Section */}
        <section className="bg-primary-container text-on-primary-container p-10 rounded-[2rem] shadow-m3-2 flex flex-col items-start gap-6">
          <h2 className="text-4xl font-bold leading-tight">Welcome to Material 3</h2>
          <p className="text-lg max-w-2xl opacity-90">
            This project has been updated with the Material 3 design system. 
            Enjoy beautiful OKLCH colors, adaptive radii, and elevation-based shadows.
          </p>
          <button className="flex items-center gap-2 px-6 h-12 bg-primary text-primary-foreground rounded-full font-medium hover:shadow-m3-3 transition-all active:scale-95">
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </section>

        {/* Buttons Section */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold">Adaptive Components</h3>
          <div className="flex flex-wrap gap-4">
            {/* FAB Example */}
            <button className="bg-secondary-container text-on-secondary-container p-4 rounded-2xl shadow-m3-3 hover:shadow-m3-4 transition-all">
              <Settings className="w-6 h-6" />
            </button>
            
            {/* Outline Button */}
            <button className="px-6 h-10 border border-outline text-primary rounded-full font-medium hover:bg-primary/5 transition-colors">
              Outlined
            </button>

            {/* Tonal Button */}
            <button className="px-6 h-10 bg-secondary-container text-on-secondary-container rounded-full font-medium hover:shadow-m3-1 hover:brightness-105 transition-all">
              Filled Tonal
            </button>

            {/* Ghost / Text Button */}
            <button className="px-6 h-10 text-primary rounded-full font-medium hover:bg-primary/5 transition-colors flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </section>

        {/* Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-variant text-on-surface-variant p-6 rounded-[1.75rem] space-y-4 border border-outline-variant">
            <div className="flex items-center justify-between">
              <Mail className="w-6 h-6" />
              <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider">
                New
              </div>
            </div>
            <h4 className="text-xl font-bold">Filled Card</h4>
            <p className="opacity-80">
              Surface variants offer a subtle contrast for content organization without overwhelming the UI.
            </p>
          </div>

          <div className="bg-card text-card-foreground p-6 rounded-[1.75rem] space-y-4 shadow-m3-2 border border-transparent">
            <div className="flex items-center justify-between">
              <Heart className="w-6 h-6 text-destructive" />
              <p className="text-sm opacity-60">Elevated</p>
            </div>
            <h4 className="text-xl font-bold">Elevated Card</h4>
            <p className="opacity-80">
              Uses depth and shadows to create focal points for important user information or actions.
            </p>
          </div>
        </section>
      </main>

      <footer className="p-8 text-center border-t border-outline-variant text-muted-foreground text-sm">
        Built with Next.js, Tailwind v4 and Material 3 Principles.
      </footer>
    </div>
  );
}
