import { router } from "@inertiajs/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar.jsx";
import { Badge } from "@/Components/ui/badge.jsx";
import { Button } from "@/Components/ui/button.jsx";

function AccountRow({ authenticator, data, synced, onSyncChanged }) {
    const username = data?.username ?? "No vinculado";
    const initials = username.slice(0, 2).toUpperCase();

    const unlink = (e) => {
        e.preventDefault();
        router.post(`/auth/signout/${authenticator}`, {}, {
            onSuccess: () => window.location.reload(),
        });
        onSyncChanged(!synced);
    };

    return (
        <div className="flex items-center justify-between gap-4 rounded-3xl border border-border bg-background/50 px-4 py-3">
            <div className="flex items-center gap-3">
                <Avatar className="size-11">
                    {data?.avatar_url && (
                        <AvatarImage src={data.avatar_url} alt="profile-picture" />
                    )}
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium text-foreground">{username}</p>
                    <p className="text-xs text-muted-foreground capitalize">{authenticator}</p>
                </div>
            </div>

            {synced ? (
                <Button onClick={unlink} variant="secondary" size="sm">
                    Desvincular
                </Button>
            ) : (
                <Button render={<a href={`/auth/signin/${authenticator}`} />} size="sm">
                    Vincular
                </Button>
            )}
        </div>
    );
}

export default function LinkedAccounts({ steamData, discordData, steamSynced, discordSynced, onSteamChange, onDiscordChange }) {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <AccountRow
                authenticator="steam"
                data={steamData}
                synced={steamSynced}
                onSyncChanged={onSteamChange}
            />
            <AccountRow
                authenticator="discord"
                data={discordData}
                synced={discordSynced}
                onSyncChanged={onDiscordChange}
            />
        </div>
    );
}
