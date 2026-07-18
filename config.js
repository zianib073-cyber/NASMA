// CHIZEL Store Configuration
const CONFIG = {
    // Store Info
    store: {
        name: 'CHIZEL',
        nameAr: 'شيزل',
        tagline: 'انحت فكك',
        description: 'علكة الفك الأصلية لنحت الملامح وتحديد خط الفك',
        currency: 'ر.س',
        country: 'السعودية'
    },

    // Products
    products: {
        basic: {
            id: 'basic',
            name: 'شيزل بيسك',
            nameEn: 'CHIZEL Basic',
            description: 'علبة واحدة - شهر',
            price: 199,
            originalPrice: 199,
            duration: 'شهر واحد',
            quantity: 1,
            features: [
                'علبة واحدة (30 قطعة)',
                'شحن مجاني',
                'ضمان 30 يوم'
            ]
        },
        pro: {
            id: 'pro',
            name: 'شيزل برو',
            nameEn: 'CHIZEL Pro',
            description: 'علبتين + دليل',
            price: 249,
            originalPrice: 398,
            duration: 'شهرين',
            quantity: 2,
            badge: 'الأكثر طلباً',
            features: [
                'علبتين (60 قطعة)',
                'دليل تمارين الفك PDF',
                'شحن مجاني سريع',
                'ضمان 30 يوم'
            ]
        },
        max: {
            id: 'max',
            name: 'شيزل ماكس',
            nameEn: 'CHIZEL Max',
            description: '3 علب + دليل + متابعة',
            price: 379,
            originalPrice: 597,
            duration: '3 شهور',
            quantity: 3,
            badge: 'توفير أكبر',
            features: [
                '3 علب (90 قطعة)',
                'دليل تمارين الفك PDF',
                'متابعة شخصية واتساب',
                'شحن مجاني أولوية',
                'ضمان 30 يوم'
            ]
        }
    },

    // Contact Info
    contact: {
        whatsapp: '+966XXXXXXXXX',
        email: 'support@chizel.sa',
        workingHours: 'السبت - الخميس: 9 صباحاً - 11 مساءً'
    },

    // Social Media
    social: {
        instagram: 'https://instagram.com/chizel.sa',
        tiktok: 'https://tiktok.com/@chizel.sa',
        snapchat: 'https://snapchat.com/add/chizel.sa'
    },

    // Shipping
    shipping: {
        free: true,
        freeThreshold: 0,
        estimatedDays: '2-4',
        areas: 'جميع مناطق السعودية'
    },

    // Guarantee
    guarantee: {
        days: 30,
        description: 'ضمان ذهبي - استرجاع كامل بدون أسئلة'
    },

    // Form Messages
    messages: {
        success: 'تم استلام طلبك بنجاح! سنتواصل معك قريباً.',
        error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
        required: 'هذا الحقل مطلوب',
        invalidPhone: 'رقم الجوال غير صحيح'
    },

    // Cities
    cities: [
        'الرياض',
        'جدة',
        'مكة المكرمة',
        'المدينة المنورة',
        'الدمام',
        'الخبر',
        'الظهران',
        'الطائف',
        'تبوك',
        'بريدة',
        'خميس مشيط',
        'أبها',
        'نجران',
        'جازان',
        'ينبع',
        'حائل',
        'الجبيل',
        'القطيف',
        'الأحساء'
    ]
};
