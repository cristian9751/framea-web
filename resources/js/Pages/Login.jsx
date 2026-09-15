import { Button } from '@/Components/ui/button';
import PageHero from '@/Components/PageHero';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import Layout from '../Components/Layout';
import {usePage} from "@inertiajs/react";

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
            title="FRAMEA | Iniciar Sesión"
            description="Accede a tu cuenta de FRAMEA mediante Steam o Discord"
        >
            <PageHero title="Iniciar Sesión" subtitle="Accede a tu cuenta usando Steam o Discord" />

            <section className="py-24">
                <div className="container">
                    <div className="mx-auto max-w-[520px]">
                        <Card className=" justify-content-center border-border text-center p-10 md:p-12">
                            <CardHeader className="items-center">
                                <div className="mb-6 inline-flex items-center gap-2">
                                    <span className="font-display text-2xl font-black text-primary [text-shadow:0_0_20px_rgba(245,158,11,0.3)]">
                                        FRA
                                    </span>
                                    <span className="font-display text-xl font-bold tracking-[3px] text-foreground">
                                        MEA
                                    </span>
                                </div>
                                <CardTitle className="font-display text-xl font-bold tracking-widest text-foreground uppercase">
                                    Elige tu método de acceso
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="w-full">
                                <p className="mb-8 text-sm text-muted-foreground">
                                    Solo necesitas una de estas cuentas. No creamos usuarios ni
                                    contraseñas.
                                </p>

                                {errorMessage && (
                                    <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3.5 text-sm text-red-300">
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="flex flex-col gap-4">
                                    <Button
                                        render={<a href={steamLoginUrl} />}
                                        className="w-full bg-[#171a21] text-[#c7d5e0] hover:bg-[#1b2838] hover:text-white"
                                    >
                                        INICIAR SESIÓN CON STEAM
                                    </Button>
                                    <Button
                                        render={<a href={discordLoginUrl} />}
                                        className="w-full bg-discord text-white hover:bg-discord-dark"
                                    >
                                        INICIAR SESIÓN CON DISCORD
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
