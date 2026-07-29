/**
 * COD Network seller order submission (browser).
 * Docs: https://developer.cod.network/v2/api-seller-orders/
 * Postman: cod-network-official workspace (seller/leads vs seller/orders).
 */
(function (global) {
    var LOG_PREFIX = '[NASMA COD]';

    var DEFAULTS = {
        apiBase: 'https://api.cod.network/api/v2',
        ordersPath: '/seller/leads',
        countryCode: 'SA',
        currencyCode: 'SAR',
        paymentMethod: 'cod',
        source: 'nasma-home-website',
        phoneFormat: 'sa_local',
        lineItemsKey: 'products'
    };

    function mergeConfig() {
        var store = typeof STORE !== 'undefined' && STORE.codNetwork ? STORE.codNetwork : {};
        var local = typeof COD_CONFIG !== 'undefined' ? COD_CONFIG : {};
        return {
            apiBase: store.apiBase || DEFAULTS.apiBase,
            ordersPath: store.ordersPath || DEFAULTS.ordersPath,
            countryCode: store.countryCode || DEFAULTS.countryCode,
            currencyCode: store.currencyCode || DEFAULTS.currencyCode,
            paymentMethod: store.paymentMethod || DEFAULTS.paymentMethod,
            source: store.source || DEFAULTS.source,
            phoneFormat: store.phoneFormat || DEFAULTS.phoneFormat,
            lineItemsKey: store.lineItemsKey || DEFAULTS.lineItemsKey,
            debug:
                local.debug === true ||
                store.debug === true ||
                (typeof local.debug === 'undefined' && store.debug !== false),
            apiToken: local.apiToken || store.apiToken || ''
        };
    }

    function debugLog(cfg) {
        if (!cfg.debug) return;
        var args = Array.prototype.slice.call(arguments, 1);
        console.log.apply(console, [LOG_PREFIX].concat(args));
    }

    function formatPhone(phone, format) {
        var digits = String(phone).replace(/\D/g, '');
        if (format === 'e164') {
            if (digits.indexOf('966') === 0) return '+' + digits;
            if (digits.charAt(0) === '0') return '+966' + digits.slice(1);
            if (digits.length === 9) return '+966' + digits;
            return phone.trim();
        }
        if (digits.indexOf('966') === 0 && digits.length >= 12) {
            return '0' + digits.slice(3);
        }
        if (digits.charAt(0) !== '0' && digits.length === 9) {
            return '0' + digits;
        }
        return digits || phone.trim();
    }

    /**
     * COD Network seller API body (flat + line items).
     * SKUs must match your catalog exactly (seller dashboard → products).
     */
    function buildCodOrderPayload(input, cfg) {
        var qty = input.quantity || 1;
        var lineTotal =
            typeof input.lineTotal === 'number'
                ? input.lineTotal
                : (input.unitPrice || 0) * qty;
        var unitPrice =
            typeof input.unitPrice === 'number'
                ? input.unitPrice
                : qty
                  ? Math.round((lineTotal / qty) * 100) / 100
                  : lineTotal;
        var phone = formatPhone(input.phone, cfg.phoneFormat);

        var lineItem = {
            sku: input.sku,
            quantity: qty,
            price: unitPrice
        };

        var payload = {
            customer_name: input.customerName,
            phone_number: phone,
            city: input.city,
            address: input.address,
            country_code: input.countryCode || cfg.countryCode,
            currency_code: input.currencyCode || cfg.currencyCode,
            payment_method: input.paymentMethod || cfg.paymentMethod,
            source: input.source || cfg.source,
            note: input.notes || '',
            total: lineTotal
        };

        payload[cfg.lineItemsKey] = [lineItem];

        return payload;
    }

    function extractOrderReference(json) {
        if (!json || typeof json !== 'object') return '';
        if (json.data) {
            if (typeof json.data === 'object') {
                if (json.data.id != null) return String(json.data.id);
                if (json.data.reference != null) return String(json.data.reference);
                if (json.data.order_id != null) return String(json.data.order_id);
            }
        }
        if (json.id != null) return String(json.id);
        if (json.order_id != null) return String(json.order_id);
        if (json.reference != null) return String(json.reference);
        return '';
    }

    function responseIndicatesFailure(json) {
        if (!json || typeof json !== 'object') return false;
        if (json.success === false) return true;
        if (json.status === 'error' || json.status === 'failed') return true;
        if (json.error && !json.data) return true;
        return false;
    }

    function extractErrorMessage(json, status) {
        if (json && json.message) return json.message;
        if (json && json.error) return String(json.error);
        if (json && json.errors && typeof json.errors === 'object') {
            var parts = [];
            Object.keys(json.errors).forEach(function (key) {
                var val = json.errors[key];
                parts.push(key + ': ' + (Array.isArray(val) ? val.join(', ') : val));
            });
            if (parts.length) return parts.join(' · ');
        }
        return 'تعذّر إرسال الطلب (رمز ' + status + '). تحقق من SKU والعنوان في لوحة COD Network.';
    }

    function parseResponseBody(res) {
        return res.text().then(function (text) {
            if (!text) return { rawText: '' };
            try {
                return JSON.parse(text);
            } catch (e) {
                return { rawText: text, parseError: e.message };
            }
        });
    }

    function submitCodOrder(input) {
        var cfg = mergeConfig();
        if (!cfg.apiToken) {
            debugLog(cfg, 'Missing apiToken — add cod-config.js (see cod-config.example.js)');
            return Promise.reject(new Error('missing_token'));
        }

        var url = cfg.apiBase.replace(/\/$/, '') + cfg.ordersPath;
        var body = buildCodOrderPayload(
            Object.assign({}, input, {
                countryCode: cfg.countryCode,
                currencyCode: cfg.currencyCode,
                paymentMethod: cfg.paymentMethod,
                source: cfg.source
            }),
            cfg
        );

        debugLog(cfg, 'POST', url);
        debugLog(cfg, 'Authorization', 'Bearer ' + cfg.apiToken.slice(0, 12) + '…');
        debugLog(cfg, 'Request payload', JSON.parse(JSON.stringify(body)));

        return fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + cfg.apiToken
            },
            body: JSON.stringify(body)
        })
            .then(function (res) {
                debugLog(cfg, 'HTTP status', res.status, res.statusText);
                return parseResponseBody(res).then(function (json) {
                    debugLog(cfg, 'Response body', json);

                    if (responseIndicatesFailure(json)) {
                        var failMsg = extractErrorMessage(json, res.status);
                        debugLog(cfg, 'API reported failure', failMsg);
                        var failErr = new Error(failMsg);
                        failErr.details = json;
                        failErr.status = res.status;
                        throw failErr;
                    }

                    if (!res.ok && res.status !== 201) {
                        var errMsg = extractErrorMessage(json, res.status);
                        debugLog(cfg, 'HTTP error', errMsg);
                        var httpErr = new Error(errMsg);
                        httpErr.details = json;
                        httpErr.status = res.status;
                        throw httpErr;
                    }

                    var reference = extractOrderReference(json);
                    if (!reference) {
                        debugLog(
                            cfg,
                            'Warning: HTTP OK but no order/lead id in response — check COD dashboard (Leads vs Orders) and Postman schema.',
                            json
                        );
                    } else {
                        debugLog(cfg, 'Order reference', reference);
                    }

                    return {
                        ok: true,
                        reference: reference,
                        raw: json,
                        httpStatus: res.status
                    };
                });
            })
            .catch(function (err) {
                if (err && err.message === 'missing_token') {
                    throw err;
                }
                debugLog(cfg, 'Fetch/network error', err);
                if (err && err.details) {
                    debugLog(cfg, 'Error details', err.details);
                }
                throw err;
            });
    }

    function logStartupDiagnostics() {
        var cfg = mergeConfig();
        debugLog(cfg, 'Ready', {
            endpoint: cfg.apiBase.replace(/\/$/, '') + cfg.ordersPath,
            hasToken: Boolean(cfg.apiToken),
            tokenPreview: cfg.apiToken ? cfg.apiToken.slice(0, 12) + '…' : 'MISSING',
            country: cfg.countryCode,
            phoneFormat: cfg.phoneFormat,
            lineItemsKey: cfg.lineItemsKey
        });
        if (!cfg.apiToken) {
            console.warn(
                LOG_PREFIX,
                'cod-config.js missing or empty — orders will not reach COD Network (token not loaded).'
            );
        }
    }

    global.CodNetwork = {
        buildCodOrderPayload: buildCodOrderPayload,
        submitCodOrder: submitCodOrder,
        formatPhone: formatPhone,
        logStartupDiagnostics: logStartupDiagnostics
    };

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', logStartupDiagnostics);
        } else {
            logStartupDiagnostics();
        }
    }
})(typeof window !== 'undefined' ? window : this);
