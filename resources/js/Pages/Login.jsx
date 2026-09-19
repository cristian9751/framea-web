import { Button } from '@/Components/ui/button';
import PageHero from '@/Components/PageHero';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import Layout from '../Components/Layout';
import {usePage} from "@inertiajs/react";
import favicon from '@/assets/svg/favicon.svg';
import discordWordmark from '@/assets/svg/discord_icon.svg';

const errorMessages = {
    discord: 'No se pudo completar la autenticación con Discord. Inténtalo de nuevo.',
    steam: "No se pudo completar la autenticacion con Steam. Intentalo de nuevo",
    server_error: 'Ocurrio un error.',
};

export default function Login({ error, steamLoginUrl, discordLoginUrl }) {
    const { errors } = usePage().props;
    const errorMessage = errorMessages[error] ?? Object.keys(errors).length >= 1 ? errorMessages.server_error : null

    return (
        <Layout
            title="ENTERPRISE | Iniciar Sesión"
            description="Accede a tu cuenta de ENTERPRISE mediante Steam o Discord"
        >
            <PageHero title="Iniciar Sesión" subtitle="Accede a tu cuenta usando Steam o Discord" />

            <section className="py-24">
                <div className="container">
                    <div className="mx-auto max-w-[520px]">
                        <Card className="clay justify-content-center rounded-4xl text-center p-10 md:p-12">
                            <CardHeader className="items-center">
                                <div className="mb-6 inline-flex items-center gap-2">
                                    <img src={favicon} alt="ENTERPRISE" className="size-6" />
                                    <span className="font-display text-xl font-black tracking-[0.14em] text-white">
                                        ENTERPRISE
                                    </span>
                                </div>
                                <CardTitle className="font-display text-xl font-bold tracking-wide text-foreground uppercase">
                                    Elige tu método de acceso
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="w-full">
                                <p className="mb-8 text-sm text-muted-foreground">
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
                                        className="w-full rounded-full bg-gradient-to-r from-[#171a21] to-[#1b2838] text-[#c7d5e0] shadow-clay hover:text-white"
                                    >
                                        INICIAR SESIÓN CON STEAM
                                    </Button>
                                    <Button
                                        render={<a href={discordLoginUrl} />}
                                        className="w-full rounded-full bg-gradient-to-r from-[#536dfe] to-[#5865f2] text-white shadow-clay hover:opacity-90"
                                    >
                                        <img src={discordWordmark} alt="Discord" className="mr-2 h-[18px] w-auto brightness-0 invert" />
                                        INICIAR SESIÓN
                                    </Button>
                                </div>

                                <p className="mt-6 text-xs text-muted-foreground">
                                    Al continuar aceptas las reglas del servidor.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
