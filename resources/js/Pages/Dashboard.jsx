import { useState } from "react";
import {router, usePage} from "@inertiajs/react";
import PageLayout from "../Components/Enterprise/PageLayout";
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
        <PageLayout
            title="ENTERPRISE | Dashboard"
            description="Sincroniza tu cuenta de Steam y gestiona tus roles de Discord"
        >
            <section className="bg-enterprise-bg px-5 pt-10 pb-2">
                <div className="mx-auto mb-5 max-w-[940px] text-center">
                    <div className="mx-auto mb-3 h-[2px] w-10 bg-enterprise-primary" />
                    <h2 className="m-0 text-[clamp(27px,6.75vw,39px)] font-black tracking-[0.08em] text-enterprise-text">DASHBOARD</h2>
                    <p className="mt-1.5 text-[10.5px] tracking-[0.18em] text-enterprise-muted">SINCRONIZA TU CUENTA DE STEAM Y GESTIONA TUS SERVIDORES</p>
                </div>
            </section>

            <div className="flex-1 space-y-6 p-6">
                <section className="py-12">
                    <div className="container">
                        <div className="mx-auto max-w-[900px] space-y-10">


                            {/* =========================
                                MI CUENTA
                            ========================= */}

                            <Card className="border-enterprise-border bg-enterprise-card shadow-none rounded-xl">
                                <CardHeader>
                                    <CardTitle className="font-display text-xl font-bold text-enterprise-text">
                                        Mi Cuenta
                                    </CardTitle>
                                    <CardDescription className="text-enterprise-body">
                                        Consulta tus pedidos, facturas y cuentas vinculadas
                                    </CardDescription>

                                    {perms[Permissions.VIEW_ADMINISTRATION_PANEL] && (
                                        <CardAction>
                                            <Button
                                                className="rounded-full bg-enterprise-primary text-[#111] hover:opacity-90"
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
            </div>
        </PageLayout>
    );
}
