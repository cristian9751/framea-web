import {router, usePage} from "@inertiajs/react";
import {Button} from "@/Components/ui/button.jsx";

export default function LogoutButton() {
    const {  props } = usePage()
    return ( props.auth?.user &&
        <Button className={"rounded-full"}
                onClick={() => router.post('/auth/logout')}
        >
            Cerrar sesión
        </Button>
    )
}
