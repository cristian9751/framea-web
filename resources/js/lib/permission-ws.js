//
// permission-ws.js — Cliente del socket de permisos (estilo LuckPerms).
// ---------------------------------------------------------------------------
// SOLO FRONTEND. El backend (handlers perm.*, core.*, mod.*,
// PermissionAdminService, etc.) lo programa el desarrollador de backend.
// Este archivo es el CONTRATO documentado + un modo mock para ver y probar
// el panel integrado (/admin/dashboard/perms) sin servidor.
//
// BACKEND (dev): para conectar el panel real hay que
//   1) exponer la URL del socket (p. ej. VITE_PERMISSIONS_WS_URL),
//   2) pasar `socketUrl` a createPermissionClient (ejemplo al final).
// La ruta ya existe: Route::inertia('/dashboard/perms', 'AdminDashboardPerms')
// dentro de routes/administration.php (prefijo admin).
//
// PROTOCOLO (según especificación del proyecto):
//   - Cada petición lleva SIEMPRE `action` (string, obligatorio) y según la
//     acción: SteamId?, Node?, GroupName?, DisplayName?, Track?, ServerKey?,
//     Priority? (def 0), Weight? (def 0), Color?, IsHidden? (def false).
//     Si NO se manda ServerKey, el servidor usa FrameaPlatform.ServerKey.
//   - Toda respuesta es WsResponse: { Success, Message, Data, Error }.
//     Códigos de Error: missing_params, user_not_found, not_found,
//     already_exists, unknown_action, error.
//   - Acciones (todas request -> perm.response):
//       check steamId,node        -> Data { steamId, node, granted }
//       grant steamId,node        -> inserta holder_permissions (usuario=true)
//       revoke steamId,node       -> borra el holder_permissions del usuario
//       group.list  —             -> [{ id,name,displayName,priority,weight,isHidden,color,parentId }]
//       group.create groupName    -> crea grupo (already_exists si duplicado), devuelve id
//       group.delete groupName    -> borra grupo (CASCADE a memberships)
//       group.info groupName      -> grupo + miembros { steamId,displayName } + memberCount
//       track.list  —             -> [{ id,name,groupCount }]
//       track.promote steamId,track -> sube un puesto (sale del grupo actual al siguiente por Position)
//       track.demote steamId,track  -> baja un puesto
//       user.info steamId         -> permisos efectivos + primaryGroup + displayName
//       user.groups steamId       -> [{ id,name,displayName,priority,weight }]
//   - Eventos salientes (fire-and-forget, SIN CorrelationId):
//       perm.event       { action, steamId, node, granted, timestamp }
//       perm.group.event { action, groupName, timestamp }
//   - El mismo socket lleva además core.* (status, modules.list, ping) y
//     mod.* (ban/mute/warn/kick/note/unban/unmute/revoke/lookup/expire/sync).
//     ticket.* existe pero está vacío (stub).
//
// QUÉ ES UN NODO (resumen para el panel):
//   Cadena jerárquica con segmentos separados por `.` (p. ej.
//   framea.command.reload). Vive en permission_nodes; holder_permissions
//   enlaza cada par holder+nodo con valor allow/deny, scope Server y
//   expiración. Wildcards por segmento (`*`).
//   Precedencia al resolver (PermissionResolver.cs:69):
//     1) fuente usuario (directa) gana a grupo,
//     2) mayor Weight/Priority del grupo,
//     3) mayor especificidad del patrón,
//     4) que tenga expiración.
//   Un usuario acumula N nodos: directos (grant/revoke) + los de todos sus
//   grupos + herencia por ParentId. perm.check evalúa SIEMPRE el conjunto
//   efectivo, filtrado por ServerKey.
//
// NOTA DE DISEÑO: el protocolo solo muta nodos a nivel de USUARIO
// (grant/revoke). Los nodos de GRUPO se muestran (group.info) pero no se
// editan desde aquí — igual que el editor web de LuckPerms mostraría filas
// de solo lectura si el backend no expone esa mutación.
//

