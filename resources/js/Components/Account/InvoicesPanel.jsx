import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table.jsx";
import { Badge } from "@/Components/ui/badge.jsx";

const sampleInvoices = [
    { id: "#INV-2081", date: "02 Sep 2026", amount: "$49.00", status: "Pagada" },
    { id: "#INV-2063", date: "15 Ago 2026", amount: "$49.00", status: "Pagada" },
];

function statusVariant(status) {
    if (status === "Pagada") return "default";
    return "outline";
}

export default function InvoicesPanel({ invoices }) {
    const data = invoices ?? sampleInvoices;

    if (data.length === 0) {
        return (
            <div className="clay flex flex-col items-center justify-center gap-2 rounded-3xl py-12 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-clay-gold/10 text-2xl shadow-clay-inset">🧾</span>
                <p className="font-display text-lg font-bold text-foreground">Sin facturas</p>
                <p className="text-sm text-muted-foreground">No hay facturas emitidas todavía.</p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Factura</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((invoice) => (
                    <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell className="font-medium">{invoice.amount}</TableCell>
                        <TableCell className="text-right">
                            <Badge variant={statusVariant(invoice.status)}>{invoice.status}</Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
