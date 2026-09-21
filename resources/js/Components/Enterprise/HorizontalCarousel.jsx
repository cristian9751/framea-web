import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'motion/react';

const SCP_NAMES = [
    'SCP-049', 'SCP-049-2', 'SCP-079', 'SCP-096', 'SCP-106',
    'SCP-173', 'SCP-939', 'Anti-Cola', 'SCP-018', 'SCP-127',
    'SCP-207', 'SCP-244', 'SCP-268', 'SCP-500', 'SCP-1344',
    'SCP-1509', 'SCP-1576', 'SCP-1853', 'SCP-2176',
];

export default function HorizontalCarousel({ items }) {
    const doubled = items.concat(items);
    const wrapRef = useRef(null);
    const trackRef = useRef(null);
    const hovered = useRef(false);
    const [inView, setInView] = useState(true);
    const reduce = useReducedMotion();
    const x = useMotionValue(0);

    useEffect(function () {
        if (typeof IntersectionObserver === 'undefined') { return; }
        const observer = new IntersectionObserver(function (entries) {
            setInView(entries.some(function (e) { return e.isIntersecting; }));
        });
        if (wrapRef.current) { observer.observe(wrapRef.current); }
        return function () { observer.disconnect(); };
    }, []);

    useAnimationFrame(function (_, delta) {
        if (reduce || hovered.current || !inView) { return; }
        const el = trackRef.current;
        if (!el) { return; }
        const half = el.scrollWidth / 2;
        if (half <= 0) { return; }
        let nx = x.get() - (delta / 1000) * (half / 30);
        if (nx <= -half) { nx += half; }
        x.set(nx);
    });

    function pause() { hovered.current = true; }
    function resume() { hovered.current = false; }

    return (
        <div ref={wrapRef} className="relative w-full overflow-hidden" aria-label="SCPs jugables y objetos">
            <motion.div ref={trackRef} className="flex w-max will-change-transform" style={{ x }}>
                {doubled.map((src, i) => {
                    const idx = i % items.length;
                    const wiki = 'https://en.scpslgame.com/index.php?title=' + encodeURIComponent(SCP_NAMES[idx]);
                    return (
                        <a
                            key={i}
                            className="group relative flex h-[132px] w-[110px] shrink-0 flex-col items-center justify-center border-r border-white/[0.03] bg-white/[0.02] opacity-[0.88] blur-[0.7px] transition-[transform,opacity,filter] duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:z-[5] hover:scale-[1.15] hover:blur-none hover:opacity-100"
                            href={wiki}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={SCP_NAMES[idx]}
                            onMouseEnter={pause}
                            onMouseLeave={resume}
                            onFocus={pause}
                            onBlur={resume}
                        >
                            <span className="pointer-events-none absolute top-1/2 left-1/2 size-[84px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(150,119,242,0.55)_0%,rgba(150,119,242,0.18)_38%,transparent_72%)] opacity-0 blur-[10px] transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true" />
                            <img src={src} alt={SCP_NAMES[idx]} loading="lazy" className="size-[72px] object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.7)] transition-[filter] duration-200 group-hover:drop-shadow-[0_0_10px_rgba(150,119,242,0.5)]" />
                            <span className="mt-1 text-[10px] tracking-[0.12em] text-enterprise-muted transition-colors duration-200 group-hover:text-enterprise-primary">{SCP_NAMES[idx]}</span>
                        </a>
                    );
                })}
            </motion.div>
        </div>
    );
}