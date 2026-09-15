import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card';

export default function DonnorPack({ color, tier, name, price, description, perks, submitText }) {
    return (
        <Card className="flex flex-col overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl">
            <CardHeader
                className="border-b border-border text-center"
                style={{ borderColor: color }}
            >
                <div
                    className="font-display text-xs font-bold tracking-[3px] uppercase"
                    style={{ color }}
                >
                    {tier}
                </div>
                <div className="font-display text-2xl font-black tracking-wider text-foreground uppercase">
                    {name}
                </div>
                <div className="relative z-10 font-mono text-3xl font-bold text-primary">
                    {price}
                    <span
                        className="pointer-events-none absolute top-1/2 left-1/2 h-[200%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-xl [animation:priceGlow_2s_ease-in-out_infinite]"
                        style={{
                            background: `radial-gradient(ellipse, ${color}40, transparent 70%)`,
                        }}
                    />
                </div>
            </CardHeader>
            <CardContent className="flex-1 pt-[var(--card-spacing)]">
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{description}</p>
                <ul className="list-none">
                    {perks.map((perk) => (
                        <li
                            key={perk}
                            className="relative py-1.5 pl-5 text-sm leading-snug text-muted-foreground"
                            style={{ color: 'var(--muted-foreground)' }}
                        >
                            <span
                                className="absolute top-1/2 left-0 -translate-y-1/2 font-bold"
                                style={{ color: '#22c55e' }}
                            >
                                ✓
                            </span>
                            {perk}
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter className="justify-center">
                <Button
                    render={<a href="https://discord.gg/framea" target="_blank" rel="noreferrer noopener" />}
                    className="w-full"
                >
                    {submitText}
                </Button>
            </CardFooter>
        </Card>
    );
}
