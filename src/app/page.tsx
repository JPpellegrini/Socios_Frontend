import { Bell, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Baseline</h3>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[1.1]">
            Visual Excellence <br />
            <span className="text-primary/60 italic font-serif">by design.</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl">
            Un showcase de componentes encapsulados que siguen las directrices de Material You para una experiencia moderna.
          </p>
        </section>

        {/* INPUTS SECTION */}
        <ShowcaseSection 
          title="Campos de Texto" 
          description="Material 3 Filled fields con soporte nativo de etiquetas flotantes y estados interactivos."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 max-w-4xl">
            <Input label="Nombre de Usuario" defaultValue="pablo_dev" />
            <Input label="Correo electrónico" type="email" placeholder="ejemplo@correo.com" />
            <Input label="Contraseña" type="password" />
            <Input placeholder="Campo sin etiqueta prop (estándar)" />
          </div>
        </ShowcaseSection>

        {/* BUTTONS SECTION */}
        <ShowcaseSection 
          title="Acciones y Botones" 
          description="Desde botones de alto énfasis hasta opciones discretas. Formato cápsula por defecto."
        >
          <div className="space-y-12">
            {/* VARIANTES */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-primary/70">Variantes de Énfasis</p>
              <div className="flex flex-wrap gap-4 items-center">
                <Button>Filled (Primary)</Button>
                <Button variant="secondary">Filled Tonal</Button>
                <Button variant="outline">Outlined</Button>
                <Button variant="ghost">Text / Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            {/* TAMAÑOS */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-primary/70">Escala de Tamaños</p>
              <div className="flex flex-wrap gap-6 items-end">
                <Button size="xs">XS</Button>
                <Button size="sm">Small</Button>
                <Button size="default">Default (M3)</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large (Hero)</Button>
              </div>
            </div>
          </div>
        </ShowcaseSection>

        {/* CARDS SECTION */}
        <ShowcaseSection 
          title="Contenedores y Tarjetas" 
          description="Uso de contrastes sólidos y radios de 28px para agrupar contenido. Ahora con respuesta táctil de contracción."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Tonal (Container)</CardTitle>
                <CardDescription>Énfasis Medio</CardDescription>
              </CardHeader>
              <CardContent className="text-sm opacity-80">
                Usa el color de contenedor secundario para resaltar secciones interactivas.
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm">Interactuar</Button>
              </CardFooter>
            </Card>

            <Card variant="filled">
              <CardHeader>
                <CardTitle>Superficie</CardTitle>
                <CardDescription>Surface Variant</CardDescription>
              </CardHeader>
              <CardContent className="text-sm opacity-80">
                Un bloque sólido y equilibrado para la mayoría de los casos de uso.
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm">Acción</Button>
              </CardFooter>
            </Card>

            <Card variant="outlined">
              <CardHeader>
                <CardTitle>Bajo Énfasis</CardTitle>
                <CardDescription>Delineado Sólido</CardDescription>
              </CardHeader>
              <CardContent className="text-sm opacity-80">
                Utiliza una opacidad mínima para una agrupación discreta.
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Configurar</Button>
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
