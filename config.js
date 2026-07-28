const STORE = {
    name: 'نسمة هوم',
    nameEn: 'NASMA Home',
    tagline: 'منتجات موثوقة · شحن مجاني · دفع عند الاستلام',
    currency: 'ر.س',
    sheetUrl: 'https://sheetdb.io/api/v1/glsn5w5ktwugw'
};

const BUNDLES = [
    { id: 'single', price: 199, titleAr: 'قطعة واحدة', badge: '' },
    { id: 'dual', price: 279, titleAr: 'باقة ثنائية', badge: 'الأكثر طلباً' },
    { id: 'mega', price: 349, titleAr: 'الباقة المتكاملة', badge: 'وفّر أكثر' }
];

const PRODUCTS = {
    light: {
        slug: 'product-light.html',
        nameAr: 'مصباح العمل المغناطيسي القوي',
        sheetProduct: 'مصباح LED'
    },
    lock: {
        slug: 'product-lock.html',
        nameAr: 'قفل أمان الأبواب والنوافذ للأطفال',
        sheetProduct: 'قفل أطفال'
    },
    straps: {
        slug: 'product-straps.html',
        nameAr: 'أحزمة رفع ونقل الأثاث الثقيل',
        sheetProduct: 'أحزمة نقل'
    }
};
