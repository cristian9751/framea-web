import { useEffect, useMemo, useRef, useState } from 'react';
import AdminDashboardLayout from '@/Components/AdminDashboard/AdminDashboardLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { createPermissionClient } from '@/lib/permission-ws';

// ---------------------------------------------------------------------------
// Panel de permisos integrado en el layout de administración
// (Sidebar + panel grande). Ruta: /admin/dashboard/perms, botón "Permisos"
// en el menú lateral. Estilo Enterprise como el resto de la app.
//
// Solo frontend + mock local. El backend (socket perm.*) lo conecta el
// desarrollador de backend vía VITE_PERMISSIONS_WS_URL (ver permission-ws.js).
// ---------------------------------------------------------------------------

function ValueBadge({ value }) {
    return value
        ? <Badge className="border-[#2ecc71]/40 bg-[#2ecc71]/15 text-[#2ecc71]">allow</Badge>
        : <Badge className="border-[#ff3ed8]/40 bg-[#ff3ed8]/15 text-[#ff3ed8]">deny</Badge>;
}

// ¿Abrir el popup hacia arriba? (evita recortes y scroll cuando no cabe abajo)
function flipUp(ref) {
    try {
        const r = ref.current.getBoundingClientRect();
        return (window.innerHeight - r.bottom) < 260;
    } catch (e) { return false; }
}

// Abrir un popup cierra todos los demás (evita solapes entre desplegables).
function popOpen(id) {
    try { window.dispatchEvent(new CustomEvent('pop:open', { detail: id })); } catch (e) {}
}
function usePopClose(id, close) {
    useEffect(function () {
        const h = function (e) { if (!e || e.detail !== id) close(); };
        window.addEventListener('pop:open', h);
        return function () { window.removeEventListener('pop:open', h); };
    }, [id]);
}

// TagInput estilo añadir-tags de YouTube: lo escrito se encierra en burbuja
// con coma/Enter (o al perder el foco), click en sugerencias añade sin
// cerrar, × quita, backspace en vacío quita la última. Sin dependencias.
function TagInput({ values, onChange, placeholder, suggestions, allowCustom, popId }) {
    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    const [up, setUp] = useState(false);
    const wrapRef = useRef(null);
    const [pos, setPos] = useState({ top: 0, left: 0, width: 200, maxH: 240 });
    const openMe = function () {
        let p = { top: 0, left: 0, width: 200, maxH: 240 };
        let isUp = false;
        try {
            const r = wrapRef.current.getBoundingClientRect();
            const w = Math.max(Math.round(r.width), 180);
            const left = Math.max(8, Math.min(Math.round(r.left), window.innerWidth - w - 8));
            const below = window.innerHeight - r.bottom;
            isUp = below < 260;
            const maxH = Math.max(120, Math.round((isUp ? r.top : below) - 12));
            p = isUp
                ? { bottom: Math.round(window.innerHeight - r.top + 4), left: left, width: w, maxH: maxH }
                : { top: Math.round(r.bottom + 4), left: left, width: w, maxH: maxH };
        } catch (e) {}
        setPos(p); setUp(isUp); setOpen(true); popOpen(popId);
    };
    usePopClose(popId, function () { setOpen(false); });
    // Fijo a viewport: ningún contenedor con scroll lo recorta. Con scroll/resize se cierra.
    useEffect(function () {
        if (!open) return undefined;
        const h = function () { setOpen(false); };
        window.addEventListener('scroll', h, true);
        window.addEventListener('resize', h);
        return function () { window.removeEventListener('scroll', h, true); window.removeEventListener('resize', h); };
    }, [open]);
    const q = text.trim().toLowerCase();
    const hits = (suggestions || []).filter(function (x) {
        return values.indexOf(x) < 0 && (!q || x.toLowerCase().indexOf(q) >= 0);
    });
    const commit = function (raw) {
        const v = String(raw || '').trim().replace(/,+$/, '').trim();
        if (!v) return false;
        if (!allowCustom && suggestions.indexOf(v) < 0) return false;
        if (values.indexOf(v) < 0) onChange(values.concat([v]));
        setText('');
        return true;
    };
    const onKey = function (e) {
        if (e.key === 'Escape') { setOpen(false); return; }
        if (e.key === 'Enter') { e.preventDefault(); if (commit(text)) openMe(); return; }
        if (e.key === 'Backspace' && !text && values.length) onChange(values.slice(0, -1));
    };
    const onType = function (e) {
        const v = e.target.value;
        if (v.indexOf(',') < 0) { setText(v); openMe(); return; }
        // Por comas: solo se consume lo que realmente se convierte en burbuja;
        // lo inválido (filtro sin coincidencia exacta) se queda escrito.
        const parts = v.split(',');
        const rest = parts.pop();
        const add = [];
        const keep = [];
        parts.forEach(function (p) {
            const t = String(p).trim();
            if (!t) return;
            if (!allowCustom && suggestions.indexOf(t) < 0) { keep.push(p); return; }
            if (values.indexOf(t) < 0 && add.indexOf(t) < 0) add.push(t);
        });
        if (add.length) onChange(values.concat(add));
        keep.push(rest);
        setText(keep.join(','));
        openMe();
    };
    return (
        <span ref={wrapRef} className="relative block">
            <span
                role="textbox" tabIndex={0}
                onFocus={function () { openMe(); }}
                onClick={function () { const i = wrapRef.current ? wrapRef.current.querySelector('input') : null; if (i) i.focus(); }}
                className="flex min-h-[38px] w-full cursor-text flex-wrap items-center gap-1.5 rounded-xl border border-enterprise-border bg-enterprise-bg px-2.5 py-1.5"
            >
                {values.map(function (v) {
                    return (
                        <span key={v} className="inline-flex max-w-full items-center gap-1 rounded-lg bg-enterprise-primarySoft px-2 py-0.5 font-mono text-[11px] text-enterprise-primary">
                            <span className="truncate">{v}</span>
                            <button type="button" aria-label={'Quitar ' + v} onMouseDown={function (e) { e.preventDefault(); onChange(values.filter(function (x) { return x !== v; })); }}
                                className="text-enterprise-primary hover:text-enterprise-text">×</button>
                        </span>
                    );
                })}
                <input
                    value={text}
                    onChange={onType}
                    onKeyDown={onKey}
                    onFocus={function () { openMe(); }}
                    onBlur={function () { commit(text); setTimeout(function () { setOpen(false); }, 150); }}
                    placeholder={values.length ? '' : placeholder}
                    className="min-w-[90px] flex-1 bg-transparent font-mono text-[12px] text-enterprise-text outline-none placeholder:text-enterprise-muted"
                />
            </span>
            {open && (hits.length > 0 || (allowCustom && q)) && (
                <span className="z-[100] overflow-y-auto rounded-xl border border-enterprise-border bg-enterprise-bg shadow-[0_18px_40px_rgba(0,0,0,0.5)]" style={{ position: 'fixed', left: pos.left, width: pos.width, maxHeight: pos.maxH, top: up ? undefined : pos.top, bottom: up ? pos.bottom : undefined }}>
                    {allowCustom && q && hits.indexOf(text.trim()) < 0 && (
                        <button type="button" onMouseDown={function (e) { e.preventDefault(); if (commit(text)) openMe(); }}
                            className="block w-full truncate px-3 py-2 text-left text-[13px] text-enterprise-primary hover:bg-enterprise-primarySoft">
                            Añadir “{text.trim()}”
                        </button>
                    )}
                    {hits.map(function (x) {
                        return (
                            <button key={x} type="button" onMouseDown={function (e) { e.preventDefault(); commit(x); openMe(); }}
                                className="block w-full truncate px-3 py-1.5 text-left font-mono text-[12px] text-enterprise-text hover:bg-enterprise-primarySoft">
                                {x}
                            </button>
                        );
                    })}
                </span>
            )}
        </span>
    );
}

