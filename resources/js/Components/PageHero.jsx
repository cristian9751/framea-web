export default function PageHero({ title, subtitle, badge }) {
    return (
        <section className="relative overflow-hidden pb-16 pt-32 text-center md:pb-24 md:pt-40">
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
                style={{ background: 'radial-gradient(ellipse, #ff7d6b, transparent 70%)' }}
            />
            <div className="container">
                {badge && (
                    <span className="mb-4 inline-block rounded-full border border-clay-violet/40 bg-clay-violet/10 px-4 py-1 font-display text-xs font-semibold tracking-widest text-clay-violet uppercase shadow-clay-inset">
                        {badge}
                    </span>
                )}
                <h1 className="animate-fade-up relative z-10 mb-3 font-display text-4xl font-black text-foreground [animation-delay:0.05s] md:text-5xl">
                    <span className="text-gradient">{title}</span>
                </h1>
                {subtitle && (
                    <p className="animate-fade-up relative z-10 text-sm text-muted-foreground [animation-delay:0.15s] md:text-base">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}