// ---------------------------------------------------------------------------
// MODO MOCK (solo desarrollo del frontal). Datos de ejemplo coherentes con
// la especificación (grupo admin weight 100 padre de staff, etc.).
// BACKEND (dev): borrar createMockStore/useMock y cablear `socketUrl`.
// MOCK: avatar generado (iniciales sobre círculo de color). Sin red ni
// dependencias. BACKEND (dev): user.list/user.search real debería devolver
// `avatar` con la URL de foto real; la UI lo usa tal cual.
function avatarFor(name) {
    let h = 0;
    for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) % 360;
    const init = (name.slice(0, 2) || '??').toUpperCase();
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' rx='32' fill='hsl(" + h + ",45%,32%)'/><text x='32' y='42' font-family='Arial,sans-serif' font-size='24' font-weight='bold' fill='#fff' text-anchor='middle'>" + init + "</text></svg>";
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function createMockStore() {
    const groups = [
        { id: 1, name: 'admin', displayName: 'Admin', priority: 100, weight: 100, isHidden: false, color: '#ff3ed8', parentId: 2,
          nodes: [{ node: 'framea.command.*', value: true }, { node: 'framea.sanctions.*', value: true }] },
        { id: 2, name: 'staff', displayName: 'Staff', priority: 50, weight: 50, isHidden: false, color: '#9677F2', parentId: 3,
          nodes: [{ node: 'framea.game.*', value: true }] },
        { id: 3, name: 'default', displayName: 'Default', priority: 0, weight: 0, isHidden: false, color: '#868e99', parentId: null,
          nodes: [{ node: 'framea.command.info', value: true }] },
        { id: 4, name: 'helper', displayName: 'Helper', priority: 10, weight: 10, isHidden: false, color: '#2ecc71', parentId: 5,
          nodes: [{ node: 'framea.command.info', value: true }] },
        { id: 5, name: 'moderador', displayName: 'Moderador', priority: 30, weight: 30, isHidden: false, color: '#f5a623', parentId: 1,
          nodes: [{ node: 'framea.sanctions.mute', value: true }, { node: 'framea.sanctions.warn', value: true }] },
    ];
    const users = {
        // MOCK: usuario de ejemplo con un deny directo (gana al grupo).
        '76561198000000001': {
            displayName: 'DemoUser', direct: [{ node: 'framea.game.ban', value: false }],
            groups: [1, 2, 3],
        },
    };
    const tracks = [{ id: 1, name: 'staff', ladder: [3, 2, 1] }, { id: 2, name: 'Staff', ladder: [3, 4, 5, 1] }];
    let nextGroupId = 6;
    // MOCK: scopes placeholder (futuro: varios servidores in-game / scopes).
    // BACKEND (dev): los scopes reales saldrán de la configuración de
    // servidores; hoy solo existen servidor.1/2/3 de ejemplo.
    const scopes = ['global', 'servidor.1', 'servidor.2', 'servidor.3'];
    // MOCK: scopes asignados por holder. El protocolo aún no tiene acción
    // para esto (futura user.scope.assign / cableado de ServerKey); la UI
    // los guarda aquí y el backend los persistirá cuando exista.
    const scopeAssign = { user: {}, group: {} };
    // MOCK: catálogo de nodos conocidos (PermissionNodeCatalog.cs en el
    // backend: *, framea.game.*, sanciones, comandos, legacy).
    // BACKEND (dev): exponer catálogo real (p. ej. perm.catalog).
    const catalog = ['*', 'framea.game.*', 'framea.native.*', 'framea.sanctions.*',
        'framea.sanctions.ban', 'framea.sanctions.mute', 'framea.sanctions.warn',
        'framea.sanctions.kick', 'framea.sanctions.unban', 'framea.sanctions.unmute',
        'framea.sanctions.note', 'framea.sanctions.history', 'framea.sanctions.staffhistory',
        'framea.sanctions.check', 'framea.sanctions.alts', 'framea.sanctions.alerts',
        'framea.sanctions.allow', 'framea.sanctions.unallow', 'framea.sanctions.rollback',
        'framea.sanctions.overwrite', 'framea.sanctions.reload', 'framea.command.*',
        'framea.command.info', 'framea.command.list', 'framea.command.apply',
        'framea.command.grant', 'framea.command.myrole', 'framea.command.clear',
        'framea.command.getitem', 'framea.command.customkeycard', 'framea.command.reload',
        'framea.command.perm', 'framea.command.perm.user', 'framea.command.perm.group',
        'framea.command.perm.track', 'framea.command.perm.sync', 'framea.command.perm.search',
        'framea.command.perm.log', 'framea.command.perm.tree', 'framea.command.perm.info'].sort();
    // MOCK: directorio para el buscador (30 conectados + 30 desconectados,
    // orden alfabético dentro de cada grupo). Nombres/SteamIds inventados.
    // MOCK: directorio para el buscador (60 usuarios, orden alfabético).
    // Nombres/SteamIds inventados. Sin estados de conexión (no implementado).
    const names = ['Kane', 'Zeta', 'Luna', 'Ragnar', 'Mia', 'Iker', 'Nora', 'Hugo', 'Aitana', 'Pablo', 'Lucia', 'Marco', 'Sofia', 'Diego', 'Alba', 'Raul', 'Carmen', 'Ivan', 'Elena', 'Jorge', 'Paula', 'Mario', 'Laura', 'Sergio', 'Marta', 'David', 'Clara', 'Adrian', 'Sara', 'Julia', 'Dani', 'Alex', 'Nico', 'Leo', 'Max', 'Teo', 'Ian', 'Eric', 'Nil', 'Jan', 'Pol', 'Ori', 'Arnau', 'Laia', 'Marc', 'Anna', 'Pau', 'Quim', 'Joel', 'Enzo', 'Liam', 'Noah', 'Olivia', 'Emma', 'Aitor', 'Jon', 'Ane', 'Markel', 'June'];
    const directory = [{ steamId: '76561198000000001', displayName: 'DemoUser', avatar: avatarFor('DemoUser') }];
    names.forEach(function (nm, i) {
        const sid = '76561198' + String(2 + i).padStart(9, '0');
        directory.push({ steamId: sid, displayName: nm, avatar: avatarFor(nm) });
    });
    // Pre-alta para que user.info funcione al elegir del buscador.
    directory.forEach(function (d) {
        if (!users[d.steamId]) users[d.steamId] = { displayName: d.displayName, direct: [], groups: [3] };
    });
    return { groups, users, tracks, nextGroupId, directory, scopes, scopeAssign, catalog };
}

