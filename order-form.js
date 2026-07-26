(function () {
    var btn = document.getElementById('mobileMenuBtn');
    var nav = document.getElementById('mobileNav');
    if (btn && nav) {
        btn.addEventListener('click', function () {
            nav.classList.toggle('open');
        });
    }

    /* Countdown — session timer (~47 min) */
    var countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        var key = 'nasma_offer_end';
        var end = sessionStorage.getItem(key);
        if (!end) {
            end = Date.now() + 47 * 60 * 1000;
            sessionStorage.setItem(key, String(end));
        } else {
            end = parseInt(end, 10);
        }
        function tick() {
            var left = Math.max(0, end - Date.now());
            var m = Math.floor(left / 60000);
            var s = Math.floor((left % 60000) / 1000);
            countdownEl.textContent =
                (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
            if (left > 0) requestAnimationFrame(function () { setTimeout(tick, 1000); });
        }
        tick();
    }

    var form = document.getElementById('orderForm');
    if (!form) return;

    var sheetUrl = form.getAttribute('data-sheet') || 'https://sheetdb.io/api/v1/glsn5w5ktwugw';
    var productName = form.getAttribute('data-product') || 'طلب';
    var msg = document.getElementById('orderMsg');
    var submitBtn = document.getElementById('orderSubmit');
    var stickyPrice = document.getElementById('stickyPrice');
    var summaryPrice = document.getElementById('summaryPrice');
    var summaryBundle = document.getElementById('summaryBundle');

    function getSelectedBundle() {
        var checked = form.querySelector('input[name="bundle"]:checked');
        if (!checked) return { price: 199, label: 'قطعة واحدة', id: 'single' };
        return {
            price: parseInt(checked.getAttribute('data-price'), 10) || 199,
            label: checked.getAttribute('data-label') || 'قطعة واحدة',
            id: checked.value
        };
    }

    function syncBundleUI() {
        var b = getSelectedBundle();
        var priceText = b.price + ' ر.س';
        if (submitBtn) submitBtn.textContent = 'تأكيد الطلب — ' + priceText;
        if (stickyPrice) stickyPrice.textContent = priceText;
        if (summaryPrice) summaryPrice.textContent = priceText;
        if (summaryBundle) summaryBundle.textContent = b.label;
        form.querySelectorAll('.bundle-option').forEach(function (el) {
            el.classList.toggle('selected', el.querySelector('input') === form.querySelector('input[name="bundle"]:checked'));
        });
    }

    form.querySelectorAll('input[name="bundle"]').forEach(function (radio) {
        radio.addEventListener('change', syncBundleUI);
    });
    syncBundleUI();

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var bundle = getSelectedBundle();
        var name = document.getElementById('order-name').value.trim();
        var phone = document.getElementById('order-phone').value.trim();

        if (!name || !phone) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري الإرسال...';
        if (msg) msg.className = 'form-msg';

        var orderLine = productName + ' | ' + bundle.label + ' | ' + bundle.price + ' SAR';
        var cityInput = document.getElementById('order-city-input');
        var cityValue = cityInput ? cityInput.value.trim() : '';
        if (cityValue) orderLine += ' | ' + cityValue;

        fetch(sheetUrl, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: [{ name: name, phone: phone, city: orderLine }]
            })
        })
        .then(function (res) {
            if (res.ok || res.status === 201) {
                var q = '?product=' + encodeURIComponent(productName) +
                    '&bundle=' + encodeURIComponent(bundle.label) +
                    '&price=' + bundle.price;
                window.location.href = (form.getAttribute('data-thank-you') || 'thank-you.html') + q;
            } else {
                throw new Error('fail');
            }
        })
        .catch(function () {
            if (msg) {
                msg.textContent = 'حدث خطأ، حاول مرة ثانية.';
                msg.className = 'form-msg err';
            }
            submitBtn.disabled = false;
            syncBundleUI();
        });
    });
})();
