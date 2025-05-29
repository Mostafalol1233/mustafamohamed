# دليل رفع الموقع على Vercel

## الخطوات المطلوبة:

### 1. إنشاء قاعدة بيانات PostgreSQL
اختر أحد هذه الخدمات المجانية:
- **Neon Database** (الأفضل) - https://neon.tech
- **Supabase** - https://supabase.com
- **Railway** - https://railway.app

### 2. الحصول على DATABASE_URL
بعد إنشاء قاعدة البيانات، احصل على رابط الاتصال الذي يكون بهذا الشكل:
```
postgresql://username:password@host:port/database
```

### 3. رفع الموقع على Vercel
1. ادخل على https://vercel.com
2. اضغط "New Project"
3. اربط حساب GitHub واختر المشروع
4. في إعدادات Environment Variables أضف:
   - `DATABASE_URL`: رابط قاعدة البيانات
   - `SESSION_SECRET`: أي كلمة سر عشوائية مثل `mySecretKey123!@#`

### 4. بعد النشر
1. ادخل على رابط الموقع
2. اذهب إلى `/admin-quick` للدخول السريع للإدارة
3. بيانات الدخول:
   - اسم المستخدم: `admin`
   - كلمة المرور: `mostafalol1233@#`

## الاختصارات المتاحة:
- **الموقع الرئيسي**: `yoursite.vercel.app`
- **دخول سريع للإدارة**: `yoursite.vercel.app/admin-quick`
- **ملف الاختصار للكمبيوتر**: `admin-shortcut.html` (افتحه في المتصفح)

## المميزات:
✅ نظام إدارة بسيط وآمن
✅ لا توجد أي علاقة بـ Replit
✅ جاهز للنشر على Vercel
✅ اختصارات سريعة للإدارة
✅ كلمة مرور قوية للحماية
✅ واجهة عربية بالكامل

## في حالة المشاكل:
- تأكد من صحة DATABASE_URL
- تأكد من إضافة SESSION_SECRET
- جرب الدخول عبر `/admin-quick` بدلاً من الصفحة الرئيسية