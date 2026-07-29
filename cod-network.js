/**
 * COD Network seller order submission (browser).
 * Endpoint confirmed: GET /api/v2/seller/orders → 401 without token.
 * Adjust buildCodOrderPayload() if your dashboard docs use different field names.
 */
(function (global) {
    var DEFAULTS = {
        apiBase: 'https://api.cod.network/api/v2',
        ordersPath: '/seller/orders',
        countryCode: 'SA',
        currencyCode: 'SAR',
        paymentMethod: 'cod',
        source: 'nasma-home-website'
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
            apiToken: local.apiToken || store.apiToken || ''
        };
    }

    function normalizePhone(phone) {
        var digits = String(phone).replace(/\D/g, '');
        if (digits.indexOf('966') === 0) return '+' + digits;
        if (digits.charAt(0) === '0') return '+966' + digits.slice(1);
        if (digits.length === 9) return '+966' + digits;
        return phone.trim();
    }

    /**
     * Map store form data → COD Network order body.
     * SKUs must match your COD Network product catalog.
     */
    function buildCodOrderPayload(input) {
        var qty = input.quantity || 1;
        var lineTotal =
            typeof input.lineTotal === 'number'
                ? input.lineTotal
                : (input.unitPrice || 0) * qty;
        var unitPrice =
            typeof input.unitPrice === 'number'
                ? input.unitPrice
                : qty
                  ? lineTotal / qty
                  : lineTotal;

        return {
            customer_name: input.customerName,
            phone: normalizePhone(input.phone),
            city: input.city,
            address: input.address,
            country_code: input.countryCode || DEFAULTS.countryCode,
            currency_code: input.currencyCode || DEFAULTS.currencyCode,
            payment_method: input.paymentMethod || DEFAULTS.paymentMethod,
            source: input.source || DEFAULTS.source,
            notes: input.notes || '',
            total: lineTotal,
            products: [
                {
                    sku: input.sku,
                    quantity: qty,
                    price: unitPrice
                }
            ]
        };
    }

    function extractOrderReference(json) {
        if (!json || typeof json !== 'object') return '';
        if (json.data && (json.data.id || json.data.reference)) {
            return String(json.data.id || json.data.reference);
        }
        if (json.id) return String(json.id);
        if (json.order_id) return String(json.order_id);
        if (json.reference) return String(json.reference);
        return '';
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

    function submitCodOrder(input) {
        var cfg = mergeConfig();
        if (!cfg.apiToken) {
            return Promise.reject(new Error('missing_token'));
        }
        var url = cfg.apiBase.replace(/\/$/, '') + cfg.ordersPath;
        var body = buildCodOrderPayload(
            Object.assign({}, input, {
                countryCode: cfg.countryCode,
                currencyCode: cfg.currencyCode,
                paymentMethod: cfg.paymentMethod,
                source: cfg.source
            })
        );

        return fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + cfg.apiToken
            },
            body: JSON.stringify(body)
        }).then(function (res) {
            return res
                .json()
                .catch(function () {
                    return {};
                })
                .then(function (json) {
                    if (res.ok || res.status === 201) {
                        return {
                            ok: true,
                            reference: extractOrderReference(json),
                            raw: json
                        };
                    }
                    var err = new Error(extractErrorMessage(json, res.status));
                    err.details = json;
                    err.status = res.status;
                    throw err;
                });
        });
    }

    global.CodNetwork = {
        buildCodOrderPayload: buildCodOrderPayload,
        submitCodOrder: submitCodOrder,
        normalizePhone: normalizePhone
    };
})(typeof window !== 'undefined' ? window : this);
