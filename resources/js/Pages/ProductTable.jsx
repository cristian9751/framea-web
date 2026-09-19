import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table"
import AdminDashboardLayout from "@/Components/AdminDashboard/AdminDashboardLayout.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"

export default function ProductTable({ products }) {
    return (
        <Card className="clay rounded-4xl">
            <CardHeader>
                <CardTitle className="font-display text-xl font-bold text-foreground">
                    <span className="text-transparent [background-image:linear-gradient(120deg,#ff7d6b,#f472b6)] bg-clip-text">
                        Gestión de Productos
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Precios</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">
                                    <span className="rounded-xl bg-clay-coral/10 px-2.5 py-1 text-foreground">
                                        {product.name}
                                    </span>
                                </TableCell>

                                <TableCell>
                                    {product.description}
                                </TableCell>

                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        {product.prices.map((price) => (
                                            <div
                                                key={price.id}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="rounded-xl bg-clay-gold/10 px-2.5 py-1 font-medium text-clay-gold">
                                                    {price.value} €
                                                </span>

                                                <span className="text-muted-foreground">
                                                    / {price.billing_type.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
ProductTable.layout = (page) => (
    <AdminDashboardLayout>
        {page}
    </AdminDashboardLayout>
)