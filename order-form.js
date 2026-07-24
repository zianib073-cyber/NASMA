(function () {
    var btn = document.getElementById('mobileMenuBtn');
    var nav = document.getElementById('mobileNav');
    if (btn && nav) {
        btn.addEventListener('click', function () {
            nav.classList.toggle('open');
        });
    }

    var form = document.getElementById('orderForm');
    if (!form) return;

    var sheetUrl = form.getAttribute('data-sheet') || 'https://sheetdb.io/api/v1/glsn5w5ktwugw';
    var productLabel = form.getAttribute('data-product') || 'طلب';
    var msg = document.getElementById('orderMsg');
    var submitBtn = document.getElementById('orderSubmit');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري الإرسال...';
        if (msg) msg.className = 'form-msg';

        fetch(sheetUrl, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: [{
                    name: document.getElementById('order-name').value.trim(),
                    phone: document.getElementById('order-phone').value.trim(),
                    city: productLabel
                }]
            })
        })
        .then(function (res) {
            if (res.ok || res.status === 201) {
                if (msg) {
                    msg.textContent = 'تم إرسال طلبك. بنتواصل معك قريباً.';
                    msg.className = 'form-msg ok';
                }
                form.reset();
                var thankYou = form.getAttribute('data-thank-you');
                if (thankYou) {
                    window.location.href = thankYou;
                }
            } else {
                throw new Error('fail');
            }
        })
        .catch(function () {
            if (msg) {
                msg.textContent = 'حدث خطأ، حاول مرة ثانية.';
                msg.className = 'form-msg err';
            }
        })
        .finally(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = 'اطلب الآن — 199 ر.س';
        });
    });
})();
