import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Lock, Users, Zap, Puzzle, CalendarDays, UserPlus, Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardDescription, CardTitle } from '@/Components/ui/card';
import TopHeader from '@/Components/Enterprise/TopHeader';
import MobileFloatingControls from '@/Components/Enterprise/MobileFloatingControls';
import HorizontalCarousel from '@/Components/Enterprise/HorizontalCarousel';
import HeroVideoBackground from '@/Components/Enterprise/HeroVideoBackground';
import { SplittingText } from '@/Components/animate-ui/primitives/texts/splitting';
import Footer from '@/Components/Footer';
import scp00 from '@/assets/images/scp/scp00.png';
import scp01 from '@/assets/images/scp/scp01.png';
import scp02 from '@/assets/images/scp/scp02.png';
import scp03 from '@/assets/images/scp/scp03.png';
import scp04 from '@/assets/images/scp/scp04.png';
import scp05 from '@/assets/images/scp/scp05.png';
import scp06 from '@/assets/images/scp/scp06.png';
import scp07 from '@/assets/images/scp/scp07.png';
import scp08 from '@/assets/images/scp/scp08.png';
import scp09 from '@/assets/images/scp/scp09.png';
import scp10 from '@/assets/images/scp/scp10.png';
import scp11 from '@/assets/images/scp/scp11.png';
import scp12 from '@/assets/images/scp/scp12.png';
import scp13 from '@/assets/images/scp/scp13.png';
import scp14 from '@/assets/images/scp/scp14.png';
import scp15 from '@/assets/images/scp/scp15.png';
import scp16 from '@/assets/images/scp/scp16.png';
import scp17 from '@/assets/images/scp/scp17.png';
import scp18 from '@/assets/images/scp/scp18.png';
import pageBgRaw from '@/assets/images/bg/page_bg_raw.png';
import discordIcon from '@/assets/svg/discord.svg';

const FEATURES = [
    { icon: Lock, title: 'ANTI-CHEAT ACTIVO', desc: 'Sistema de protección avanzado para garantizar partidas justas y sin tramposos.' },
    { icon: Users, title: 'COMUNIDAD ACTIVA', desc: 'Comunidad hispanohablante con Discord, eventos semanales y soporte en vivo.' },
    { icon: Zap, title: 'BAJA LATENCIA', desc: 'Servidor optimizado con hosting premium para la mejor experiencia de juego.' },
    { icon: Puzzle, title: 'MODS EXCLUSIVOS', desc: 'Plugins personalizados y modos de juego únicos que no encontrarás en otros servidores.' },
    { icon: CalendarDays, title: 'EVENTOS SEMANALES', desc: 'Eventos organizados con premios, torneos y partidas especiales cada semana.' },
    { icon: UserPlus, title: 'STAFF PROFESIONAL', desc: 'Equipo de moderación experimentado disponible 24/7 para ayudarte.' },
];

const PACKS = [
    { tier: 'BASIC', name: 'BRONCE', price: '5€', desc: 'Perfecto para empezar a apoyar al servidor.', perks: ['Tag de color en el chat', 'Acceso a sala VIP en Discord', 'Comando /pig cada 30s'], popular: false },
    { tier: 'STANDARD', name: 'PLATA', price: '10€', desc: 'El pack más popular entre nuestra comunidad.', perks: ['Todo lo de Bronce', 'Rango exclusivo en juego', 'Skin personalizada para armas', 'Comando /pig cada 15s'], popular: true },
    { tier: 'PREMIUM', name: 'ORO', price: '20€', desc: 'Experiencia premium con beneficios exclusivos.', perks: ['Todo lo de Plata', 'Cola prioritaria', 'Slot reservado en servidor lleno', 'Efectos de muerte personalizados', 'Comando /pig ilimitado'], popular: false },
    { tier: 'ELITE', name: 'DIAMANTE', price: '35€', desc: 'El máximo nivel de soporte al servidor.', perks: ['Todo lo de Oro', 'Skin de SCP exclusiva', 'Voto de mapa semanal', 'Badge único en Discord', 'Acceso a canal de sugerencias VIP', 'Soporte prioritario 24/7'], popular: false },
];

