<?php

namespace App\Services\Framea;

use App\abstract\interfaces\services\IFrameaPermissionsService;

class FrameaPermissionsService implements IFrameaPermissionsService
{
    public function __construct(private  FrameaWsService $ws)
    {
    }

    public function check(string $steamId, string $node, ?string $serverKey = null): array
    {
        return $this->ws->request(
            'perm.check',
            $this->payload('check', ['SteamId' => $steamId, 'Node' => $node], $serverKey),
        );
    }

    public function grant(string $steamId, string $node, ?string $serverKey = null): array
    {
        return $this->ws->request(
            'perm.grant',
            $this->payload('grant', ['SteamId' => $steamId, 'Node' => $node], $serverKey),
        );
    }

    public function revoke(string $steamId, string $node, ?string $serverKey = null): array
    {
        return $this->ws->request(
            'perm.revoke',
            $this->payload('revoke', ['SteamId' => $steamId, 'Node' => $node], $serverKey),
        );
    }

    public function groupList(): array
    {
        return $this->ws->request('perm.group.list', $this->payload('group.list'));
    }

    public function groupCreate(
        string $groupName,
        ?string $displayName = null,
        ?int $priority = null,
        ?int $weight = null,
        ?string $color = null,
        bool $isHidden = false,
    ): array {
        $fields = ['GroupName' => $groupName];

        if ($displayName !== null) {
            $fields['DisplayName'] = $displayName;
        }
        if ($priority !== null) {
            $fields['Priority'] = $priority;
        }
        if ($weight !== null) {
            $fields['Weight'] = $weight;
        }
        if ($color !== null) {
            $fields['Color'] = $color;
        }
        $fields['IsHidden'] = $isHidden;

        return $this->ws->request('perm.group.create', $this->payload('group.create', $fields));
    }

    public function groupDelete(string $groupName): array
    {
        return $this->ws->request(
            'perm.group.delete',
            $this->payload('group.delete', ['GroupName' => $groupName]),
        );
    }

    public function groupInfo(string $groupName): array
    {
        return $this->ws->request(
            'perm.group.info',
            $this->payload('group.info', ['GroupName' => $groupName]),
        );
    }

    public function trackList(): array
    {
        return $this->ws->request('perm.track.list', $this->payload('track.list'));
    }

    public function trackPromote(string $steamId, string $track): array
    {
        return $this->ws->request(
            'perm.track.promote',
            $this->payload('track.promote', ['SteamId' => $steamId, 'Track' => $track]),
        );
    }

    public function trackDemote(string $steamId, string $track): array
    {
        return $this->ws->request(
            'perm.track.demote',
            $this->payload('track.demote', ['SteamId' => $steamId, 'Track' => $track]),
        );
    }

    public function userInfo(string $steamId): array
    {
        return $this->ws->request(
            'perm.user.info',
            $this->payload('user.info', ['SteamId' => $steamId]),
        );
    }

    public function userGroups(string $steamId): array
    {
        return $this->ws->request(
            'perm.user.groups',
            $this->payload('user.groups', ['SteamId' => $steamId]),
        );
    }

    /**
     * Build a perm.* payload with the Action field and optional server scope.
     *
     * @param array<string, mixed> $fields
     * @return array<string, mixed>
     */
    private function payload(string $action, array $fields = [], ?string $serverKey = null): array
    {
        $payload = ['Action' => $action] + $fields;

        if ($serverKey !== null) {
            $payload['ServerKey'] = $serverKey;
        }

        return $payload;
    }
}