// MOCK: ¿un patrón (con *) matchea un nodo? `*` = cualquier secuencia.
function matchNode(pattern, node) {
    if (pattern === '*') return true;
    const p = pattern.split('.');
    const n = node.split('.');
    let pi = 0;
    let ni = 0;
    while (pi < p.length && ni < n.length) {
        if (p[pi] === '*') return true;
        if (p[pi] !== n[ni]) return false;
        pi += 1;
        ni += 1;
    }
    return pi === p.length && ni === n.length;
}

// MOCK: especificidad = nº de segmentos no comodín (más = más específico).
function specificity(pattern) {
    if (pattern === '*') return 0;
    return pattern.split('.').filter(function (s) { return s !== '*'; }).length;
}

// MOCK: entradas efectivas de un usuario (directas + grupos + herencia).
function effectiveEntries(store, steamId) {
    const u = store.users[steamId];
    if (!u) return null;
    const out = [];
    u.direct.forEach(function (d) {
        out.push({ node: d.node, value: d.value, source: 'user', groupName: null, weight: Infinity, serverKey: d.serverKey });
    });
    const seen = {};
    const walk = function (gid) {
        if (!gid || seen[gid]) return;
        seen[gid] = true;
        const g = store.groups.find(function (x) { return x.id === gid; });
        if (!g) return;
        g.nodes.forEach(function (d) {
            out.push({ node: d.node, value: d.value, source: 'group', groupName: g.name, weight: g.weight });
        });
        walk(g.parentId);
    };
    u.groups.forEach(walk);
    return out;
}

// MOCK: ganador según precedencia usuario > peso > especificidad,
// filtrado por scope (MatchesScope: sin scope o 'global' vale todo;
// con scope, cuenta lo global/sin scope o lo igual al solicitado).
function resolveCheck(store, steamId, node, scope) {
    const entries = effectiveEntries(store, steamId);
    if (!entries) return null;
    const cands = entries.filter(function (e) {
        if (!matchNode(e.node, node)) return false;
        if (!scope || scope === 'global') return true;
        const es = e.serverKey || 'global';
        return es === 'global' || es === scope;
    });
    if (!cands.length) return { granted: false, via: null };
    cands.sort(function (a, b) {
        const au = a.source === 'user' ? 1 : 0;
        const bu = b.source === 'user' ? 1 : 0;
        if (au !== bu) return bu - au;
        if (a.weight !== b.weight) return b.weight - a.weight;
        return specificity(b.node) - specificity(a.node);
    });
    const win = cands[0];
    return { granted: !!win.value, via: win };
}

