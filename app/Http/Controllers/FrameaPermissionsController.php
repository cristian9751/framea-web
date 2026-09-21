<?php

namespace App\Http\Controllers;

use App\abstract\interfaces\services\IFrameaPermissionsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FrameaPermissionsController extends Controller
{

    public function __construct(
        private readonly IFrameaPermissionsService $permissions
    ) {
    }

    /**
     * Base page: groups and tracks used to build the lucky-perms style UI.
     */
    public function index(): Response
    {
        return Inertia::render('page', [
            'groups' => $this->permissions->groupList(),
            'tracks' => $this->permissions->trackList(),
        ]);
    }

    /**
     * Review a user's permissions and return its nodes.
     */
    public function show(Request $request, string $steamId): Response
    {
        $validated = $request->validate([
            'serverKey' => ['nullable', 'string'],
        ]);

        return Inertia::render('page', [
            'steamId' => $steamId,
            'user' => $this->permissions->userInfo($steamId),
            'userGroups' => $this->permissions->userGroups($steamId),
            'serverKey' => $validated['serverKey'] ?? null,
        ]);
    }

    /**
     * Authorize a user on a node.
     */
    public function grant(Request $request)
    {
        $validated = $request->validate([
            'steamId' => ['required', 'string'],
            'node' => ['required', 'string'],
            'serverKey' => ['nullable', 'string'],
        ]);

        $this->permissions->grant(
            $validated['steamId'],
            $validated['node'],
            $validated['serverKey'] ?? null,
        );

        return back();
    }

    /**
     * Deauthorize a user on a node.
     */
    public function revoke(Request $request)
    {
        $validated = $request->validate([
            'steamId' => ['required', 'string'],
            'node' => ['required', 'string'],
            'serverKey' => ['nullable', 'string'],
        ]);

        $this->permissions->revoke(
            $validated['steamId'],
            $validated['node'],
            $validated['serverKey'] ?? null,
        );

        return back();
    }

    /**
     * Check whether a user has a node.
     */
    public function check(Request $request): Response
    {
        $validated = $request->validate([
            'steamId' => ['required', 'string'],
            'node' => ['required', 'string'],
            'serverKey' => ['nullable', 'string'],
        ]);

        return Inertia::render('page', [
            'check' => $this->permissions->check(
                $validated['steamId'],
                $validated['node'],
                $validated['serverKey'] ?? null,
            ),
        ]);
    }

    public function groupList(Request $request): Response
    {
        return Inertia::render('page', [
            'groups' => $this->permissions->groupList(),
        ]);
    }

    public function groupCreate(Request $request)
    {
        $validated = $request->validate([
            'groupName' => ['required', 'string'],
            'displayName' => ['nullable', 'string'],
            'priority' => ['nullable', 'integer'],
            'weight' => ['nullable', 'integer'],
            'color' => ['nullable', 'string'],
            'isHidden' => ['nullable', 'boolean'],
        ]);

        $this->permissions->groupCreate(
            $validated['groupName'],
            $validated['displayName'] ?? null,
            $validated['priority'] ?? null,
            $validated['weight'] ?? null,
            $validated['color'] ?? null,
            $validated['isHidden'] ?? false,
        );

        return back();
    }

    public function groupDelete(Request $request)
    {
        $validated = $request->validate([
            'groupName' => ['required', 'string'],
        ]);

        $this->permissions->groupDelete($validated['groupName']);

        return back();
    }

    public function groupInfo(Request $request, string $groupName): Response
    {
        return Inertia::render('page', [
            'groupName' => $groupName,
            'group' => $this->permissions->groupInfo($groupName),
        ]);
    }

    public function trackList(Request $request): Response
    {
        return Inertia::render('page', [
            'tracks' => $this->permissions->trackList(),
        ]);
    }

    public function trackPromote(Request $request)
    {
        $validated = $request->validate([
            'steamId' => ['required', 'string'],
            'track' => ['required', 'string'],
        ]);

        $this->permissions->trackPromote($validated['steamId'], $validated['track']);

        return back();
    }

    public function trackDemote(Request $request)
    {
        $validated = $request->validate([
            'steamId' => ['required', 'string'],
            'track' => ['required', 'string'],
        ]);

        $this->permissions->trackDemote($validated['steamId'], $validated['track']);

        return back();
    }

    public function userGroups(Request $request, string $steamId): Response
    {
        return Inertia::render('page', [
            'steamId' => $steamId,
            'userGroups' => $this->permissions->userGroups($steamId),
        ]);
    }

    public function userInfo(Request $request, string $steamId): Response
    {
        return Inertia::render('page', [
            'steamId' => $steamId,
            'user' => $this->permissions->userInfo($steamId),
        ]);
    }
}
