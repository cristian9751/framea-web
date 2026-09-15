import Layout from '../Components/Layout';
import PageHero from '../Components/PageHero';
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
        <div className="mb-5 border-b-2 border-border pb-3">
            <h2 className="font-display text-2xl font-bold tracking-widest text-primary uppercase">
                {children}
            </h2>
        </div>
    );
}

export default function About() {
    return (
        <Layout
            title="FRAMEA | Sobre el Server"
            description="Información sobre FRAMEA - Servidor de SCP: Secret Laboratory en español"
        >
            <PageHero title="Sobre el Servidor" subtitle="Conoce más sobre FRAMEA" />

            <section className="py-24">
                <div className="container">
                    <div className="mx-auto max-w-[900px] space-y-16">
                        <div>
                            <BlockTitle>¿Qué es FRAMEA?</BlockTitle>
                            <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
                                FRAMEA es un servidor comunitario de{' '}
                                <strong className="text-foreground">SCP: Secret Laboratory</strong>{' '}
                                enfocado en la comunidad hispanohablante. Nacimos con la misión de
                                ofrecer una experiencia de juego justa, divertida y optimizada para
                                todos los jugadores de habla hispana.
                            </p>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                Contamos con servidores de alta capacidad, baja latencia y una
                                moderación activa las 24 horas del día. Nuestro objetivo es crear un
                                entorno donde tanto veteranos como nuevos jugadores puedan disfrutar
                                del juego.
                            </p>
                        </div>

                        <div>
                            <BlockTitle>Nuestra Historia</BlockTitle>
                            <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
                                Fundado en 2023, FRAMEA comenzó como un pequeño proyecto entre
                                amigos apasionados por SCP:SL. Rápidamente crecimos gracias al apoyo
                                de la comunidad, convirtiéndonos en uno de los servidores en español
                                más populares del juego.
                            </p>
                            <p className="text-lg leading-relaxed text-muted-foreground">
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
                                        className="flex-row items-center justify-between border-border px-5 py-4 transition-all hover:border-primary"
                                    >
                                        <CardContent className="flex w-full items-center justify-between py-0">
                                            <span className="font-display text-sm tracking-wider text-muted-foreground uppercase">
                                                {s.label}
                                            </span>
                                            <span className="font-mono text-sm font-semibold text-foreground">
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
                                        className="border-border transition-all hover:-translate-y-0.5 hover:border-primary"
                                    >
                                        <CardHeader>
                                            <CardTitle className="font-display text-base font-bold tracking-wider text-primary uppercase">
                                                {m.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm leading-relaxed text-muted-foreground">
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
        </Layout>
    );
}
