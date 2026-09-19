import { useState } from "react";
import {router, usePage} from "@inertiajs/react";
import Layout from "../Components/Layout";
import PageHero from "../Components/PageHero";
import { LinkBox } from "../Components/LinkBox.jsx";
import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from "@/Components/ui/card.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs.jsx";
import AccountSummary from "../Components/Account/AccountSummary.jsx";
import OrdersPanel from "../Components/Account/OrdersPanel.jsx";
import InvoicesPanel from "../Components/Account/InvoicesPanel.jsx";
import LinkedAccounts from "../Components/Account/LinkedAccounts.jsx";
import { Permissions } from "@/constants/permissions"
import {Button} from "@/Components/ui/button.jsx";

export default function Dashboard({ discordData, steamData }) {
    const {perms } = usePage().props

    const [steamSynced, setSteamSynced] = useState(steamData["linked"]);
    const [discordSynced, setDiscordSynced] = useState(discordData["linked"]);

    return (
        <Layout
            title="ENTERPRISE | Dashboard"
            description="Sincroniza tu cuenta de Steam y gestiona tus roles de Discord"
        >
            <PageHero
                title="Dashboard"
                subtitle="Sincroniza tu cuenta de Steam y gestiona tus servidores"
            />

            <main className="flex-1 space-y-6 p-6">
                <section className="py-12">
                    <div className="container">
                        <div className="mx-auto max-w-[900px] space-y-10">


                            {/* =========================
                                MI CUENTA
                            ========================== */}

                            <Card className="clay rounded-4xl">
                                <CardHeader>
                                    <CardTitle className="font-display text-xl font-bold text-foreground">
                                        Mi Cuenta
                                    </CardTitle>
                                    <CardDescription>
                                        Consulta tus pedidos, facturas y cuentas vinculadas
                                    </CardDescription>

                                    {perms[Permissions.VIEW_ADMINISTRATION_PANEL] && (
                                        <CardAction>
                                            <Button
                                                className="rounded-full bg-gradient-to-r from-clay-coral to-clay-violet text-white shadow-clay hover:opacity-90"
                                                onClick={() => router.get('/admin/dashboard')}
                                            >
                                                Panel de administracion
                                            </Button>
                                        </CardAction>
                                    )}
                                </CardHeader>


                                <CardContent>
                                    <Tabs defaultValue="resumen" className="w-full">
                                        <TabsList className="flex w-full flex-wrap">
                                            <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
                                            <TabsTrigger value="facturas">Facturas</TabsTrigger>
                                            <TabsTrigger value="cuentas">Cuentas</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="pedidos" className="mt-6">
                                            <OrdersPanel />
                                        </TabsContent>

                                        <TabsContent value="facturas" className="mt-6">
                                            <InvoicesPanel />
                                        </TabsContent>

                                        <TabsContent value="cuentas" className="mt-6">
                                            <LinkedAccounts
                                                steamData={steamData}
                                                discordData={discordData}
                                                steamSynced={steamSynced}
                                                discordSynced={discordSynced}
                                                onSteamChange={setSteamSynced}
                                                onDiscordChange={setDiscordSynced}
                                            />
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