// MOCK: nodos de un grupo + cadena de herencia por ParentId.
function groupChainNodes(store, groupName) {
    const out = [];
    const seen = {};
    let g = store.groups.find(function (x) { return x.name === groupName; });
    while (g && !seen[g.id]) {
        seen[g.id] = true;
        g.nodes.forEach(function (d) {
            out.push({ node: d.node, value: d.value, serverKey: d.serverKey, groupName: g.name });
        });
        g = store.groups.find(function (x) { return x.id === g.parentId; });
    }
    return out;
}

// MOCK: refleja scopes otorgados en scopeAssign para que la columna Scope
// los muestre sin abrir nada. Sin esto, grant guardaba el scope en la
// entrada pero la UI leía otro almacén y parecía "sin scope".
function assignNodeScope(store, kind, id, node, serverKey) {
    if (!serverKey) return;
    store.scopeAssign[kind][id] = store.scopeAssign[kind][id] || {};
    const cur = store.scopeAssign[kind][id][node] || [];
    if (cur.indexOf(serverKey) < 0) cur.push(serverKey);
    store.scopeAssign[kind][id][node] = cur;
}
function clearNodeScopes(store, kind, id, node) {
    const h = store.scopeAssign[kind][id];
    if (h) delete h[node];
}

// MOCK: mini "servidor" en memoria. Misma forma que WsResponse.
function mockRequest(store, emit, action, p) {
    const ok = function (data, message) { return { Success: true, Message: message || 'ok', Data: data, Error: null }; };
    const fail = function (code, message) { return { Success: false, Message: message || code, Data: null, Error: code }; };
    const need = function () {
        for (let i = 0; i < arguments.length; i += 1) {
            if (p[arguments[i]] === undefined || p[arguments[i]] === null || p[arguments[i]] === '') {
                return fail('missing_params', 'Falta ' + arguments[i]);
            }
        }
        return null;
    };
    const now = function () { return new Date().toISOString(); };
    let m;
    switch (action) {
        case 'check':
            if ((m = need('steamId', 'node'))) return m;
            if (!store.users[p.steamId]) return fail('user_not_found', 'Usuario no encontrado');
            return ok(Object.assign({ steamId: p.steamId, node: p.node, serverKey: p.serverKey || null }, resolveCheck(store, p.steamId, p.node, p.serverKey)));
        case 'grant':
            if ((m = need('steamId', 'node'))) return m;
            // Los scopes nuevos se auto-registran (como los nodos con
            // ResolveNodeIdAsync): la UI permite escribir texto libre.
            if (p.serverKey !== undefined && p.serverKey !== null && p.serverKey !== '' && (store.scopes || []).indexOf(p.serverKey) < 0) {
                store.scopes.push(p.serverKey);
            }
            if (!store.users[p.steamId]) {
                store.users[p.steamId] = { displayName: p.steamId, direct: [], groups: [3] };
            }
            store.users[p.steamId].direct = store.users[p.steamId].direct.filter(function (d) { return d.node !== p.node || (d.serverKey || '') !== (p.serverKey || ''); });
            store.users[p.steamId].direct.push({ node: p.node, value: true, serverKey: p.serverKey || undefined });
            assignNodeScope(store, 'user', p.steamId, p.node, p.serverKey || undefined);
            emit('perm.event', { action: 'granted', steamId: p.steamId, node: p.node, granted: true, timestamp: now() });
            return ok({ steamId: p.steamId, node: p.node, serverKey: p.serverKey || null, granted: true });
        case 'revoke':
            if ((m = need('steamId', 'node'))) return m;
            if (!store.users[p.steamId]) return fail('user_not_found', 'Usuario no encontrado');
            store.users[p.steamId].direct = store.users[p.steamId].direct.filter(function (d) { return d.node !== p.node; });
            clearNodeScopes(store, 'user', p.steamId, p.node);
            emit('perm.event', { action: 'revoked', steamId: p.steamId, node: p.node, granted: false, timestamp: now() });
            return ok({ steamId: p.steamId, node: p.node, granted: false });
        case 'group.list':
            return ok(store.groups.map(function (g) {
                return { id: g.id, name: g.name, displayName: g.displayName, priority: g.priority, weight: g.weight, isHidden: g.isHidden, color: g.color, parentId: g.parentId };
            }));
        case 'group.create': {
            if ((m = need('groupName'))) return m;
            if (store.groups.some(function (g) { return g.name === p.groupName; })) return fail('already_exists', 'El grupo ya existe');
            const g = { id: store.nextGroupId, name: p.groupName, displayName: p.displayName || p.groupName, priority: p.priority || 0, weight: p.weight || 0, isHidden: !!p.isHidden, color: p.color || '#868e99', parentId: null, nodes: [] };
            store.nextGroupId += 1;
            store.groups.push(g);
            emit('perm.group.event', { action: 'created', groupName: g.name, timestamp: now() });
            return ok({ id: g.id });
        }
        case 'group.node.add': {
            // SOLO MOCK: el protocolo aún no tiene mutación de nodos de grupo
            // (futura group.node.grant). La UI lo usa; el backend lo cableará.
            if ((m = need('groupName', 'node'))) return m;
            const gg = store.groups.find(function (x) { return x.name === p.groupName; });
            if (!gg) return fail('not_found', 'Grupo no encontrado');
            if (p.serverKey !== undefined && p.serverKey !== null && p.serverKey !== '' && (store.scopes || []).indexOf(p.serverKey) < 0) {
                store.scopes.push(p.serverKey);
            }
            if (p.serverKey !== undefined && p.serverKey !== null && p.serverKey !== '' && (store.scopes || []).indexOf(p.serverKey) < 0) {
                store.scopes.push(p.serverKey);
            }
            if (!gg.nodes.some(function (n) { return n.node === p.node && (n.serverKey || '') === (p.serverKey || ''); })) {
                gg.nodes.push({ node: p.node, value: p.value === false ? false : true, serverKey: p.serverKey || undefined });
            }
            assignNodeScope(store, 'group', p.groupName, p.node, p.serverKey || undefined);
            return ok({ groupName: gg.name, node: p.node, serverKey: p.serverKey || null });
        }
        case 'group.node.remove': {
            // SOLO MOCK: ver comentario de group.node.add.
            if ((m = need('groupName', 'node'))) return m;
            const gr = store.groups.find(function (x) { return x.name === p.groupName; });
            if (!gr) return fail('not_found', 'Grupo no encontrado');
            gr.nodes = gr.nodes.filter(function (n) { return n.node !== p.node; });
            clearNodeScopes(store, 'group', p.groupName, p.node);
            return ok({ groupName: gr.name, node: p.node });
        }
        case 'group.check': {
            // SOLO MOCK: evalúa un nodo contra el grupo + herencia (futura acción real).
            if ((m = need('groupName', 'node'))) return m;
            if (!store.groups.some(function (x) { return x.name === p.groupName; })) return fail('not_found', 'Grupo no encontrado');
            const cands = groupChainNodes(store, p.groupName).filter(function (e) {
                if (!matchNode(e.node, p.node)) return false;
                if (!p.serverKey || p.serverKey === 'global') return true;
                const es = e.serverKey || 'global';
                return es === 'global' || es === p.serverKey;
            });
            if (!cands.length) return ok({ groupName: p.groupName, node: p.node, serverKey: p.serverKey || null, granted: false });
            cands.sort(function (a, b) { return specificity(b.node) - specificity(a.node); });
            return ok({ groupName: p.groupName, node: p.node, serverKey: p.serverKey || null, granted: !!cands[0].value });
        }
        case 'group.delete': {
            if ((m = need('groupName'))) return m;
            const ix = store.groups.findIndex(function (g) { return g.name === p.groupName; });
            if (ix < 0) return fail('not_found', 'Grupo no encontrado');
            const gid = store.groups[ix].id;
            store.groups.splice(ix, 1);
            Object.keys(store.users).forEach(function (sid) {
                store.users[sid].groups = store.users[sid].groups.filter(function (id) { return id !== gid; });
            });
            emit('perm.group.event', { action: 'deleted', groupName: p.groupName, timestamp: now() });
            return ok({ groupName: p.groupName });
        }
        case 'group.info': {
            if ((m = need('groupName'))) return m;
            const g = store.groups.find(function (x) { return x.name === p.groupName; });
            if (!g) return fail('not_found', 'Grupo no encontrado');
            const members = Object.keys(store.users)
                .filter(function (sid) { return store.users[sid].groups.indexOf(g.id) >= 0; })
                .map(function (sid) { return { steamId: sid, displayName: store.users[sid].displayName }; });
            return ok({ id: g.id, name: g.name, displayName: g.displayName, priority: g.priority, weight: g.weight, isHidden: g.isHidden, color: g.color, parentId: g.parentId, nodes: g.nodes, members: members, memberCount: members.length });
        }
        case 'scope.list':
            // SOLO MOCK: scopes placeholder (futuro multi-servidor).
            return ok(store.scopes || []);
        case 'scope.get': {
            // SOLO MOCK: lee los scopes asignados a un holder.
            if ((m = need('kind', 'id'))) return m;
            const cur = (((store.scopeAssign[p.kind] || {})[p.id]) || {})[p.node || ''] || [];
            return ok({ kind: p.kind, id: p.id, scopes: cur });
        }
        case 'scope.assign': {
            // SOLO MOCK: guarda scopes asignados a un holder. El protocolo aún
            // no tiene esta acción (futura user.scope.assign / ServerKey).
            if ((m = need('kind', 'id'))) return m;
            if (p.kind !== 'user' && p.kind !== 'group') return fail('missing_params', 'kind debe ser user o group');
            // Scopes por NODO (holder -> nodo -> [scopes]). Sin node = nivel holder.
            const list = Array.isArray(p.scopes) ? p.scopes.slice() : [];
            const nk = p.node || '';
            store.scopeAssign[p.kind][p.id] = store.scopeAssign[p.kind][p.id] || {};
            store.scopeAssign[p.kind][p.id][nk] = list;
            return ok({ kind: p.kind, id: p.id, node: nk, scopes: list });
        }
        case 'node.catalog':
            // SOLO MOCK: catálogo alfabético (futura acción perm.catalog real).
            return ok((store.catalog || []).slice().sort());
        case 'track.list':
            return ok(store.tracks.map(function (t) { return { id: t.id, name: t.name, groupCount: t.ladder.length }; }));
        case 'track.promote':
        case 'track.demote': {
            if ((m = need('steamId', 'track'))) return m;
            const t = store.tracks.find(function (x) { return x.name === p.track; });
            if (!t) return fail('not_found', 'Track no encontrado');
            if (!store.users[p.steamId]) return fail('user_not_found', 'Usuario no encontrado');
            const u = store.users[p.steamId];
            const pos = t.ladder.findIndex(function (gid) { return u.groups.indexOf(gid) >= 0; });
            const next = action === 'track.promote' ? pos + 1 : pos - 1;
            if (pos < 0 || next < 0 || next >= t.ladder.length) return fail('error', 'Sin movimiento posible en el track');
            u.groups = u.groups.filter(function (gid) { return gid !== t.ladder[pos]; });
            if (u.groups.indexOf(t.ladder[next]) < 0) u.groups.push(t.ladder[next]);
            const g = store.groups.find(function (x) { return x.id === t.ladder[next]; });
            emit('perm.group.event', { action: action === 'track.promote' ? 'promoted' : 'demoted', groupName: g ? g.name : '', timestamp: now() });
            return ok({ steamId: p.steamId, track: p.track, groupName: g ? g.name : null });
        }
        case 'user.search': {
            // SOLO MOCK por ahora: filtra el directorio local (nombre o SteamId),
            // orden alfabético. Sin estados de conexión (no implementado).
            // BACKEND (dev): exponer user.list/user.search real con
            // [{ steamId, displayName, avatar }].
            const q = String(p.query || '').trim().toLowerCase();
            const all = (store.directory || []).filter(function (d) {
                return !q || d.displayName.toLowerCase().indexOf(q) >= 0 || d.steamId.indexOf(q) >= 0;
            });
            all.sort(function (a, b) {
                return a.displayName.localeCompare(b.displayName);
            });
            return ok(all);
        }
        case 'user.info': {
            if ((m = need('steamId'))) return m;
            const u = store.users[p.steamId];
            if (!u) return fail('user_not_found', 'Usuario no encontrado');
            const entries = effectiveEntries(store, p.steamId);
            let primary = null;
            let best = -Infinity;
            u.groups.forEach(function (gid) {
                const g = store.groups.find(function (x) { return x.id === gid; });
                if (g && g.weight > best) { best = g.weight; primary = g.name; }
            });
            return ok({ steamId: p.steamId, displayName: u.displayName, primaryGroup: primary, nodes: entries });
        }
        case 'user.groups': {
            if ((m = need('steamId'))) return m;
            const u = store.users[p.steamId];
            if (!u) return fail('user_not_found', 'Usuario no encontrado');
            return ok(u.groups.map(function (gid) {
                const g = store.groups.find(function (x) { return x.id === gid; });
                return g ? { id: g.id, name: g.name, displayName: g.displayName, priority: g.priority, weight: g.weight } : null;
            }).filter(Boolean));
        }
        default:
            return fail('unknown_action', 'Acción desconocida: ' + action);
    }
}

