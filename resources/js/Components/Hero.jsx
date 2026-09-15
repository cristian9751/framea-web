import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { ChatBubbleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const infoItems = [
    { icon: '⚠', text: 'Contenido Breach' },
    { icon: '♔', text: 'PvP Intenso' },
    { icon: '🎮', text: 'Multiplayer' },
];

export default function Hero({ discordLoginUrl = '/auth/signin/discord' }) {
    return (
        <section className="relative flex min-h-[100vh] items-center justify-center overflow-hidden px-5 pb-20 pt-28">
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    background:
                        'linear-gradient(135deg, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.7) 50%, rgba(10,10,15,0.95) 100%)',
                }}
            />
            <div className="relative z-10 max-w-[800px] animate-fade-in text-center">
                <Badge className="mb-6 bg-gradient-to-br from-accent to-rose-800 px-5 py-1 font-display text-xs uppercase tracking-widest text-white">
                    FREE TO PLAY
                </Badge>
                <h1 className="mb-4 font-display text-6xl font-black uppercase tracking-[5px] text-white [line-height:1.1] [text-shadow:0_0_40px_rgba(245,158,11,0.3)] md:text-7xl">
                    <span className="mb-2 block text-2xl font-normal tracking-[15px] text-primary md:text-3xl [text-shadow:0_0_30px_rgba(245,158,11,0.3)]">
                        SCP:
                    </span>
                    FRAMEA
                </h1>
                <p className="mb-8 text-xl text-muted-foreground">
                    Bienvenido a <strong className="text-primary">FRAMEA</strong> &mdash; La
                    experiencia definitiva en espanol
                </p>
                <div className="mb-10 flex flex-wrap justify-center gap-8">
                    {infoItems.map((item) => (
                        <div
                            className="flex items-center gap-2 text-sm font-medium tracking-wider text-muted-foreground uppercase"
                            key={item.text}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button
                        render={<a href={discordLoginUrl} />}
                        size="lg"
                        className="animate-pulse-glow bg-discord text-white hover:bg-discord-dark"
                    >
                        <HugeiconsIcon icon={ChatBubbleIcon} strokeWidth={2} />
                        INICIAR SESION POR DISCORD
                    </Button>
                </div>
            </div>
        </section>
    );
}
