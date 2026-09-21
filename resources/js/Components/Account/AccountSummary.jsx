import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar.jsx";
import { Badge } from "@/Components/ui/badge.jsx";
import { Separator } from "@/Components/ui/separator.jsx";

export default function AccountSummary({ user, steamData, discordData }) {
    const initials = (user?.name ?? "U").slice(0, 2).toUpperCase();
    const links = [
        { label: "Steam", linked: steamData?.linked ?? false },
        { label: "Discord", linked: discordData?.linked ?? false },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar className="size-16">
                    <AvatarImage src={user?.avatar_url} alt="avatar" />
                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>

                <div>
                    <p className="font-display text-lg font-bold text-foreground">
                        {user?.name ?? "Usuario"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {user?.email ?? "Sin correo asociado"}
                    </p>
                </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {links.map((link) => (
                    <div
                        key={link.label}
                        className="flex items-center justify-between rounded-2xl bg-background/60 px-4 py-3 shadow-clay-inset"
                        style={{ border: '1px solid rgb(255 255 255 / 0.06)' }}
                    >
                        <span className="text-sm font-medium text-foreground">
                            {link.label}
                        </span>
                        {link.linked ? (
                            <Badge variant="secondary">Vinculada</Badge>
                        ) : (
                            <Badge variant="outline">Sin vincular</Badge>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
