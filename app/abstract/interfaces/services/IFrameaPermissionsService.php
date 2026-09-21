<?php

namespace App\abstract\interfaces\services;

interface IFrameaPermissionsService
{
    public function check(
        string $steamId,
        string $node,
        ?string $serverKey = null
    ): array;

    public function grant(
        string $steamId,
        string $node,
        ?string $serverKey = null
    ): array;

    public function revoke(
        string $steamId,
        string $node,
        ?string $serverKey = null
    ): array;

    public function groupList(): array;

    public function groupCreate(
        string $groupName,
        ?string $displayName = null,
        ?int $priority = null,
        ?int $weight = null,
        ?string $color = null,
        bool $isHidden = false
    ): array;

    public function groupDelete(string $groupName): array;

    public function groupInfo(string $groupName): array;

    public function trackList(): array;

    public function trackPromote(
        string $steamId,
        string $track
    ): array;

    public function trackDemote(
        string $steamId,
        string $track
    ): array;

    public function userInfo(string $steamId): array;

    public function userGroups(string $steamId): array;
}