export default function AdminDashboardPerms() {
    // BACKEND (dev): socketUrl sale del .env (Vite). Sin él -> mock local.
    const client = useMemo(function () {
        return createPermissionClient({ socketUrl: import.meta.env.VITE_PERMISSIONS_WS_URL });
    }, []);
    const [tracks, setTracks] = useState([]);
    const [groups, setGroups] = useState([]);
    const [sel, setSel] = useState(null); // { kind: 'group'|'track'|'user', name }
    const [detail, setDetail] = useState(null);
    const [events, setEvents] = useState([]);
    const [err, setErr] = useState(null);
    // Scopes activos (multi-selección, coma-separados en el filtro).
    // [] = servidor por defecto. Se usan como ServerKey en check/grant.
    const [scope, setScope] = useState([]);

    const fail = function (e) {
        if (!e) { setErr(null); return; }
        setErr({ code: e.code || 'error', message: e.message || 'Error desconocido' });
    };

    const loadLists = function () {
        fail(null);
        client.trackList().then(setTracks).catch(fail);
        client.groupList()
            .then(function (g) {
                setGroups(g);
                if (!sel && g[0]) select('group', g[0].name);
            })
            .catch(fail);
    };

    useEffect(function () {
        loadLists();
        const off1 = client.on('perm.event', function (e) {
            setEvents(function (l) { return [{ text: e.action + ' ' + e.node + ' → ' + e.steamId, at: e.timestamp }].concat(l).slice(0, 30); });
        });
        const off2 = client.on('perm.group.event', function (e) {
            setEvents(function (l) { return [{ text: e.action + ' ' + e.groupName, at: e.timestamp }].concat(l).slice(0, 30); });
            loadLists();
        });
        return function () { off1(); off2(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client]);

    const select = function (kind, name) {
        fail(null);
        // Si es la misma selección (p. ej. refresco tras grant/revoke),
        // conservar el detalle para no desmontar la vista ni perder el
        // resultado mostrado; si cambia, limpiar mientras carga lo nuevo.
        const same = sel && sel.kind === kind && sel.name === name;
        setSel({ kind: kind, name: name });
        if (!same) setDetail(null);
        if (kind === 'group') client.groupInfo(name).then(setDetail).catch(fail);
        if (kind === 'user') {
            client.userInfo(name)
                .then(function (u) {
                    return client.userGroups(name).then(function (gs) {
                        setDetail(Object.assign({}, u, { groups: gs }));
                    });
                })
                .catch(fail);
        }
    };

    return (
        <AdminDashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="font-display text-3xl font-black text-enterprise-text">
                        Permisos
                    </h1>
                    <p className="text-sm text-enterprise-muted">
                        Usuarios, grupos y tracks — editor estilo LuckPerms.
                        {client.isMock && (
                            <span className="ml-2">
                                <Badge className="border-enterprise-primary/40 bg-enterprise-primary/20 text-enterprise-primary">MODO DEMO</Badge>
                            </span>
                        )}
                    </p>
                </div>

                {err && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-[#ff7d6b]">
                        {err.code ? '[' + err.code + '] ' : ''}{err.message}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[300px_1fr]">
                    <SidePanel
                        tracks={tracks} groups={groups} sel={sel}
                        onSelect={select} onChanged={loadLists} client={client} fail={fail}
                        scope={scope} setScope={setScope}
                    />
                    <DetailPanel
                        sel={sel} detail={detail} client={client} fail={fail} scope={scope}
                        onChanged={function () { if (sel) select(sel.kind, sel.name); loadLists(); }}
                    />
                </div>

                <Card className="border-enterprise-border bg-enterprise-card shadow-none rounded-xl">
                    <CardHeader>
                        <CardTitle className="font-display text-base font-bold text-enterprise-text">Actividad ({events.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {events.length === 0 && <p className="text-sm text-enterprise-muted">Sin eventos todavía.</p>}
                        {events.map(function (e, i) {
                            return <p key={i} className="mb-1.5 font-mono text-[12px] text-enterprise-body">{e.text} <span className="text-enterprise-muted">{e.at}</span></p>;
                        })}
                    </CardContent>
                </Card>
            </div>
        </AdminDashboardLayout>
    );
}

// ------------------------- Panel lateral -------------------------
function SidePanel({ tracks, groups, sel, onSelect, onChanged, client, fail, scope, setScope }) {
    const [steamId, setSteamId] = useState('');
    const [scopes, setScopes] = useState([]);
    useEffect(function () {
        const load = function () { client.scopeList().then(setScopes).catch(function () {}); };
        load();
        window.addEventListener('scopes:changed', load);
        return function () { window.removeEventListener('scopes:changed', load); };
    }, [client]);
    usePopClose('user-search', function () { setOpen(false); });
    const [creating, setCreating] = useState(false);
    const [open, setOpen] = useState(false);
    const [userUp, setUserUp] = useState(false);
    const userWrapRef = useRef(null);
    const [dir, setDir] = useState([]);
    const openUser = function () { setUserUp(flipUp(userWrapRef)); setOpen(true); };
    useEffect(function () {
        client.userSearch('').then(setDir).catch(function () {});
    }, [client]);
    const q = steamId.trim().toLowerCase();
    const matches = dir
        .filter(function (d) {
            return !q || d.displayName.toLowerCase().indexOf(q) >= 0 || d.steamId.indexOf(q) >= 0;
        })
        .sort(function (a, b) { return a.displayName.localeCompare(b.displayName); });
    const pick = function (u) {
        setSteamId(u.steamId);
        setOpen(false);
        onSelect('user', u.steamId);
    };
    const [form, setForm] = useState({ groupName: '', displayName: '', priority: 0, weight: 0, color: '#9677F2' });
    const isOn = function (kind, name) { return sel && sel.kind === kind && sel.name === name; };
    const setF = function (k, v) { setForm(function (f) { const n = Object.assign({}, f); n[k] = v; return n; }); };

    const searchUser = function () {
        const qq = steamId.trim().toLowerCase();
        const hit = dir.find(function (d) { return d.steamId === steamId.trim() || d.displayName.toLowerCase() === qq; });
        setOpen(false);
        if (steamId.trim()) onSelect('user', hit ? hit.steamId : steamId.trim());
    };
    const rowUser = function (u) {
        return (
            <button key={u.steamId} type="button" onMouseDown={function (e) { e.preventDefault(); pick(u); }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-enterprise-primarySoft">
                <img src={u.avatar} alt="" className="size-9 shrink-0 rounded-full" />
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-enterprise-text">{u.displayName}</span>
                    <span className="block truncate font-mono text-[11px] text-enterprise-muted">{u.steamId}</span>
                </span>
            </button>
        );
    };
    const create = function () {
        fail(null);
        client.groupCreate(form).then(function () { setCreating(false); onChanged(); }).catch(fail);
    };

    return (
        <Card className="border-enterprise-border bg-enterprise-card shadow-none rounded-xl">
            <CardContent className="space-y-5 pt-6">
                <div>
                    <p className="mb-2 text-[11px] tracking-[0.14em] text-enterprise-muted">SCOPE</p>
                    <TagInput values={scope} onChange={setScope} placeholder="Todos los scopes" suggestions={scopes} allowCustom={false} popId="scope-filter" />
                </div>
                <div ref={userWrapRef} className="relative">
                    <p className="mb-2 text-[11px] tracking-[0.14em] text-enterprise-muted">USUARIO</p>
                    <div className="flex gap-2">
                        <Input value={steamId} onFocus={function () { openUser(); popOpen('user-search'); }} onBlur={function () { setTimeout(function () { setOpen(false); }, 150); }} onKeyDown={function (e) { if (e.key === 'Escape') setOpen(false); }} onChange={function (e) { setSteamId(e.target.value); openUser(); popOpen('user-search'); }} placeholder="Nombre o SteamId…" className="border-enterprise-border bg-enterprise-bg font-mono text-[12px] text-enterprise-text" />
                        <Button onClick={searchUser} className="bg-enterprise-primary text-[#111] hover:opacity-90">Buscar</Button>
                    </div>
                    {open && (
                        <div className={'absolute inset-x-0 z-50 max-h-[340px] overflow-y-auto rounded-xl border border-enterprise-border bg-enterprise-bg shadow-[0_18px_40px_rgba(0,0,0,0.5)] ' + (userUp ? 'bottom-full mb-1' : 'top-full mt-1')}>
                            {matches.length === 0 && (
                                <p className="px-3 py-2 text-[12px] text-enterprise-muted">Sin resultados.</p>
                            )}
                            {matches.map(rowUser)}
                        </div>
                    )}
                </div>
                <div>
                    <p className="mb-2 text-[11px] tracking-[0.14em] text-enterprise-muted">TRACKS ({tracks.length})</p>
                    {tracks.map(function (t) {
                        return (
                            <button key={t.id} type="button" onClick={function () { onSelect('track', t.name); }}
                                className={'mb-1 flex w-full items-center rounded-xl border px-3 py-2 text-left text-sm ' + (isOn('track', t.name) ? 'border-enterprise-primary/60 bg-enterprise-primarySoft text-enterprise-text' : 'border-enterprise-border bg-enterprise-bg text-enterprise-body hover:text-enterprise-primary')}>
                                <span className="font-mono">{t.name}</span>
                                <span className="ml-auto font-mono text-[11px] opacity-70">{t.groupCount}</span>
                            </button>
                        );
                    })}
                </div>
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-[11px] tracking-[0.14em] text-enterprise-muted">GRUPOS ({groups.length})</p>
                        <button type="button" onClick={function () { setCreating(!creating); }} className="rounded-lg border border-enterprise-border px-2 text-sm text-enterprise-primary hover:border-enterprise-primary/60">+</button>
                    </div>
                    {creating && (
                        <div className="mb-2 flex flex-col gap-2 rounded-xl border border-enterprise-border p-2">
                            <Input value={form.groupName} onChange={function (e) { setF('groupName', e.target.value); }} placeholder="Nombre" className="border-enterprise-border bg-enterprise-bg text-[12px] text-enterprise-text" />
                            <Input value={form.displayName} onChange={function (e) { setF('displayName', e.target.value); }} placeholder="Display (opcional)" className="border-enterprise-border bg-enterprise-bg text-[12px] text-enterprise-text" />
                            <div className="flex gap-2">
                                <Input type="number" value={form.priority} onChange={function (e) { setF('priority', Number(e.target.value)); }} placeholder="Prio" className="border-enterprise-border bg-enterprise-bg text-[12px] text-enterprise-text" />
                                <Input type="number" value={form.weight} onChange={function (e) { setF('weight', Number(e.target.value)); }} placeholder="Peso" className="border-enterprise-border bg-enterprise-bg text-[12px] text-enterprise-text" />
                            </div>
                            <Button onClick={create} className="bg-enterprise-primary text-[#111] hover:opacity-90">Crear</Button>
                        </div>
                    )}
                    {groups.map(function (g) {
                        return (
                            <button key={g.id} type="button" onClick={function () { onSelect('group', g.name); }}
                                className={'mb-1 flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm ' + (isOn('group', g.name) ? 'border-enterprise-primary/60 bg-enterprise-primarySoft text-enterprise-text' : 'border-enterprise-border bg-enterprise-bg text-enterprise-body hover:text-enterprise-primary')}>
                                <span className="inline-block size-2.5 shrink-0 rounded-full" style={{ background: g.color || '#868e99' }} />
                                <span className="font-semibold">{g.displayName || g.name}</span>
                                <span className="ml-auto font-mono text-[11px] opacity-70">w{g.weight}</span>
                            </button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

// Selector multi-opción de scopes (ticks) para un usuario o grupo.
// BACKEND (dev): hoy persiste en mock (futura user.scope.assign / ServerKey).
function ScopeTicks({ kind, id, node, uid, client }) {
    const [open, setOpen] = useState(false);
    const [up, setUp] = useState(false);
    const wrapRef = useRef(null);
    const [pos, setPos] = useState({ top: 0, left: 0, width: 208, maxH: 240 });
    const [all, setAll] = useState([]);
    const [mine, setMine] = useState([]);
    const [text, setText] = useState('');
    const reload = function () {
        client.scopeList().then(setAll).catch(function () {});
        client.scopeGet(kind, id, node).then(function (d) { setMine(d.scopes || []); }).catch(function () {});
    };
    useEffect(function () {
        let dead = false;
        client.scopeList().then(function (s) { if (!dead) setAll(s); }).catch(function () {});
        client.scopeGet(kind, id, node).then(function (d) { if (!dead) setMine(d.scopes || []); }).catch(function () {});
        const h = function () { reload(); };
        window.addEventListener('scopes:changed', h);
        return function () { dead = true; window.removeEventListener('scopes:changed', h); };
    }, [client, kind, id, node]);
    // Al abrir uno se cierran los demás (evento global pop:open).
    usePopClose(uid, function () { setOpen(false); });
    // Click fuera del popup lo cierra.
    useEffect(function () {
        if (!open) return undefined;
        const h = function (e) {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', h);
        return function () { document.removeEventListener('mousedown', h); };
    }, [open ]);
    const openMe = function () {
        try {
            const r = wrapRef.current.getBoundingClientRect();
            const w = 208;
            const left = Math.max(8, Math.min(Math.round(r.right - w), window.innerWidth - w - 8));
            const below = window.innerHeight - r.bottom;
            const isUp = below < 260;
            const maxH = Math.max(120, Math.round((isUp ? r.top : below) - 12));
            setPos(isUp
                ? { bottom: Math.round(window.innerHeight - r.top + 4), left: left, width: w, maxH: maxH }
                : { top: Math.round(r.bottom + 4), left: left, width: w, maxH: maxH });
            setUp(isUp);
        } catch (e) {}
        setOpen(true);
        popOpen(uid);
    };
    useEffect(function () {
        if (!open) return undefined;
        const h = function () { setOpen(false); };
        window.addEventListener('scroll', h, true);
        window.addEventListener('resize', h);
        return function () { window.removeEventListener('scroll', h, true); window.removeEventListener('resize', h); };
    }, [open]);
    const save = function (next) {
        client.assignScopes(kind, id, next, node).then(function (d) { setMine(d.scopes || []); }).catch(function () {});
    };
    const toggle = function (name) {
        const has = mine.indexOf(name) >= 0;
        save(has ? mine.filter(function (x) { return x !== name; }) : mine.concat([name]));
    };
    const commitText = function () {
        const v = text.trim().replace(/,+$/, '').trim();
        if (!v) return;
        if (mine.indexOf(v) < 0) save(mine.concat([v]));
        setText('');
    };
    const label = mine.length ? mine.join(', ') : '—';
    return (
        <span ref={wrapRef} className="relative inline-block">
            <button type="button" onClick={function () { if (open) setOpen(false); else openMe(); }} title={label}
                className="max-w-[180px] truncate rounded-lg border border-enterprise-border bg-enterprise-bg px-2 py-1 font-mono text-[11px] text-enterprise-body hover:text-enterprise-primary">
                {label} ▾
            </button>
            {open && (
                <span className="z-[100] block w-52 rounded-xl border border-enterprise-border bg-enterprise-bg p-1 shadow-[0_18px_40px_rgba(0,0,0,0.5)]" style={{ position: 'fixed', left: pos.left, width: pos.width, maxHeight: pos.maxH, overflowY: 'auto', top: up ? undefined : pos.top, bottom: up ? pos.bottom : undefined }}>
                    <p className="px-2 py-1 font-mono text-[11px] text-enterprise-muted">{mine.length ? mine.join(', ') : 'Sin scopes'}</p>
                    <input value={text} onChange={function (e) {
                        const v = e.target.value;
                        if (v.indexOf(',') >= 0) { v.split(',').forEach(function (p) { const t = p.trim(); if (t && mine.indexOf(t) < 0) save(mine.concat([t])); }); setText('');
                        } else setText(v);
                    }} onKeyDown={function (e) { if (e.key === 'Enter') { e.preventDefault(); commitText(); } }} placeholder="Nuevo scope…" className="mb-1 w-full rounded-lg border border-enterprise-border bg-enterprise-card px-2 py-1.5 font-mono text-[12px] text-enterprise-text outline-none placeholder:text-enterprise-muted" />
                    {all.map(function (name) {
                        const on = mine.indexOf(name) >= 0;
                        return (
                            <button key={name} type="button" onClick={function () { toggle(name); }}
                                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 font-mono text-[12px] text-enterprise-text hover:bg-enterprise-primarySoft">
                                <span className={'flex size-4 items-center justify-center rounded border text-[11px] ' + (on ? 'border-enterprise-primary bg-enterprise-primary text-[#111]' : 'border-enterprise-border text-transparent')}>✓</span>
                                {name}
                            </button>
                        );
                    })}
                </span>
            )}
        </span>
    );
}

// ------------------------- Panel de detalle -------------------------
function DetailPanel({ sel, detail, client, fail, scope, onChanged }) {
    if (!sel) {
        return (
            <Card className="border-enterprise-border bg-enterprise-card shadow-none rounded-xl">
                <CardContent className="pt-6"><p className="text-sm text-enterprise-muted">Selecciona un grupo, track o busca un usuario.</p></CardContent>
            </Card>
        );
    }
    if (!detail) {
        return (
            <Card className="border-enterprise-border bg-enterprise-card shadow-none rounded-xl">
                <CardContent className="pt-6"><p className="text-sm text-enterprise-muted">Cargando…</p></CardContent>
            </Card>
        );
    }
    if (sel.kind === 'group') return <GroupDetail key={detail.name} detail={detail} client={client} fail={fail} scope={scope} onChanged={onChanged} />;
    if (sel.kind === 'user') return <UserDetail key={detail.steamId} detail={detail} client={client} fail={fail} scope={scope} onChanged={onChanged} />;
    return <TrackDetail name={sel.name} client={client} fail={fail} />;
}

// Detalle de grupo: cabecera (nombre, peso, padre) + tabla de nodos
// (lectura: el protocolo solo muta nodos a nivel de usuario) + miembros.
function GroupDetail({ detail, client, fail, scope, onChanged }) {
    const remove = function () {
        if (!window.confirm('¿Borrar el grupo "' + detail.name + '"? (CASCADE a memberships)')) return;
        fail(null);
        client.groupDelete(detail.name).then(onChanged).catch(fail);
    };
    const [nodeTags, setNodeTags] = useState([]);
    const [checkRes, setCheckRes] = useState(null);
    const [catalog, setCatalog] = useState([]);
    const [grantScopes, setGrantScopes] = useState(['global']);
    const [allScopes, setAllScopes] = useState([]);
    const [picked, setPicked] = useState([]);
    useEffect(function () {
        client.nodeCatalog().then(setCatalog).catch(function () {});
        const loadScopes = function () { client.scopeList().then(setAllScopes).catch(function () {}); };
        loadScopes();
        window.addEventListener('scopes:changed', loadScopes);
        return function () { window.removeEventListener('scopes:changed', loadScopes); };
    }, [client]);
    const togglePick = function (name) {
        setPicked(function (prev) {
            return prev.indexOf(name) >= 0 ? prev.filter(function (x) { return x !== name; }) : prev.concat([name]);
        });
    };
    // Check: nodos × scopes activos (o una sin scope = servidor por defecto).
    const runCheck = async function () {
        fail(null); setCheckRes(null);
        if (!nodeTags.length) { fail({ code: 'missing_params', message: 'Añade al menos un permiso.' }); return; }
        try {
            const keys = scope.length ? scope : [undefined];
            const rows = [];
            for (let n = 0; n < nodeTags.length; n += 1) {
                for (let i = 0; i < keys.length; i += 1) {
                    const d = await client.groupCheck(detail.name, nodeTags[n], keys[i]);
                    rows.push({ node: d.node, granted: d.granted, scope: keys[i] || null });
                }
            }
            setCheckRes(rows);
        } catch (e) { fail(e); }
    };
    // Grant: valida scopes y otorga cada permiso una vez por scope, a la vez.
    const runGrant = async function () {
        fail(null); setCheckRes(null);
        if (!nodeTags.length) { fail({ code: 'missing_params', message: 'Añade al menos un permiso.' }); return; }
        if (!grantScopes.length) { fail({ code: 'missing_params', message: 'Selecciona al menos un scope para otorgar.' }); return; }
        try {
            for (let n = 0; n < nodeTags.length; n += 1) {
                for (let i = 0; i < grantScopes.length; i += 1) {
                    await client.groupNodeAdd(detail.name, nodeTags[n], grantScopes[i]);
                }
            }
            setCheckRes(nodeTags.map(function (t) { return { node: t, granted: true, scope: grantScopes.join(', ') }; }));
            setNodeTags([]);
            try { window.dispatchEvent(new Event('scopes:changed')); } catch (e) {}
            onChanged();
        } catch (e) { fail(e); }
    };
    // Revoke: los marcados con tick, o las burbujas si no hay ninguno.
    const runRevoke = async function () {
        fail(null); setCheckRes(null);
        try {
            const seen = {};
            const targets = picked.concat(nodeTags).filter(function (t) { if (seen[t]) return false; seen[t] = true; return true; });
            if (!targets.length) { fail({ code: 'missing_params', message: 'Marca nodos o añade permisos.' }); return; }
            for (let i = 0; i < targets.length; i += 1) {
                await client.groupNodeRemove(detail.name, targets[i]);
            }
            setPicked([]);
            setNodeTags([]);
            onChanged();
        } catch (e) { fail(e); }
    };
    return (
        <Card className="border-enterprise-border bg-enterprise-card shadow-none rounded-xl">
            <CardHeader>
                <CardTitle className="font-display text-xl font-black text-enterprise-text">
                    {detail.displayName} <span className="font-mono text-[13px] font-normal text-enterprise-muted">({detail.name})</span>
                </CardTitle>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-enterprise-body">
                    <span>Weight <b className="font-mono text-enterprise-text">{detail.weight}</b></span>
                    <span>Priority <b className="font-mono text-enterprise-text">{detail.priority}</b></span>
                    <span>Miembros <b className="font-mono text-enterprise-text">{detail.memberCount}</b></span>
                    {detail.isHidden && <Badge className="border-enterprise-border bg-enterprise-bg text-enterprise-muted">hidden</Badge>}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="mb-2 text-[11px] tracking-[0.14em] text-enterprise-muted">NODOS ({detail.nodes.length})</p>
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row">
                        <div className="flex-1">
                            <TagInput values={nodeTags} onChange={setNodeTags} placeholder="Permiso" suggestions={catalog} allowCustom popId="group-node-catalog" />
                        </div>
                        <div className="flex-1">
                            <TagInput values={grantScopes} onChange={setGrantScopes} placeholder="Scopes" suggestions={allScopes} allowCustom popId="group-grant-scopes" />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={runCheck} variant="ghost" className="border border-enterprise-border text-enterprise-text hover:text-enterprise-primary">Check</Button>
                            <Button onClick={runGrant} className="bg-[#2ecc71] text-[#06130c] hover:opacity-90">Grant</Button>
                            <Button onClick={runRevoke} className="bg-[#ff3ed8] text-[#1c0514] hover:opacity-90">Revoke{picked.length ? ' (' + picked.length + ')' : ''}</Button>
                        </div>
                    </div>
                    {checkRes && checkRes.length > 0 && (
                        <div className="mb-2 space-y-1.5">
                            {checkRes.map(function (r, i) {
                                return (
                                    <p key={i} className="text-sm text-enterprise-body">
                                        <span className="font-mono text-[12px]">{r.node}</span>
                                        {r.scope ? <span className="ml-1 font-mono text-[11px] text-enterprise-muted">[{r.scope}]</span> : null} → {r.granted
                                            ? <Badge className="ml-1 border-[#2ecc71]/40 bg-[#2ecc71]/15 text-[#2ecc71]">permitido</Badge>
                                            : <Badge className="ml-1 border-[#ff3ed8]/40 bg-[#ff3ed8]/15 text-[#ff3ed8]">denegado</Badge>}
                                    </p>
                                );
                            })}
                        </div>
                    )}
                    {detail.nodes.length === 0 && <p className="text-sm text-enterprise-muted">Sin nodos.</p>}
                    {detail.nodes.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-enterprise-muted">Nodo</TableHead>
                                    <TableHead className="text-enterprise-muted">Valor</TableHead>
                                    <TableHead className="text-enterprise-muted">Scope</TableHead>
                                    <TableHead className="w-10" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {detail.nodes.map(function (n, i) {
                                    return (
                                        <TableRow key={i}>
                                            <TableCell className="font-mono text-[12px] text-enterprise-text">{n.node}</TableCell>
                                            <TableCell><ValueBadge value={n.value} /></TableCell>
                                            <TableCell><ScopeTicks kind="group" id={detail.name} node={n.node} uid={'g' + detail.name + i} client={client} /></TableCell>
                                            <TableCell className="w-10 text-right">
                                                <button type="button" title="Marcar para revocar" onClick={function () { togglePick(n.node); }}
                                                    className={'inline-flex size-5 items-center justify-center rounded-md border text-[12px] ' + (picked.indexOf(n.node) >= 0 ? 'border-[#ff3ed8] bg-[#ff3ed8]/20 text-[#ff3ed8]' : 'border-enterprise-border text-transparent hover:border-[#ff3ed8]/60')}>✓</button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>
                <div>
                    <p className="mb-2 text-[11px] tracking-[0.14em] text-enterprise-muted">MIEMBROS ({detail.memberCount})</p>
                    {detail.members.map(function (m) {
                        return <p key={m.steamId} className="text-[13px] text-enterprise-body">{m.displayName} <span className="font-mono text-[11px] text-enterprise-muted">{m.steamId}</span></p>;
                    })}
                </div>
                <Button onClick={remove} variant="ghost" className="border border-[#ff3ed8]/40 text-[#ff3ed8] hover:bg-[#ff3ed8]/10">Borrar grupo</Button>
            </CardContent>
        </Card>
    );
}

// Detalle de usuario: grupos + nodos efectivos + grant/revoke/check.
function UserDetail({ detail, client, fail, scope, onChanged }) {
    const [nodeTags, setNodeTags] = useState([]);
    const [checkRes, setCheckRes] = useState(null);
    const [catalog, setCatalog] = useState([]);
    const [grantScopes, setGrantScopes] = useState(['global']);
    const [picked, setPicked] = useState([]);
    const [allScopes, setAllScopes] = useState([]);
    useEffect(function () {
        client.nodeCatalog().then(setCatalog).catch(function () {});
        const loadScopes = function () { client.scopeList().then(setAllScopes).catch(function () {}); };
        loadScopes();
        window.addEventListener('scopes:changed', loadScopes);
        return function () { window.removeEventListener('scopes:changed', loadScopes); };
    }, [client]);
    const togglePick = function (name) {
        setPicked(function (prev) {
            return prev.indexOf(name) >= 0 ? prev.filter(function (x) { return x !== name; }) : prev.concat([name]);
        });
    };
    // Check: nodos × scopes activos (o una sin scope = servidor por defecto).
    const runCheck = async function () {
        fail(null); setCheckRes(null);
        if (!nodeTags.length) { fail({ code: 'missing_params', message: 'Añade al menos un permiso.' }); return; }
        try {
            const keys = scope.length ? scope : [undefined];
            const rows = [];
            for (let n = 0; n < nodeTags.length; n += 1) {
                for (let i = 0; i < keys.length; i += 1) {
                    const d = await client.check(detail.steamId, nodeTags[n], keys[i]);
                    rows.push({ node: d.node, granted: d.granted, scope: keys[i] || null });
                }
            }
            setCheckRes(rows);
        } catch (e) { fail(e); }
    };
    // Grant: valida scopes y otorga cada permiso una vez por scope, a la vez.
    const runGrant = async function () {
        fail(null); setCheckRes(null);
        if (!nodeTags.length) { fail({ code: 'missing_params', message: 'Añade al menos un permiso.' }); return; }
        if (!grantScopes.length) { fail({ code: 'missing_params', message: 'Selecciona al menos un scope para otorgar.' }); return; }
        try {
            for (let n = 0; n < nodeTags.length; n += 1) {
                for (let i = 0; i < grantScopes.length; i += 1) {
                    await client.grant(detail.steamId, nodeTags[n], grantScopes[i]);
                }
            }
            setCheckRes(nodeTags.map(function (t) { return { node: t, granted: true, scope: grantScopes.join(', ') }; }));
            setNodeTags([]);
            try { window.dispatchEvent(new Event('scopes:changed')); } catch (e) {}
            onChanged();
        } catch (e) { fail(e); }
    };
    // Revoke: ticks de la tabla + burbujas del input, a la vez.
    const runRevoke = async function () {
        fail(null); setCheckRes(null);
        try {
            const seen = {};
            const targets = picked.concat(nodeTags).filter(function (t) { if (seen[t]) return false; seen[t] = true; return true; });
            if (!targets.length) { fail({ code: 'missing_params', message: 'Marca nodos o añade permisos.' }); return; }
            for (let i = 0; i < targets.length; i += 1) {
                await client.revoke(detail.steamId, targets[i]);
            }
            setPicked([]);
            setNodeTags([]);
            onChanged();
        } catch (e) { fail(e); }
    };
    return (
        <Card className="border-enterprise-border bg-enterprise-card shadow-none rounded-xl">
            <CardHeader>
                <CardTitle className="font-display text-xl font-black text-enterprise-text">
                    {detail.displayName} <span className="font-mono text-[13px] font-normal text-enterprise-muted">{detail.steamId}</span>
                </CardTitle>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-enterprise-muted">Principal:</span>
                    {detail.primaryGroup
                        ? <Badge className="border-enterprise-primary/40 bg-enterprise-primary/20 text-enterprise-primary">{detail.primaryGroup}</Badge>
                        : <span className="text-[11px] text-enterprise-muted">—</span>}
                    {(detail.groups || []).map(function (g) {
                        return <Badge key={g.id} className="border-enterprise-border bg-enterprise-bg text-enterprise-body">{g.displayName || g.name}</Badge>;
                    })}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex-1">
                        <TagInput values={nodeTags} onChange={setNodeTags} placeholder="Permiso" suggestions={catalog} allowCustom popId="node-catalog" />
                    </div>
                    <div className="flex-1">
                        <TagInput values={grantScopes} onChange={setGrantScopes} placeholder="Scopes" suggestions={allScopes} allowCustom popId="grant-scopes" />
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={runCheck} variant="ghost" className="border border-enterprise-border text-enterprise-text hover:text-enterprise-primary">Check</Button>
                        <Button onClick={runGrant} className="bg-[#2ecc71] text-[#06130c] hover:opacity-90">Grant</Button>
                        <Button onClick={runRevoke} className="bg-[#ff3ed8] text-[#1c0514] hover:opacity-90">Revoke{picked.length ? ' (' + picked.length + ')' : ''}</Button>
                    </div>
                </div>
                {checkRes && checkRes.length > 0 && (
                    <div className="space-y-1.5">
                        {checkRes.map(function (r, i) {
                            return (
                                <p key={i} className="text-sm text-enterprise-body">
                                    <span className="font-mono text-[12px]">{r.node}</span>
                                    {r.scope ? <span className="ml-1 font-mono text-[11px] text-enterprise-muted">[{r.scope}]</span> : null} → {r.granted
                                        ? <Badge className="ml-1 border-[#2ecc71]/40 bg-[#2ecc71]/15 text-[#2ecc71]">permitido</Badge>
                                        : <Badge className="ml-1 border-[#ff3ed8]/40 bg-[#ff3ed8]/15 text-[#ff3ed8]">denegado</Badge>}
                                </p>
                            );
                        })}
                    </div>
                )}
                <div>
                    <p className="mb-2 text-[11px] tracking-[0.14em] text-enterprise-muted">PERMISOS EFECTIVOS ({detail.nodes.length})</p>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-enterprise-muted">Nodo</TableHead>
                                <TableHead className="text-enterprise-muted">Valor</TableHead>
                                <TableHead className="text-enterprise-muted">Origen</TableHead>
                                <TableHead className="text-enterprise-muted">Scope</TableHead>
                                <TableHead className="w-10" title="Seleccionar para revocar" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {detail.nodes.map(function (n, i) {
                                return (
                                    <TableRow key={i}>
                                        <TableCell className="font-mono text-[12px] text-enterprise-text">{n.node}</TableCell>
                                        <TableCell><ValueBadge value={n.value} /></TableCell>
                                        <TableCell className="text-[12px] text-enterprise-body">{n.source === 'user' ? 'directo' : 'grupo ' + n.groupName}</TableCell>
                                                <TableCell><ScopeTicks kind="user" id={detail.steamId} node={n.node} uid={'u' + detail.steamId + i} client={client} /></TableCell>
                                                <TableCell className="w-10 text-right">
                                                    <button type="button" title="Marcar para revocar" onClick={function () { togglePick(n.node); }}
                                                        className={'inline-flex size-5 items-center justify-center rounded-md border text-[12px] ' + (picked.indexOf(n.node) >= 0 ? 'border-[#ff3ed8] bg-[#ff3ed8]/20 text-[#ff3ed8]' : 'border-enterprise-border text-transparent hover:border-[#ff3ed8]/60')}>✓</button>
                                                </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

// Detalle de track: promote/demote por SteamId (mueve entre grupos del ladder).
function TrackDetail({ name, client, fail }) {
    const [steamId, setSteamId] = useState('');
    const [msg, setMsg] = useState(null);
    const move = function (dir) {
        fail(null); setMsg(null);
        const fn = dir > 0 ? client.promote : client.demote;
        fn(steamId, name).then(function (d) { setMsg('OK → ' + (d.groupName || '(sin grupo)')); }).catch(fail);
    };
    return (
        <Card className="border-enterprise-border bg-enterprise-card shadow-none rounded-xl">
            <CardHeader>
                <CardTitle className="font-display text-xl font-black text-enterprise-text">
                    Track <span className="font-mono">{name}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Input value={steamId} onChange={function (e) { setSteamId(e.target.value); }} placeholder="SteamId…" className="border-enterprise-border bg-enterprise-bg font-mono text-[12px] text-enterprise-text" />
                    <div className="flex gap-2">
                        <Button onClick={function () { move(1); }} className="bg-[#2ecc71] text-[#06130c] hover:opacity-90">Promote ↑</Button>
                        <Button onClick={function () { move(-1); }} className="bg-[#ff3ed8] text-[#1c0514] hover:opacity-90">Demote ↓</Button>
                    </div>
                </div>
                {msg && <p className="mt-3 text-sm text-enterprise-primary">{msg}</p>}
            </CardContent>
        </Card>
    );
}
