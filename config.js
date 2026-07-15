/* ============================================
   نسمة - متجر معطرات ذكية فاخرة
   Configuration File
   ============================================ */

const CONFIG = {
    
    // معلومات المتجر
    store: {
        name: 'نسمة',
        nameEn: 'Nasma',
        tagline: 'معطرات ذكية فاخرة',
        description: 'معطرات ذكية فاخرة للمنزل والسيارة. تقنية متطورة، روائح فاخرة، وتحكم من هاتفك.'
    },

    // المنتجات
    products: {
        home: {
            id: 'home',
            name: 'نسمة هوم',
            nameEn: 'Nasma Home',
            subtitle: 'معطر ذكي للمنزل',
            price: 299,
            currency: 'ر.س',
            badge: 'الأكثر مبيعاً',
            rating: 4.9,
            reviews: 487
        },
        auto: {
            id: 'auto',
            name: 'نسمة أوتو',
            nameEn: 'Nasma Auto',
            subtitle: 'معطر ذكي للسيارة',
            price: 149,
            currency: 'ر.س',
            badge: 'جديد',
            rating: 4.8,
            reviews: 312
        },
        oils: {
            id: 'oils',
            name: 'زيوت نسمة',
            nameEn: 'Nasma Oils',
            subtitle: 'مجموعة 3 زيوت فاخرة',
            price: 199,
            currency: 'ر.س',
            badge: 'فاخر',
            rating: 4.9,
            reviews: 401
        }
    },

    // معلومات الشركة
    company: {
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
        }
    },

    // إعدادات الشحن
    shipping: {
        freeShipping: true,
        freeShippingMinimum: 0,
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
