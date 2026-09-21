import heroVideo from '@/assets/videos/hero-trailer-8-50.mp4';

export default function HeroVideoBackground() {
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[64px] bottom-0 z-[2] flex items-start justify-center overflow-hidden">
            <div className="relative w-full aspect-[21/9] overflow-hidden bg-enterprise-bg [@media(orientation:portrait)]:aspect-[9/16] [@media(orientation:portrait)]:w-auto [@media(orientation:portrait)]:h-full max-md:!aspect-auto max-md:!h-full max-md:!w-full">
                <div className="absolute inset-0 overflow-hidden">
                    <video src={heroVideo} autoPlay muted loop playsInline preload="auto" tabIndex="-1" className="pointer-events-none absolute inset-0 h-full w-full border-0 object-cover" />
                </div>
            </div>
        </div>
    );
}