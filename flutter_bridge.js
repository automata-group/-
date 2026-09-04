/**
 * FLUTTER BRIDGE & INTERACTION CONTROLLER
 * Full Bi-Directional Bridge with Comprehensive Modal System for All Buttons
 */

(function (window) {
  'use strict';

  const FlutterBridge = {
    isFlutterWebView: false,
    isBookmarked: false,

    init: function () {
      if (window.AgencyChannel && typeof window.AgencyChannel.postMessage === 'function') {
        this.isFlutterWebView = true;
      } else if (window.flutter_inappwebview && typeof window.flutter_inappwebview.callHandler === 'function') {
        this.isFlutterWebView = true;
      }

      window.updateDashboardData = this.receiveFromFlutter.bind(this);
      window.togglePerformanceMonitor = this.togglePerfMonitor.bind(this);

      this.setupModalControls();
    },

    setupModalControls: function () {
      const backdrop = document.getElementById('modal-backdrop');
      const sheet = document.getElementById('modal-sheet');
      const closeBtn = document.getElementById('sheet-close-btn');

      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal());
      }
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) this.closeModal();
        });
      }
    },

    openModal: function ({ icon, title, bodyHtml, primaryBtnText, onPrimaryClick }) {
      const backdrop = document.getElementById('modal-backdrop');
      const sheet = document.getElementById('modal-sheet');
      const iconEl = document.getElementById('sheet-icon');
      const titleEl = document.getElementById('sheet-title');
      const bodyEl = document.getElementById('sheet-body');
      const primaryBtn = document.getElementById('sheet-primary-btn');

      if (!backdrop || !sheet) return;

      if (iconEl) iconEl.innerHTML = icon || '★';
      if (titleEl) titleEl.textContent = title || '';
      if (bodyEl) bodyEl.innerHTML = bodyHtml || '';

      if (primaryBtn) {
        primaryBtn.textContent = primaryBtnText || 'حسناً، فهمت';
        primaryBtn.onclick = () => {
          if (typeof onPrimaryClick === 'function') {
            onPrimaryClick();
          } else {
            this.closeModal();
          }
        };
      }

      backdrop.classList.remove('modal-backdrop-hidden');
      requestAnimationFrame(() => {
        sheet.classList.remove('modal-sheet-hidden');
      });
    },

    closeModal: function () {
      const backdrop = document.getElementById('modal-backdrop');
      const sheet = document.getElementById('modal-sheet');
      if (!sheet || !backdrop) return;

      sheet.classList.add('modal-sheet-hidden');
      setTimeout(() => {
        backdrop.classList.add('modal-backdrop-hidden');
      }, 280);
    },

    send: function (eventName, payload) {
      const message = {
        event: eventName,
        timestamp: Date.now(),
        data: payload || {}
      };

      if (window.AgencyChannel && typeof window.AgencyChannel.postMessage === 'function') {
        try { window.AgencyChannel.postMessage(JSON.stringify(message)); return; } catch (e) {}
      }
      if (window.flutter_inappwebview && typeof window.flutter_inappwebview.callHandler === 'function') {
        try { window.flutter_inappwebview.callHandler(eventName, payload); return; } catch (e) {}
      }
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(message, '*');
      }
      console.log(`[FlutterBridge OUT] ${eventName}:`, payload);
    },

    /* ========================================================================
       ALL BUTTON HANDLERS ACTIVATED
       ======================================================================== */

    // 1. Back Button
    onBack: function () {
      this.send('onBack', { action: 'navigate_back' });
      this.showToast('تم النقر على زر الرجوع');
    },

    // 2. Support Button (سماعة الدعم)
    onSupport: function () {
      this.send('onSupport', { action: 'open_support' });
      this.openModal({
        icon: '🎧',
        title: 'خدمة عملاء ودعم الوكالات',
        bodyHtml: `
          <div class="modal-card-box">
            <p style="margin-bottom:8px;">مرحباً بك في مركز الدعم المباشر لمدراء الوكالات.</p>
            <div class="modal-stat-grid">
              <div class="modal-stat-item">
                <div class="val" style="color:#76D398;">متصل الآن</div>
                <div class="lbl">حالة مدير حسابك</div>
              </div>
              <div class="modal-stat-item">
                <div class="val">&lt; 3 دقائق</div>
                <div class="lbl">متوسط وقت الرد</div>
              </div>
            </div>
          </div>
          <p style="font-size:13px; color:#A59EBA;">يمكنك بدء محادثة فورية لحل أي استفسار متعلق بإيرادات الوكالة أو توثيق المذيعين الجدد.</p>
        `,
        primaryBtnText: 'بدء محادثة فورية مع الدعم',
        onPrimaryClick: () => {
          this.closeModal();
          this.showToast('جاري فتح محادثة الدعم الفني...');
          this.send('onStartSupportChat', { channel: 'live_agent' });
        }
      });
    },

    // 3. Growth Banner Button (بانر نمو الوكالات)
    onBannerClick: function () {
      this.send('onBannerClick', { url: 'agency://growth-guide' });
      this.openModal({
        icon: '📢',
        title: 'دليل نظام نمو الوكالات الشامل',
        bodyHtml: `
          <div class="modal-card-box">
            <h4 style="color:#C487DE; margin-bottom:6px;">خارطة طريق ترقية الوكالة</h4>
            <p style="font-size:13px; line-height:1.7;">
              نظام النمو يمنح وكالتك نقاط خبرة وعمولات إضافية عند تحقيق أهداف البث الشهرية وتفعيل مذيعين نشطين.
            </p>
            <div class="modal-stat-grid">
              <div class="modal-stat-item">
                <div class="val">+25%</div>
                <div class="lbl">مكافأة نمو المستوى</div>
              </div>
              <div class="modal-stat-item">
                <div class="val">1x بطاقة</div>
                <div class="lbl">دعم ترند أسبوعي</div>
              </div>
            </div>
          </div>
        `,
        primaryBtnText: 'عرض مهام خطة النمو',
        onPrimaryClick: () => {
          this.closeModal();
          this.showToast('تم فتح خطة مهام النمو');
        }
      });
    },

    // 4. Copy Code Button
    onCopyCode: function (code) {
      this.send('onCopyCode', { code: code });
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).catch(() => {});
      }
      this.showToast(`تم نسخ كود الوكالة: ${code} بنجاح ✓`);
    },

    // 5. Star Bookmark Button
    onStarToggle: function () {
      this.isBookmarked = !this.isBookmarked;
      this.send('onStarToggle', { bookmarked: this.isBookmarked });
      if (this.isBookmarked) {
        this.showToast('تم حفظ الوكالة في المفضلة ⭐');
      } else {
        this.showToast('تمت إزالة الوكالة من المفضلة');
      }
    },

    // 6. Agency Profile Details (Chevron)
    onProfileChevron: function () {
      this.send('onProfileDetails', { agencyCode: '53529' });
      this.openModal({
        icon: '🏢',
        title: 'تفاصيل ملف الوكالة',
        bodyHtml: `
          <div class="modal-card-box">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span style="color:#A59EBA;">اسم الوكالة:</span>
              <strong style="color:#F5ECF9;">MENA-JDYEFGS</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span style="color:#A59EBA;">كود الوكالة:</span>
              <strong style="color:#F2C762;">53529</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:#A59EBA;">حالة التوثيق:</span>
              <span style="color:#76D398; font-weight:bold;">موثقة رسمياً ✓</span>
            </div>
          </div>
        `,
        primaryBtnText: 'إغلاق'
      });
    },

    // 7. Record Card (أعلى رقم قياسي)
    onRecordCardClick: function () {
      this.send('onRecordCardClick', { target: 'record_history' });
      this.openModal({
        icon: '🏆',
        title: 'سجل الأرقام القياسية للوكالة',
        bodyHtml: `
          <div class="modal-card-box">
            <p style="font-size:13px; margin-bottom:10px;">إحصائيات أعلى رقم قياسي حققته الوكالة منذ التأسيس:</p>
            <div class="modal-stat-grid">
              <div class="modal-stat-item">
                <div class="val" style="color:#F2C762;">0 / 0</div>
                <div class="lbl">الرقم القياسي الحالي</div>
              </div>
              <div class="modal-stat-item">
                <div class="val" style="color:#CFD8DC;">الدرع الماسي</div>
                <div class="lbl">تصنيف الجائزة</div>
              </div>
            </div>
          </div>
          <p style="font-size:12px; color:#A59EBA;">عند تحطيم الرقم القياسي القادم ستحصل الوكالة على شارة ماسية بارزة في لوحة الشرف.</p>
        `,
        primaryBtnText: 'عرض قائمة المتصدرين'
      });
    },

    // 8. Level Card (مستوى الوكالة)
    onLevelCardClick: function () {
      this.send('onLevelCardClick', { target: 'agency_level' });
      this.openModal({
        icon: '⭐',
        title: 'مستوى الوكالة وشروط الترقية',
        bodyHtml: `
          <div class="modal-card-box">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <span>المستوى المستهدف:</span>
              <strong style="color:#F2C762; font-size:16px;">2M كوينز</strong>
            </div>
            <div style="background:#382A6B; height:6px; border-radius:3px; overflow:hidden; margin-bottom:8px;">
              <div style="width:15%; height:100%; background:#76D398;"></div>
            </div>
            <span style="font-size:11px; color:#A59EBA;">تبقى 2,000,000 كوينز للوصول إلى وسام الوكالة الفضية المتقدمة.</span>
          </div>
        `,
        primaryBtnText: 'شروط ومزايا المستويات'
      });
    },

    // 9. Revenue Card (إيرادات الوكالة)
    onRevenueCardClick: function () {
      this.send('onRevenueCardClick', { target: 'revenue_statement' });
      this.openModal({
        icon: '💰',
        title: 'كشف حساب إيرادات الوكالة',
        bodyHtml: `
          <div class="modal-card-box">
            <div class="modal-stat-grid">
              <div class="modal-stat-item">
                <div class="val" style="color:#F2C762;">0 P</div>
                <div class="lbl">إجمالي الإيرادات</div>
              </div>
              <div class="modal-stat-item">
                <div class="val">0 Xcoins</div>
                <div class="lbl">العملات الشهرية</div>
              </div>
            </div>
          </div>
          <p style="font-size:12px; color:#A59EBA;">يتم تحويل أرباح الوكالة تلقائياً في اليوم الأول من كل شهر ميلادي.</p>
        `,
        primaryBtnText: 'تحميل كشف الحساب المفصل (PDF)'
      });
    },

    onSalariedHostsClick: function () {
      this.send('onSalariedHostsClick', {});
      this.openModal({
        icon: '👥',
        title: 'المضيفين برواتب شهرية',
        bodyHtml: `
          <div class="modal-card-box">
            <p style="font-size:13px;">عدد المضيفين المتعاقدين حالياً: <strong>0 مضيف</strong></p>
            <p style="font-size:12px; color:#A59EBA; margin-top:8px;">يمكنك إضافة عقود عمل جديدة للمذيعين المؤهلين لتحفيزهم على البث المنتظم.</p>
          </div>
        `,
        primaryBtnText: 'إضافة عقد مضيف جديد'
      });
    },

    onXcoinsClick: function () {
      this.send('onXcoinsClick', {});
      this.openModal({
        icon: '🪙',
        title: 'محفظة عملات Xcoins الشهرية',
        bodyHtml: `
          <div class="modal-card-box">
            <div style="font-size:24px; font-weight:bold; color:#F2C762; text-align:center; margin:8px 0;">0 Xcoins</div>
            <p style="font-size:12px; text-align:center; color:#A59EBA;">سعر الصرف الحالي: 10,000 Xcoins = $10 USD</p>
          </div>
        `,
        primaryBtnText: 'سحب العملات إلى المحفظة'
      });
    },

    // 10. Services (5 Action Icons)
    onServiceClick: function (serviceId, serviceTitle) {
      this.send('onServiceClick', { serviceId: serviceId, title: serviceTitle });
      
      const contents = {
        academy: {
          icon: '📖',
          title: 'أكاديمية تدريب المذيعين',
          text: 'دروس تفاعلية وفيديوهات تدريبية لتطوير مهارات البث وزيادة التفاعل وجذب الداعمين.'
        },
        policy: {
          icon: '📜',
          title: 'سياسات وقوانين البث والوكالة',
          text: 'دليل القوانين الإرشادية لسياسة المحتوى وتجنب الحظر والحفاظ على أعلى معايير الجودة.'
        },
        review: {
          icon: '🔍',
          title: 'مراجعة طلبات المضيفين',
          text: 'قائمة بطلبات الانضمام الجديدة من المذيعين الراغبين بالانضمام إلى وكالتك قيد المراجعة.'
        },
        invite: {
          icon: '🔗',
          title: 'دعوة مذيعين جدد للوكالة (+8)',
          text: 'شارك رابط الانضمام المباشر الخاص بوكالتك واحصل على عمولات ترحيبية إضافية.'
        },
        management: {
          icon: '⚙️',
          title: 'لوحة إدارة المضيفين (=8)',
          text: 'إدارة كاملة لجميع المضيفين المنضمين للوكالة، تتبع ساعات البث المباشر، والعمولات.'
        }
      };

      const item = contents[serviceId] || { icon: '⚙️', title: serviceTitle, text: 'قسم ' + serviceTitle };

      this.openModal({
        icon: item.icon,
        title: item.title,
        bodyHtml: `
          <div class="modal-card-box">
            <p style="font-size:13.5px; line-height:1.7;">${item.text}</p>
          </div>
        `,
        primaryBtnText: 'الدخول إلى ' + serviceTitle,
        onPrimaryClick: () => {
          this.closeModal();
          this.showToast('فتح: ' + serviceTitle);
        }
      });
    },

    // 11. Active Task Click
    onTaskClick: function (taskId, taskTitle) {
      this.send('onTaskClick', { taskId: taskId, title: taskTitle });
      this.openModal({
        icon: '🎁',
        title: 'تفعيل المهمة الشهرية',
        bodyHtml: `
          <div class="modal-card-box">
            <h4 style="color:#76D398; margin-bottom:8px;">${taskTitle}</h4>
            <p style="font-size:13px; line-height:1.6; color:#D5CCE5;">
              قم بتفعيل مضيف جديد واحد مؤهل للبث خلال هذا الشهر لفتح حزمة الجوائز والمكافآت الحصرية.
            </p>
            <div style="margin-top:12px; padding:10px; background:rgba(189, 132, 185, 0.15); border:1px solid #BD84B9; border-radius:10px;">
              <strong style="color:#BD84B9; font-size:13px;">المكافأة الفورية:</strong>
              <div style="font-size:12.5px; margin-top:4px;">1x بطاقة الزيارات + 1x بطاقة دعم الترند 🔥</div>
            </div>
          </div>
        `,
        primaryBtnText: 'بدء المهمة الآن واستلام الدعم',
        onPrimaryClick: () => {
          this.closeModal();
          this.showToast('تم تفعيل المهمة بنجاح! حظاً موفقاً 🚀');
          this.send('onTaskActivated', { taskId: taskId });
        }
      });
    },

    receiveFromFlutter: function (data) {
      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        if (window.AgencyEngine && typeof window.AgencyEngine.updateDynamicData === 'function') {
          window.AgencyEngine.updateDynamicData(parsed);
        }
      } catch (err) {
        console.error('[FlutterBridge] Error parsing update data:', err);
      }
    },

    showToast: function (message) {
      const toast = document.getElementById('toast');
      const msgEl = document.getElementById('toast-message');
      if (!toast || !msgEl) return;

      msgEl.textContent = message;
      toast.classList.remove('toast-hidden');
      toast.classList.add('toast-visible');

      if (this._toastTimer) clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toast.classList.remove('toast-visible');
        toast.classList.add('toast-hidden');
      }, 2400);
    },

    togglePerfMonitor: function (show) {
      const monitor = document.getElementById('perf-monitor');
      if (!monitor) return;
      if (show === undefined) monitor.classList.toggle('perf-monitor-hidden');
      else if (show) monitor.classList.remove('perf-monitor-hidden');
      else monitor.classList.add('perf-monitor-hidden');
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    FlutterBridge.init();
  });

  window.FlutterBridge = FlutterBridge;
})(window);
