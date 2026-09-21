import AdminDashboardLayout from '@/Components/AdminDashboard/AdminDashboardLayout.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Badge } from '@/Components/ui/badge'
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

const stats = [
    { label: 'Jugadores activos', value: '1,284', delta: '+12%', icon: '👥', color: '#ff7d6b' },
    { label: 'Ventas del mes', value: '€2,847', delta: '+8%', icon: '🛒', color: '#f472b6' },
    { label: 'Packs activos', value: '4', delta: 'estable', icon: '🎁', color: '#a78bfa' },
    { label: 'Nuevos suscriptores', value: '96', delta: '+21%', icon: '🚀', color: '#22d3ee' },
]

const chartData = [
    { day: 'Lun', ventas: 420, jugadores: 980 },
    { day: 'Mar', ventas: 510, jugadores: 1040 },
    { day: 'Mié', ventas: 480, jugadores: 1010 },
    { day: 'Jue', ventas: 620, jugadores: 1120 },
    { day: 'Vie', ventas: 740, jugadores: 1240 },
    { day: 'Sáb', ventas: 880, jugadores: 1320 },
    { day: 'Dom', ventas: 690, jugadores: 1180 },
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
                <h1 className="font-display text-3xl font-black text-foreground">
                    <span className="text-gradient">Panel de Administración</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                    Resumen general del servidor y de las ventas.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((s) => (
                    <Card key={s.label} className="clay rounded-4xl">
                        <CardContent className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                    {s.label}
                                </p>
                                <p className="mt-2 font-display text-3xl font-black text-foreground">
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
                                className="flex size-12 items-center justify-center rounded-2xl text-2xl shadow-clay-inset"
                                style={{ background: `${s.color}1a`, boxShadow: 'var(--shadow-clay-inset), 0 0 22px -8px ' + s.color + '80' }}
                            >
                                {s.icon}
                            </span>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
                <Card className="clay rounded-4xl">
                    <CardHeader>
                        <CardTitle className="font-display text-lg font-bold text-foreground">
                            Actividad semanal
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="gradVentas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ff7d6b" stopOpacity={0.6} />
                                        <stop offset="100%" stopColor="#ff7d6b" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gradJugadores" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
                                        <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgb(255 255 255 / 0.06)" />
                                <XAxis dataKey="day" tick={{ fill: '#a7b0c5', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#a7b0c5', fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
                                <Tooltip
                                    contentStyle={{
                                        background: '#161c2e',
                                        border: '1px solid rgb(255 255 255 / 0.08)',
                                        borderRadius: 16,
                                        boxShadow: 'var(--shadow-clay-inset)',
                                        color: '#e8ebf5',
                                    }}
                                />
                                <Area type="monotone" dataKey="ventas" stroke="#ff7d6b" strokeWidth={2.5} fill="url(#gradVentas)" />
                                <Area type="monotone" dataKey="jugadores" stroke="#22d3ee" strokeWidth={2.5} fill="url(#gradJugadores)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="clay rounded-4xl">
                    <CardHeader>
                        <CardTitle className="font-display text-lg font-bold text-foreground">
                            Pedidos recientes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentOrders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between gap-3 rounded-2xl bg-background/60 px-4 py-3 shadow-clay-inset"
                                style={{ border: '1px solid rgb(255 255 255 / 0.06)' }}
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-foreground">
                                        {order.product} · {order.user}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{order.id}</p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <span className="rounded-full bg-clay-gold/10 px-2.5 py-0.5 text-xs font-semibold text-clay-gold">
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
        </div>
    )
}

AdminDashboard.layout = (page) => (
    <AdminDashboardLayout>
        {page}
    </AdminDashboardLayout>
)