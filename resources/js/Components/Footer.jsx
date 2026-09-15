import { Link } from '@inertiajs/react';

const socialLinks = [
    { href: 'https://discord.gg/framea', label: 'Discord', icon: 'D', aria: 'Discord' },
    { href: 'https://steamcommunity.com/groups/framea', label: 'Steam', icon: 'S', aria: 'Steam' },
    { href: 'https://twitter.com/framea', label: 'Twitter', icon: 'X', aria: 'Twitter' },
    { href: 'https://youtube.com/@framea', label: 'YouTube', icon: 'Y', aria: 'YouTube' },
];

const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/about', label: 'Sobre el Server' },
    { href: '/rules', label: 'Reglas' },
    { href: '/staff', label: 'Staff' },
];

const externalLinks = [
    { href: 'https://discord.gg/framea', label: 'Discord' },
    { href: 'https://steamcommunity.com/app/700330', label: 'Steam' },
    { href: 'https://scpslgame.com', label: 'Sitio Oficial' },
    { href: 'https://steamcommunity.com/sharedfiles/filedetails/?id=700330', label: 'Workshop' },
];

export default function Footer() {
    return (
        <footer className="border-t border-border bg-card pb-5 pt-14">
            <div className="container">
                <div className="mb-10 grid grid-cols-1 gap-10 text-center md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:text-left">
                    <div>
                        <Link href="/" className="mb-4 inline-flex items-center gap-2">
                            <span className="font-display text-xl font-black text-primary">FRA</span>
                            <span className="font-display text-base font-bold tracking-[3px] text-foreground">
                                MEA
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Servidor comunitario de SCP: Secret Laboratory en español. La mejor
                            experiencia de juego con baja latencia, staff profesional y una comunidad
                            activa.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-5 font-display text-sm font-bold tracking-widest text-foreground uppercase">
                            Navegación
                        </h4>
                        <ul className="list-none">
                            {navLinks.map((l) => (
                                <li key={l.href} className="mb-2.5">
                                    <Link
                                        href={l.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-5 font-display text-sm font-bold tracking-widest text-foreground uppercase">
                            Enlaces
                        </h4>
                        <ul className="list-none">
                            {externalLinks.map((l) => (
                                <li key={l.href} className="mb-2.5">
                                    <a
                                        href={l.href}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {l.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-5 font-display text-sm font-bold tracking-widest text-foreground uppercase">
                            Contacto
                        </h4>
                        <ul className="list-none">
                            <li className="mb-2.5">
                                <a
                                    href="mailto:admin@framea.com"
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    admin@framea.com
                                </a>
                            </li>
                        </ul>
                        <div className="mt-4 flex justify-center gap-3 lg:justify-start">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    aria-label={link.aria}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-base text-muted-foreground transition-all hover:translate-y-[-2px] hover:border-primary hover:bg-primary/5 hover:text-primary"
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-5 text-center">
                    <p className="mb-1 text-xs text-muted-foreground">
                        &copy; 2026 FRAMEA. Todos los derechos reservados.
                    </p>
                    <p className="text-[0.7rem] text-muted-foreground/60">
                        SCP: Secret Laboratory es propiedad de Northwood Studios. Este sitio no está
                        afiliado oficialmente.
                    </p>
                </div>
            </div>
        </footer>
    );
}
