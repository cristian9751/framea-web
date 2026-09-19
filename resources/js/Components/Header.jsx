import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/Components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/Components/ui/sheet';
import LogoutButton from '@/Components/LogoutButton.jsx';
import favicon from '@/assets/svg/favicon.svg';

const links = [
    { href: '/', label: 'Inicio' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/about', label: 'Sobre el Server' },
    { href: '/rules', label: 'Reglas' },
];

export default function Header() {
    const { url } = usePage();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const currentPath = url || '/';

    const isActive = (href) => currentPath === href;

    return (
        <header className="fixed top-0 left-0 z-50 w-full px-4 pt-4">
            <div
                className={`container flex h-14 items-center justify-between rounded-4xl transition-all duration-300 ${
                    scrolled ? 'bg-background/80 shadow-clay backdrop-blur-2xl' : 'bg-background/40 backdrop-blur-lg'
                }`}
                style={{ border: '1px solid rgb(255 255 255 / 0.08)' }}
            >
                <Link href="/" className="flex items-center gap-2">
                    <img src={favicon} alt="ENTERPRISE" className="size-7" />
                    <span className="font-display text-xl font-black tracking-[0.14em] text-white">
                        ENTERPRISE
                    </span>
                    <span className="ml-1 hidden rounded-full bg-clay-teal/15 px-2 py-0.5 text-[0.6rem] font-bold tracking-widest text-clay-teal uppercase sm:inline-block">
                        SCP:SL
                    </span>
                </Link>

                <nav className="hidden md:block">
                    <ul className="flex list-none items-center gap-1">
                        {links.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`rounded-full px-4 py-2 font-display text-xs font-semibold tracking-wider transition-all ${
                                        isActive(link.href)
                                            ? 'bg-gradient-to-r from-clay-coral/20 to-clay-violet/20 text-clay-coral shadow-clay-inset'
                                            : 'text-muted-foreground hover:bg-foreground/5 hover:text-clay-coral'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <li className="ml-2">
                            <LogoutButton />
                        </li>
                    </ul>
                </nav>

                <Sheet>
                    <SheetTrigger
                        render={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                aria-label="Abrir menú"
                            >
                                <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
                            </Button>
                        }
                    />
                    <SheetContent
                        showCloseButton={true}
                        side="right"
                        className="w-72 p-0"
                        style={{ border: '1px solid rgb(255 255 255 / 0.08)' }}
                    >
                        <SheetTitle className="bg-clay p-6 font-display text-lg">
                            <span className="font-black tracking-[0.14em] text-white">ENTERPRISE</span>
                        </SheetTitle>
                        <div className="flex flex-col gap-1 px-3 py-4">
                            {links.map((link) => (
                                <SheetClose
                                    key={link.href}
                                    render={
                                        <Link
                                            href={link.href}
                                            className={`block w-full rounded-2xl border border-transparent px-4 py-3 font-display text-sm tracking-wider transition-all ${
                                                isActive(link.href)
                                                    ? 'bg-gradient-to-r from-clay-coral/20 to-clay-violet/20 text-clay-coral shadow-clay-inset'
                                                    : 'text-muted-foreground hover:bg-foreground/5 hover:text-clay-coral'
                                            }`}
                                        >
                                            {link.label}
                                        </Link>
                                    }
                                />
                            ))}
                        </div>
                        <div className="px-3 pb-6">
                            <LogoutButton className="w-full" />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}