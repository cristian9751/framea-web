import PageLayout from '../Components/Enterprise/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

const specs = [
    { label: 'Capacidad', value: '32 Jugadores' },
    { label: 'Ubicación', value: 'Madrid, España' },
    { label: 'Hosting', value: 'Dedicado - 64GB RAM' },
    { label: 'Anti-Cheat', value: 'AC Personalizado' },
    { label: 'Plugins', value: '15+ Exclusivos' },
    { label: 'Versión', value: '14.0 +' },
];

const modes = [
    { title: 'Classic', desc: 'La experiencia clásica de SCP:SL con todas las facciones.' },
    { title: 'Infected', desc: 'Modo infección donde los SCPs aumentan sus filas.' },
    { title: 'VS', desc: 'Duelos equilibrados entre SCPs y humanos.' },
    { title: 'Escape', desc: 'Carrera contrarreloj para escapar de la instalación.' },
];

function BlockTitle({ children }) {
    return (
        <div className="mb-5 flex items-center gap-3 pb-2">
            <span className="h-6 w-1.5 rounded-full bg-enterprise-primary" />
            <h2 className="font-display text-2xl font-bold tracking-wide uppercase">
                <span className="text-enterprise-text">
                    {children}
                </span>
            </h2>
        </div>
    );
}

export default function About() {
    return (
        <PageLayout
            title="ENTERPRISE | Sobre el Server"
            description="Información sobre ENTERPRISE - Servidor de SCP: Secret Laboratory en español"
        >
            <section className="bg-enterprise-bg px-5 pt-10 pb-2">
                <div className="mx-auto mb-5 max-w-[940px] text-center">
                    <div className="mx-auto mb-3 h-[2px] w-10 bg-enterprise-primary" />
                    <h2 className="m-0 text-[clamp(27px,6.75vw,39px)] font-black tracking-[0.08em] text-enterprise-text">SOBRE EL SERVIDOR</h2>
                    <p className="mt-1.5 text-[10.5px] tracking-[0.18em] text-enterprise-muted">CONOCE MÁS SOBRE ENTERPRISE</p>
                </div>
            </section>

            <section className="py-24">
                <div className="container">
                    <div className="mx-auto max-w-[900px] space-y-16">
                        <div>
                            <BlockTitle>¿Qué es ENTERPRISE?</BlockTitle>
                            <p className="mb-4 text-lg leading-relaxed text-enterprise-body">
                                ENTERPRISE es un servidor comunitario de{' '}
                                <strong className="font-semibold text-enterprise-primary">SCP: Secret Laboratory</strong>{' '}
                                enfocado en la comunidad hispanohablante. Nacimos con la misión de
                                ofrecer una experiencia de juego justa, divertida y optimizada para
                                todos los jugadores de habla hispana.
                            </p>
                            <p className="text-lg leading-relaxed text-enterprise-body">
                                Contamos con servidores de alta capacidad, baja latencia y una
                                moderación activa las 24 horas del día. Nuestro objetivo es crear un
                                entorno donde tanto veteranos como nuevos jugadores puedan disfrutar
                                del juego.
                            </p>
                        </div>

                        <div>
                            <BlockTitle>Nuestra Historia</BlockTitle>
                            <p className="mb-4 text-lg leading-relaxed text-enterprise-body">
                                Fundado en 2023, ENTERPRISE comenzó como un pequeño proyecto entre
                                amigos apasionados por SCP:SL. Rápidamente crecimos gracias al apoyo
                                de la comunidad, convirtiéndonos en uno de los servidores en español
                                más populares del juego.
                            </p>
                            <p className="text-lg leading-relaxed text-enterprise-body">
                                Hoy, contamos con cientos de jugadores activos, eventos semanales y
                                un equipo de desarrollo que trabaja constantemente en nuevos plugins
                                y mejoras para la experiencia de juego.
                            </p>
                        </div>

                        <div>
                            <BlockTitle>Especificaciones del Servidor</BlockTitle>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {specs.map((s) => (
                                    <Card
                                        key={s.label}
                                        className="border-enterprise-border bg-enterprise-card shadow-none flex-row items-center justify-between rounded-2xl px-5 py-4 hover:border-enterprise-primary/60"
                                    >
                                        <CardContent className="flex w-full items-center justify-between py-0">
                                            <span className="font-display text-sm tracking-wider text-enterprise-muted uppercase">
                                                {s.label}
                                            </span>
                                            <span className="font-mono text-sm font-semibold text-enterprise-text">
                                                {s.value}
                                            </span>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <div>
                            <BlockTitle>Modos de Juego</BlockTitle>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {modes.map((m) => (
                                    <Card
                                        key={m.title}
                                        className="border-enterprise-border bg-enterprise-card shadow-none rounded-2xl hover:border-enterprise-primary/60"
                                    >
                                        <CardHeader>
                                            <CardTitle className="font-display text-base font-bold tracking-wide uppercase">
                                                <span className="text-enterprise-text">
                                                    {m.title}
                                                </span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm leading-relaxed text-enterprise-body">
                                                {m.desc}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
