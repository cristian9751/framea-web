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

export default function ProductTable({ products }) {
    return (
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
                            {product.name}
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
                                        <span className="font-medium">
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
    )
}
ProductTable.layout = (page) => (
    <AdminDashboardLayout>
        {page}
    </AdminDashboardLayout>
)
