import Layout from '../Components/Layout';
import PageHero from '../Components/PageHero';
import { Card } from '@/Components/ui/card';

const categories = [
    {
        title: 'Generales',
        items: [
            { num: '1.1', strong: 'Respeto mutuo', desc: 'Trata a todos los jugadores con respeto. No se tolerará el acoso, discriminación o insultos graves.' },
            { num: '1.2', strong: 'Sin trampas', desc: 'El uso de hacks, cheats, exploits o cualquier programa de terceros para obtener ventaja resultará en baneo permanente.' },
            { num: '1.3', strong: 'Idioma', desc: 'El idioma oficial del servidor es el español. Se permite el inglés pero priorizamos la comunicación en español.' },
            { num: '1.4', strong: 'Micrófono', desc: 'Prohibido el uso de micrófono con ruido excesivo, música de fondo o sonidos molestos. Usa push-to-talk.' },
            { num: '1.5', strong: 'Spam', desc: 'No hacer spam en el chat de texto ni de voz. Esto incluye publicidad no autorizada.' },
        ],
    },
    {
        title: 'Gameplay',
        items: [
            { num: '2.1', strong: 'Team Killing', desc: 'Prohibido matar intencionalmente a compañeros de equipo. Los accidentes se evalúan caso por caso.' },
            { num: '2.2', strong: 'Ghosting', desc: 'No compartir información del juego fuera de él (Discord, otras llamadas) mientras estás muerto.' },
            { num: '2.3', strong: 'Combat Logging', desc: 'Desconectarse intencionalmente durante un combate para evitar morir está prohibido.' },
            { num: '2.4', strong: 'Mic Spam en SCP', desc: 'Los SCPs no deben hacer spam de micrófono para desorientar a los humanos de manera antinatural.' },
            { num: '2.5', strong: 'Respawn', desc: 'No abusar de mecánicas de respawn. Sigue el flujo natural del juego.' },
        ],
    },
    {
        title: 'Sanciones',
        compact: true,
        items: [
            { num: '3.1', strong: 'Advertencia', desc: 'Infracciones leves - Se registra en el sistema.' },
            { num: '3.2', strong: 'Kick', desc: 'Infracciones moderadas o reincidencia.' },
            { num: '3.3', strong: 'Ban temporal', desc: 'De 1 a 30 días según la gravedad.' },
            { num: '3.4', strong: 'Ban permanente', desc: 'Hacks, amenazas graves o reincidencia extrema.' },
        ],
    },
];

export default function Rules() {
    return (
        <Layout
            title="FRAMEA | Reglas"
            description="Reglas del servidor FRAMEA de SCP: Secret Laboratory"
        >
            <PageHero title="Reglas del Servidor" subtitle="Normas para mantener una comunidad sana y divertida" />

            <section className="py-24">
                <div className="container">
                    <div className="mx-auto max-w-[800px]">
                        {categories.map((cat) => (
                            <div key={cat.title} className="mb-12">
                                <h2 className="mb-6 border-b-2 border-border pb-2.5 font-display text-xl font-bold tracking-widest text-accent uppercase">
                                    {cat.title}
                                </h2>
                                <div
                                    className={`flex flex-col gap-3 ${
                                        cat.compact ? 'md:grid md:grid-cols-2' : ''
                                    }`}
                                >
                                    {cat.items.map((item) => (
                                        <Card
                                            key={item.num}
                                            className={`border-border transition-all hover:border-primary ${
                                                cat.compact ? 'px-5 py-4' : 'px-5 py-5'
                                            }`}
                                        >
                                            <div className="flex gap-4">
                                                <span className="pt-0.5 font-display text-sm font-bold text-primary">
                                                    {item.num}
                                                </span>
                                                <div>
                                                    <strong className="mb-1 block font-display text-sm tracking-wider text-foreground uppercase">
                                                        {item.strong}
                                                    </strong>
                                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
