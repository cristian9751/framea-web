import DonnorPack from './DonnorPack';

const packs = [
    { tier: 'BASIC', name: 'Bronce', color: '#cd7f32', price: '5€', desc: 'Perfecto para empezar a apoyar al servidor.', perks: ['Tag de color en el chat', 'Acceso a sala VIP en Discord', 'Comando /pig cada 30s'] },
    { tier: 'STANDARD', name: 'Plata', color: '#a0a0a0', price: '10€', desc: 'El pack mas popular entre nuestra comunidad.', perks: ['Todo lo de Bronce', 'Rango exclusivo en juego', 'Skin personalizada para armas', 'Comando /pig cada 15s'] },
    { tier: 'PREMIUM', name: 'Oro', color: '#ffd700', price: '20€', desc: 'Experiencia premium con beneficios exclusivos.', perks: ['Todo lo de Plata', 'Queue prioritario', 'Slot reservado en server lleno', 'Efectos de muerte personalizados', 'Comando /pig ilimitado'] },
    { tier: 'ELITE', name: 'Diamante', color: '#00bfff', price: '35€', desc: 'El maximo nivel de soporte al servidor.', perks: ['Todo lo de Oro', 'Skin de SCP exclusiva', 'Voto de mapa semanal', 'Badge unico en Discord', 'Acceso a canal de sugerencias VIP', 'Soporte prioritario 24/7'] },
];

export default function Classes() {
    return (
        <section className="relative bg-secondary py-24">
            <div className="container">
                <h2 className="mb-3 text-center font-display text-4xl font-bold tracking-[3px] text-foreground uppercase">
                    Packs de Donador
                </h2>
                <div className="mx-auto mb-14 h-0.5 w-15 rounded bg-gradient-to-r from-primary to-accent" />
                <p className="mb-14 text-center text-lg text-muted-foreground">
                    Apoya al servidor y obtiene beneficios exclusivos
                </p>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {packs.map((p) => (
                        <DonnorPack
                            key={p.tier}
                            color={p.color}
                            tier={p.tier}
                            name={p.name}
                            price={p.price}
                            description={p.desc}
                            perks={p.perks}
                            submitText="Comprar"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
