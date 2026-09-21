import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import PageLayout from '../Components/Enterprise/PageLayout';
import {usePage} from "@inertiajs/react";
import discordWordmark from '@/assets/svg/discord_icon.svg';
import steamLogo from '@/assets/svg/steam.svg';

const errorMessages = {
    discord: 'No se pudo completar la autenticación con Discord. Inténtalo de nuevo.',
    steam: "No se pudo completar la autenticacion con Steam. Intentalo de nuevo",
    server_error: 'Ocurrio un error.',
};

export default function Login({ error, steamLoginUrl, discordLoginUrl }) {
    const { errors } = usePage().props;
    const errorMessage = errorMessages[error] ?? Object.keys(errors).length >= 1 ? errorMessages.server_error : null

    return (
        <PageLayout
            title="ENTERPRISE | Iniciar Sesión"
            description="Accede a tu cuenta de ENTERPRISE mediante Steam o Discord"
        >
            <section className="bg-enterprise-bg px-5 pt-10 pb-2">
                <div className="mx-auto mb-5 max-w-[940px] text-center">
                    <div className="mx-auto mb-3 h-[2px] w-10 bg-enterprise-primary" />
                    <h2 className="m-0 text-[clamp(27px,6.75vw,39px)] font-black tracking-[0.08em] text-enterprise-text">INICIAR SESIÓN</h2>
                    <p className="mt-1.5 text-[10.5px] tracking-[0.18em] text-enterprise-muted">ACCEDE A TU CUENTA USANDO STEAM O DISCORD</p>
                </div>
            </section>

            <section className="py-24">
                <div className="container">
                    <div className="mx-auto max-w-[520px]">
                        <Card className="border-enterprise-border bg-enterprise-card shadow-none justify-content-center rounded-4xl text-center p-8 md:p-10">
                            <CardHeader className="items-center">
                                <CardTitle className="font-display text-xl font-bold tracking-wide text-enterprise-text uppercase">
                                    Elige tu método de acceso
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="w-full">
                                <p className="mb-8 text-sm text-enterprise-body">
                                    Solo necesitas una de estas cuentas. No creamos usuarios ni
                                    contraseñas.
                                </p>

                                {errorMessage && (
                                    <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3.5 text-sm text-clay-coral">
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="flex flex-col gap-4">
                                    <Button
                                        render={<a href={steamLoginUrl} />}
                                        aria-label="Iniciar sesión con Steam"
                                        className="w-full rounded-full bg-gradient-to-r from-[#171a21] to-[#1b2838] text-[#c7d5e0] hover:text-white"
                                    >
                                        <img src={steamLogo} alt="Steam" className="h-[25px] w-auto brightness-0 invert" />
                                    </Button>
                                    <Button
                                        render={<a href={discordLoginUrl} />}
                                        aria-label="Iniciar sesión con Discord"
                                        className="w-full rounded-full bg-gradient-to-r from-[#536dfe] to-[#5865f2] text-white hover:opacity-90"
                                    >
                                        <img src={discordWordmark} alt="Discord" className="h-[20px] w-auto brightness-0 invert" />
                                    </Button>
                                </div>

                                <p className="mt-6 text-xs text-enterprise-body">
                                    Al continuar aceptas las reglas del servidor.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}
