import AdminDashboardLayout from '@/Components/AdminDashboard/AdminDashboardLayout.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Badge } from '@/Components/ui/badge'

const stats = [
    { label: 'Jugadores activos', value: '1,284', delta: '+12%', icon: '👥', color: '#9677F2' },
    { label: 'Ventas del mes', value: '€2,847', delta: '+8%', icon: '🛒', color: '#2ecc71' },
    { label: 'Packs activos', value: '4', delta: 'estable', icon: '🎁', color: '#ff3ed8' },
]

const recentOrders = [
    { id: '#ORD-1042', user: 'Kane', product: 'Pack Oro', amount: '20€', status: 'Completado' },
    { id: '#ORD-1041', user: 'Zeta', product: 'Pack Plata', amount: '10€', status: 'Pendiente' },
    { id: '#ORD-1040', user: 'Luna', product: 'Pack Diamante', amount: '35€', status: 'Completado' },
]

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-3xl font-black text-enterprise-text">
                    Panel de Administración
                </h1>
                <p className="text-sm text-enterprise-muted">
                    Resumen general del servidor y de las ventas.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((s) => (
                    <Card key={s.label} className="border-enterprise-border bg-enterprise-card shadow-none rounded-xl">
                        <CardContent className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium tracking-wide text-enterprise-muted uppercase">
                                    {s.label}
                                </p>
                                <p className="mt-2 font-display text-3xl font-black text-enterprise-text">
                                    {s.value}
                                </p>
                                <Badge
                                    variant="outline"
                                    className="mt-2 rounded-full"
                                    style={{ color: s.color, borderColor: `${s.color}66`, background: `${s.color}1a` }}
                                >
                                    {s.delta}
                                </Badge>
                            </div>
                            <span
                                className="flex size-12 items-center justify-center rounded-2xl border border-enterprise-border text-2xl"
                                style={{ background: `${s.color}1a` }}
                            >
                                {s.icon}
                            </span>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-enterprise-border bg-enterprise-card shadow-none rounded-xl">
                <CardHeader>
                    <CardTitle className="font-display text-lg font-bold text-enterprise-text">
                        Pedidos recientes
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {recentOrders.map((order) => (
                        <div
                            key={order.id}
                            className="flex items-center justify-between gap-3 rounded-2xl border border-enterprise-border bg-enterprise-bg px-4 py-3"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-enterprise-text">
                                    {order.product} · {order.user}
                                </p>
                                <p className="text-xs text-enterprise-muted">{order.id}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                                <span className="rounded-full bg-enterprise-primarySoft px-2.5 py-0.5 text-xs font-semibold text-enterprise-primary">
                                    {order.amount}
                                </span>
                                <Badge
                                    variant={order.status === 'Completado' ? 'default' : 'secondary'}
                                    className="rounded-full"
                                >
                                    {order.status}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

AdminDashboard.layout = (page) => (
    <AdminDashboardLayout>
        {page}
    </AdminDashboardLayout>
)
