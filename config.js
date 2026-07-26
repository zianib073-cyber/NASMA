const STORE = {
    name: 'NASMA',
    tagline: 'منتجات موثوقة · شحن مجاني · دفع عند الاستلام',
    currency: 'ر.س',
    sheetUrl: 'https://sheetdb.io/api/v1/glsn5w5ktwugw'
};

const BUNDLES = [
    { id: 'single', price: 199, titleAr: 'قطعة واحدة', badge: '' },
    { id: 'dual', price: 279, titleAr: 'باقة ثنائية', badge: 'الأكثر طلباً' },
    { id: 'mega', price: 349, titleAr: 'الباقة المتكاملة', badge: 'وفر أكثر' }
];

const PRODUCTS = {
    led: {
        slug: 'product-led-light.html',
        nameAr: 'مصباح العمل المغناطيسي القوي',
        sheetProduct: 'مصباح LED'
    },
    kidsLock: {
        slug: 'product-kids-lock.html',
        nameAr: 'قفل أمان الأبواب والنوافذ للأطفال',
        sheetProduct: 'قفل أطفال'
    },
    straps: {
        slug: 'product-move-straps.html',
        nameAr: 'أحزمة رفع ونقل الأثاث الثقيل',
        sheetProduct: 'أحزمة نقل'
    }
};
