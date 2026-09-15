import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

const features = [
    { icon: '🔒', title: 'Anti-Cheat Activo', desc: 'Sistema de proteccion avanzado para garantizar partidas justas y sin tramposos.' },
    { icon: '💬', title: 'Comunidad Activa', desc: 'Comunidad hispanohablante con Discord, eventos semanales y soporte en vivo.' },
    { icon: '⚡', title: 'Baja Latencia', desc: 'Servidor optimizado con hosting premium para la mejor experiencia de juego.' },
    { icon: '🛠', title: 'Mods Exclusivos', desc: 'Plugins personalizados y modos de juego unicos que no encontraras en otros servidores.' },
    { icon: '🏆', title: 'Eventos Semanales', desc: 'Eventos organizados con premios, torneos y partidas especiales cada semana.' },
    { icon: '🗣', title: 'Staff Profesional', desc: 'Equipo de moderacion experimentado disponible 24/7 para ayudarte.' },
];

export default function Features() {
    return (
        <section className="relative py-24">
            <div className="container">
                <h2 className="mb-3 text-center font-display text-4xl font-bold tracking-[3px] text-foreground uppercase">
                    Por que FRAMEA?
                </h2>
                <div className="mx-auto mb-14 h-0.5 w-15 rounded bg-gradient-to-r from-primary to-accent" />
                <p className="mb-14 text-center text-lg text-muted-foreground">
                    La mejor experiencia SCP:SL en espanol
                </p>
                <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
                    {features.map((f) => (
                        <Card
                            key={f.title}
                            className="items-center border-border text-center transition-all hover:-translate-y-1.5 hover:border-primary hover:shadow-2xl"
                        >
                            <CardHeader className="items-center">
                                <span className="mb-4 block text-4xl">{f.icon}</span>
                                <CardTitle className="font-display text-base font-bold tracking-wider text-foreground uppercase">
                                    {f.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {f.desc}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