// ---------------------------------------------------------------------------
// Cliente. BACKEND (dev): cuando exista el socket real, implementa
// sendOverSocket() (abrir WebSocket a `socketUrl`, enviar { action, ...payload },
// correlacionar la perm.response y resolver/rechazar) y pon mock:false.
// Los suscriptores reciben perm.event / perm.group.event tal cual lleguen
// (fire-and-forget, sin CorrelationId).
export function createPermissionClient(options) {
    const opts = options || {};
    const useMock = opts.mock !== false && !opts.socketUrl;
    const store = useMock ? createMockStore() : null;
    const subs = {};
    const emit = function (event, data) {
        (subs[event] || []).forEach(function (fn) { try { fn(data); } catch (e) { /* noop */ } });
    };
    const request = function (action, payload) {
        const p = Object.assign({}, payload);
        if (useMock) {
            return new Promise(function (resolve, reject) {
                let res;
                try {
                    res = mockRequest(store, emit, action, p);
                } catch (e) {
                    reject(Object.assign(new Error('error'), { code: 'error' }));
                    return;
                }
                if (res.Success) resolve(res.Data);
                else reject(Object.assign(new Error(res.Message || res.Error), { code: res.Error }));
            });
        }
        // BACKEND (dev): aquí va el envío real por WebSocket.
        return Promise.reject(Object.assign(new Error('Sin socket: configura socketUrl'), { code: 'error' }));
    };
    return {
        // true = datos de ejemplo locales; false = socket real.
        isMock: useMock,
        request: request,
        on: function (event, fn) {
            subs[event] = subs[event] || [];
            subs[event].push(fn);
            return function () { subs[event] = (subs[event] || []).filter(function (f) { return f !== fn; }); };
        },
        // Atajos 1:1 con la tabla de acciones del protocolo.
        check: function (steamId, node, serverKey) { return request('check', { steamId: steamId, node: node, serverKey: serverKey }); },
        grant: function (steamId, node, serverKey) { return request('grant', { steamId: steamId, node: node, serverKey: serverKey }); },
        revoke: function (steamId, node, serverKey) { return request('revoke', { steamId: steamId, node: node, serverKey: serverKey }); },
        groupList: function () { return request('group.list', {}); },
        groupCreate: function (args) {
            return request('group.create', {
                groupName: args.groupName, displayName: args.displayName, priority: args.priority,
                weight: args.weight, color: args.color, isHidden: args.isHidden,
            });
        },
        groupDelete: function (groupName) { return request('group.delete', { groupName: groupName }); },
        groupNodeAdd: function (groupName, node, serverKey) { return request('group.node.add', { groupName: groupName, node: node, serverKey: serverKey }); },
        groupNodeRemove: function (groupName, node) { return request('group.node.remove', { groupName: groupName, node: node }); },
        groupCheck: function (groupName, node, serverKey) { return request('group.check', { groupName: groupName, node: node, serverKey: serverKey }); },
        groupInfo: function (groupName) { return request('group.info', { groupName: groupName }); },
        trackList: function () { return request('track.list', {}); },
        promote: function (steamId, track) { return request('track.promote', { steamId: steamId, track: track }); },
        demote: function (steamId, track) { return request('track.demote', { steamId: steamId, track: track }); },
        userInfo: function (steamId) { return request('user.info', { steamId: steamId }); },
        userGroups: function (steamId) { return request('user.groups', { steamId: steamId }); },
        userSearch: function (query) { return request('user.search', { query: query }); },
        scopeList: function () { return request('scope.list', {}); },
        scopeGet: function (kind, id, node) { return request('scope.get', { kind: kind, id: id, node: node }); },
        assignScopes: function (kind, id, scopes, node) { return request('scope.assign', { kind: kind, id: id, scopes: scopes, node: node }); },
        nodeCatalog: function () { return request('node.catalog', {}); },
    };
}

// Ejemplo de conexión real (BACKEND dev):
//   const perms = createPermissionClient({ socketUrl: import.meta.env.VITE_PERMISSIONS_WS_URL });
//   perms.on('perm.event', console.log);
//   await perms.grant('76561198...', 'framea.command.reload');
