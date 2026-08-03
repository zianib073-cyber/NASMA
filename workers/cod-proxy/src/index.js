/**
 * NASMA COD Network proxy — bypasses browser CORS.
 * Token stays in Worker secrets (not in the public site).
 */
export default {
    async fetch(request, env) {
        var allowedOrigins = parseAllowedOrigins(env);
        var origin = request.headers.get('Origin') || '';
        var corsOrigin = allowedOrigins.indexOf(origin) !== -1 ? origin : allowedOrigins[0];

        var corsHeaders = {
            'Access-Control-Allow-Origin': corsOrigin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Accept',
            'Access-Control-Max-Age': '86400'
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        if (request.method !== 'POST') {
            return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders);
        }

        var url = new URL(request.url);
        var allowedPaths = ['/seller/leads', '/seller/orders'];
        if (allowedPaths.indexOf(url.pathname) === -1) {
            return jsonResponse({ error: 'Path not allowed' }, 404, corsHeaders);
        }

        if (!env.COD_NETWORK_TOKEN) {
            return jsonResponse({ error: 'Proxy not configured' }, 500, corsHeaders);
        }

        var body = await request.text();
        var upstream = 'https://api.cod.network/api/v2' + url.pathname;

        try {
            var apiRes = await fetch(upstream, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + env.COD_NETWORK_TOKEN
                },
                body: body
            });

            var responseHeaders = Object.assign({}, corsHeaders, {
                'Content-Type': apiRes.headers.get('Content-Type') || 'application/json'
            });

            return new Response(await apiRes.text(), {
                status: apiRes.status,
                headers: responseHeaders
            });
        } catch (err) {
            return jsonResponse({ error: 'Upstream request failed', message: String(err) }, 502, corsHeaders);
        }
    }
};

function parseAllowedOrigins(env) {
    var raw = env.ALLOWED_ORIGINS || env.ALLOWED_ORIGIN || 'https://zianib073-cyber.github.io';
    return raw.split(',').map(function (entry) {
        return entry.trim();
    }).filter(Boolean);
}

function jsonResponse(data, status, corsHeaders) {
    return new Response(JSON.stringify(data), {
        status: status,
        headers: Object.assign({}, corsHeaders, { 'Content-Type': 'application/json' })
    });
}
