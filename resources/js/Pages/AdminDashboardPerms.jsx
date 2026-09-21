import { useEffect, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminDashboardLayout from '@/Components/AdminDashboard/AdminDashboardLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

// ---------------------------------------------------------------------------
// Panel de permisos (estilo LuckPerms) conectado al backend.
// Ruta: /admin/dashboard/perms -> FrameaPermissionsController (Inertia).
// Los datos vienen por las props de la página, nunca por middleware.
// Mutaciones: grant/revoke/group.*/track.* via Inertia (router.post/delete).
// ---------------------------------------------------------------------------

const url = {
    user: (s) => '/admin/dashboard/perms/user/' + encodeURIComponent(s),
    group: (g) => '/admin/dashboard/perms/group/' + encodeURIComponent(g),
    check: '/admin/dashboard/perms/check',
    grant: '/admin/dashboard/perms/grant',
    revoke: '/admin/dashboard/perms/revoke',
    groupStore: '/admin/dashboard/perms',
    groupDelete: (g) => '/admin/dashboard/perms/group/' + encodeURIComponent(g),
    promote: (t) => '/admin/dashboard/perms/track/' + encodeURIComponent(t) + '/promote',
    demote: (t) => '/admin/dashboard/perms/track/' + encodeURIComponent(t) + '/demote',
};

// El servicio devuelve WsResponse { Success, Message, Data, Error }. Para la
// UI nos quedamos con `Data`; si ya es un array/objeto plano, se usa tal cual.
function unwrap(res) {
    if (res && typeof res === 'object' && Object.prototype.hasOwnProperty.call(res, 'Data')) {
        return res.Data;
    }
    return res;
}

// Visit de Inertia convertido en Promise (preserva estado para encadenar
// grant/revoke/check sobre varios nodos sin desmontar el panel).
function visit(method, target, data, opts) {
    return new Promise((resolve, reject) => {
        router[method](target, data || {}, Object.assign({}, opts, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => resolve(page),
            onError: (e) => {
                const v = Object.values(e)[0];
                reject(new Error(Array.isArray(v) ? v[0] : v || 'Error en la petición'));
            },
        }));
    });
}

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

