/**
 * ============================================================================
 * VIP HOST INCOME CARD - REUSABLE DROP-IN WIDGET / MODULE
 * Version: 2.0.0 (Production Modular Architecture)
 * 
 * Hardware-Accelerated Dual Canvas Engine (Zero-Idle CPU Power Lifecycle)
 * Responsive auto-scaling (1280 x 885 base aspect ratio: ~1.446)
 * Native Arabic typography, rolling counters, touch ripples, and Flutter bridge
 * ============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.VipHostCard = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Base Virtual Coordinate Space (Matches 1280 x 885 extracted template)
  const BASE_W = 1280;
  const BASE_H = 885;
  const ASPECT_RATIO = BASE_W / BASE_H; // ~1.446327

  // Helper formatting numbers with commas (e.g. 483,800)
  function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Smooth easing for rolling counters
  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  // Injects scoped minimal styles once into document head
  function injectStyles() {
    if (document.getElementById('vip-host-card-widget-styles')) return;
    const style = document.createElement('style');
    style.id = 'vip-host-card-widget-styles';
    style.textContent = `
      .vip-host-card-root {
        position: relative;
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        overflow: hidden;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        box-sizing: border-box;
      }
      .vip-host-card-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: ${((BASE_H / BASE_W) * 100).toFixed(4)}%; /* 69.14% aspect ratio */
      }
      .vip-host-card-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: block;
        pointer-events: none;
      }
      .vip-host-card-canvas.interactive {
        pointer-events: auto;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Main VipHostCard Class
   * @param {string|HTMLElement} target - Container element or CSS selector
   * @param {Object} options - Configuration and data
   */
  class VipHostCard {
    constructor(target, options = {}) {
      this.target = typeof target === 'string' ? document.querySelector(target) : target;
      if (!this.target) {
        throw new Error('[VipHostCard] Target container element not found: ' + target);
      }

      this.options = Object.assign({
        templateUrl: 'static/card_template.png',
        animateNumbers: true,
        pulseCrown: true,
        dprLimit: 2.5,
        labels: {
          deposits: 'إيداعات الوكالة',
          commission: 'عمولة الوكالة',
          deductions: 'خصومات الوقت والمكافآت',
          joinSuffix: '• انضمام'
        },
        icons: {
          avatar: null,
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
        data: {
          hostName: 'The King...',
          genderAge: '♂ 29',
          level: 'H5',
          joinDate: '12/08/2026',
          deposits: 483800,
          commission: 434600,
          deductions: 49200,
          totalXcoins: '3,502,640',
          durationText: '7372 دقيقة & 18 يوم'
        },
        onProfileClick: null,
        onChatClick: null,
        onTransferClick: null,
        onRowClick: null,
        onXcoinsClick: null,
        onDurationClick: null,
        onCrownClick: null
      }, options);

      // Event listener registry
      this._listeners = {};

      // Image Cache
      this._images = {
        template: new Image(),
        avatar: null,
        depositsIcon: null,
        commissionIcon: null,
        deductionsIcon: null,
        coinP: null,
        coinX: null,
        clock: null,
        maleIcon: null,
        crownBadge: null,
        pillFrame: null
      };

      // State
      this._dpr = 1;
      this._scale = 1;
      this._animProgress = { counter: this.options.animateNumbers ? 0 : 1, pulsePhase: 0, ripples: [] };
      this._isRunning = false;
      this._animId = null;
      this._isDestroyed = false;

      // Hit-Box Geometry (Exact coordinates on 1280 x 885)
      this.hitBoxes = [
        { id: 'profile', name: 'الملف التعريفي للمضيف', x: 80, y: 70, w: 750, h: 220, action: 'profile' },
        { id: 'chat_btn', name: 'محادثة المضيف', x: 938, y: 129, w: 106, h: 106, action: 'chat' },
        { id: 'transfer_btn', name: 'تحويل كوينز للمضيف', x: 1077, y: 129, w: 104, h: 104, action: 'transfer' },
        { id: 'row_deposits', name: 'إيداعات الوكالة', x: 110, y: 310, w: 1060, h: 110, action: 'row_deposits' },
        { id: 'row_commission', name: 'عمولة الوكالة', x: 110, y: 420, w: 1060, h: 110, action: 'row_commission' },
        { id: 'row_deductions', name: 'خصومات الوقت والمكافآت', x: 110, y: 530, w: 1060, h: 110, action: 'row_deductions' },
        { id: 'stat_xcoins', name: 'محفظة عملات Xcoins', x: 110, y: 685, w: 510, h: 110, action: 'xcoins' },
        { id: 'stat_duration', name: 'ساعات البث والأيام النشطة', x: 650, y: 685, w: 520, h: 110, action: 'duration' },
        { id: 'crest_crown', name: 'تاج الوكالة الملكي والجمشت', x: 580, y: 780, w: 120, h: 80, action: 'crown' }
      ];

      injectStyles();
      this._buildDOM();
      this._preloadImages();
      this._bindEvents();
    }

    /**
     * Builds DOM wrapper and Dual Canvas layers inside container
     */
    _buildDOM() {
      this.root = document.createElement('div');
      this.root.className = 'vip-host-card-root';

      this.aspectContainer = document.createElement('div');
      this.aspectContainer.className = 'vip-host-card-container';

      // Layer 1: Static Layer (GPU rendered once)
      this.staticCanvas = document.createElement('canvas');
      this.staticCanvas.className = 'vip-host-card-canvas';
      this.sCtx = this.staticCanvas.getContext('2d', { alpha: true });

      // Layer 2: Dynamic Interactive Layer (Rolling numbers, ripples, pulse)
      this.dynamicCanvas = document.createElement('canvas');
      this.dynamicCanvas.className = 'vip-host-card-canvas interactive';
      this.dCtx = this.dynamicCanvas.getContext('2d', { alpha: true });

      this.aspectContainer.appendChild(this.staticCanvas);
      this.aspectContainer.appendChild(this.dynamicCanvas);
      this.root.appendChild(this.aspectContainer);
      this.target.appendChild(this.root);

      this.resize();
    }

    /**
     * Preloads all required assets
     */
    _preloadImages() {
      // 1. Template Image (Core Base)
      this._images.template.src = this.options.templateUrl;
      this._images.template.onload = () => {
        this.renderStatic();
        this.requestDynamicFrame();
      };

      // 2. Optional Host Avatar
      if (this.options.data.avatarUrl) {
        this._loadSubImage('avatar', this.options.data.avatarUrl);
      }

      // 3. Row Icons, Coins, and Badges
      if (this.options.icons) {
        if (this.options.icons.deposits) this._loadSubImage('depositsIcon', this.options.icons.deposits);
        if (this.options.icons.commission) this._loadSubImage('commissionIcon', this.options.icons.commission);
        if (this.options.icons.deductions) this._loadSubImage('deductionsIcon', this.options.icons.deductions);
        if (this.options.icons.coinP) this._loadSubImage('coinP', this.options.icons.coinP);
        if (this.options.icons.coinX) this._loadSubImage('coinX', this.options.icons.coinX);
        if (this.options.icons.clock) this._loadSubImage('clock', this.options.icons.clock);
        if (this.options.icons.male) this._loadSubImage('maleIcon', this.options.icons.male);
        if (this.options.icons.crownBadge) this._loadSubImage('crownBadge', this.options.icons.crownBadge);
        if (this.options.icons.pillFrame) this._loadSubImage('pillFrame', this.options.icons.pillFrame);
      }
    }

    _loadSubImage(key, url) {
      if (!url) return;
      const img = new Image();
      img.src = url;
      img.onload = () => {
        this._images[key] = img;
        this.renderStatic();
      };
    }

    /**
     * Handles responsive sizing and High-DPI Canvas scaling
     */
    resize() {
      if (this._isDestroyed) return;
      const rect = this.aspectContainer.getBoundingClientRect();
      const w = Math.max(rect.width, 240);
      const h = Math.round(w / ASPECT_RATIO);

      this._dpr = Math.min(window.devicePixelRatio || 1, this.options.dprLimit);
      this._scale = w / BASE_W;

      this.staticCanvas.width = Math.round(w * this._dpr);
      this.staticCanvas.height = Math.round(h * this._dpr);
      this.dynamicCanvas.width = Math.round(w * this._dpr);
      this.dynamicCanvas.height = Math.round(h * this._dpr);

      const renderScale = this._scale * this._dpr;
      this.sCtx.setTransform(renderScale, 0, 0, renderScale, 0, 0);
      this.dCtx.setTransform(renderScale, 0, 0, renderScale, 0, 0);

      this.renderStatic();
      this.requestDynamicFrame();
    }

    /**
     * Render Static Layer (Background Template, Avatar, Labels, Icons)
     * Executed ONCE on load/data update - 0% CPU consumption during idle
     */
    renderStatic() {
      if (this._isDestroyed || !this.sCtx) return;
      const ctx = this.sCtx;
      ctx.clearRect(0, 0, BASE_W, BASE_H);

      // 1. Draw Base Template Image
      if (this._images.template.complete && this._images.template.naturalWidth > 0) {
        ctx.drawImage(this._images.template, 0, 0, BASE_W, BASE_H);
      }

      // 2. Draw Host Avatar (Clipped to circular frame at 197.5, 179.5, r=91)
      if (this._images.avatar && this._images.avatar.complete && this._images.avatar.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(197.5, 179.5, 91, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(this._images.avatar, 197.5 - 91, 179.5 - 91, 182, 182);
        ctx.restore();
      }

      // 3. Draw Profile Info
      this._renderProfileHeader(ctx);

      // 4. Draw Row Labels & Icons
      this._renderRows(ctx);

      // 5. Draw Bottom Bar Static Labels & Icons
      this._renderBottomBar(ctx);
    }

    /**
     * Helper to render a 3-sliced luxury gold pill frame with royal purple fill
     */
    _drawPill(ctx, x, y, w, h, bgFill = 'rgba(38, 10, 64, 0.88)') {
      ctx.save();
      const r = h / 2;
      ctx.fillStyle = bgFill;
      ctx.beginPath();
      ctx.roundRect(x + 2, y + 2, w - 4, h - 4, r - 2);
      ctx.fill();

      if (this._images.pillFrame && this._images.pillFrame.complete && this._images.pillFrame.naturalWidth > 0) {
        const pf = this._images.pillFrame;
        const origW = pf.naturalWidth;
        const origH = pf.naturalHeight;
        const capW = Math.round(origH / 2);
        const tCapW = Math.round(h / 2);
        const tCenterW = Math.max(1, w - 2 * tCapW);

        // Left cap
        ctx.drawImage(pf, 0, 0, capW, origH, x, y, tCapW, h);
        // Center stretch
        ctx.drawImage(pf, capW, 0, origW - 2 * capW, origH, x + tCapW, y, tCenterW, h);
        // Right cap
        ctx.drawImage(pf, origW - capW, 0, capW, origH, x + tCapW + tCenterW, y, tCapW, h);
      } else {
        ctx.strokeStyle = '#F7E5A9';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();
    }

    _renderProfileHeader(ctx) {
      const d = this.options.data;

      // 1. Host Name
      ctx.save();
      ctx.font = 'bold 44px "Outfit", "Cairo", sans-serif';
      ctx.fillStyle = '#FFF8E7';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(242, 200, 95, 0.45)';
      ctx.shadowBlur = 8;
      const hostName = d.hostName || 'The King...';
      ctx.fillText(hostName, 320, 155);
      const nameW = ctx.measureText(hostName).width;

      // 2. Badge 1: Gender & Age (Gold pill + 3D Male icon + Age)
      const ageNum = (d.genderAge || d.age || '29').toString().replace(/[^\d]/g, '') || '29';
      ctx.font = 'bold 28px "Outfit", "Cairo", sans-serif';
      ctx.shadowBlur = 0;
      const ageW = ctx.measureText(ageNum).width;
      
      const badgeH = 46;
      const badge1Y = 155 - Math.round(badgeH / 2); // 132
      const badge1X = 320 + nameW + 18;
      const badge1W = Math.max(105, Math.round(44 + ageW + 28));

      this._drawPill(ctx, badge1X, badge1Y, badge1W, badgeH);

      // Draw 3D Male Icon inside Badge 1
      const iconMale = this._images.maleIcon;
      if (iconMale && iconMale.complete && iconMale.naturalWidth > 0) {
        const mSize = 34;
        ctx.drawImage(iconMale, badge1X + 7, badge1Y + Math.round((badgeH - mSize) / 2), mSize, mSize);
      } else {
        ctx.fillStyle = '#F7E5A9';
        ctx.font = 'bold 26px "Outfit", sans-serif';
        ctx.fillText('♂', badge1X + 16, 156);
      }

      // Draw Age text inside Badge 1
      ctx.font = 'bold 28px "Outfit", "Cairo", sans-serif';
      ctx.fillStyle = '#FFF8E7';
      ctx.textAlign = 'center';
      ctx.fillText(ageNum, badge1X + 44 + ageW / 2, 156);

      // 3. Badge 2: Level & Royal Crown Crystal (Gold pill + H5 + Crown badge)
      const levelText = d.level || 'H5';
      ctx.font = 'bold italic 28px "Cinzel", "Outfit", "Times New Roman", serif';
      const lvlW = ctx.measureText(levelText).width;
      
      const badge2X = badge1X + badge1W + 16;
      const crownAspect = 1622 / 1939; // ~0.8365
      const crownH = 66;
      const crownW = Math.round(crownH * crownAspect); // 55
      const badge2W = Math.max(122, Math.round(lvlW + 26 + 46));

      this._drawPill(ctx, badge2X, badge1Y, badge2W, badgeH);

      // Level text inside Badge 2
      ctx.font = 'bold italic 28px "Cinzel", "Outfit", "Times New Roman", serif';
      ctx.fillStyle = '#F7E5A9';
      ctx.textAlign = 'left';
      ctx.shadowColor = 'rgba(242, 200, 95, 0.4)';
      ctx.shadowBlur = 4;
      ctx.fillText(levelText, badge2X + 20, 156);

      // 3D Royal Crown Crystal Badge on right
      const crownImg = this._images.crownBadge;
      if (crownImg && crownImg.complete && crownImg.naturalWidth > 0) {
        ctx.drawImage(crownImg, badge2X + badge2W - crownW + 6, 155 - Math.round(crownH / 2), crownW, crownH);
      }

      // 4. Join Date & Text
      const joinStr = `${d.joinDate || '12/08/2026'} ${this.options.labels.joinSuffix}`;
      ctx.font = '500 28px "Cairo", "Outfit", sans-serif';
      ctx.fillStyle = '#A59EBA';
      ctx.textAlign = 'left';
      ctx.shadowBlur = 0;
      ctx.fillText(joinStr, 320, 218);
      ctx.restore();
    }

    _renderRows(ctx) {
      const labels = this.options.labels;

      // Row 1: Deposits
      this._renderSingleRow(ctx, {
        y: 365,
        icon: this._images.depositsIcon,
        label: labels.deposits,
        fallbackGlyph: '🪙'
      });

      // Row 2: Commission
      this._renderSingleRow(ctx, {
        y: 475,
        icon: this._images.commissionIcon,
        label: labels.commission,
        fallbackGlyph: '🛡️'
      });

      // Row 3: Deductions
      this._renderSingleRow(ctx, {
        y: 583,
        icon: this._images.deductionsIcon,
        label: labels.deductions,
        fallbackGlyph: '⏱️'
      });
    }

    _renderSingleRow(ctx, { y, icon, label, fallbackGlyph }) {
      ctx.save();
      // Left Icon in circle (center at x=186, size 82x82)
      if (icon && icon.complete && icon.naturalWidth > 0) {
        ctx.drawImage(icon, 186 - 41, y - 41, 82, 82);
      }

      // Row Arabic Label
      ctx.font = 'bold 34px "Cairo", "Outfit", sans-serif';
      ctx.fillStyle = '#FFF8E7';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(242, 200, 95, 0.3)';
      ctx.shadowBlur = 6;
      ctx.fillText(label, 255, y);

      // Right (P) Coin (center at x=908)
      if (this._images.coinP && this._images.coinP.complete && this._images.coinP.naturalWidth > 0) {
        ctx.drawImage(this._images.coinP, 908 - 27, y - 27, 54, 54);
      }
      ctx.restore();
    }

    _renderBottomBar(ctx) {
      ctx.save();
      const y = 740;

      // 1. Coin X (center at x=165, size 60x60)
      if (this._images.coinX && this._images.coinX.complete && this._images.coinX.naturalWidth > 0) {
        ctx.drawImage(this._images.coinX, 165 - 30, y - 30, 60, 60);
      }

      // 2. Clock Icon (center at x=705, size 60x60)
      if (this._images.clock && this._images.clock.complete && this._images.clock.naturalWidth > 0) {
        ctx.drawImage(this._images.clock, 705 - 30, y - 30, 60, 60);
      }

      // 3. Duration & Active Days Text (starts at x=750)
      ctx.font = 'bold 31px "Cairo", "Outfit", sans-serif';
      ctx.fillStyle = '#FFF8E7';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(242, 200, 95, 0.35)';
      ctx.shadowBlur = 6;
      ctx.fillText(this.options.data.durationText || '', 750, y);
      ctx.restore();
    }

    /**
     * Render Dynamic Layer (Rolling Counters, Gem Pulse, Ripples)
     */
    renderDynamic() {
      if (this._isDestroyed || !this.dCtx) return;
      const ctx = this.dCtx;
      ctx.clearRect(0, 0, BASE_W, BASE_H);

      const t = this._animProgress.counter;
      const easedT = easeOutExpo(t);
      const d = this.options.data;

      // Numeric Values
      const curDeposits = Math.round((d.deposits || 0) * easedT);
      const curCommission = Math.round((d.commission || 0) * easedT);
      const curDeductions = Math.round((d.deductions || 0) * easedT);

      ctx.save();
      ctx.font = 'bold 42px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = '#FFF8E7';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(242, 200, 95, 0.5)';
      ctx.shadowBlur = 7;

      // Row Values (positioned next to P coin at x=955)
      ctx.fillText(formatNumber(curDeposits), 958, 365);
      ctx.fillText(formatNumber(curCommission), 958, 475);
      ctx.fillText(formatNumber(curDeductions), 958, 583);

      // Bottom Left: Total Xcoins
      ctx.font = 'bold 44px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(d.totalXcoins || '0', 215, 740);
      ctx.restore();

      // Touch Ripples
      this._renderRipples(ctx);

      // Amethyst Crown Pulse
      if (this.options.pulseCrown) {
        this._renderCrownPulse(ctx);
      }
    }

    _renderCrownPulse(ctx) {
      this._animProgress.pulsePhase += 0.045;
      const pulseAlpha = 0.25 + 0.18 * Math.sin(this._animProgress.pulsePhase);
      const gemX = 638;
      const gemY = 798;

      ctx.save();
      const glow = ctx.createRadialGradient(gemX, gemY, 2, gemX, gemY, 24);
      glow.addColorStop(0, `rgba(224, 64, 251, ${pulseAlpha * 1.6})`);
      glow.addColorStop(0.5, `rgba(156, 39, 176, ${pulseAlpha})`);
      glow.addColorStop(1, 'rgba(56, 0, 107, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(gemX, gemY, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    _renderRipples(ctx) {
      const ripples = this._animProgress.ripples;
      if (ripples.length === 0) return;

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += 5.5;
        rip.alpha -= 0.045;

        if (rip.alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(247, 229, 169, ${rip.alpha})`;
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#F2C85F';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();
      }
    }

    /**
     * Animation Loop & Zero-Idle Power Management
     */
    _loop() {
      if (!this._isRunning || this._isDestroyed) return;

      if (this._animProgress.counter < 1) {
        this._animProgress.counter += 0.035;
        if (this._animProgress.counter > 1) this._animProgress.counter = 1;
      }

      this.renderDynamic();

      // Zero-Idle: Stop animation loop once counter completes and ripples finish
      if (this._animProgress.counter >= 1 && this._animProgress.ripples.length === 0 && !this.options.pulseCrown) {
        this._isRunning = false;
        this._animId = null;
        return;
      }

      this._animId = requestAnimationFrame(() => this._loop());
    }

    requestDynamicFrame() {
      if (!this._isRunning && !this._isDestroyed) {
        this._isRunning = true;
        this._animId = requestAnimationFrame(() => this._loop());
      }
    }

    /**
     * Pointer & Touch Dispatcher
     */
    _handlePointer(clientX, clientY) {
      const rect = this.dynamicCanvas.getBoundingClientRect();
      const clickX = ((clientX - rect.left) / rect.width) * BASE_W;
      const clickY = ((clientY - rect.top) / rect.height) * BASE_H;

      for (const box of this.hitBoxes) {
        if (clickX >= box.x && clickX <= box.x + box.w && clickY >= box.y && clickY <= box.y + box.h) {
          // Touch ripple
          this._animProgress.ripples.push({ x: clickX, y: clickY, radius: 10, alpha: 0.95 });
          this.requestDynamicFrame();

          // Dispatch Event / Callback
          this._dispatchAction(box.action, box);
          return;
        }
      }
    }

    _dispatchAction(action, box) {
      const data = Object.assign({}, this.options.data);
      this._emit(action, { action, box, data });

      // Direct callback handlers
      switch (action) {
        case 'profile':
          if (this.options.onProfileClick) this.options.onProfileClick(data);
          break;
        case 'chat':
          if (this.options.onChatClick) this.options.onChatClick(data);
          break;
        case 'transfer':
          if (this.options.onTransferClick) this.options.onTransferClick(data);
          break;
        case 'row_deposits':
        case 'row_commission':
        case 'row_deductions':
          const rowKey = action.replace('row_', '');
          if (this.options.onRowClick) this.options.onRowClick(rowKey, data);
          break;
        case 'xcoins':
          if (this.options.onXcoinsClick) this.options.onXcoinsClick(data);
          break;
        case 'duration':
          if (this.options.onDurationClick) this.options.onDurationClick(data);
          break;
        case 'crown':
          if (this.options.onCrownClick) this.options.onCrownClick(data);
          break;
      }

      // Forward to Flutter WebView Bridge if available
      if (window.FlutterBridge && typeof window.FlutterBridge.send === 'function') {
        window.FlutterBridge.send(action, { id: box.id, name: box.name, data });
      }
    }

    _bindEvents() {
      this._pointerHandler = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        this._handlePointer(clientX, clientY);
      };

      this.dynamicCanvas.addEventListener('pointerdown', this._pointerHandler);

      // Resize Observer for 100% fluid responsive scaling
      if (typeof ResizeObserver !== 'undefined') {
        this._resizeObserver = new ResizeObserver(() => this.resize());
        this._resizeObserver.observe(this.target);
      } else {
        this._windowResizeHandler = () => this.resize();
        window.addEventListener('resize', this._windowResizeHandler);
      }
    }

    /**
     * Public API: Updates data and animates to new values
     * @param {Object} newData - Partial or full data updates
     */
    updateData(newData) {
      if (this._isDestroyed) return;
      Object.assign(this.options.data, newData);
      if (newData.avatarUrl) {
        this._loadSubImage('avatar', newData.avatarUrl);
      }
      this._animProgress.counter = 0;
      this.renderStatic();
      this.requestDynamicFrame();
    }

    /**
     * Public API: Register custom event listener
     */
    on(event, callback) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(callback);
      return this;
    }

    _emit(event, payload) {
      if (this._listeners[event]) {
        this._listeners[event].forEach(fn => fn(payload));
      }
      if (this._listeners['*']) {
        this._listeners['*'].forEach(fn => fn(event, payload));
      }
    }

    /**
     * Public API: Destroy and cleanup
     */
    destroy() {
      this._isDestroyed = true;
      if (this._animId) cancelAnimationFrame(this._animId);
      if (this._resizeObserver) this._resizeObserver.disconnect();
      if (this._windowResizeHandler) window.removeEventListener('resize', this._windowResizeHandler);
      if (this.dynamicCanvas && this._pointerHandler) {
        this.dynamicCanvas.removeEventListener('pointerdown', this._pointerHandler);
      }
      if (this.root && this.root.parentNode) {
        this.root.parentNode.removeChild(this.root);
      }
      this._listeners = {};
    }
  }

  return VipHostCard;
}));
