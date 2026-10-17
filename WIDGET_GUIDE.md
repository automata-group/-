# دليل استخدام ويدجت الكارد الملكي (VipHostCard Widget)

موديول جافاسكريبت مستقل (`Reusable Drop-in Component`) يمكن تضمينه داخل أي صفحة ويب موجودة مسبقاً لرسم وتفاعل كارد المضيف الملكي مباشرة على الكانفاس فائق السرعة دون أي تعقيد.

---

## 1. التثبيت والتضمين السريع (3 خطوات فقط)

### الخطوة 1: تضمين ملف الجافاسكريبت والخطوط
أضف الرابط التالي في صفحتك:
```html
<!-- خطوط العرض الملكية (Cairo & Cormorant Garamond) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@600;700&display=swap" rel="stylesheet">

<!-- ملف موديول الكارد -->
<script src="vip_host_card.js"></script>
```

### الخطوة 2: وضع الحاوية داخل أي مكان بصفحتك
```html
<div id="host-card-box" style="width: 100%; max-width: 592px; margin: 0 auto;"></div>
```

### الخطوة 3: تشغيل الويدجت برمجياً
```javascript
const card = new VipHostCard('#host-card-box', {
  templateUrl: 'static/card_template.png', // الصورة الأساسية التي قمت باستخراجها
  
  // البيانات الديناميكية
  data: {
    hostName: 'The King...',
    genderAge: '♂ 29',
    level: 'H5',
    joinDate: '12/08/2026',
    avatarUrl: 'static/my_avatar.png', // رابط صورة المضيف لتفريغها دائرياً
    deposits: 483800,                  // إيداعات الوكالة
    commission: 434600,                // عمولة الوكالة
    deductions: 49200,                 // خصومات ومكافآت الوقت
    totalXcoins: '3,502,640',          // إجمالي كوينز X
    durationText: '7372 دقيقة & 18 يوم' // ساعات البث والأيام
  },

  // مسارات الأيقونات من مجلد static (اختيارية)
  icons: {
    deposits: 'static/icon_deposits.png',
    commission: 'static/icon_commission.png',
    deductions: 'static/icon_deductions.png',
    coinP: 'static/p_coin_gold.png',
    coinX: 'static/x_coin_gold.png',
    clock: 'static/clock_gold.png',
    male: 'static/icon_male.png',
    crownBadge: 'static/icon_crown_badge.png',
    pillFrame: 'static/gold_pill_frame.png'
  },

  // استقبال أحداث النقرات (Callbacks)
  onChatClick: (data) => {
    console.log('فتح محادثة مع المضيف:', data.hostName);
  },
  onTransferClick: (data) => {
    console.log('تحويل كوينز للمضيف');
  },
  onProfileClick: (data) => {
    console.log('النقر على الملف الشخصي:', data);
  },
  onRowClick: (rowKey, data) => {
    // rowKey: 'deposits' | 'commission' | 'deductions'
    console.log('تم النقر على الصف:', rowKey);
  },
  onXcoinsClick: (data) => {
    console.log('فتح محفظة Xcoins');
  },
  onDurationClick: (data) => {
    console.log('فتح تقرير ساعات البث');
  }
});
```

---

## 2. تحديث البيانات الحية (Real-time Dynamic Update)

لتحديث الأرقام أو النصوص فورياً مع انيميشن التدحرج (`Rolling Numbers`):
```javascript
card.updateData({
  deposits: 650000,
  commission: 585000,
  totalXcoins: '4,100,000'
});
```

---

## 3. التكامل مع فلاتر (Flutter Integration)

عند النقر على أي عنصر، يقوم الموديول تلقائياً بتمرير الحدث إلى `window.FlutterBridge` إن وجد:
```dart
// من داخل تطبيق Flutter
controller.runJavaScript('''
  card.updateData({
    deposits: $newDeposits,
    commission: $newCommission
  });
''');
```

---

## 4. الميزات التقنية للويدجت:
- **Zero-Idle CPU**: يستهلك 0% من المعالج عند استقرار الكارد، ويعمل فقط أثناء تدحرج الأرقام أو اللمس.
- **Fluid Responsiveness**: يتكيف تلقائياً مع عرض الحاوية الأب (`ResizeObserver`) مع الحفاظ على النسبة والتناسب `1280:885`.
- **High-DPI Retina**: يرسم بنقاوة متناهية تتوافق مع شاشات الهواتف الحديثة.
