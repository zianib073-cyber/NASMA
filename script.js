(function () {
    var menuBtn = document.getElementById('mobileMenuBtn');
    var mobileNav = document.getElementById('mobileNav');
    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
        mobileNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileNav.classList.remove('open');
            });
        });
    }

    var form = document.getElementById('orderForm');
    if (!form) return;

    var sheetUrl = form.getAttribute('data-sheet') ||
        (typeof STORE !== 'undefined' && STORE.sheetUrl) ||
        'https://sheetdb.io/api/v1/glsn5w5ktwugw';
    var productName = form.getAttribute('data-product') || 'طلب NASMA';
    var msg = document.getElementById('orderMsg');
    var submitBtn = document.getElementById('orderSubmit');
    var stickyPrice = document.getElementById('stickyPrice');
    var stickyBtn = document.getElementById('stickyOrderBtn');

    if (stickyPrice || stickyBtn) {
        document.body.classList.add('has-sticky-order');
    }

    function getSelectedBundle() {
        var checked = form.querySelector('input[name="bundle"]:checked');
        if (!checked) {
            return { price: 199, label: 'قطعة واحدة', id: 'single' };
        }
        return {
            price: parseInt(checked.getAttribute('data-price'), 10) || 199,
            label: checked.getAttribute('data-label') || 'قطعة واحدة',
            id: checked.value
        };
    }

    var hasBundles = form.querySelectorAll('input[name="bundle"]').length > 0;

    function syncBundleUI() {
        if (!hasBundles) return;
        var bundle = getSelectedBundle();
        var priceText = bundle.price + ' ر.س';
        if (submitBtn) {
            submitBtn.textContent = 'تأكيد الطلب — ' + priceText;
        }
        if (stickyPrice) {
            stickyPrice.textContent = priceText;
        }
        form.querySelectorAll('.bundle-option').forEach(function (el) {
            var input = el.querySelector('input');
            el.classList.toggle('selected', input && input.checked);
        });
    }

    form.querySelectorAll('input[name="bundle"]').forEach(function (radio) {
        radio.addEventListener('change', syncBundleUI);
    });
    syncBundleUI();

    if (stickyBtn) {
        stickyBtn.addEventListener('click', function () {
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var bundle = hasBundles ? getSelectedBundle() : null;
        var name = document.getElementById('order-name').value.trim();
        var phone = document.getElementById('order-phone').value.trim();
        var cityInput = document.getElementById('order-city');
        var cityValue = cityInput ? cityInput.value.trim() : '';
        var defaultSubmitText = submitBtn ? submitBtn.textContent : '';

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

        var orderLine = productName;
        if (bundle) {
            orderLine += ' | ' + bundle.label + ' | ' + bundle.price + ' SAR';
        }
        if (cityValue) orderLine += ' | ' + cityValue;

        fetch(sheetUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: [{ name: name, phone: phone, city: orderLine }]
            })
        })
            .then(function (res) {
                if (res.ok || res.status === 201) {
                    var q = '?product=' + encodeURIComponent(productName);
                    if (bundle) {
                        q +=
                            '&bundle=' + encodeURIComponent(bundle.label) +
                            '&price=' + bundle.price;
                    }
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
                if (hasBundles) {
                    syncBundleUI();
                } else {
                    submitBtn.textContent = defaultSubmitText || 'إرسال';
                }
            });
    });
})();
