// ============================================
// CHIZEL Brand Config
// براند سعودي — مستكة يونانية لنحت الفك
// ============================================

const BRAND = {
    name: 'CHIZEL',
    nameAr: 'شيزل',
    tagline: 'انحت فكك',
    promise: 'مستكة خيوس الأصلية لتقوية عضلات الفك وتحديد الملامح',
    country: 'السعودية',
    currency: 'ر.س'
};

const PRODUCTS = {
    start: {
        id: 'start',
        name: 'CHIZEL Start',
        nameAr: 'شيزل ستارت',
        label: 'ستارت',
        desc: 'علبة تجربة · كافية لبداية قوية',
        duration: 'حوالي أسبوعين',
        price: 199,
        features: ['علبة واحدة', 'شحن مجاني', 'ضمان 30 يوم']
    },
    pro: {
        id: 'pro',
        name: 'CHIZEL Pro',
        nameAr: 'شيزل برو',
        label: 'برو',
        desc: 'الشهر الكامل + دليل التمارين',
        duration: 'شهر واحد',
        price: 249,
        originalPrice: 398,
        badge: 'الأكثر طلباً',
        features: ['علبتين', 'دليل تمارين PDF', 'شحن سريع', 'ضمان 30 يوم']
    },
    elite: {
        id: 'elite',
        name: 'CHIZEL Elite',
        nameAr: 'شيزل إيليت',
        label: 'إيليت',
        desc: 'الباقة الكاملة · نتائج أوضح',
        duration: '3 أشهر',
        price: 379,
        originalPrice: 597,
        badge: 'توفير أكبر',
        features: ['3 علب', 'دليل تمارين', 'متابعة واتساب', 'شحن أولوية', 'ضمان 30 يوم']
    }
};

const SHEETDB_URL = 'https://sheetdb.io/api/v1/glsn5w5ktwugw';
