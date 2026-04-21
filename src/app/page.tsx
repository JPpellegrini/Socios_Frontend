import { Bell, Search, Settings, Home as HomeIcon, Heart, User, Plus, Pencil, Trash, Check, X, Info, AlertTriangle, Menu, ChevronRight, Share2, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Chip } from "@/components/ui/chip";

/**
 * ShowcaseSection: Un componente auxiliar para mantener la consistencia
 * en los títulos y descripción de cada sección del catálogo.
 */
function ShowcaseSection({ title, description, children }: { 
  title: string; 
  description: string; 
  children: React.ReactNode 
}) {
  return (
    <section className="space-y-6 sm:space-y-8">
      <div className="space-y-1.5 px-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">{description}</p>
      </div>
      <div className="rounded-[2rem] bg-secondary-container/10 p-4 sm:p-8 overflow-hidden shadow-inner ring-1 ring-inset ring-foreground/5">
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/10">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-4 sm:px-8 bg-background/80 backdrop-blur-xl border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" className="hover:bg-surface-variant transition-colors">
            <Search className="w-5 h-5 text-on-surface-variant" />
          </Button>
          <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground/90">
            Material 3 Design System
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon-sm" className="relative hover:bg-surface-variant">
            <Bell className="w-5 h-5 text-on-surface-variant" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
          </Button>
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm ring-2 ring-primary/20 ring-offset-2 ring-offset-background cursor-pointer hover:scale-105 transition-all">
            P
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-12 space-y-12 sm:space-y-24">
        
        {/* HERO INTRO */}
        <section className="py-8 space-y-4 px-1">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Material Design 3</h3>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[1.1]">
            Standardized <br />
            <span className="text-primary/60 italic font-serif">Component Catalog.</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl">
            Un catálogo vivo de componentes y estilos tipográficos siguiendo las directrices oficiales de M3.
          </p>
        </section>

        {/* TYPOGRAPHY SECTION */}
        <ShowcaseSection 
          title="Typography Scale" 
          description="La escala tipográfica de M3 optimiza la legibilidad y jerarquía a través de 5 estilos clave."
        >
          <div className="space-y-8 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-[0.7rem] uppercase tracking-widest text-muted-foreground">
                  <th className="pb-4 font-bold">Style</th>
                  <th className="pb-4 font-bold">Large (Default)</th>
                  <th className="pb-4 font-bold">Medium</th>
                  <th className="pb-4 font-bold">Small</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                <tr>
                  <td className="py-6 align-top font-mono text-[0.7rem] text-primary/70">Display</td>
                  <td className="py-6 text-5xl font-normal tracking-tight">Display L</td>
                  <td className="py-6 text-4xl font-normal">Display M</td>
                  <td className="py-6 text-3xl font-normal">Display S</td>
                </tr>
                <tr>
                  <td className="py-6 align-top font-mono text-[0.7rem] text-primary/70">Headline</td>
                  <td className="py-6 text-2xl font-normal leading-tight">Headline L</td>
                  <td className="py-6 text-xl font-normal">Headline M</td>
                  <td className="py-6 text-lg font-normal">Headline S</td>
                </tr>
                <tr>
                  <td className="py-6 align-top font-mono text-[0.7rem] text-primary/70">Title</td>
                  <td className="py-6 text-base font-semibold">Title L</td>
                  <td className="py-6 text-sm font-semibold tracking-wide">Title M</td>
                  <td className="py-6 text-xs font-semibold tracking-wider">Title S</td>
                </tr>
                <tr>
                  <td className="py-6 align-top font-mono text-[0.7rem] text-primary/70">Body</td>
                  <td className="py-6 text-base font-normal">Body L</td>
                  <td className="py-6 text-sm font-normal">Body M</td>
                  <td className="py-6 text-xs font-normal">Body S</td>
                </tr>
                <tr>
                  <td className="py-6 align-top font-mono text-[0.7rem] text-primary/70">Label</td>
                  <td className="py-6 text-sm font-bold tracking-wide">Label L</td>
                  <td className="py-6 text-xs font-bold tracking-wider">Label M</td>
                  <td className="py-6 text-[0.6rem] font-bold tracking-[0.08em] uppercase">Label S</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ShowcaseSection>

        {/* INPUTS SECTION */}
        <ShowcaseSection 
          title="Text Fields" 
          description="Entradas de datos con soporte para etiquetas flotantes y validaciones visuales."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 max-w-4xl">
            <div className="space-y-2">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary/60 px-1">Filled Text Field</p>
              <Input label="Nombre de Usuario" defaultValue="pablo_dev" />
            </div>
            <div className="space-y-2">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary/60 px-1">Email Variant</p>
              <Input label="Correo electrónico" type="email" placeholder="ejemplo@correo.com" />
            </div>
            <div className="space-y-2">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary/60 px-1">Password Variant</p>
              <Input label="Contraseña" type="password" />
            </div>
            <div className="space-y-2">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary/60 px-1">Standard Text Field (Fallback)</p>
              <Input placeholder="Campo sin etiqueta prop" />
            </div>
          </div>
        </ShowcaseSection>

        {/* BUTTONS SECTION */}
        <ShowcaseSection 
          title="Buttons" 
          description="Acciones con distintos niveles de énfasis. Formato cápsula por defecto con respuesta de contracción."
        >
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary/60 px-1">Emphasis Types</p>
              <div className="flex flex-wrap gap-4 items-center">
                <Button>Filled Button</Button>
                <Button variant="secondary">Tonal Button</Button>
                <Button variant="outline">Outlined Button</Button>
                <Button variant="ghost">Text Button</Button>
                <Button variant="destructive">Tonal Error Button</Button>
              </div>
            </div>
          </div>
        </ShowcaseSection>

        {/* CARDS SECTION */}
        <ShowcaseSection 
          title="Cards" 
          description="Contenedores sólidos para agrupar información con radios XL y respuesta táctil."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>Máximo Énfasis Sólido</CardDescription>
              </CardHeader>
              <CardContent className="text-sm opacity-80">
                Resalta sobre la superficie mediante un tono de contenedor secundario.
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm">Action</Button>
              </CardFooter>
            </Card>

            <Card variant="filled">
              <CardHeader>
                <CardTitle>Filled Card</CardTitle>
                <CardDescription>M3 Surface standard</CardDescription>
              </CardHeader>
              <CardContent className="text-sm opacity-80">
                La variante más equilibrada para la mayoría de los bloques de contenido.
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm">Action</Button>
              </CardFooter>
            </Card>

            <Card variant="outlined">
              <CardHeader>
                <CardTitle>Outlined Card</CardTitle>
                <CardDescription>Bajo Énfasis Sólido</CardDescription>
              </CardHeader>
              <CardContent className="text-sm opacity-80">
                Ideal para agrupar información secundaria de forma discreta.
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm">Action</Button>
              </CardFooter>
            </Card>

            {/* CARD CON IMAGEN (Simulada) */}
            <Card className="p-0 overflow-hidden">
              <div className="h-40 bg-primary/20 flex items-center justify-center text-primary/40 italic font-serif text-2xl">
                Media Content
              </div>
              <CardHeader className="p-6">
                <CardTitle>Tarjeta con Media</CardTitle>
                <CardDescription>Layout vertical</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 text-sm opacity-80">
                Soporte para contenido visual con radios adaptados en las esquinas superiores.
              </CardContent>
            </Card>

            {/* CARD HORIZONTAL */}
            <Card className="col-span-1 md:col-span-2 flex-row items-center p-0 overflow-hidden min-h-[160px]">
              <div className="w-1/3 h-full bg-secondary-container/50 flex items-center justify-center text-secondary-container text-xs font-bold uppercase tracking-widest vertical-text py-4">
                Horizontal
              </div>
              <div className="flex-1 p-6 space-y-2">
                <CardTitle>Diseño Horizontal</CardTitle>
                <CardDescription>Variante Flexible</CardDescription>
                <p className="text-sm opacity-80">Ideal para listas de elementos o secciones de dashboard.</p>
                <Button variant="link" size="sm" className="px-0 h-auto font-bold">Ver Detalles</Button>
              </div>
            </Card>
          </div>
        </ShowcaseSection>

        {/* ACTIONS AND SELECTION */}
        <ShowcaseSection 
          title="Actions and Selection" 
          description="Elementos interactivos para tareas rápidas, filtrado y estados de selección."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* FABs */}
            <div className="space-y-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary/60 px-1">Floating Action Button (FAB)</p>
              <div className="flex items-end gap-6">
                {/* Large FAB */}
                <div className="flex flex-col items-center gap-3">
                  <Button className="size-24 rounded-3xl shadow-m3-2 hover:shadow-m3-3 active:scale-95 flex items-center justify-center">
                    <Search className="size-8" />
                  </Button>
                  <span className="text-[0.65rem] font-medium text-muted-foreground">Large FAB</span>
                </div>
                {/* Standard FAB */}
                <div className="flex flex-col items-center gap-3">
                  <Button className="size-14 rounded-2xl shadow-m3-1 hover:shadow-m3-2 active:scale-90 flex items-center justify-center">
                    <Bell className="size-6" />
                  </Button>
                  <span className="text-[0.65rem] font-medium text-muted-foreground">Standard</span>
                </div>
              </div>
            </div>

            {/* CHIPS */}
            <div className="space-y-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary/60 px-1">Chips</p>
              <div className="flex flex-wrap gap-3">
                <Chip variant="assist">Assist Chip</Chip>
                <Chip variant="filter" selected>Filter Chip</Chip>
                <Chip variant="input">Input Chip</Chip>
                <Chip variant="suggestion">Suggestion</Chip>
              </div>
            </div>
          </div>
        </ShowcaseSection>

        {/* ICONOGRAPHY SECTION */}
        <ShowcaseSection 
          title="Iconography" 
          description="Iconos de sistema para navegación, acciones y estados, optimizados para legibilidad y peso visual."
        >
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6 sm:gap-8">
            {[
              { Icon: HomeIcon, label: "Home" },
              { Icon: Search, label: "Search" },
              { Icon: Settings, label: "Settings" },
              { Icon: Bell, label: "Notifications" },
              { Icon: Heart, label: "Favorite" },
              { Icon: User, label: "Account" },
              { Icon: Plus, label: "Add" },
              { Icon: Pencil, label: "Edit" },
              { Icon: Trash, label: "Delete" },
              { Icon: Check, label: "Done" },
              { Icon: X, label: "Close" },
              { Icon: Info, label: "Info" },
              { Icon: AlertTriangle, label: "Warning" },
              { Icon: Menu, label: "Menu" },
              { Icon: ChevronRight, label: "Navigation" },
              { Icon: Share2, label: "Share" },
              { Icon: Mail, label: "Email" },
              { Icon: MessageSquare, label: "Chat" },
            ].map(({ Icon, label }, i) => (
              <div key={i} className="flex flex-col items-center gap-3 group cursor-pointer transition-transform active:scale-90">
                <div className="size-12 rounded-xl bg-surface-variant/10 flex items-center justify-center transition-colors group-hover:bg-primary/10">
                  <Icon className="size-6 text-on-surface-variant group-hover:text-primary transition-colors" />
                </div>
                <span className="text-[0.6rem] font-medium text-muted-foreground group-hover:text-foreground text-center line-clamp-1">{label}</span>
              </div>
            ))}
          </div>
        </ShowcaseSection>
      </main>

      {/* --- FOOTER --- */}
      <footer className="p-12 text-center border-t border-outline-variant bg-surface-variant/5">
        <div className="flex justify-center gap-6 mb-4">
          <Button variant="ghost" size="icon-sm" className="rounded-full"><Settings className="w-5 h-5 text-muted-foreground" /></Button>
        </div>
        <p className="text-muted-foreground text-sm font-medium">
          SocioFrontend &copy; 2026 <br />
          <span className="text-xs opacity-50 font-normal">Next.js + Tailwind v4 + Material Design 3</span>
        </p>
      </footer>
    </div>
  );
}
