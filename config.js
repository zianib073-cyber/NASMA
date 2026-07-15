/* ============================================
   نسمة - معطر منزلي ذكي
   Configuration File
   ============================================ */

const CONFIG = {
    
    // معلومات المنتج
    product: {
        name: 'نسمة',
        nameEn: 'Nasma',
        description: 'معطر منزلي ذكي',
        price: 299,
        currency: 'ر.س',
        currencyEn: 'SAR'
    },

    // معلومات الشركة
    company: {
        name: 'نسمة',
        email: 'info@nasma.sa',
        phone: '+966500000000',
        whatsapp: '+966500000000'
    },

    // روابط التواصل الاجتماعي
    socialMedia: {
        twitter: 'https://twitter.com/nasma',
        instagram: 'https://instagram.com/nasma',
        whatsapp: 'https://wa.me/966500000000'
    },

    // إعدادات الفورم
    form: {
        submitUrl: '',
        messages: {
            success: 'تم استلام طلبك بنجاح! سنتواصل معك قريباً.',
            error: 'حدث خطأ، يرجى المحاولة مرة أخرى.',
            validationError: 'يرجى ملء جميع الحقول المطلوبة.'
        },
        phoneRegex: /^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/
    },

    // إعدادات الشحن
    shipping: {
        freeShipping: true,
        deliveryDays: '3-5',
        availableCountries: ['SA', 'AE', 'KW', 'BH', 'QA', 'OM']
    },

    // إعدادات التتبع (Pixels)
    analytics: {
        googleAnalytics: { enabled: false, trackingId: '' },
        facebookPixel: { enabled: false, pixelId: '' },
        tiktokPixel: { enabled: false, pixelId: '' },
        snapchatPixel: { enabled: false, pixelId: '' }
    }
};
