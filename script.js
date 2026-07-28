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

    /* Brand slider (homepage) */
    var slider = document.getElementById('brandSlider');
    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('.slide'));
        var dotsWrap = document.getElementById('sliderDots');
        var prevBtn = document.getElementById('sliderPrev');
        var nextBtn = document.getElementById('sliderNext');
        var index = 0;
        var timer = null;

        function goTo(i) {
            index = (i + slides.length) % slides.length;
            slides.forEach(function (slide, n) {
                slide.classList.toggle('is-active', n === index);
            });
            if (dotsWrap) {
                dotsWrap.querySelectorAll('.slider-dot').forEach(function (dot, n) {
                    dot.classList.toggle('is-active', n === index);
                    dot.setAttribute('aria-selected', n === index ? 'true' : 'false');
                });
            }
        }

        function next() { goTo(index + 1); }
        function prev() { goTo(index - 1); }

        function startAuto() {
            stopAuto();
            timer = setInterval(next, 5500);
        }

        function stopAuto() {
            if (timer) clearInterval(timer);
            timer = null;
        }

        if (dotsWrap) {
            slides.forEach(function (_, n) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'slider-dot' + (n === 0 ? ' is-active' : '');
                dot.setAttribute('aria-label', 'الشريحة ' + (n + 1));
                dot.setAttribute('role', 'tab');
                dot.addEventListener('click', function () {
                    goTo(n);
                    startAuto();
                });
                dotsWrap.appendChild(dot);
            });
        }

        if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAuto(); });
        if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAuto(); });

        slider.addEventListener('mouseenter', stopAuto);
        slider.addEventListener('mouseleave', startAuto);
        goTo(0);
        startAuto();
    }

    var form = document.getElementById('orderForm');
    if (!form) return;

    var sheetUrl = form.getAttribute('data-sheet') ||
        (typeof STORE !== 'undefined' && STORE.sheetUrl) ||
        'https://sheetdb.io/api/v1/glsn5w5ktwugw';
    var productName = form.getAttribute('data-product') || 'طلب نسمة هوم';
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
