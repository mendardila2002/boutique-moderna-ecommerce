import Header from '@/components/Header';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000"
            alt="Boutique Studio"
            fill
            className="object-cover brightness-50"
            priority
          />
          <div className="relative text-center text-white space-y-4 px-4">
            <h1 className="text-5xl md:text-7xl font-serif italic">Nuestra Historia</h1>
            <p className="text-xs md:text-sm uppercase tracking-[0.5em] font-light">Elevando lo cotidiano a extraordinario</p>
          </div>
        </section>

        {/* Philosophy */}
        <section className="container mx-auto px-4 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-serif leading-tight">
                Curaduría con propósito, <br />
                estilo con alma.
              </h2>
              <div className="space-y-6 text-gray-500 leading-relaxed font-light">
                <p>
                  Boutique Moderna nació en 2024 como una respuesta a la moda efímera. Creemos en piezas que trascienden las temporadas, diseñadas para personas que valoran la calidad sobre la cantidad.
                </p>
                <p>
                  Cada prenda en nuestra colección es seleccionada personalmente por nuestro equipo, asegurando no solo la estética, sino la integridad de los materiales y el comercio justo en cada paso de su creación.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100">
                <div>
                  <p className="text-2xl font-serif">100%</p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Calidad</p>
                </div>
                <div>
                  <p className="text-2xl font-serif">2024</p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Fundación</p>
                </div>
                <div>
                  <p className="text-2xl font-serif">LATAM</p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Corazón</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000"
                alt="Fashion Concept"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </section>

        {/* Manifesto */}
        <section className="bg-black text-white py-24 md:py-32">
          <div className="container mx-auto px-4 text-center max-w-3xl space-y-12">
            <span className="text-[10px] uppercase tracking-[0.5em] text-gray-500">Nuestro Manifiesto</span>
            <h3 className="text-2xl md:text-4xl font-serif italic leading-relaxed">
              "No vestimos cuerpos, acompañamos historias. Creemos que la ropa es el lenguaje silencioso de la confianza."
            </h3>
            <div className="h-20 w-px bg-gray-800 mx-auto" />
          </div>
        </section>
      </main>

      <footer className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">© 2026 Boutique Moderna. Diseñado para el presente.</p>
        </div>
      </footer>
    </div>
  );
}
