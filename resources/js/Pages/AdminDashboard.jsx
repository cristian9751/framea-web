import AdminDashboardLayout from '@/Components/AdminDashboard/AdminDashboardLayout.jsx'

export default function AdminDashboard() {
    return (
        <div>
            Panel de administración
        </div>
    )
}

AdminDashboard.layout = (page) => (
    <AdminDashboardLayout>
        {page}
    </AdminDashboardLayout>
)

