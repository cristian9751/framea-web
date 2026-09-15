import { router } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar.jsx";
import { Button } from "@/Components/ui/button.jsx";
import { Link04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function LinkBox({ synced, data, authenticator, onSyncChanged }) {
    const unlink = (e) => {
        e.preventDefault();
        router.post(`/auth/signout/${authenticator}`, {}, {
            onSuccess: () => window.location.reload(),
        });
        onSyncChanged(!synced);
    };

    const username = data['username'] ?? 'No vinculado';
    const initials = username.slice(0, 2).toUpperCase();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cuenta de {authenticator}</CardTitle>
                <CardDescription>
                    {synced
                        ? `Tu cuenta de ${authenticator} está vinculada`
                        : `Presiona el botón para vincular ${authenticator}`}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                    <Avatar className="size-11">
                        {data['avatar_url'] && (
                            <AvatarImage src={data['avatar_url']} alt="profile-picture" />
                        )}
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-foreground">{username}</p>
                </div>
                {data['id'] && (
                    <p className="text-xs text-muted-foreground">{data['id']}</p>
                )}
            </CardContent>
            <CardFooter>
                {synced ? (
                    <Button onClick={unlink} variant="secondary" className="w-full">
                        Desvincular
                    </Button>
                ) : (
                    <Button
                        render={<a href={`/auth/signin/${authenticator}`} />}
                        className="w-full"
                    >
                        <HugeiconsIcon icon={Link04Icon} strokeWidth={2} />
                        Vincular
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