const TITLE_TEXT = 'ENTERPRISE';
const SERVER_IP = 'play.enterprise-scp.com';
const SUB_PRE = 'Bienvenido a ';
const SUB_HL = 'ENTERPRISE';
const SUB_POST = ' — La experiencia definitiva en español';
const SUB_FULL = SUB_PRE + SUB_HL + SUB_POST;

const COLLAGE_POSES = [
    { w: 26, z: 2 },
    { w: 34, z: 1 },
    { w: 26, z: 2 },
    { w: 26, z: 2 },
    { w: 34, z: 1 },
    { w: 26, z: 2 },
];

const scps = [scp00, scp01, scp02, scp03, scp04, scp05, scp06, scp07, scp08, scp09, scp10, scp11, scp12, scp13, scp14, scp15, scp16, scp17, scp18];

export default function Home() {
    const [toast, setToast] = useState('');
    const [typed, setTyped] = useState('');
    const [done, setDone] = useState(false);
    const rowRef = useRef(null);
    const [box, setBox] = useState({ w: 0, h: 0, items: [] });
    const natRef = useRef(null);

    useEffect(function () {
        let i = 0;
        let interval;
        const startAt = window.setTimeout(function () {
            interval = window.setInterval(function () {
                i += 1;
                setTyped(SERVER_IP.slice(0, i));
                if (i >= SERVER_IP.length) { window.clearInterval(interval); setDone(true); }
            }, 70);
        }, 500);
        return function () {
            window.clearTimeout(startAt);
            window.clearInterval(interval);
        };
    }, []);

    useEffect(function () {
        const im = new Image();
        im.onload = function () {
            natRef.current = { w: im.naturalWidth, h: im.naturalHeight };
            if (typeof window !== "undefined" && window.dispatchEvent) {
                window.dispatchEvent(new Event("resize"));
            }
        };
        im.src = pageBgRaw;
        return function () { im.onload = null; };
    }, []);

    useLayoutEffect(function () {
        let raf = 0;
        let ro = null;
        function measure() {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(function () {
                const row = rowRef.current;
                if (!row) return;
                const rc = row.getBoundingClientRect();
                const items = [];
                row.querySelectorAll('[data-win]').forEach(function (w) {
                    const wr = w.getBoundingClientRect();
                    items.push({ x: Math.round(wr.left - rc.left), y: Math.round(wr.top - rc.top) });
                });
                var nr = natRef.current;
                var cov = null;
                if (nr && nr.w && nr.h && rc.width && rc.height) {
                    var sc = Math.max(rc.width / nr.w, rc.height / nr.h);
                    var cw = Math.round(nr.w * sc);
                    var ch = Math.round(nr.h * sc);
                    cov = { cw: cw, ch: ch, ox: (rc.width - cw) / 2, oy: (rc.height - ch) / 2 };
                }
                setBox({ w: rc.width, h: rc.height, items: items, cov: cov });
            });
        }
        measure();
        if (typeof ResizeObserver !== 'undefined' && rowRef.current) {
            ro = new ResizeObserver(measure);
            ro.observe(rowRef.current);
        }
        window.addEventListener('resize', measure);
        return function () {
            cancelAnimationFrame(raf);
            if (ro) ro.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, []);

    function copyIp() {
        const done = function () { showToast('IP copiada'); };
        function fallback() {
            const el = document.createElement('textarea');
            el.value = SERVER_IP;
            el.style.position = 'fixed';
            el.style.opacity = '0';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            done();
        }
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(SERVER_IP).then(done).catch(fallback);
        } else {
            fallback();
        }
    }

    function showToast(m) {
        setToast(m);
        window.clearTimeout(showToast._t);
        showToast._t = window.setTimeout(function () { setToast(''); }, 2400);
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-enterprise-bg font-[Arial,Helvetica,sans-serif] text-[#d6d8dc]">
            <Head>
                <title>ENTERPRISE | SCP: Secret Laboratory</title>
            </Head>
            <TopHeader showToast={showToast} />

            <main className="relative z-[2] min-w-0 flex-1">
                <section className="relative flex min-h-[480px] flex-col items-center justify-center overflow-hidden bg-enterprise-bg px-4 pt-16 pb-0 text-center h-[calc(64px_+_100vw_*_9/21)] [@media(orientation:portrait)]:!h-[100svh]">
                    <div className="absolute inset-0 z-[1] flex">
                        <div className="relative flex flex-1 flex-col overflow-hidden bg-enterprise-bg" />
                        <div className="pointer-events-none absolute top-0 left-0 right-0 z-[2] h-[60px] bg-[linear-gradient(#2D2449_10%,transparent)]" />
                        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] h-[60px] bg-[linear-gradient(transparent,#2D2449_90%)]" />
                    </div>

                    <HeroVideoBackground />

                    <div className="relative z-[3] mx-auto flex w-full max-w-[700px] flex-col items-center">
                        <h1 className="my-[4px] mb-3 flex flex-nowrap items-center justify-center whitespace-nowrap text-[clamp(30px,8vw,92px)] font-black leading-[0.9] tracking-[0.06em] text-white font-[Arial_Black,Arial,sans-serif] max-sm:w-full max-sm:text-[clamp(45px,12vw,138px)]" aria-label={TITLE_TEXT}>
                            <SplittingText
                                aria-hidden="true"
                                text={TITLE_TEXT}
                                type="chars"
                                stagger={0.09}
                                staggerFrom="center"
                                initial={{ opacity: 0, filter: 'blur(8px)', scaleX: 0.6, scaleY: 1.05 }}
                                animate={{ opacity: 1, filter: 'blur(0px)', scaleX: 1, scaleY: 1.05 }}
                                transition={{ duration: 0.9, ease: [0.45, 0, 0.55, 1] }}
                            />
                        </h1>
                        <p className="mb-[18px] min-h-[20px] whitespace-nowrap text-[clamp(11px,1.5vw,20px)] text-enterprise-body max-sm:whitespace-normal" aria-label={SUB_FULL}>
                            <SplittingText
                                aria-hidden="true"
                                segments={[
                                    { text: SUB_PRE },
                                    { text: SUB_HL, className: 'font-bold text-enterprise-primary' },
                                    { text: SUB_POST },
                                ]}
                                type="chars"
                                stagger={0.025}
                                staggerFrom="center"
                                delay={1000}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                        </p>
                        <Button
                            size="lg"
                            className="rounded-xl bg-[#5865F2] w-[300px] max-sm:w-[280px] px-6 py-2.5 text-[11px] font-bold tracking-[0.08em] text-white shadow-[0_4px_14px_rgba(0,0,0,0.35)] hover:bg-[#4752C4] whitespace-nowrap"
                            onClick={function () {
                                showToast('Redirigiendo a Discord...');
                                setTimeout(function () { window.location.href = '/auth/signin/discord'; }, 650);
                            }}
                        >
                            <img src={discordIcon} width="16" height="16" alt="Discord icon - SVGRepo vector" className="mr-1.5 align-middle brightness-0 invert" />
                            INICIAR SESIÓN POR DISCORD
                        </Button>
                        <div className="mt-4 inline-flex w-[300px] max-sm:w-[280px] items-center justify-between whitespace-nowrap rounded-xl border-2 border-[#ff8c42] bg-[#2b2f36] px-4 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                            <span className="relative font-[ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace] text-[13px] font-semibold tracking-[0.08em] text-[#e8eaed] text-left" aria-label={SERVER_IP}>
                                <span className="invisible">{SERVER_IP}</span>
                                <span className="absolute inset-0 whitespace-nowrap">
                                    {typed}
                                    {done ? null : <span className="animate-blink ml-[2px] inline-block h-[14px] w-[8px] translate-y-[2px] bg-[#ff8c42]" aria-hidden="true" />}
                                </span>
                            </span>
                            <button
                                type="button"
                                aria-label="Copiar IP"
                                onClick={copyIp}
                                className="flex size-[30px] cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/5 text-[#e8eaed] transition-colors hover:border-[#ff8c42] hover:text-[#ff8c42]"
                            >
                                <Copy size={15} strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>
                </section>

                <section id="why" className="bg-enterprise-bg px-5 pt-7 pb-8">
                    <div className="mx-auto mb-5 max-w-[940px] text-center">
                        <div className="mx-auto mb-3 h-[2px] w-10 bg-enterprise-primary" />
                        <h2 className="m-0 text-[clamp(27px,6.75vw,39px)] font-black tracking-[0.08em] text-enterprise-text">¿POR QUÉ ENTERPRISE?</h2>
                        <p className="mt-1.5 text-[10.5px] tracking-[0.18em] text-enterprise-muted">LA MEJOR EXPERIENCIA SCP:SL EN ESPAÑOL</p>
                    </div>
                    <div ref={rowRef} className="relative mx-auto flex max-w-[1080px] flex-wrap items-center justify-center gap-x-[18px] gap-y-6 px-1">
                                                    {FEATURES.map(function (f, i) {
                            const Icon = f.icon;
                            const pos = COLLAGE_POSES[i % COLLAGE_POSES.length];
                            return (
                                <div
                                    key={i}
                                    className="relative aspect-[3/4] flex-none overflow-hidden border-2 border-enterprise-border/80 shadow-[0_18px_40px_rgba(0,0,0,0.5)] sm:max-lg:!w-[45%] max-sm:!w-[82%]"
                                    data-win="1"
                                    style={{ width: pos.w + '%', zIndex: pos.z }}
                                >
                                    <div className="h-full w-full">
                                        {(box.cov && box.items && box.items[i]) ? (
                                            <div
                                                className="h-full w-full"
                                                style={{
                                                    backgroundImage: "url(" + pageBgRaw + ")",
                                                    backgroundSize: box.cov.cw + "px " + box.cov.ch + "px",
                                                    backgroundPosition: "-" + (box.items[i].x - box.cov.ox) + "px -" + (box.items[i].y - box.cov.oy) + "px",
                                                    backgroundRepeat: "no-repeat"
                                                }}
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-enterprise-card/35" />
                                        )}
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 px-3.5 pt-[42px] pb-3.5 text-center text-white bg-[linear-gradient(rgba(19,16,34,0),rgba(19,16,34,0.55)_35%,rgba(19,16,34,0.94)_78%)]">
                                        <div className="mx-auto mb-2 inline-flex size-[30px] items-center justify-center rounded-lg border border-enterprise-primary/35 bg-enterprise-primary/20">
                                            <Icon size={18} className="text-enterprise-primary" strokeWidth={1.5} />
                                        </div>
                                        <CardTitle className="m-0 mb-1.5 text-[13px] font-extrabold tracking-[0.06em] text-white">{f.title}</CardTitle>
                                        <CardDescription className="m-0 text-[11px] leading-[1.5] text-white/70">{f.desc}</CardDescription>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section id="packs" className="bg-enterprise-bg px-5 pt-6 pb-8">
                    <div className="mx-auto mb-3 max-w-[940px] text-center">
                        <div className="mx-auto mb-3 h-[2px] w-10 bg-enterprise-primary" />
                        <h2 className="m-0 text-[clamp(27px,6.75vw,39px)] font-black tracking-[0.08em] text-enterprise-text">DESTACADOS</h2>
                        <p className="mt-1.5 text-[10.5px] tracking-[0.18em] text-enterprise-muted">APOYA AL SERVIDOR Y OBTÉN BENEFICIOS EXCLUSIVOS CON NUESTROS PACKS DE DONADOR</p>
                    </div>
                    <div className="mx-auto flex max-w-[940px] flex-wrap gap-2.5">
                        {PACKS.map(function (p, i) {
                            return (
                                <Card
                                    key={i}
                                    className={cn(
                                        'relative flex flex-col border border-enterprise-primarySoft bg-enterprise-card p-3.5 pb-3 shadow-none rounded-xl w-full sm:max-lg:w-[48%] sm:max-lg:flex-none lg:w-auto lg:flex-1',
                                        p.popular ? 'overflow-visible border-[5px] border-[#ff3ed8] shadow-[0_0_22px_rgba(255,62,216,0.45),0_0_70px_rgba(255,62,216,0.18)]' : 'overflow-hidden'
                                    )}
                                >
                                    {p.popular && (
                                        <Badge className="absolute -top-[9px] left-1/2 -translate-x-1/2 rounded-[10px] border-[#ff3ed8] bg-[#ff3ed8] px-2 py-[3px] text-[10px] font-extrabold tracking-[0.08em] text-[#1c0514] shadow-[0_0_14px_rgba(255,62,216,0.9)]">
                                            POPULAR
                                        </Badge>
                                    )}
                                    <div className={p.popular ? "text-center text-[10px] tracking-[0.14em] text-enterprise-muted" : "text-center text-[10px] tracking-[0.14em] text-[#d3d6dd]"}>{p.tier}</div>
                                    <div className={p.popular ? "my-1 text-center text-[15px] font-black text-enterprise-text" : "my-1 text-center text-[15px] font-black text-[#d3d6dd]"}>{p.name}</div>
                                    <div className={p.popular ? "text-center text-[19px] font-black text-enterprise-primary" : "text-center text-[19px] font-black text-[#d3d6dd]"}>{p.price}</div>
                                    <p className={p.popular ? "mt-2 mb-2.5 text-center text-[11px] leading-[1.4] text-[#ff3ed8] [text-shadow:0_0_6px_rgba(255,62,216,0.55),0_0_16px_rgba(255,62,216,0.28)]" : "mt-2 mb-2.5 text-center text-[11px] leading-[1.4] text-[#d3d6dd]"}>{p.desc}</p>
                                    <ul className="mb-[14px] list-none p-0">
                                        {p.perks.map(function (perk, j) {
                                            return (
                                                <li key={j} className={p.popular ? "relative mb-1.5 pl-3 text-[11px] leading-[1.4] text-enterprise-body" : "relative mb-1.5 pl-3 text-[11px] leading-[1.4] text-[#d3d6dd]"}>
                                                    <Check size={9} className="absolute top-[3px] left-0 text-[#2ecc71]" /> {perk}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <Button
                                        variant="ghost"
                                        className="mt-auto w-full rounded-xl border border-enterprise-border px-[9px] py-[9px] text-[11px] font-extrabold tracking-[0.08em] !bg-[#1a1d22] !text-[#f5f6f8] hover:!bg-[#4a4e56]"
                                        onClick={function () { showToast(p.name + ' — pronto'); }}
                                    >
                                        COMPRAR
                                    </Button>
                                </Card>
                            );
                        })}
                    </div>
                    <div className="mx-auto mt-6 max-w-[940px]">
                        <p className="mb-3 text-center text-[7px] tracking-[0.18em] text-enterprise-muted">
                            SCPS JUGABLES Y OBJETOS — PASA EL CURSOR PARA PAUSAR, CLIC PARA VER EN LA WIKI
                        </p>
                        <div className="overflow-hidden rounded-xl border border-enterprise-primary/20 bg-enterprise-card/40">
                            <HorizontalCarousel items={scps} />
                        </div>
                    </div>
                </section>
            </main>
            {toast && (
                <div className="fixed bottom-[18px] left-1/2 z-[80] -translate-x-1/2 border border-enterprise-border bg-enterprise-card px-3.5 py-[7px] text-[11px] text-enterprise-primary">
                    {toast}
                </div>
            )}
            <Footer />
            <MobileFloatingControls showToast={showToast} />
        </div>
    );
}