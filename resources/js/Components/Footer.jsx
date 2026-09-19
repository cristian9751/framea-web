import { Link } from '@inertiajs/react';
import favicon from '@/assets/svg/favicon.svg';
import iconsSprite from '@/assets/svg/icons.svg?url';

const socialLinks = [
    { href: 'https://discord.gg/framea', label: 'Discord', sprite: 'discord-icon', aria: 'Discord' },
    { href: 'https://steamcommunity.com/groups/framea', label: 'Steam', sprite: 'steam-icon', aria: 'Steam' },
    { href: 'https://twitter.com/framea', label: 'Twitter', sprite: 'x-icon', aria: 'Twitter' },
    { href: 'https://youtube.com/@framea', label: 'YouTube', sprite: 'youtube-icon', aria: 'YouTube' },
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
        <footer className="relative pb-5 pt-14">
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 opacity-60"
                style={{ background: 'linear-gradient(0deg, rgb(255 125 107 / 0.06), transparent 60%)' }}
            />
            <div className="container">
                <div className="mb-10 grid grid-cols-1 gap-10 text-center md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:text-left">
                    <div>
                        <Link href="/" className="mb-4 inline-flex items-center gap-2">
                            <img src={favicon} alt="ENTERPRISE" className="size-6" />
                            <span className="font-display text-xl font-black tracking-[0.14em] text-white">
                                ENTERPRISE
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
                                        className="text-sm text-muted-foreground transition-colors hover:text-enterprise-primary"
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
                                        className="text-sm text-muted-foreground transition-colors hover:text-enterprise-primary"
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
                                    className="text-sm text-muted-foreground transition-colors hover:text-enterprise-primary"
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
                                    className="flex size-10 items-center justify-center rounded-2xl bg-background/60 text-base text-muted-foreground shadow-clay transition-all hover:-translate-y-1 hover:text-enterprise-primary"
                                    style={{ border: '1px solid rgb(255 255 255 / 0.06)' }}
                                >
                                    {link.sprite ? (
                                        <svg className="size-5 [&_path]:fill-current" aria-hidden="true">
                                            <use href={`${iconsSprite}#${link.sprite}`} />
                                        </svg>
                                    ) : (
                                        <span>{link.icon}</span>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-5 text-center">
                    <p className="mb-1 text-xs text-muted-foreground">
                        &copy; 2026 ENTERPRISE. Todos los derechos reservados.
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