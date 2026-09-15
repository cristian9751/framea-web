import { useMemo } from 'react';

export default function Particles({ count = 60 }) {
    const particles = useMemo(
        () =>
            Array.from({ length: count }, () => {
                const size = Math.random() * 3 + 1;
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                const duration = Math.random() * 20 + 10;
                const delay = Math.random() * 10;
                const opacity = Math.random() * 0.4 + 0.1;
                const drift = Math.random() > 0.5 ? '50px' : '-50px';
                return { size, x, y, duration, delay, opacity, drift };
            }),
        [count],
    );

    return (
        <div id="particles-container">
            {particles.map((p, i) => (
                <span
                    key={i}
                    style={{
                        position: 'absolute',
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: `rgba(245, 158, 11, ${p.opacity})`,
                        borderRadius: '50%',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        animation: `particleFloat ${p.duration}s ${p.delay}s infinite linear`,
                        pointerEvents: 'none',
                        '--drift': p.drift,
                    }}
                />
            ))}
        </div>
    );
}
