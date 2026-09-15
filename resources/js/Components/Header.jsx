import { useEffect, useState } from 'react';
import {Link, router, usePage} from '@inertiajs/react';
import { Menu01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/Components/ui/button';
import {Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger} from '@/Components/ui/sheet';
import LogoutButton from "@/Components/LogoutButton.jsx";

const links = [
    { href: '/', label: 'Inicio' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/about', label: 'Sobre el Server' },
    { href: '/rules', label: 'Reglas' },
];


export default function Header() {

    const { url, props } = usePage();
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
        <header
            className={`fixed top-0 left-0 z-50 h-[50px] w-full border-b border-border backdrop-blur-xl transition-shadow ${
                scrolled ? 'bg-background/95 shadow-lg' : 'bg-background/80'
            }`}
        >
            <div className="container flex h-full items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-display text-2xl font-black text-primary [text-shadow:0_0_20px_rgba(245,158,11,0.3)]">
                        FRA
                    </span>
                    <span className="font-display text-xl font-bold tracking-[3px] text-foreground">
                        MEA
                    </span>
                </Link>

                <nav className="hidden md:block">
                    <ul className="flex list-none gap-2">
                        {links.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`rounded px-4 py-2 font-display text-xs font-medium tracking-wider transition-colors ${
                                        isActive(link.href)
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <LogoutButton/>
                    </ul>
                </nav>



                <Sheet className={"md:hidden"}>
                    <SheetTrigger render={ <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        aria-label="Abrir menú"
                    >
                        <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
                    </Button>}></SheetTrigger>
                    <SheetContent showCloseButton={true} side="right" className="w-72 bg-card p-0">
                        <SheetTitle className="p-6 font-display text-lg">
                            <span className="text-primary">FRA</span>
                            <span className="tracking-[3px] text-foreground">MEA</span>
                        </SheetTitle>
                        <div className="flex flex-col gap-1 px-3">
                            {links.map((link) => (
                                <SheetClose
                                    key={link.href}
                                    render={
                                        <Link
                                            href={link.href}
                                            className={`block w-full rounded-lg border border-transparent px-4 py-3 font-display text-sm tracking-wider transition-colors ${
                                                isActive(link.href)
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                                            }`}
                                        >{link.label}</Link>

                                    }
                                />
                            ))}
                        </div>
                        <LogoutButton className={"rounded-none"}/>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
