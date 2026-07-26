(function () {
    var STORE = window.NASMA_STORE || {
        sheetUrl: 'https://sheetdb.io/api/v1/glsn5w5ktwugw'
    };
    var PRODUCTS = window.NASMA_PRODUCTS || {};
    var BUNDLES = window.NASMA_BUNDLES || [
        { id: 'single', price: 199, titleAr: 'قطعة واحدة' },
        { id: 'dual', price: 279, titleAr: 'باقة ثنائية' },
        { id: 'mega', price: 349, titleAr: 'الباقة المتكاملة' }
    ];

    document.body.classList.add('has-sticky');

    var menuBtn = document.getElementById('mobileMenuBtn');
    var drawer = document.getElementById('mobileNav');
    if (menuBtn && drawer) {
        menuBtn.addEventListener('click', function () {
            drawer.classList.toggle('open');
        });
        drawer.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () { drawer.classList.remove('open'); });
        });
    }

    var form = document.getElementById('landingOrderForm');
    if (!form) return;

    var productSelect = document.getElementById('order-product');
    var msg = document.getElementById('orderMsg');
    var submitBtn = document.getElementById('orderSubmit');
    var stickyPrice = document.getElementById('stickyPrice');

    function getProductSheetName() {
        if (!productSelect) return 'طلب NASMA';
        var opt = productSelect.options[productSelect.selectedIndex];
        return opt.getAttribute('data-sheet') || opt.textContent.trim();
    }

    function getSelectedBundle() {
        var checked = form.querySelector('input[name="bundle"]:checked');
        if (!checked) return { price: 199, label: 'قطعة واحدة', id: 'single' };
        return {
            price: parseInt(checked.getAttribute('data-price'), 10) || 199,
            label: checked.getAttribute('data-label') || 'قطعة واحدة',
            id: checked.value
        };
    }

    function syncUI() {
        var b = getSelectedBundle();
        var priceText = b.price + ' ر.س';
        if (submitBtn) submitBtn.textContent = 'تأكيد الطلب — ' + priceText;
        if (stickyPrice) stickyPrice.textContent = priceText;
    }

    form.querySelectorAll('input[name="bundle"]').forEach(function (radio) {
        radio.addEventListener('change', syncUI);
    });
    if (productSelect) productSelect.addEventListener('change', syncUI);
    syncUI();

    document.querySelectorAll('[data-preset-product]').forEach(function (el) {
        el.addEventListener('click', function (e) {
            var key = el.getAttribute('data-preset-product');
            if (productSelect && key) {
                productSelect.value = key;
                syncUI();
            }
        });
    });

    var stickyBtn = document.getElementById('stickyOrderBtn');
    if (stickyBtn) {
        stickyBtn.addEventListener('click', function () {
            var checkout = document.getElementById('checkout');
            if (checkout) checkout.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var bundle = getSelectedBundle();
        var productName = getProductSheetName();
        var name = document.getElementById('order-name').value.trim();
        var phone = document.getElementById('order-phone').value.trim();
        var cityInput = document.getElementById('order-city-input');
        var cityValue = cityInput ? cityInput.value.trim() : '';

        if (!name || !phone) {
            if (msg) {
                msg.textContent = 'يرجى إدخال الاسم ورقم الجوال.';
                msg.className = 'form-msg err';
            }
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري الإرسال...';
        if (msg) msg.className = 'form-msg';

        var orderLine = productName + ' | ' + bundle.label + ' | ' + bundle.price + ' SAR';
        if (cityValue) orderLine += ' | ' + cityValue;

        fetch(STORE.sheetUrl || form.getAttribute('data-sheet'), {
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
                    window.location.href = 'thank-you.html' + q;
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
                syncUI();
            });
    });
})();
