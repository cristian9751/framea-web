import PageLayout from '../Components/Enterprise/PageLayout';
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
        <PageLayout
            title="ENTERPRISE | Reglas"
            description="Reglas del servidor ENTERPRISE de SCP: Secret Laboratory"
        >
            <section className="bg-enterprise-bg px-5 pt-10 pb-2">
                <div className="mx-auto mb-5 max-w-[940px] text-center">
                    <div className="mx-auto mb-3 h-[2px] w-10 bg-enterprise-primary" />
                    <h2 className="m-0 text-[clamp(27px,6.75vw,39px)] font-black tracking-[0.08em] text-enterprise-text">REGLAS DEL SERVIDOR</h2>
                    <p className="mt-1.5 text-[10.5px] tracking-[0.18em] text-enterprise-muted">NORMAS PARA MANTENER UNA COMUNIDAD SANA Y DIVERTIDA</p>
                </div>
            </section>

            <section className="py-24">
                <div className="container">
                    <div className="mx-auto max-w-[800px]">
                        {categories.map((cat) => (
                            <div key={cat.title} className="mb-12">
                                <h2 className="mb-6 flex items-center gap-3 pb-2 font-display text-xl font-bold tracking-wide uppercase">
                                    <span className="h-5 w-1.5 rounded-full bg-enterprise-primary" />
                                    <span className="text-enterprise-primary">
                                        {cat.title}
                                    </span>
                                </h2>
                                <div
                                    className={`flex flex-col gap-3 ${
                                        cat.compact ? 'md:grid md:grid-cols-2' : ''
                                    }`}
                                >
                                    {cat.items.map((item) => (
                                        <Card
                                            key={item.num}
                                            className={`border-enterprise-border bg-enterprise-card shadow-none rounded-2xl hover:border-enterprise-primary/60 ${
                                                cat.compact ? 'px-5 py-4' : 'px-5 py-5'
                                            }`}
                                        >
                                            <div className="flex gap-4">
                                                <span
                                                    className="flex size-8 shrink-0 items-center justify-center rounded-xl pt-0 font-display text-[0.7rem] font-bold text-enterprise-primary"
                                                    style={{ background: 'rgb(150 119 242 / 0.12)' }}
                                                >
                                                    {item.num}
                                                </span>
                                                <div>
                                                    <strong className="mb-1 block font-display text-sm tracking-wider text-enterprise-text uppercase">
                                                        {item.strong}
                                                    </strong>
                                                    <p className="text-sm leading-relaxed text-enterprise-body">
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
        </PageLayout>
    );
}