// TagInput: lo escrito se encierra en burbuja con coma/Enter (o al perder el
// foco), click en sugerencias añade sin cerrar, × quita, backspace en vacío
// quita la última. Sin dependencias. `suggestions` vacío + allowCustom =
// escribir nodos libres (grant/revoke/check).
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
    const page = usePage();
    const groups = unwrap(page.props.groups) || [];
    const tracks = unwrap(page.props.tracks) || [];
    const user = unwrap(page.props.user);
    const userGroups = unwrap(page.props.userGroups) || [];
    const group = unwrap(page.props.group);
    const errors = page.props.errors || {};

    const [err, setErr] = useState(null);
    const [trackSel, setTrackSel] = useState(null);

    const firstErr = Object.values(errors)[0];
    const serverError = Array.isArray(firstErr) ? firstErr[0] : firstErr;
    const message = err ? err.message : serverError;

    const sel = user
        ? { kind: 'user', name: user.steamId }
        : group
            ? { kind: 'group', name: group.name }
            : trackSel
                ? { kind: 'track', name: trackSel }
                : null;

    let detail = null;
    if (user) detail = { key: user.steamId, kind: 'user', name: user.steamId, payload: Object.assign({}, user, { groups: userGroups }) };
    else if (group) detail = { key: group.name, kind: 'group', name: group.name, payload: group };
    else if (trackSel) detail = { key: trackSel, kind: 'track', name: trackSel, payload: null };

    const openUser = function (id) {
        if (!id) return;
        setErr(null);
        visit('get', url.user(id), {}).catch(setErr);
    };
    const openGroup = function (name) {
        setErr(null);
        visit('get', url.group(name), {}).catch(setErr);
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
                    </p>
                </div>

                {message && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-[#ff7d6b]">
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[300px_1fr]">
                    <SidePanel
                        groups={groups} tracks={tracks} sel={sel}
                        onTrack={setTrackSel} onUser={openUser} onGroup={openGroup}
                        setErr={setErr}
                    />
                    <DetailPanel detail={detail} setErr={setErr} />
                </div>
            </div>
        </AdminDashboardLayout>
    );
}

// ------------------------- Panel lateral -------------------------
function SidePanel({ groups, tracks, sel, onTrack, onUser, onGroup, setErr }) {
    const [steamId, setSteamId] = useState('');
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ groupName: '', displayName: '', priority: 0, weight: 0, color: '#9677F2' });
    const isOn = function (kind, name) { return sel && sel.kind === kind && sel.name === name; };
    const setF = function (k, v) { setForm(function (f) { const n = Object.assign({}, f); n[k] = v; return n; }); };

    const create = function () {
        setErr(null);
        visit('post', url.groupStore, form).catch(setErr);
    };

    return (
        <Card className="border-enterprise-border bg-enterprise-card shadow-none rounded-xl">
            <CardContent className="space-y-5 pt-6">
                <div>
                    <p className="mb-2 text-[11px] tracking-[0.14em] text-enterprise-muted">USUARIO</p>
                    <div className="flex gap-2">
                        <Input value={steamId} onKeyDown={function (e) { if (e.key === 'Enter') onUser(steamId); }} onChange={function (e) { setSteamId(e.target.value); }} placeholder="SteamId…" className="border-enterprise-border bg-enterprise-bg font-mono text-[12px] text-enterprise-text" />
                        <Button onClick={function () { onUser(steamId); }} className="bg-enterprise-primary text-[#111] hover:opacity-90">Buscar</Button>
                    </div>
                </div>
                <div>
                    <p className="mb-2 text-[11px] tracking-[0.14em] text-enterprise-muted">TRACKS ({tracks.length})</p>
                    {tracks.map(function (t) {
                        return (
                            <button key={t.id} type="button" onClick={function () { onTrack(t.name); }}
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
                            <button key={g.id} type="button" onClick={function () { onGroup(g.name); }}
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

// ------------------------- Panel de detalle -------------------------
function DetailPanel({ detail, setErr }) {
    if (!detail) {
        return (
            <Card className="border-enterprise-border bg-enterprise-card shadow-none rounded-xl">
                <CardContent className="pt-6"><p className="text-sm text-enterprise-muted">Selecciona un grupo, track o busca un usuario.</p></CardContent>
            </Card>
        );
    }
    if (detail.kind === 'user') return <UserDetail key={detail.key} detail={detail.payload} setErr={setErr} />;
    if (detail.kind === 'group') return <GroupDetail key={detail.key} detail={detail.payload} setErr={setErr} />;
    return <TrackDetail name={detail.name} setErr={setErr} />;
}

// Detalle de grupo: cabecera + tabla de nodos (lectura: el protocolo solo
// muta nodos a nivel de usuario) + miembros.
function GroupDetail({ detail, setErr }) {
    const nodes = detail.nodes || [];
    const members = detail.members || [];
    const remove = function () {
        if (!window.confirm('¿Borrar el grupo "' + detail.name + '"? (CASCADE a memberships)')) return;
        setErr(null);
        visit('delete', url.groupDelete(detail.name), {}).catch(setErr);
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
                    <p className="mb-2 text-[11px] tracking-[0.14em] text-enterprise-muted">NODOS ({nodes.length})</p>
                    {nodes.length === 0 && <p className="text-sm text-enterprise-muted">Sin nodos.</p>}
                    {nodes.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-enterprise-muted">Nodo</TableHead>
                                    <TableHead className="text-enterprise-muted">Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {nodes.map(function (n, i) {
                                    return (
                                        <TableRow key={i}>
                                            <TableCell className="font-mono text-[12px] text-enterprise-text">{n.node}</TableCell>
                                            <TableCell><ValueBadge value={n.value} /></TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>
                <div>
                    <p className="mb-2 text-[11px] tracking-[0.14em] text-enterprise-muted">MIEMBROS ({detail.memberCount})</p>
                    {members.length === 0 && <p className="text-sm text-enterprise-muted">Sin miembros.</p>}
                    {members.map(function (m) {
                        return <p key={m.steamId} className="text-[13px] text-enterprise-body">{m.displayName} <span className="font-mono text-[11px] text-enterprise-muted">{m.steamId}</span></p>;
                    })}
                </div>
                <Button onClick={remove} variant="ghost" className="border border-[#ff3ed8]/40 text-[#ff3ed8] hover:bg-[#ff3ed8]/10">Borrar grupo</Button>
            </CardContent>
        </Card>
    );
}

// Detalle de usuario: grupos + nodos efectivos + grant/revoke/check.
function UserDetail({ detail, setErr }) {
    const steamId = detail.steamId;
    const nodes = detail.nodes || [];
    const groups = detail.groups || [];
    const [nodeTags, setNodeTags] = useState([]);
    const [checkRes, setCheckRes] = useState(null);
    const [picked, setPicked] = useState([]);

    const togglePick = function (name) {
        setPicked(function (prev) {
            return prev.indexOf(name) >= 0 ? prev.filter(function (x) { return x !== name; }) : prev.concat([name]);
        });
    };

    // Check: cada burbuja se consulta al backend (respuesta real, no local).
    const runCheck = async function () {
        setErr(null); setCheckRes(null);
        if (!nodeTags.length) { setErr(new Error('Añade al menos un permiso.')); return; }
        try {
            const rows = [];
            for (const node of nodeTags) {
                const page = await visit('get', url.check, { steamId: steamId, node: node }, { only: ['check'] });
                const d = unwrap(page.props.check);
                rows.push({ node: node, granted: !!d && d.granted === true });
            }
            setCheckRes(rows);
        } catch (e) { setErr(e); }
    };

    // Grant: otorga cada permiso una vez (secuencial; el redirect de vuelta
    // refresca los nodos del usuario después de cada inserción).
    const runGrant = async function () {
        setErr(null); setCheckRes(null);
        if (!nodeTags.length) { setErr(new Error('Añade al menos un permiso.')); return; }
        try {
            for (const node of nodeTags) {
                await visit('post', url.grant, { steamId: steamId, node: node });
            }
            setNodeTags([]);
        } catch (e) { setErr(e); }
    };

    // Revoke: los marcados con tick + las burbujas, a la vez.
    const runRevoke = async function () {
        setErr(null); setCheckRes(null);
        const seen = {};
        const targets = picked.concat(nodeTags).filter(function (t) { if (seen[t]) return false; seen[t] = true; return true; });
        if (!targets.length) { setErr(new Error('Marca nodos o añade permisos.')); return; }
        try {
            for (const node of targets) {
                await visit('post', url.revoke, { steamId: steamId, node: node });
            }
            setPicked([]);
            setNodeTags([]);
        } catch (e) { setErr(e); }
    };

    return (
        <Card className="border-enterprise-border bg-enterprise-card shadow-none rounded-xl">
            <CardHeader>
                <CardTitle className="font-display text-xl font-black text-enterprise-text">
                    {detail.displayName} <span className="font-mono text-[13px] font-normal text-enterprise-muted">{steamId}</span>
                </CardTitle>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-enterprise-muted">Principal:</span>
                    {detail.primaryGroup
                        ? <Badge className="border-enterprise-primary/40 bg-enterprise-primary/20 text-enterprise-primary">{detail.primaryGroup}</Badge>
                        : <span className="text-[11px] text-enterprise-muted">—</span>}
                    {groups.map(function (g) {
                        return <Badge key={g.id} className="border-enterprise-border bg-enterprise-bg text-enterprise-body">{g.displayName || g.name}</Badge>;
                    })}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex-1">
                        <TagInput values={nodeTags} onChange={setNodeTags} placeholder="Permiso (nodo)" suggestions={[]} allowCustom popId="node-catalog" />
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
                                    <span className="font-mono text-[12px]">{r.node}</span> → {r.granted
                                        ? <Badge className="ml-1 border-[#2ecc71]/40 bg-[#2ecc71]/15 text-[#2ecc71]">permitido</Badge>
                                        : <Badge className="ml-1 border-[#ff3ed8]/40 bg-[#ff3ed8]/15 text-[#ff3ed8]">denegado</Badge>}
                                </p>
                            );
                        })}
                    </div>
                )}
                <div>
                    <p className="mb-2 text-[11px] tracking-[0.14em] text-enterprise-muted">PERMISOS EFECTIVOS ({nodes.length})</p>
                    {nodes.length === 0 && <p className="text-sm text-enterprise-muted">Sin permisos.</p>}
                    {nodes.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-enterprise-muted">Nodo</TableHead>
                                    <TableHead className="text-enterprise-muted">Valor</TableHead>
                                    <TableHead className="text-enterprise-muted">Origen</TableHead>
                                    <TableHead className="w-10" title="Seleccionar para revocar" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {nodes.map(function (n, i) {
                                    return (
                                        <TableRow key={i}>
                                            <TableCell className="font-mono text-[12px] text-enterprise-text">{n.node}</TableCell>
                                            <TableCell><ValueBadge value={n.value} /></TableCell>
                                            <TableCell className="text-[12px] text-enterprise-body">{n.source === 'user' ? 'directo' : 'grupo ' + n.groupName}</TableCell>
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
            </CardContent>
        </Card>
    );
}

// Detalle de track: promote/demote por SteamId (mueve entre grupos del ladder).
function TrackDetail({ name, setErr }) {
    const [steamId, setSteamId] = useState('');
    const [msg, setMsg] = useState(null);
    const move = function (dir) {
        setErr(null); setMsg(null);
        if (!steamId.trim()) { setErr(new Error('Introduce un SteamId.')); return; }
        const target = dir > 0 ? url.promote(name) : url.demote(name);
        visit('post', target, { steamId: steamId.trim() })
            .then(function () { setMsg('OK'); })
            .catch(function (e) { setErr(e); });
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