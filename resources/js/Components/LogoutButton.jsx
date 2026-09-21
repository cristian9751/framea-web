import {router, usePage} from "@inertiajs/react";
import {Button} from "@/Components/ui/button.jsx";

export default function LogoutButton({ className }) {
    const {  props } = usePage()
    return ( props.auth?.user &&
        <Button
            variant="ghost"
            className={className ?? "rounded-full bg-clay-rose/10 text-clay-rose hover:bg-clay-rose/20 hover:text-clay-rose"}
            onClick={() => router.post('/auth/logout')}
        >
            Cerrar sesión
        </Button>
    )
}
