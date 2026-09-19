import { useMemo } from 'react';

const PALETTE = ['#ff7d6b', '#f472b6', '#a78bfa', '#22d3ee', '#fbbf24'];

export default function Particles({ count = 36 }) {
    const particles = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => {
                const size = Math.random() * 8 + 3;
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                const duration = Math.random() * 18 + 12;
                const delay = Math.random() * 12;
                const opacity = Math.random() * 0.18 + 0.05;
                const drift = Math.random() > 0.5 ? '60px' : '-60px';
                const color = PALETTE[i % PALETTE.length];
                return { size, x, y, duration, delay, opacity, drift, color };
            }),
        [count],
    );

    return (
        <div aria-hidden="true" id="particles-container">
            {particles.map((p, i) => (
                <span
                    key={i}
                    style={{
                        position: 'absolute',
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: p.color,
                        borderRadius: '50%',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        opacity: p.opacity,
                        filter: 'blur(1px)',
                        boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                        animation: `particleFloat ${p.duration}s ${p.delay}s infinite linear`,
                        pointerEvents: 'none',
                        '--drift': p.drift,
                    }}
                />
            ))}
        </div>
    );
}