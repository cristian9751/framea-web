import { Link, usePage } from '@inertiajs/react';
import { Home, Info, FileText, LayoutDashboard, Settings } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { cn } from '@/lib/utils';
import favicon from '@/assets/svg/favicon.svg';

const nav = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, dashboard: true },
    { href: '/about', label: 'Info', icon: Info },
    { href: '/rules', label: 'Reglas', icon: FileText },
];

export default function TopHeader({ showToast }) {
    const { url, props } = usePage();
    const { auth } = props;
    const name = auth?.user?.name || null;
    const path = url.split('?')[0];

    return (
        <header className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[64px]">
            <div className="pointer-events-auto grid h-full grid-cols-[1fr_auto_1fr] items-center gap-[15px] border-b border-enterprise-border bg-enterprise-bg px-[18px] shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
                <div className="hidden min-w-0 items-center gap-2.5 justify-self-start md:flex">
                    <Link
                        href="/"
                        aria-label="ENTERPRISE"
                        className="flex h-[39px] w-[39px] items-center justify-center rounded-xl border border-enterprise-border bg-enterprise-card text-enterprise-primary"
                    >
                        <img src={favicon} alt="ENTERPRISE" className="size-[27px]" />
                    </Link>
                    <span className="whitespace-nowrap text-[16px] font-black tracking-[0.18em] text-enterprise-primary">ENTERPRISE</span>
                </div>
                <nav className="flex items-center justify-self-center gap-3 max-sm:gap-2">
                    {nav.map((item, i) => {
                        const Icon = item.icon;
                        const href = item.dashboard && !auth?.user ? '/login' : item.href;
                        const active = path === href;
                        return (
                            <span key={i} className="inline-flex items-center gap-3 max-sm:gap-2">
                                <Link
                                    href={href}
                                    className={cn(
                                        'inline-flex items-center gap-[7px] whitespace-nowrap rounded-[9px] border border-transparent px-2 py-[5px] text-enterprise-muted transition-[color,background-color,border-color] duration-150 hover:text-enterprise-primary max-sm:gap-[5px] max-sm:px-[5px] max-sm:py-1',
                                        active && 'border-enterprise-primary/30 bg-enterprise-primarySoft text-enterprise-primary'
                                    )}
                                >
                                    <Icon size={18} strokeWidth={1.5} />
                                    <span className="text-[11px] font-bold leading-none tracking-[0.08em] max-sm:text-[10px] max-sm:tracking-[0.02em]">{item.label}</span>
                                </Link>
                                {i < nav.length - 1 && <span className="h-4 w-px bg-enterprise-border opacity-50 max-sm:h-[14px]" aria-hidden="true" />}
                            </span>
                        );
                    })}
                </nav>
                <div className="hidden items-center gap-[9px] justify-self-end md:flex">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="settings"
                        onClick={() => showToast('Ajustes — pronto')}
                        className="h-[33px] w-[33px] bg-transparent text-[#4a4e56] hover:text-enterprise-primary"
                    >
                        <Settings size={21} strokeWidth={1.5} />
                    </Button>
                    <Avatar className="h-[39px] w-[39px] rounded-full border border-enterprise-border bg-enterprise-card">
                        <AvatarFallback className="bg-transparent text-[14px] text-[#8aa0b8]">
                            {(name || 'F').charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}