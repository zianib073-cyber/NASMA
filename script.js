(function () {
  'use strict';

  // Configuration
  const CONFIG = {
    whatsapp: '966500000000',
    storeName: 'نَسمة',
    product: {
      name: 'جهاز نَسمة للتعطير الذكي',
      price: 299,
      currency: 'ر.س'
    }
  };

  // Phone validation patterns for Gulf countries
  const PHONE_PATTERNS = {
    SA: /^(\+966|966|0)?5[0-9]{8}$/,
    AE: /^(\+971|971|0)?5[0-9]{8}$/,
    KW: /^(\+965|965)?[569][0-9]{7}$/
  };

  // DOM Elements
  const orderForm = document.getElementById('orderForm');
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  let toastTimer;

  // Mobile Menu Toggle
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const isOpen = !mobileMenu.classList.contains('hidden');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Toast Notification
  function showToast(message, isError = false) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.hidden = false;
    toast.classList.remove('bg-green-600', 'bg-red-600');
    toast.classList.add(isError ? 'bg-red-600' : 'bg-green-600');

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.hidden = true;
      }, 300);
    }, 4000);
  }

  // Phone Validation
  function validatePhone(phone, country) {
    const cleaned = phone.replace(/[\s\-()]/g, '');
    const pattern = PHONE_PATTERNS[country];
    return pattern ? pattern.test(cleaned) : cleaned.length >= 8;
  }

  // Build WhatsApp Message
  function buildOrderMessage(data) {
    const countryNames = {
      SA: 'السعودية',
      AE: 'الإمارات',
      KW: 'الكويت'
    };

    return [
      `🛒 *طلب جديد — ${CONFIG.storeName}*`,
      '',
      `📦 *المنتج:* ${CONFIG.product.name}`,
      `💰 *السعر:* ${CONFIG.product.price} ${CONFIG.product.currency}`,
      '',
      `👤 *الاسم:* ${data.name}`,
      `📱 *الهاتف:* ${data.phone}`,
      `🌍 *الدولة:* ${countryNames[data.country] || data.country}`,
      `📍 *العنوان:* ${data.address}`,
      '',
      '💳 *الدفع:* عند الاستلام'
    ].join('\n');
  }

  // Send to WhatsApp
  function sendToWhatsApp(message) {
    const whatsappNumber = CONFIG.whatsapp.replace(/\D/g, '');

    if (!whatsappNumber || whatsappNumber.includes('000000')) {
      showToast('يرجى تحديث رقم الواتساب في الإعدادات', true);
      return false;
    }

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    return true;
  }

  // Form Submission Handler
  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const data = {
      name: formData.get('name')?.trim(),
      phone: formData.get('phone')?.trim(),
      country: formData.get('country'),
      address: formData.get('address')?.trim()
    };

    // Validation
    if (!data.name || !data.phone || !data.country || !data.address) {
      showToast('يرجى تعبئة جميع الحقول المطلوبة', true);
      return;
    }

    if (data.name.length < 3) {
      showToast('يرجى إدخال الاسم الكامل', true);
      return;
    }

    if (!validatePhone(data.phone, data.country)) {
      const countryMessages = {
        SA: 'يرجى إدخال رقم جوال سعودي صحيح',
        AE: 'يرجى إدخال رقم جوال إماراتي صحيح',
        KW: 'يرجى إدخال رقم جوال كويتي صحيح'
      };
      showToast(countryMessages[data.country] || 'يرجى إدخال رقم هاتف صحيح', true);
      return;
    }

    if (data.address.length < 10) {
      showToast('يرجى إدخال عنوان تفصيلي', true);
      return;
    }

    // Build and send message
    const message = buildOrderMessage(data);
    const sent = sendToWhatsApp(message);

    if (sent) {
      showToast('تم إرسال طلبك بنجاح! جارٍ فتح واتساب...');
      form.reset();

      // Disable button temporarily
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
        }, 3000);
      }
    }
  }

  // Initialize Form
  if (orderForm) {
    orderForm.addEventListener('submit', handleSubmit);
  }

  // Header Scroll Effect
  const header = document.querySelector('header');
  if (header) {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 50) {
        header.classList.add('shadow-md');
      } else {
        header.classList.remove('shadow-md');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header?.offsetHeight || 64;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Section Fade-in Animation on Scroll
  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    const sections = document.querySelectorAll('section');

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-section', 'visible');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      section.classList.add('fade-in-section');
      sectionObserver.observe(section);
    });
  }

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      menuBtn?.setAttribute('aria-expanded', 'false');
    }
  });

  // Prevent form resubmission on page refresh
  if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
  }
})();
