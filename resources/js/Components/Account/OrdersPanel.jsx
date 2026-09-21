import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table.jsx";
import { Badge } from "@/Components/ui/badge.jsx";

const sampleOrders = [
    { id: "#ORD-1042", product: "Suscripción Pro", date: "02 Sep 2026", amount: "$49.00", status: "Completado" },
    { id: "#ORD-1039", product: "Suscripción Básica", date: "28 Ago 2026", amount: "$19.00", status: "Pendiente" },
    { id: "#ORD-1021", product: "Suscripción Pro", date: "15 Ago 2026", amount: "$49.00", status: "Completado" },
];

function statusVariant(status) {
    if (status === "Completado") return "default";
    if (status === "Pendiente") return "secondary";
    return "destructive";
}

export default function OrdersPanel({ orders }) {
    const data = orders ?? sampleOrders;

    if (data.length === 0) {
        return (
            <div className="clay flex flex-col items-center justify-center gap-2 rounded-3xl py-12 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-clay-coral/10 text-2xl shadow-clay-inset">📦</span>
                <p className="font-display text-lg font-bold text-foreground">Sin pedidos</p>
                <p className="text-sm text-muted-foreground">Aún no tienes pedidos registrados.</p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell className="font-medium">{order.amount}</TableCell>
                        <TableCell className="text-right">
                            <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
