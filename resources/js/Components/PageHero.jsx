export default function PageHero({ title, subtitle }) {
    return (
        <section className="relative z-30 border-b border-border bg-secondary py-12 text-center md:py-24">
            <h1 className="relative z-10 mb-3 font-display text-3xl font-black tracking-[4px] text-white uppercase md:text-4xl">
                {title}
            </h1>
            {subtitle && (
                <p className="relative z-10 text-sm text-muted-foreground">{subtitle}</p>
            )}
        </section>
    );
}
