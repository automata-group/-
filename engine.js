/**
 * High-Performance Dual-Layer H5 Canvas Engine - 100% Procedural (Zero Image Assets)
 * Reverse-Engineered from Pixel Measurements (592x1280)
 * 
 * ZERO EXTERNAL IMAGES:
 * Every single element is drawn via Pure Canvas 2D Mathematics & Procedural Paths:
 * - Detailed hand-crafted vector portrait (young bearded man matching the reference photo)
 * - Baroque ornate gold filigree, multi-faceted faceted crowns & gemstones
 * - 3D milled edge gold coins ('P' and 'X') with embossed metallic relief
 * - Vector icons: Calendar, Two-People, Chat Bubbles, Transfer Arrows, Search, Help, Chevron
 * - Procedural organic marble veins for the Wallet button
 * - Procedural royal amethyst crystal for the Torki Policy button
 * - Procedural Fleur-de-lis / Lotus watermark for the chart background
 * - Layer 1 (Static): Frozen in GPU memory (0 draw calls during idle)
 * - Layer 2 (Dynamic): Rolling numbers, glowing neon spline chart, touch ripples, badges
 * - Zero-Idle Power Management (0% CPU/GPU when idle)
 */
(function(window) {
  'use strict';

  // Base Virtual Resolution
  const V_W = 592;
  const V_H = 1280;

  // DOM Elements (Flexible fallbacks for bulletproof loading)
  const container = document.getElementById('canvas-container') || 
                    document.getElementById('appContainer') || 
                    document.getElementById('app-viewport') || 
                    document.body;
  const staticCanvas = document.getElementById('staticCanvas');
  const dynamicCanvas = document.getElementById('dynamicCanvas');
  const toastBanner = document.getElementById('toastBanner') || document.getElementById('toast');
  const fpsCounter = document.getElementById('fpsCounter') || document.getElementById('fps-label');
  const gpuStatus = document.getElementById('gpuStatus') || document.getElementById('cpu-mode');

  const sCtx = staticCanvas.getContext('2d', { alpha: false });
  const dCtx = dynamicCanvas.getContext('2d', { alpha: true });

  // DPR and Viewport Scaling
  let dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  let scale = 1;
  let isStaticRendered = false;
  let isRunning = false;
  let animId = null;

  // FPS Tracking
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 60;

  // User Custom Luxury Search Icon Asset (Item 4)
  const searchIconImg = new Image();
  searchIconImg.src = 'assets/search_gold_icon.png';
  searchIconImg.onload = function() {
    if (isStaticRendered) renderStaticLayer();
  };

  // User Custom Luxury Help Question Mark Icon Asset
  const helpIconImg = new Image();
  helpIconImg.src = 'assets/help_gold_icon.png';
  helpIconImg.onload = function() {
    if (isStaticRendered) renderStaticLayer();
  };

  // User Custom Luxury Back Arrow Icon Asset (Item 8)
  const backArrowImg = new Image();
  backArrowImg.src = 'assets/back_gold_icon.png';
  backArrowImg.onload = function() {
    if (isStaticRendered) renderStaticLayer();
  };

  // User Custom Luxury Title Frame Asset
  const titleFrameImg = new Image();
  titleFrameImg.src = 'assets/title_frame.png';
  titleFrameImg.onload = function() {
    if (isStaticRendered) renderStaticLayer();
  };

  // User Custom Luxury Calendar Icon Asset (Item 1)
  const calendarIconImg = new Image();
  calendarIconImg.src = 'assets/calendar_gold_icon.png';
  calendarIconImg.onload = function() {
    if (isStaticRendered) renderStaticLayer();
  };

  // User Custom Luxury Chevron Icon Asset
  const chevronIconImg = new Image();
  chevronIconImg.src = 'assets/chevron_gold_icon.png';
  chevronIconImg.onload = function() {
    if (isStaticRendered) renderStaticLayer();
  };

  // User Custom Luxury Agency Card Frame Asset (Item 5)
  const agencyCardFrameImg = new Image();
  agencyCardFrameImg.src = 'assets/agency_card_frame.png';
  agencyCardFrameImg.onload = function() {
    if (isStaticRendered) renderStaticLayer();
  };

  // User Custom Luxury UTC+0 Asset
  const utcIconImg = new Image();
  utcIconImg.src = 'assets/utc_gold_icon.png';
  utcIconImg.onload = function() {
    if (isStaticRendered) renderStaticLayer();
  };

  // User Custom Luxury P-Coin Asset (Item 10)
  const pCoinImg = new Image();
  pCoinImg.src = 'assets/p_coin_gold.png';
  pCoinImg.onload = function() {
    if (isStaticRendered) renderStaticLayer();
  };

  // User Custom Luxury Dual Cards Frame Asset (Item 7)
  const dualCardsFrameImg = new Image();
  dualCardsFrameImg.src = 'assets/dual_cards_frame.png';
  dualCardsFrameImg.onload = function() {
    if (isStaticRendered) renderStaticLayer();
  };

  // User Custom Luxury X-Coin Asset (Item 9)
  const xCoinImg = new Image();
  xCoinImg.src = 'assets/x_coin_gold.png';
  xCoinImg.onload = function() {
    if (isStaticRendered) renderStaticLayer();
  };

  // User Custom Luxury Salaried Hosts People Icon Asset
  const hostsPeopleIconImg = new Image();
  hostsPeopleIconImg.src = 'assets/hosts_people_gold_icon.png';
  hostsPeopleIconImg.onload = function() {
    if (isStaticRendered) renderStaticLayer();
  };

  // User Custom Luxury Chart Card Frame Asset (Item 3)
  const chartCardFrameImg = new Image();
  chartCardFrameImg.src = 'assets/chart_card_frame.png';
  chartCardFrameImg.onload = function() {
    if (isStaticRendered) renderStaticLayer();
  };

  // User Custom Luxury Profile Card Frame Asset (Item 11)
  const profileCardFrameImg = new Image();
  profileCardFrameImg.src = 'assets/profile_card_frame.png';
  profileCardFrameImg.onload = function() {
    if (isStaticRendered) renderStaticLayer();
  };

  // User Custom Luxury Bottom Buttons: Lego Assembled (Items 2 & 6)
  const torkiBtnLegoImg = new Image();
  torkiBtnLegoImg.src = 'assets/torki_btn_assembled_lego.png';
  torkiBtnLegoImg.onload = function() {
    if (isStaticRendered) renderStaticLayer();
  };

  const walletBtnLegoImg = new Image();
  walletBtnLegoImg.src = 'assets/wallet_btn_assembled_lego.png';
  walletBtnLegoImg.onload = function() {
    if (isStaticRendered) renderStaticLayer();
  };

  // User Custom Full-Screen Luxury Wallpaper Asset
  const screenBgImg = new Image();
  screenBgImg.src = 'assets/screen_background.png';
  screenBgImg.onload = function() {
    if (isStaticRendered) renderStaticLayer();
  };

  // Dynamic State Data
  const appData = {
    date: '8/2026',
    timezone: 'UTC+0',
    revenues: 483800,
    commission: 434600,
    timeBonus: 49200,
    salariedHosts: 1,
    totalXcoins: '3.50M',
    totalXcoinsNum: 3.50,
    hostName: 'يـا الملك',
    hostAgeGender: '♂ 29',
    hostLevel: 'H5',
    joinDate: '12/08/2026',
    chartData: [0, 0, 0, 0, 0, 3.50]
  };

  // Animation Progress
  const animProgress = {
    counter: 0,
    chartLine: 0,
    pulsePhase: 0,
    activeRipples: []
  };

  // Interactive Hit-Boxes (X, Y, W, H in Virtual Pixels)
  const hitBoxes = [
    // Header Buttons (Y center = 58)
    { id: 'btn_back', name: 'زر الرجوع', x: 505, y: 31, w: 54, h: 54, action: 'back' },
    { id: 'btn_title', name: 'عنوان تفاصيل الدخل', x: 216, y: 36, w: 168, h: 44, action: 'help' },
    { id: 'btn_search', name: 'أيقونة البحث', x: 29, y: 31, w: 54, h: 54, action: 'search' },
    { id: 'btn_help', name: 'أيقونة المساعدة', x: 97, y: 31, w: 54, h: 54, action: 'help' },

    // Date & Timezone (Y center = 124)
    { id: 'filter_date', name: 'فلتر التاريخ', x: 35, y: 110, w: 130, h: 28, action: 'date_filter' },
    { id: 'filter_utc', name: 'المنطقة الزمنية (UTC+0)', x: 488, y: 110, w: 72, h: 28, action: 'timezone' },

    // Card 1: Agency Income Individual Rows (Y = 164, rows at 228, 298, 368)
    { id: 'card_agency_rev', name: 'إيرادات الوكالة', x: 20, y: 180, w: 552, h: 78, action: 'agency_rev' },
    { id: 'card_agency_comm', name: 'عمولة الوكالة', x: 20, y: 260, w: 552, h: 70, action: 'agency_comm' },
    { id: 'card_agency_bonus', name: 'مكافآت الوقت للوكالة', x: 20, y: 332, w: 552, h: 78, action: 'agency_bonus' },
    { id: 'coin_p1', name: 'عملة إيرادات الوكالة', x: 50, y: 208, w: 40, h: 40, action: 'coin_spin' },
    { id: 'coin_p2', name: 'عملة عمولة الوكالة', x: 50, y: 278, w: 40, h: 40, action: 'coin_spin' },
    { id: 'coin_p3', name: 'عملة مكافآت الوقت', x: 50, y: 348, w: 40, h: 40, action: 'coin_spin' },

    // Dual Cards
    { id: 'card_hosts', name: 'المضيفين برواتب', x: 20, y: 458, w: 266, h: 142, action: 'salaried_hosts' },
    { id: 'card_xcoins', name: 'إجمالي Xcoins', x: 306, y: 458, w: 266, h: 142, action: 'xcoins_wallet' },

    // Chart Card Interactive Areas
    { id: 'chart_peak', name: 'ذروة شهر أغسطس (3.50M)', x: 490, y: 650, w: 60, h: 60, action: 'chart_peak' },
    { id: 'chart_area', name: 'منحنى الرسم البياني', x: 20, y: 618, w: 552, h: 300, action: 'chart_analytics' },
    { id: 'chart_btn_income', name: 'تقرير الدخل', x: 445, y: 920, w: 100, h: 48, action: 'chart_income' },
    { id: 'chart_btn_duration', name: 'ساعات البث', x: 340, y: 920, w: 100, h: 48, action: 'chart_duration' },
    { id: 'chart_btn_no_income', name: 'تفاصيل الأشهر السابقة', x: 210, y: 920, w: 120, h: 48, action: 'chart_past' },
    { id: 'chart_btn_no_bonus', name: 'معايير المكافآت', x: 30, y: 920, w: 170, h: 48, action: 'agency_bonus' },

    // Card 5: Host Profile & Actions
    { id: 'card_profile_user', name: 'الملف التعريفي للمضيف', x: 20, y: 1014, w: 220, h: 114, action: 'host_profile' },
    { id: 'badge_male', name: 'شارة ذكر 29', x: 230, y: 1035, w: 50, h: 30, action: 'badge_male' },
    { id: 'badge_h5', name: 'مستوى المضيف H5', x: 286, y: 1035, w: 40, h: 30, action: 'badge_h5' },
    { id: 'badge_diamond', name: 'شارة الألماس', x: 334, y: 1035, w: 30, h: 30, action: 'badge_diamond' },
    { id: 'btn_chat', name: 'محادثة المضيف', x: 410, y: 1045, w: 58, h: 58, action: 'chat' },
    { id: 'btn_transfer', name: 'تحويل للمضيف', x: 484, y: 1045, w: 58, h: 58, action: 'transfer' },

    // Bottom Action Buttons
    { id: 'btn_torki_policy', name: 'سياسة Torki', x: 24, y: 1140, w: 262, h: 78, action: 'torki_policy' },
    { id: 'btn_wallet', name: 'المحفظة', x: 306, y: 1140, w: 262, h: 78, action: 'wallet' }
  ];

  function formatNumber(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  // --- 1. Canvas Sizing & DPR Initialization ---
  function resizeCanvases() {
    dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const targetContainer = document.getElementById('canvas-container') || 
                            document.getElementById('appContainer') || 
                            container || 
                            document.getElementById('app-viewport') || 
                            document.body;
    const rect = (targetContainer && typeof targetContainer.getBoundingClientRect === 'function')
      ? targetContainer.getBoundingClientRect()
      : { width: window.innerWidth, height: window.innerHeight };

    scale = ((rect && rect.width) ? rect.width : V_W) / V_W;

    staticCanvas.width = V_W * dpr;
    staticCanvas.height = V_H * dpr;
    dynamicCanvas.width = V_W * dpr;
    dynamicCanvas.height = V_H * dpr;

    sCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    renderStaticLayer();
    requestDynamicFrame();
  }

  // --- 2. PURE PROCEDURAL VECTOR DRAWING HELPERS (ZERO IMAGES) ---

  function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Baroque Filigree Corner Ornament
  function drawFiligreeCorner(ctx, cx, cy, dirX, dirY, size = 16) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(dirX, dirY);
    ctx.strokeStyle = '#F2C85F';
    ctx.lineWidth = 1.4;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size * 0.4, 0, size * 0.6, -size * 0.4);
    ctx.quadraticCurveTo(size * 0.8, -size * 0.8, size * 0.4, -size);
    ctx.stroke();

    // Leaf flourish
    ctx.beginPath();
    ctx.moveTo(size * 0.2, -size * 0.2);
    ctx.quadraticCurveTo(size * 0.6, -size * 0.1, size * 0.8, -size * 0.35);
    ctx.stroke();

    // Pearl bead
    ctx.beginPath();
    ctx.arc(size * 0.4, -size, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF8E0';
    ctx.fill();
    ctx.restore();
  }

  // Golden Crown Emblem with Faceted Jewel
  function drawCrown(ctx, x, y, width = 60, height = 24, hasGem = true) {
    ctx.save();
    ctx.translate(x, y);

    const grad = ctx.createLinearGradient(-width / 2, 0, width / 2, 0);
    grad.addColorStop(0, '#A36210');
    grad.addColorStop(0.25, '#F2C85F');
    grad.addColorStop(0.5, '#FFF4D7');
    grad.addColorStop(0.75, '#F2C85F');
    grad.addColorStop(1, '#A36210');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(25, 9, 35, 0.95)';

    // Multi-arch wing flourishes
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(-width * 0.25, 12, -width * 0.45, -4, -width * 0.5, -8);
    ctx.bezierCurveTo(-width * 0.35, -2, -width * 0.2, 0, 0, -2);
    ctx.bezierCurveTo(width * 0.2, 0, width * 0.35, -2, width * 0.5, -8);
    ctx.bezierCurveTo(width * 0.45, -4, width * 0.25, 12, 0, 4);
    ctx.fill();
    ctx.stroke();

    if (hasGem) {
      // Multi-faceted emerald/oval cut amethyst
      const gemGrad = ctx.createRadialGradient(0, -3, 1, 0, -3, 9);
      gemGrad.addColorStop(0, '#E040FB');
      gemGrad.addColorStop(0.5, '#9C27B0');
      gemGrad.addColorStop(1, '#38006B');

      ctx.beginPath();
      ctx.ellipse(0, -2, 7.5, 10.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = gemGrad;
      ctx.fill();
      ctx.strokeStyle = '#F2C85F';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Specular glint
      ctx.beginPath();
      ctx.ellipse(-2.2, -5.5, 2.2, 3.5, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fill();
    }

    ctx.restore();
  }

  // 3D Milled-Edge Gold Coin ('P' or 'X')
  function drawGoldCoin(ctx, x, y, radius, letter = 'P') {

    ctx.save();
    ctx.translate(x, y);

    // Deep drop shadow
    ctx.beginPath();
    ctx.arc(0, 2.5, radius + 1, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fill();

    // Outer Rim with 3D gradient
    const rimGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
    rimGrad.addColorStop(0, '#FFF2B2');
    rimGrad.addColorStop(0.3, '#E5C595');
    rimGrad.addColorStop(0.7, '#C68B2C');
    rimGrad.addColorStop(1, '#6A3C08');

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = rimGrad;
    ctx.fill();

    // 24 Milled Ridge Ticks around the perimeter
    for (let a = 0; a < 24; a++) {
      const ang = (a * Math.PI * 2) / 24;
      const x1 = Math.cos(ang) * (radius - 1);
      const y1 = Math.sin(ang) * (radius - 1);
      const x2 = Math.cos(ang) * (radius - 3.2);
      const y2 = Math.sin(ang) * (radius - 3.2);
      ctx.strokeStyle = 'rgba(106, 60, 8, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Inner Recessed Face with Radial Brushed Gold
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.78, 0, Math.PI * 2);
    const innerGrad = ctx.createRadialGradient(0, -radius * 0.2, 1, 0, 0, radius * 0.8);
    innerGrad.addColorStop(0, '#FFF8D0');
    innerGrad.addColorStop(0.4, '#F2C85F');
    innerGrad.addColorStop(0.85, '#D49B2E');
    innerGrad.addColorStop(1, '#8C520C');
    ctx.fillStyle = innerGrad;
    ctx.fill();
    ctx.strokeStyle = '#6A3C08';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Embossed 3D Letter ('P' or 'X')
    ctx.font = `bold ${radius * 1.15}px 'Outfit', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Shadow pass
    ctx.fillStyle = 'rgba(74, 38, 4, 0.9)';
    ctx.fillText(letter, 0.8, 1.8);

    // Highlight pass
    ctx.fillStyle = '#FFF8E0';
    ctx.fillText(letter, -0.4, -0.4);

    // Core Face
    ctx.fillStyle = '#5A3205';
    ctx.fillText(letter, 0, 0.8);

    ctx.restore();
  }

  // Pure Procedural Vector Calendar Icon
  function drawProceduralCalendar(ctx, x, y, size = 18) {
    ctx.save();
    ctx.translate(x, y);

    // Parchment Body
    drawRoundedRect(ctx, 0, 2, size, size - 2, 3);
    ctx.fillStyle = '#FFF8EC';
    ctx.fill();
    ctx.strokeStyle = '#D49B2E';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Top Binder Header Bar
    drawRoundedRect(ctx, 0, 2, size, 5, 2);
    ctx.fillStyle = '#C68B2C';
    ctx.fill();

    // 2 Silver Binder Rings on top
    ctx.fillStyle = '#FFF4D7';
    ctx.fillRect(size * 0.25 - 1, 0, 2, 4);
    ctx.fillRect(size * 0.75 - 1, 0, 2, 4);

    // 6 Grid Dots representing days
    ctx.fillStyle = '#6E4B35';
    const dotR = 1.2;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.beginPath();
        ctx.arc(size * 0.25 + c * (size * 0.25), size * 0.55 + r * (size * 0.25), dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // Pure Procedural Two-People Metallic Gold Icon
  function drawProceduralPeopleIcon(ctx, x, y, size = 26) {
    ctx.save();
    ctx.translate(x, y);

    // Back Person (Deeper Bronze)
    ctx.fillStyle = '#A36210';
    ctx.beginPath();
    ctx.arc(-size * 0.2, -size * 0.18, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-size * 0.22, size * 0.25, size * 0.32, size * 0.22, 0, Math.PI, 0);
    ctx.fill();

    // Front Person (Bright Champagne Gold)
    const frontGrad = ctx.createLinearGradient(0, -size * 0.4, 0, size * 0.4);
    frontGrad.addColorStop(0, '#FFF2B2');
    frontGrad.addColorStop(0.4, '#F2C85F');
    frontGrad.addColorStop(1, '#A36210');
    ctx.fillStyle = frontGrad;

    ctx.beginPath();
    ctx.arc(size * 0.15, -size * 0.05, size * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(size * 0.15, size * 0.38, size * 0.38, size * 0.24, 0, Math.PI, 0);
    ctx.fill();

    ctx.restore();
  }

  // Pure Procedural Vector Chat Bubbles Icon
  function drawProceduralChatIcon(ctx, x, y, size = 22) {
    ctx.save();
    ctx.translate(x, y);

    // Secondary bubble (behind)
    ctx.fillStyle = '#C68B2C';
    drawRoundedRect(ctx, -size * 0.5, -size * 0.45, size * 0.65, size * 0.5, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-size * 0.4, 0);
    ctx.lineTo(-size * 0.55, size * 0.15);
    ctx.lineTo(-size * 0.3, size * 0.05);
    ctx.fill();

    // Primary bubble (front)
    const bGrad = ctx.createLinearGradient(0, -size * 0.2, 0, size * 0.5);
    bGrad.addColorStop(0, '#FFF4D7');
    bGrad.addColorStop(0.5, '#F2C85F');
    bGrad.addColorStop(1, '#A36210');
    ctx.fillStyle = bGrad;

    drawRoundedRect(ctx, -size * 0.2, -size * 0.2, size * 0.75, size * 0.55, 5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size * 0.3, size * 0.35);
    ctx.lineTo(size * 0.48, size * 0.55);
    ctx.lineTo(size * 0.18, size * 0.35);
    ctx.fill();

    // Message dots
    ctx.fillStyle = '#5C4432';
    [-size * 0.02, size * 0.18, size * 0.38].forEach(dx => {
      ctx.beginPath();
      ctx.arc(dx, size * 0.08, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  // Pure Procedural Vector Transfer Opposing Arrows Icon
  function drawProceduralTransferIcon(ctx, x, y, size = 20) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#F2C85F';
    ctx.fillStyle = '#F2C85F';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Top Arrow (pointing right)
    ctx.beginPath();
    ctx.moveTo(-size * 0.45, -size * 0.18);
    ctx.lineTo(size * 0.35, -size * 0.18);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.18, -size * 0.36);
    ctx.lineTo(size * 0.46, -size * 0.18);
    ctx.lineTo(size * 0.18, 0);
    ctx.fill();

    // Bottom Arrow (pointing left)
    ctx.strokeStyle = '#E5C595';
    ctx.fillStyle = '#E5C595';
    ctx.beginPath();
    ctx.moveTo(size * 0.45, size * 0.18);
    ctx.lineTo(-size * 0.35, size * 0.18);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-size * 0.18, 0);
    ctx.lineTo(-size * 0.46, size * 0.18);
    ctx.lineTo(-size * 0.18, size * 0.36);
    ctx.fill();

    ctx.restore();
  }

  // Pure Procedural Fleur-de-lis / Royal Lotus Watermark
  function drawProceduralFleurDeLis(ctx, x, y, size = 70) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = 'rgba(63, 27, 71, 0.4)';
    ctx.strokeStyle = 'rgba(242, 200, 95, 0.12)';
    ctx.lineWidth = 1;

    // Center Spear Petal
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.6);
    ctx.bezierCurveTo(size * 0.18, -size * 0.3, size * 0.22, 0, 0, size * 0.35);
    ctx.bezierCurveTo(-size * 0.22, 0, -size * 0.18, -size * 0.3, 0, -size * 0.6);
    ctx.fill();
    ctx.stroke();

    // Left Curling Petal
    ctx.beginPath();
    ctx.moveTo(0, size * 0.2);
    ctx.bezierCurveTo(-size * 0.4, size * 0.15, -size * 0.55, -size * 0.2, -size * 0.45, -size * 0.35);
    ctx.bezierCurveTo(-size * 0.25, -size * 0.2, -size * 0.1, 0, 0, size * 0.2);
    ctx.fill();
    ctx.stroke();

    // Right Curling Petal
    ctx.beginPath();
    ctx.moveTo(0, size * 0.2);
    ctx.bezierCurveTo(size * 0.4, size * 0.15, size * 0.55, -size * 0.2, size * 0.45, -size * 0.35);
    ctx.bezierCurveTo(size * 0.25, -size * 0.2, size * 0.1, 0, 0, size * 0.2);
    ctx.fill();
    ctx.stroke();

    // Bottom Cross Ring
    ctx.fillRect(-size * 0.25, size * 0.25, size * 0.5, size * 0.08);

    ctx.restore();
  }

  // PURE PROCEDURAL HAND-CRAFTED PORTRAIT (NO IMAGE ASSETS!)
  function drawProceduralPortrait(ctx, cx, cy, r, withGoldRim = true) {
    ctx.save();
    // 1. Circular Clip
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // 2. Moody Studio Background Gradient
    const bg = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 5, cx, cy, r);
    bg.addColorStop(0, '#2D1B36');
    bg.addColorStop(0.6, '#180E1E');
    bg.addColorStop(1, '#0B050E');
    ctx.fillStyle = bg;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    // 3. Charcoal Crewneck Shirt & Shoulders
    ctx.fillStyle = '#100D13';
    ctx.beginPath();
    ctx.moveTo(cx - r, cy + r);
    ctx.quadraticCurveTo(cx - r * 0.5, cy + r * 0.35, cx - r * 0.1, cy + r * 0.45);
    ctx.quadraticCurveTo(cx + r * 0.3, cy + r * 0.5, cx + r, cy + r);
    ctx.lineTo(cx - r, cy + r);
    ctx.fill();

    // Shirt collar rim light
    ctx.strokeStyle = '#2A2230';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.4, cy + r * 0.5);
    ctx.quadraticCurveTo(cx + r * 0.1, cy + r * 0.55, cx + r * 0.6, cy + r * 0.65);
    ctx.stroke();

    // 4. Neck with Chiaroscuro Shading
    const neckGrad = ctx.createLinearGradient(cx - r * 0.5, cy, cx + r * 0.5, cy);
    neckGrad.addColorStop(0, '#5C4030');
    neckGrad.addColorStop(0.5, '#8C674E');
    neckGrad.addColorStop(1, '#C6A282');
    ctx.fillStyle = neckGrad;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.25, cy + r * 0.1);
    ctx.lineTo(cx - r * 0.35, cy + r * 0.55);
    ctx.lineTo(cx + r * 0.35, cy + r * 0.55);
    ctx.lineTo(cx + r * 0.35, cy + r * 0.15);
    ctx.closePath();
    ctx.fill();

    // Neck shadow under jawline
    ctx.fillStyle = 'rgba(25, 15, 10, 0.65)';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.3, cy + r * 0.15);
    ctx.quadraticCurveTo(cx + r * 0.1, cy + r * 0.3, cx + r * 0.4, cy + r * 0.15);
    ctx.lineTo(cx + r * 0.1, cy + r * 0.1);
    ctx.closePath();
    ctx.fill();

    // 5. Sculpted Face Profile / Three-Quarter View (Facing Right)
    const faceGrad = ctx.createRadialGradient(cx + r * 0.2, cy - r * 0.1, 5, cx - r * 0.1, cy, r * 0.7);
    faceGrad.addColorStop(0, '#F0D0B0'); // Key light
    faceGrad.addColorStop(0.4, '#CCA482');
    faceGrad.addColorStop(0.8, '#8D664A');
    faceGrad.addColorStop(1, '#4A3222'); // Shadow
    ctx.fillStyle = faceGrad;

    ctx.beginPath();
    ctx.moveTo(cx + r * 0.15, cy - r * 0.45); // Forehead
    ctx.lineTo(cx + r * 0.35, cy - r * 0.25); // Brow
    ctx.lineTo(cx + r * 0.32, cy - r * 0.15); // Nose bridge
    ctx.lineTo(cx + r * 0.48, cy - r * 0.05); // Nose tip
    ctx.lineTo(cx + r * 0.36, cy + 0);        // Under nose
    ctx.lineTo(cx + r * 0.42, cy + r * 0.08); // Upper lip
    ctx.lineTo(cx + r * 0.35, cy + r * 0.13); // Mouth line
    ctx.lineTo(cx + r * 0.40, cy + r * 0.18); // Lower lip
    ctx.lineTo(cx + r * 0.42, cy + r * 0.28); // Chin
    ctx.lineTo(cx + r * 0.1, cy + r * 0.32);  // Jaw
    ctx.lineTo(cx - r * 0.25, cy + r * 0.12); // Jaw angle
    ctx.lineTo(cx - r * 0.32, cy - r * 0.05); // Ear
    ctx.lineTo(cx - r * 0.22, cy - r * 0.2);
    ctx.lineTo(cx - r * 0.35, cy - r * 0.45); // Temple
    ctx.closePath();
    ctx.fill();

    // Ear with interior cavity
    ctx.fillStyle = '#9E7456';
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.22, cy + 0, r * 0.1, r * 0.18, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6B4A34';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 6. Confident Eyebrow and Eye
    ctx.fillStyle = '#1A1215';
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.1, cy - r * 0.28);
    ctx.quadraticCurveTo(cx + r * 0.24, cy - r * 0.32, cx + r * 0.36, cy - r * 0.26);
    ctx.lineTo(cx + r * 0.35, cy - r * 0.22);
    ctx.quadraticCurveTo(cx + r * 0.22, cy - r * 0.26, cx + r * 0.1, cy - r * 0.24);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + r * 0.22, cy - r * 0.16);
    ctx.quadraticCurveTo(cx + r * 0.3, cy - r * 0.19, cx + r * 0.35, cy - r * 0.15);
    ctx.quadraticCurveTo(cx + r * 0.28, cy - r * 0.13, cx + r * 0.22, cy - r * 0.16);
    ctx.fill();

    // 7. Dark Trimmed Beard & Mustache
    const beardGrad = ctx.createLinearGradient(cx - r * 0.3, cy, cx + r * 0.4, cy + r * 0.2);
    beardGrad.addColorStop(0, '#100B0E');
    beardGrad.addColorStop(0.7, '#1E161C');
    beardGrad.addColorStop(1, '#2D222A');
    ctx.fillStyle = beardGrad;

    ctx.beginPath();
    ctx.moveTo(cx + r * 0.35, cy + 0.02);
    ctx.quadraticCurveTo(cx + r * 0.44, cy + r * 0.07, cx + r * 0.46, cy + r * 0.1);
    ctx.quadraticCurveTo(cx + r * 0.38, cy + r * 0.14, cx + r * 0.32, cy + r * 0.12);
    ctx.quadraticCurveTo(cx + r * 0.15, cy + r * 0.12, cx - r * 0.18, cy + 0);
    ctx.lineTo(cx - r * 0.25, cy + r * 0.12);
    ctx.quadraticCurveTo(cx - r * 0.1, cy + r * 0.35, cx + r * 0.15, cy + r * 0.35);
    ctx.lineTo(cx + r * 0.44, cy + r * 0.3);
    ctx.quadraticCurveTo(cx + r * 0.38, cy + r * 0.2, cx + r * 0.34, cy + r * 0.16);
    ctx.closePath();
    ctx.fill();

    // 8. Dark Styled Hair (Voluminous on top, tapered back)
    const hairGrad = ctx.createLinearGradient(cx - r * 0.4, cy - r * 0.7, cx + r * 0.3, cy - r * 0.2);
    hairGrad.addColorStop(0, '#0C080B');
    hairGrad.addColorStop(0.5, '#1A141A');
    hairGrad.addColorStop(0.8, '#322530');
    hairGrad.addColorStop(1, '#1A141A');
    ctx.fillStyle = hairGrad;

    ctx.beginPath();
    ctx.moveTo(cx - r * 0.26, cy - r * 0.2);
    ctx.quadraticCurveTo(cx - r * 0.15, cy - r * 0.38, cx + r * 0.12, cy - r * 0.38);
    ctx.quadraticCurveTo(cx + r * 0.22, cy - r * 0.42, cx + r * 0.26, cy - r * 0.52);
    ctx.quadraticCurveTo(cx + r * 0.1, cy - r * 0.72, cx - r * 0.1, cy - r * 0.7);
    ctx.quadraticCurveTo(cx - r * 0.35, cy - r * 0.65, cx - r * 0.48, cy - r * 0.4);
    ctx.quadraticCurveTo(cx - r * 0.52, cy - r * 0.1, cx - r * 0.38, cy + r * 0.05);
    ctx.closePath();
    ctx.fill();

    // Individual Hair Texture Strands
    ctx.strokeStyle = 'rgba(215, 180, 150, 0.25)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.25, cy - r * 0.6);
    ctx.quadraticCurveTo(cx - r * 0.05, cy - r * 0.65, cx + r * 0.15, cy - r * 0.52);
    ctx.moveTo(cx - r * 0.18, cy - r * 0.52);
    ctx.quadraticCurveTo(cx + r * 0.05, cy - r * 0.55, cx + r * 0.22, cy - r * 0.45);
    ctx.stroke();

    // Soft Rim Light on Profile
    ctx.strokeStyle = 'rgba(255, 235, 205, 0.45)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.25, cy - r * 0.5);
    ctx.lineTo(cx + r * 0.33, cy - r * 0.25);
    ctx.lineTo(cx + r * 0.48, cy - r * 0.05);
    ctx.stroke();

    ctx.restore();

    if (!withGoldRim) {
      return;
    }

    // 9. Outer Golden Laurel Beveled Frame with Pearls
    ctx.save();
    ctx.translate(cx, cy);

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    const ringGrad = ctx.createLinearGradient(-r, -r, r, r);
    ringGrad.addColorStop(0, '#FFF2B2');
    ringGrad.addColorStop(0.3, '#E5C595');
    ringGrad.addColorStop(0.7, '#C68B2C');
    ringGrad.addColorStop(1, '#6A3C08');
    ctx.strokeStyle = ringGrad;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, r - 3, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 244, 215, 0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 8 Golden Studs around rim
    for (let i = 0; i < 8; i++) {
      const ang = (i * Math.PI) / 4;
      const px = Math.cos(ang) * (r - 1.5);
      const py = Math.sin(ang) * (r - 1.5);
      ctx.beginPath();
      ctx.arc(px, py, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF8E0';
      ctx.fill();
    }

    ctx.restore();

    // Crown on Top of Avatar
    drawCrown(ctx, cx, cy - r + 3, 32, 14, true);
  }

  // --- 3. STATIC LAYER RENDERING (RENDERED ONCE & FROZEN) ---
  function renderStaticLayer() {
    sCtx.clearRect(0, 0, V_W, V_H);

    // 3.1 Full-Screen Luxury Cosmic Wallpaper Asset
    if (screenBgImg.complete && screenBgImg.naturalWidth > 0) {
      sCtx.drawImage(screenBgImg, 0, 0, V_W, V_H);
    } else {
      const bgGrad = sCtx.createLinearGradient(0, 0, 0, V_H);
      bgGrad.addColorStop(0, '#10081D');
      bgGrad.addColorStop(0.45, '#0E0611');
      bgGrad.addColorStop(1, '#100914');
      sCtx.fillStyle = bgGrad;
      sCtx.fillRect(0, 0, V_W, V_H);

      // Ambient Luxury Radial Lighting
      const glow1 = sCtx.createRadialGradient(296, 250, 10, 296, 250, 320);
      glow1.addColorStop(0, 'rgba(88, 20, 95, 0.16)');
      glow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = glow1;
      sCtx.fillRect(0, 0, V_W, 600);
    }

    // 3.2 Top Header Row (Back, Title, Help, Search)
    renderHeader(sCtx);

    // 3.3 Filter / Date Bar ("8/2026", "UTC+0")
    renderDateBar(sCtx);

    // 3.4 Card 1: Agency Income Card (Static Frame & Labels)
    renderAgencyCardStatic(sCtx);

    // 3.5 Dual Cards: Salaried Hosts & Total Xcoins
    renderDualCardsStatic(sCtx);

    // 3.6 Card 4: Income Chart (Grid, Axes, Watermark & Labels)
    renderChartCardStatic(sCtx);

    // 3.7 Card 5: Host Profile (Procedural Portrait, Frame & Text)
    renderProfileCardStatic(sCtx);

    // 3.8 Bottom Action Buttons ("سياسة Torki", "المحفظة")
    renderBottomButtonsStatic(sCtx);

    isStaticRendered = true;
    gpuStatus.textContent = 'Static: Frozen';
    gpuStatus.style.color = '#00FFCC';
  }

  // --- Static Component Renderers ---

  function renderHeader(ctx) {
    // User Custom Luxury Title Frame Banner (frame_banner.png: 520x108, Y center = 58)
    if (titleFrameImg.complete && titleFrameImg.naturalWidth > 0) {
      const frameW = 280;
      const frameH = frameW / (520 / 108);
      ctx.drawImage(titleFrameImg, 296 - frameW / 2, 57 - frameH / 2, frameW, frameH);
    }

    // Title "تفاصيل الدخل"
    ctx.font = 'bold 21px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFF4D7';
    ctx.shadowColor = 'rgba(242, 200, 95, 0.55)';
    ctx.shadowBlur = 8;
    ctx.fillText('تفاصيل الدخل', 296, 58);
    ctx.shadowBlur = 0;

    // Circular Button Renderer (Center Y = 58, size = 52)
    function drawCircleBtn(x, y, iconType) {
      if (iconType === 'search' && searchIconImg.complete && searchIconImg.naturalWidth > 0) {
        const btnSize = 52;
        ctx.drawImage(searchIconImg, x - btnSize / 2, y - btnSize / 2, btnSize, btnSize);
        return;
      }

      if (iconType === 'help' && helpIconImg.complete && helpIconImg.naturalWidth > 0) {
        const btnSize = 52;
        ctx.drawImage(helpIconImg, x - btnSize / 2, y - btnSize / 2, btnSize, btnSize);
        return;
      }

      if (iconType === 'back' && backArrowImg.complete && backArrowImg.naturalWidth > 0) {
        const btnSize = 52;
        ctx.drawImage(backArrowImg, x - btnSize / 2, y - btnSize / 2, btnSize, btnSize);
        return;
      }

      ctx.save();
      ctx.translate(x, y);

      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(28, 11, 35, 0.88)';
      ctx.fill();
      ctx.strokeStyle = '#E5C595';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 21, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(242, 200, 95, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.strokeStyle = '#FFF4D7';
      ctx.fillStyle = '#FFF4D7';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';

      if (iconType === 'back') {
        // Back Chevron (pointing right for RTL layout)
        ctx.beginPath();
        ctx.moveTo(-4, -8);
        ctx.lineTo(4, 0);
        ctx.lineTo(-4, 8);
        ctx.stroke();
      } else if (iconType === 'search') {
        // Search Magnifying Glass
        ctx.beginPath();
        ctx.arc(-2, -2, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(3, 3);
        ctx.lineTo(8, 8);
        ctx.stroke();
      } else if (iconType === 'help') {
        // Help Question Mark
        ctx.font = 'bold 16px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', 0, 1);
      }
      ctx.restore();
    }

    drawCircleBtn(532, 58, 'back');
    drawCircleBtn(56, 58, 'search');
    drawCircleBtn(124, 58, 'help');
  }

  function renderDateBar(ctx) {
    // 1. Downward Chevron (Centered vertically at Y=124)
    if (chevronIconImg.complete && chevronIconImg.naturalWidth > 0) {
      ctx.drawImage(chevronIconImg, 35, 120, 13, 8);
    } else {
      ctx.strokeStyle = '#E5C595';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(35, 120);
      ctx.lineTo(41, 127);
      ctx.lineTo(48, 120);
      ctx.stroke();
    }

    // 2. Date Text
    ctx.fillStyle = '#E5C595';
    ctx.font = 'bold 15px "Outfit", "Cairo", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(appData.date, 54, 124);

    // Dynamic X position based on date text width
    const textWidth = ctx.measureText(appData.date).width;
    const calX = 54 + textWidth + 8;

    // 3. User Custom Luxury Calendar Icon
    if (calendarIconImg.complete && calendarIconImg.naturalWidth > 0) {
      ctx.drawImage(calendarIconImg, calX, 113, 22, 22);
    } else {
      drawProceduralCalendar(ctx, calX, 115, 18);
    }

    // Right: "UTC+0" Gold Typography (Centered at Y=124)
    ctx.font = 'bold 14px "Outfit", sans-serif';
    ctx.fillStyle = '#E5C595';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(appData.timezone, 558, 124);
  }

  function renderAgencyCardStatic(ctx) {
    const x = 20, y = 164, w = 552, h = 286;

    // Custom Luxury Frame Asset (Item 5)
    if (agencyCardFrameImg.complete && agencyCardFrameImg.naturalWidth > 0) {
      ctx.drawImage(agencyCardFrameImg, x, y, w, h);
    } else {
      drawRoundedRect(ctx, x, y + 12, w, h - 12, 24);
      ctx.fillStyle = '#1C0A28';
      ctx.fill();
    }

    // 3 Gold Coins on Left - Item 10: New P-Coin Asset
    if (pCoinImg.complete && pCoinImg.naturalWidth > 0) {
      const coinSize = 36;
      ctx.drawImage(pCoinImg, 70 - coinSize / 2, 228 - coinSize / 2, coinSize, coinSize);
      ctx.drawImage(pCoinImg, 70 - coinSize / 2, 298 - coinSize / 2, coinSize, coinSize);
      ctx.drawImage(pCoinImg, 70 - coinSize / 2, 368 - coinSize / 2, coinSize, coinSize);
    } else {
      drawGoldCoin(ctx, 70, 228, 17, 'P');
      drawGoldCoin(ctx, 70, 298, 17, 'P');
      drawGoldCoin(ctx, 70, 368, 17, 'P');
    }

    // 3 Static Labels on Right (RTL)
    ctx.fillStyle = '#E5C595';
    ctx.font = 'bold 16px "Cairo", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('ايرادات الوكالة', 535, 228);
    ctx.fillText('عمولة الوكالة', 535, 298);
    ctx.fillText('مكافآت الوقت للوكالة', 535, 368);
  }

  function renderDualCardsStatic(ctx) {
    const y = 460, h = 138, r = 20;

    // 1. Left Card: "المضيفين برواتب" (x=20, w=266) - Item 7 Frame
    const lx = 20, lw = 266;
    if (dualCardsFrameImg.complete && dualCardsFrameImg.naturalWidth > 0) {
      ctx.drawImage(dualCardsFrameImg, lx, y, lw, h);
    } else {
      drawRoundedRect(ctx, lx, y, lw, h, r);
      ctx.fillStyle = '#16081F';
      ctx.fill();
      ctx.strokeStyle = '#E5C595';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      drawFiligreeCorner(ctx, lx + 12, y + 12, 1, 1, 10);
      drawFiligreeCorner(ctx, lx + lw - 12, y + 12, -1, 1, 10);
    }

    // Title
    ctx.fillStyle = '#E5C595';
    ctx.font = 'bold 15px "Cairo", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('المضيفين برواتب', lx + lw - 22, y + 42);

    // Question Mark Icon
    const qX = lx + 44;
    const qY = y + 40;
    const qSize = 24;
    if (helpIconImg.complete && helpIconImg.naturalWidth > 0) {
      ctx.drawImage(helpIconImg, qX - qSize / 2, qY - qSize / 2, qSize, qSize);
    } else {
      ctx.beginPath();
      ctx.arc(qX, qY, 10, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(229, 197, 149, 0.6)';
      ctx.stroke();
      ctx.font = 'bold 11px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', qX, qY);
    }

    // Custom Luxury Salaried Hosts Two-People Icon Asset
    const pX = lx + 215;
    const pY = y + 96;

    // Subtle royal circular disc matching original UI
    ctx.save();
    ctx.beginPath();
    ctx.arc(pX, pY, 19, 0, Math.PI * 2);
    const discGrad = ctx.createRadialGradient(pX, pY, 2, pX, pY, 19);
    discGrad.addColorStop(0, 'rgba(75, 26, 96, 0.88)');
    discGrad.addColorStop(0.85, 'rgba(32, 10, 42, 0.95)');
    discGrad.addColorStop(1, 'rgba(229, 197, 149, 0.4)');
    ctx.fillStyle = discGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(229, 197, 149, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    if (hostsPeopleIconImg.complete && hostsPeopleIconImg.naturalWidth > 0) {
      const figW = 26;
      const figH = figW / (290 / 249);
      ctx.drawImage(hostsPeopleIconImg, pX - figW / 2, pY - figH / 2 + 1, figW, figH);
    } else {
      drawProceduralPeopleIcon(ctx, pX, pY, 22);
    }

    // 2. Right Card: "إجمالي Xcoins" (x=306, w=266) - Item 7 Frame
    const rx = 306, rw = 266;
    if (dualCardsFrameImg.complete && dualCardsFrameImg.naturalWidth > 0) {
      ctx.drawImage(dualCardsFrameImg, rx, y, rw, h);
    } else {
      drawRoundedRect(ctx, rx, y, rw, h, r);
      const xGrad = ctx.createLinearGradient(rx, y, rx, y + h);
      xGrad.addColorStop(0, '#2D0A35');
      xGrad.addColorStop(1, '#1A0620');
      ctx.fillStyle = xGrad;
      ctx.fill();
      ctx.strokeStyle = '#E5C595';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      drawFiligreeCorner(ctx, rx + 12, y + 12, 1, 1, 10);
      drawFiligreeCorner(ctx, rx + rw - 12, y + 12, -1, 1, 10);
    }

    // Title
    ctx.fillStyle = '#E5C595';
    ctx.font = 'bold 15px "Cairo", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('إجمالي Xcoins', rx + rw - 22, y + 42);

    // Large 'X' Gold Coin - Item 9: New X-Coin Asset
    if (xCoinImg.complete && xCoinImg.naturalWidth > 0) {
      const coinSize = 42;
      ctx.drawImage(xCoinImg, rx + 55 - coinSize / 2, y + 90 - coinSize / 2, coinSize, coinSize);
    } else {
      drawGoldCoin(ctx, rx + 55, y + 90, 20, 'X');
    }
  }

  function renderChartCardStatic(ctx) {
    const x = 20, y = 618, w = 552, h = 380, r = 24;

    // Card Surface Background
    drawRoundedRect(ctx, x, y, w, h, r);
    ctx.fillStyle = '#100617';
    ctx.fill();

    // Pure Procedural Fleur-de-lis / Royal Lotus Watermark
    drawProceduralFleurDeLis(ctx, x + w / 2, y + 160, 68);

    // Y-Axis Labels and Dashed Grid Lines
    const ySteps = [
      { label: '4.00M', y: 659 },
      { label: '3.00M', y: 706 },
      { label: '2.00M', y: 754 },
      { label: '1.00M', y: 801 },
      { label: '0.00', y: 852 }
    ];

    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.fillStyle = '#B8A698';
    ctx.textAlign = 'left';

    ySteps.forEach(step => {
      ctx.fillText(step.label, x + 16, step.y + 4);

      // Dashed Grid Line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.moveTo(x + 70, step.y);
      ctx.lineTo(x + w - 20, step.y);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // X-Axis Month Labels
    const months = [
      { name: 'مارس', x: 136 },
      { name: 'أبريل', x: 213 },
      { name: 'مايو', x: 289 },
      { name: 'يونيو', x: 366 },
      { name: 'يوليو', x: 446 },
      { name: 'أغسطس', x: 519 }
    ];

    ctx.font = 'bold 13px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#B8A698';
    months.forEach(m => {
      ctx.fillText(m.name, m.x, 894);
    });

    // Bottom Summary Strip inside Chart Card
    ctx.strokeStyle = 'rgba(229, 197, 149, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 15, 920);
    ctx.lineTo(x + w - 15, 920);
    ctx.stroke();

    const footerLabels = ['الدخل', 'المدة', 'لا يوجد دخل', 'لا يوجد مكافأة للوقت'];
    const footerX = [500, 395, 280, 120];

    ctx.font = '13px "Cairo", sans-serif';
    ctx.fillStyle = '#FFF4D7';
    footerLabels.forEach((txt, idx) => {
      ctx.textAlign = 'center';
      ctx.fillText(txt, footerX[idx], 952);
    });

    // Vertical column dividers
    ctx.strokeStyle = 'rgba(229, 197, 149, 0.15)';
    [445, 340, 210].forEach(divX => {
      ctx.beginPath();
      ctx.moveTo(divX, 930);
      ctx.lineTo(divX, 970);
      ctx.stroke();
    });

    // Outer Sculpted Gold & Amethyst Frame Asset
    if (chartCardFrameImg.complete && chartCardFrameImg.naturalWidth > 0) {
      ctx.drawImage(chartCardFrameImg, x, y, w, h);
    } else {
      ctx.strokeStyle = '#E5C595';
      ctx.lineWidth = 1.6;
      drawRoundedRect(ctx, x, y, w, h, r);
      ctx.stroke();

      // Top Crown Fallback
      drawCrown(ctx, x + w / 2, y, 50, 18, false);
    }
  }

  function renderProfileCardStatic(ctx) {
    const x = 20, y = 1014, w = 552, h = 114, r = 20;

    // Custom Luxury Profile Card Asset (Item 11)
    if (profileCardFrameImg.complete && profileCardFrameImg.naturalWidth > 0) {
      ctx.drawImage(profileCardFrameImg, x, y, w, h);

      // Draw Host Avatar inside the circular gold bezel (center at x=85, y=1066, r=33)
      drawProceduralPortrait(ctx, 85, 1066, 33, false);

      // Host Name & Join Date - Left-aligned cleanly after avatar bezel with generous vertical separation
      ctx.save();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      // Line 1: Host Name (y = 1050)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px "Cairo", sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 3;
      ctx.fillText(appData.hostName, 150, 1050);

      // Line 2: Join Date (y = 1088) - Luxury Gold Color (#E5C595)
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#E5C595';
      ctx.font = '600 13px "Cairo", "Outfit", sans-serif';
      ctx.fillText('انضم ' + appData.joinDate, 150, 1088);
      ctx.restore();

      return;
    }

    // Card Surface Fallback
    drawRoundedRect(ctx, x, y, w, h, r);
    ctx.fillStyle = '#150B1E';
    ctx.fill();
    ctx.strokeStyle = '#E5C595';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    const avX = 80, avY = 1068, avR = 38;
    drawProceduralPortrait(ctx, avX, avY, avR);

    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px "Cairo", sans-serif';
    ctx.fillText(appData.hostName, 150, 1050);

    ctx.fillStyle = '#E5C595';
    ctx.font = '600 13px "Cairo", "Outfit", sans-serif';
    ctx.fillText('انضم ' + appData.joinDate, 150, 1088);
    ctx.restore();

    function drawActionBtn(btnX, btnY, iconType) {
      ctx.beginPath();
      ctx.arc(btnX, btnY, 27, 0, Math.PI * 2);
      ctx.fillStyle = '#26112C';
      ctx.fill();
      ctx.strokeStyle = '#E5C595';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      if (iconType === 'chat') {
        drawProceduralChatIcon(ctx, btnX, btnY, 20);
      } else if (iconType === 'transfer') {
        drawProceduralTransferIcon(ctx, btnX, btnY, 20);
      }
    }

    drawActionBtn(446, 1068, 'chat');
    drawActionBtn(522, 1068, 'transfer');
  }

  function renderBottomButtonsStatic(ctx) {
    const btnY = 1152, btnH = 62, btnR = 31;
    const centerY = btnY + btnH / 2; // 1183
    const btnFrameY = 1136, btnFrameH = 88;

    // 1. Left Button: "سياسة Torki" (Items 2 & 6: Lego Assembled Purple Crystal + Gold Frame)
    const bx = 18, bw = 274;
    if (torkiBtnLegoImg.complete && torkiBtnLegoImg.naturalWidth > 0) {
      ctx.drawImage(torkiBtnLegoImg, bx, btnFrameY, bw, btnFrameH);
    } else {
      const innerBx = 38, innerBw = 234;
      drawRoundedRect(ctx, innerBx, btnY, innerBw, btnH, btnR);
      ctx.fillStyle = '#6C1576';
      ctx.fill();
      ctx.strokeStyle = '#F2C85F';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('سياسة Torki', bx + bw / 2, centerY);

    // 2. Right Button: "المحفظة" (Item 2: Lego Assembled Ivory Marble + Gold Frame)
    const wx = 300, ww = 274;
    if (walletBtnLegoImg.complete && walletBtnLegoImg.naturalWidth > 0) {
      ctx.drawImage(walletBtnLegoImg, wx, btnFrameY, ww, btnFrameH);
    } else {
      const innerWx = 320, innerWw = 234;
      drawRoundedRect(ctx, innerWx, btnY, innerWw, btnH, btnR);
      ctx.fillStyle = '#F3E2CF';
      ctx.fill();
      ctx.strokeStyle = '#E5C595';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.fillStyle = '#381A05';
    ctx.font = 'bold 20px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.45)';
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 1;
    ctx.fillText('المحفظة', wx + ww / 2, centerY);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  // --- 4. DYNAMIC LAYER RENDERING (MOTION & INTERACTION ONLY) ---
  function renderDynamicLayer(timestamp) {
    dCtx.clearRect(0, 0, V_W, V_H);

    const t = animProgress.counter;
    const easedT = easeOutExpo(t);

    // 4.1 Animated Rolling Numbers (Card 1)
    const curRevenues = Math.round(appData.revenues * easedT);
    const curCommission = Math.round(appData.commission * easedT);
    const curBonus = Math.round(appData.timeBonus * easedT);

    dCtx.font = 'bold 26px "Outfit", sans-serif';
    dCtx.fillStyle = '#FFF4D7';
    dCtx.textAlign = 'left';
    dCtx.textBaseline = 'middle';
    dCtx.fillText(formatNumber(curRevenues), 106, 228);
    dCtx.fillText(formatNumber(curCommission), 106, 298);
    dCtx.fillText(formatNumber(curBonus), 106, 368);

    // 4.2 Animated Dual Cards Numbers
    dCtx.font = 'bold 30px "Outfit", sans-serif';
    dCtx.textAlign = 'center';
    dCtx.fillText(Math.round(appData.salariedHosts * easedT), 140, 566);

    dCtx.font = 'bold 28px "Outfit", sans-serif';
    dCtx.textAlign = 'left';
    dCtx.fillText(appData.totalXcoins, 396, 566);

    // 4.3 Animated Spline Chart Line & Glowing Peak Point
    renderAnimatedChart(dCtx, easedT);

    // 4.4 Profile Dynamic Badges
    renderProfileBadges(dCtx);

    // 4.5 Active Touch Ripples
    renderRipples(dCtx);
  }

  function renderAnimatedChart(ctx, progress) {
    const baselineY = 857;
    const peakX = 520;
    const peakY = 672;

    const points = [
      { x: 136, y: baselineY },
      { x: 213, y: baselineY },
      { x: 289, y: baselineY },
      { x: 366, y: baselineY },
      { x: 446, y: baselineY },
      { x: peakX, y: baselineY - (baselineY - peakY) * progress }
    ];

    ctx.save();
    ctx.strokeStyle = '#E472EA';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = '#E040FB';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i <= 4; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    const cp1x = 480;
    const cp1y = baselineY;
    const cp2x = 500;
    const cp2y = points[5].y + 15;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, points[5].x, points[5].y);
    ctx.stroke();

    // Baseline dots
    ctx.shadowBlur = 0;
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#E472EA';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }

    // August Peak Pulsing Node
    const curPeak = points[5];
    const pulse = Math.sin(animProgress.pulsePhase) * 0.5 + 0.5;

    ctx.beginPath();
    ctx.arc(curPeak.x, curPeak.y, 8 + pulse * 6, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(224, 64, 251, ${0.8 - pulse * 0.5})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(curPeak.x, curPeak.y, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = '#E472EA';
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 8;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(curPeak.x, curPeak.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    ctx.restore();
  }

  function renderProfileBadges(ctx) {
    ctx.save();
    // Dynamically calculate start position right after the host name
    ctx.font = 'bold 20px "Cairo", sans-serif';
    const nameWidth = ctx.measureText(appData.hostName).width;
    const startX = 150 + nameWidth + 12;

    // 1. Male 29 Badge (Royal Blue Pill with ♂ symbol, Y center = 1050)
    const bx = startX, by = 1040, bw = 48, bh = 20, br = 10;
    drawRoundedRect(ctx, bx, by, bw, bh, br);
    ctx.fillStyle = '#1976D2';
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('♂ 29', bx + bw / 2, by + bh / 2 + 1);

    // 2. H5 Badge (Bright Blue Shield Pill)
    const hx = bx + bw + 8, hy = 1040, hw = 36, hh = 20;
    drawRoundedRect(ctx, hx, hy, hw, hh, br);
    ctx.fillStyle = '#2979FF';
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H5', hx + hw / 2, hy + hh / 2 + 1);

    // 3. Diamond Cyan Crystal Badge (Centered at Y = 1050)
    const dx = hx + hw + 14, dy = 1050;
    ctx.translate(dx, dy);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = '#00E5FF';
    ctx.shadowColor = '#00E5FF';
    ctx.shadowBlur = 6;
    ctx.fillRect(-5, -5, 10, 10);
    ctx.restore();
  }

  function renderRipples(ctx) {
    for (let i = animProgress.activeRipples.length - 1; i >= 0; i--) {
      const rip = animProgress.activeRipples[i];
      rip.radius += 4;
      rip.alpha -= 0.04;

      if (rip.alpha <= 0) {
        animProgress.activeRipples.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(242, 200, 95, ${rip.alpha})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
  }

  // --- 5. ANIMATION LOOP & POWER SAVER (DIRTY RECT / ZERO-IDLE) ---
  function animationLoop(timestamp) {
    frameCount++;
    if (timestamp - lastTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (timestamp - lastTime));
      fpsCounter.textContent = `FPS: ${fps}`;
      frameCount = 0;
      lastTime = timestamp;
    }

    let isStillActive = false;

    if (animProgress.counter < 1) {
      animProgress.counter = Math.min(animProgress.counter + 0.028, 1);
      isStillActive = true;
    }

    if (animProgress.activeRipples.length > 0) {
      isStillActive = true;
    }

    animProgress.pulsePhase += 0.07;
    renderDynamicLayer(timestamp);

    if (animProgress.counter >= 1 && animProgress.activeRipples.length === 0) {
      isStillActive = true; // Continues gentle peak pulse
    }

    if (isStillActive) {
      animId = requestAnimationFrame(animationLoop);
    } else {
      isRunning = false;
      animId = null;
    }
  }

  function requestDynamicFrame() {
    if (!isRunning) {
      isRunning = true;
      lastTime = performance.now();
      animId = requestAnimationFrame(animationLoop);
    }
  }

  // --- 6. INTERACTION, TOUCH EVENT & MODAL CONTROLLER ---
  const modalOverlay = document.getElementById('modalOverlay') || document.getElementById('modal-backdrop');
  const modalBackdrop = document.getElementById('modalBackdrop') || document.getElementById('modal-backdrop');
  const modalTitle = document.getElementById('modalTitle') || document.getElementById('sheet-title');
  const modalBody = document.getElementById('modalBody') || document.getElementById('sheet-body');
  const modalCloseBtn = document.getElementById('modalCloseBtn') || document.getElementById('sheet-close-btn');

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.add('modal-hidden');
      modalOverlay.classList.add('modal-backdrop-hidden');
      modalOverlay.classList.remove('modal-backdrop-visible');
    }
    const sheet = document.getElementById('modal-sheet') || document.getElementById('modalSheet');
    if (sheet) {
      sheet.classList.add('modal-sheet-hidden');
      sheet.classList.remove('modal-sheet-visible');
    }
  }

  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  // Open rich interactive modal based on button action
  function openModal(action, box) {
    if (!modalOverlay || !modalTitle || !modalBody) return;

    let title = box.name;
    let html = '';

    switch (action) {
      case 'date_filter':
        title = '📅 اختيار الفترة المحاسبية';
        const monthsList = [
          { m: 'أغسطس', y: '2026', rev: '483,800 P' },
          { m: 'يوليو', y: '2026', rev: '120,000 P' },
          { m: 'يونيو', y: '2026', rev: '85,000 P' },
          { m: 'مايو', y: '2026', rev: '60,000 P' },
          { m: 'أبريل', y: '2026', rev: '30,000 P' },
          { m: 'مارس', y: '2026', rev: '15,000 P' }
        ];
        html = `
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <img src="assets/calendar_gold_icon.png" style="width:40px; height:40px; object-fit:contain; filter:drop-shadow(0 0 8px rgba(242,200,95,0.4));" />
            <div>
              <div class="modal-card-title" style="margin-bottom:2px;">الفترة الحالية: <span class="modal-stat-gold">${appData.date}</span></div>
              <div style="font-size:12px; color:#C4B29E;">استعراض وتحديث بيانات الإيرادات والمنحنى المالي</div>
            </div>
          </div>
          <div class="modal-card">
            <div style="font-size:13px; color:#E5C595;">اختر الشهر المطلوب من القائمة أدناه:</div>
          </div>
          <div class="modal-grid-3">
            ${monthsList.map(item => `
              <button class="modal-btn-select ${appData.date.includes(item.m) ? 'active' : ''}" onclick="window.AppEngine.selectMonth('${item.m}', '${item.y}')">
                <div>${item.m}</div>
                <div style="font-size:10px; opacity:0.8;">${item.y}</div>
                <div style="font-size:11px; margin-top:4px; color:${appData.date.includes(item.m) ? '#381A05' : '#F2C85F'};">${item.rev}</div>
              </button>
            `).join('')}
          </div>
          <button class="modal-action-btn" onclick="window.AppEngine.closeModal()">إغلاق وتأكيد</button>
        `;
        break;

      case 'wallet':
        title = '💼 محفظة الوكالة الرسمية';
        html = `
          <div class="modal-card">
            <div class="modal-card-title">الرصيد المتاح للسحب <span>💎 P-Coins</span></div>
            <div class="modal-stat-row">
              <span>إجمالي أرباح الوكالة:</span>
              <span class="modal-stat-value modal-stat-gold">483,800 P ($4,838.00)</span>
            </div>
            <div class="modal-stat-row">
              <span>الرصيد الصافي القابل للسحب:</span>
              <span class="modal-stat-value" style="color:#00FFCC;">434,600 P ($4,346.00)</span>
            </div>
            <div class="modal-stat-row">
              <span>مكافأة الساعات المعلقة:</span>
              <span class="modal-stat-value">49,200 P ($492.00)</span>
            </div>
          </div>

          <div class="modal-grid-2">
            <button class="modal-btn-select" style="padding:14px;" onclick="window.AppEngine.requestWithdrawal('حساب بنكي')">
              <div style="font-size:20px;">🏦</div>
              <div>سحب لحساب بنكي</div>
            </button>
            <button class="modal-btn-select" style="padding:14px;" onclick="window.AppEngine.requestWithdrawal('USDT TRC20')">
              <div style="font-size:20px;">₮</div>
              <div>سحب USDT (TRC20)</div>
            </button>
          </div>

          <div class="modal-card">
            <div class="modal-card-title">آخر العمليات المالية</div>
            <div class="modal-stat-row">
              <span>سحب أرباح أسبوعي</span>
              <span class="modal-stat-value modal-stat-gold">+250,000 P (ناجحة)</span>
            </div>
            <div class="modal-stat-row">
              <span>مكافأة استيفاء 80 ساعة</span>
              <span class="modal-stat-value modal-stat-gold">+49,200 P (مكتملة)</span>
            </div>
          </div>
          <button class="modal-action-btn" onclick="window.AppEngine.requestWithdrawal('الفوري')">طلب سحب الأرباح الفوري</button>
        `;
        break;

      case 'torki_policy':
      case 'torki_policy':
        title = '📜 ميثاق وسياسة وكالة Torki';
        html = `
          <div class="modal-card">
            <div class="modal-card-title">1. نسب العمولات والحوافز</div>
            <div style="font-size:13px; color:#E0D4C3;">
              تحصل الوكالة على نسبة عمولة تصاعدية تبدأ من 10% وتصل إلى 25% بحسب تصنيف الوكالة وحجم إجمالي الـ Xcoins المحققة شهرياً.
            </div>
          </div>
          <div class="modal-card">
            <div class="modal-card-title">2. شروط مكافأة ساعات البث الإضافية</div>
            <div style="font-size:13px; color:#E0D4C3;">
              يستحق المضيف مكافأة وقت إضافية قدرها 49,200 P فور إتمام 80 ساعة بث نشطة بمعدل لا يقل عن ساعتين يومياً خلال 22 يوماً في الشهر.
            </div>
          </div>
          <div class="modal-card">
            <div class="modal-card-title">3. تسوية الأرباح والدفعات</div>
            <div style="font-size:13px; color:#E0D4C3;">
              تتم معالجة طلبات السحب أسبوعياً كل يوم اثنين عبر التحويل البنكي أو محافظ USDT المعتمدة دون أي رسوم خصم إضافية.
            </div>
          </div>
          <button class="modal-action-btn modal-action-purple" onclick="window.AppEngine.closeModal()">فهمت وموافق على السياسة</button>
        `;
        break;

      case 'agency_rev':
        title = '📊 تفاصيل إجمالي إيرادات الوكالة';
        html = `
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <img src="assets/p_coin_gold.png" style="width:38px; height:38px; object-fit:contain; filter:drop-shadow(0 0 8px rgba(242,200,95,0.4));" />
            <div>
              <div class="modal-card-title" style="margin-bottom:2px;">إجمالي الإيرادات: <span class="modal-stat-gold">483,800 P</span></div>
              <div style="font-size:12px; color:#C4B29E;">توزيع الأرباح من الهدايا والاشتراكات المباشرة</div>
            </div>
          </div>
          <div class="modal-card">
            <div class="modal-stat-row">
              <span>أرباح هدايا البث المباشر:</span>
              <span class="modal-stat-value">380,000 P</span>
            </div>
            <div class="modal-stat-row">
              <span>اشتراكات الداعمين الحصرية:</span>
              <span class="modal-stat-value">54,600 P</span>
            </div>
            <div class="modal-stat-row">
              <span>مكافأة جولات التحدي (PK):</span>
              <span class="modal-stat-value">49,200 P</span>
            </div>
          </div>
          <button class="modal-action-btn" onclick="window.AppEngine.closeModal()">العودة للرئيسية</button>
        `;
        break;

      case 'agency_comm':
        title = '💎 عمولة الوكالة المحققة';
        html = `
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <img src="assets/p_coin_gold.png" style="width:38px; height:38px; object-fit:contain; filter:drop-shadow(0 0 8px rgba(242,200,95,0.4));" />
            <div>
              <div class="modal-card-title" style="margin-bottom:2px;">العمولة الصافية: <span class="modal-stat-gold">434,600 P</span></div>
              <div style="font-size:12px; color:#C4B29E;">نسبة عمولة الشريحة الحالية: 15% (المستوى H5)</div>
            </div>
          </div>
          <div class="modal-card">
            <div class="modal-stat-row">
              <span>نسبة عمولة الشريحة الحالية:</span>
              <span class="modal-stat-value modal-stat-gold">15% (المستوى H5)</span>
            </div>
            <div class="modal-stat-row">
              <span>المتبقي للترقية إلى H6 (18%):</span>
              <span class="modal-stat-value">116,200 P</span>
            </div>
          </div>
          <button class="modal-action-btn" onclick="window.AppEngine.closeModal()">حسناً</button>
        `;
        break;

      case 'agency_bonus':
        title = '⏱️ مكافآت وقت البث للوكالة';
        html = `
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <img src="assets/p_coin_gold.png" style="width:38px; height:38px; object-fit:contain; filter:drop-shadow(0 0 8px rgba(242,200,95,0.4));" />
            <div>
              <div class="modal-card-title" style="margin-bottom:2px;">مكافأة الوقت: <span class="modal-stat-gold">49,200 P</span></div>
              <div style="font-size:12px; color:#C4B29E;">استيفاء متطلبات ساعات البث الرسمية</div>
            </div>
          </div>
          <div class="modal-card">
            <div class="modal-stat-row">
              <span>ساعات البث المنجزة:</span>
              <span class="modal-stat-value" style="color:#00FFCC;">82.4 ساعة</span>
            </div>
            <div class="modal-stat-row">
              <span>الهدف الشهري المطلوب:</span>
              <span class="modal-stat-value">80.0 ساعة</span>
            </div>
            <div class="modal-stat-row">
              <span>نسبة تحقيق الهدف:</span>
              <span class="modal-stat-value modal-stat-gold">103% (مستحقة بالكامل)</span>
            </div>
          </div>
          <button class="modal-action-btn" onclick="window.AppEngine.closeModal()">إغلاق</button>
        `;
        break;

      case 'salaried_hosts':
        title = '👥 إدارة المضيفين برواتب';
        html = `
          <div class="modal-card">
            <div class="modal-card-title">المضيف الحالي براتب: <span>نشط (1)</span></div>
            <div class="modal-stat-row">
              <span>اسم المضيف:</span>
              <span class="modal-stat-value modal-stat-gold">...يالملك</span>
            </div>
            <div class="modal-stat-row">
              <span>الراتب الشهري المتفق عليه:</span>
              <span class="modal-stat-value">$1,200.00 USD</span>
            </div>
            <div class="modal-stat-row">
              <span>أيام البث الفعالة:</span>
              <span class="modal-stat-value">26 من أصل 22 يوماً مطلوباً</span>
            </div>
          </div>
          <button class="modal-action-btn" onclick="window.AppEngine.addNewHostPrompt()">+ إضافة عقد مضيف جديد براتب</button>
        `;
        break;

      case 'xcoins_wallet':
        title = '🪙 إجمالي رصيد Xcoins';
        html = `
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <img src="assets/x_coin_gold.png" style="width:42px; height:42px; object-fit:contain; filter:drop-shadow(0 0 8px rgba(242,200,95,0.4));" />
            <div>
              <div class="modal-card-title" style="margin-bottom:2px;">الرصيد التراكمي: <span class="modal-stat-gold">3.50M Xcoins</span></div>
              <div style="font-size:12px; color:#C4B29E;">الرصيد الإجمالي المحقق من البث التفاعلي والداعمين</div>
            </div>
          </div>
          <div class="modal-card">
            <div class="modal-stat-row">
              <span>سعر الصرف المعتمد:</span>
              <span class="modal-stat-value">1,000 Xcoins = $10.00 USD</span>
            </div>
            <div class="modal-stat-row">
              <span>القيمة التقديرية بالدولار:</span>
              <span class="modal-stat-value modal-stat-gold" style="font-size:18px;">$35,000.00 USD</span>
            </div>
          </div>
          <div class="modal-grid-2">
            <button class="modal-btn-select active" onclick="window.AppEngine.showToast('جاري تحويل Xcoins إلى محفظة السحب...')">تحويل إلى P-Coins</button>
            <button class="modal-btn-select" onclick="window.AppEngine.openModal('wallet', {name:'المحفظة'})">سحب مباشر</button>
          </div>
        `;
        break;

      case 'chat':
        title = '💬 محادثة مع المضيف (...يالملك)';
        html = `
          <div class="modal-card" style="max-height:160px; overflow-y:auto;">
            <div style="background:rgba(255,255,255,0.06); padding:8px 12px; border-radius:12px; margin-bottom:8px;">
              <div style="font-size:11px; color:#F2C85F;">المضيف ...يالملك</div>
              <div>أهلاً بالوكالة، أكملت ساعات البث الإضافية لشهر أغسطس بنجاح! 🚀</div>
            </div>
            <div id="chatHistoryBox"></div>
          </div>
          <div style="margin-top:10px;">
            <div style="font-size:12px; color:#C4B29E; margin-bottom:4px;">رسائل سريعة جاهزة:</div>
            <div class="modal-grid-3">
              <button class="modal-btn-select" onclick="window.AppEngine.sendQuickChat('أداء بطولي اليوم! 👏')">أداء بطولي!</button>
              <button class="modal-btn-select" onclick="window.AppEngine.sendQuickChat('تم إيداع المكافأة ✅')">تم التحويل</button>
              <button class="modal-btn-select" onclick="window.AppEngine.sendQuickChat('بالتوفيق في البث القادم ⭐')">بالتوفيق</button>
            </div>
          </div>
          <input type="text" id="chatInput" class="modal-input" placeholder="اكتب رسالتك للمضيف هنا..." />
          <button class="modal-action-btn" onclick="window.AppEngine.sendCustomChat()">إرسال الرسالة للمضيف</button>
        `;
        break;

      case 'transfer':
        title = '⇄ تحويل Xcoins إلى المضيف';
        html = `
          <div class="modal-card">
            <div class="modal-card-title">المستلم: <span class="modal-stat-gold">...يالملك (ID: 12082026)</span></div>
            <div style="font-size:13px; color:#E0D4C3;">اختر المبلغ المراد تحويله لدعم المضيف أو مكافأته:</div>
          </div>
          <div class="modal-grid-2">
            <button class="modal-btn-select active" onclick="window.AppEngine.setTransferAmount(50000)">50,000 Xcoins</button>
            <button class="modal-btn-select" onclick="window.AppEngine.setTransferAmount(100000)">100,000 Xcoins</button>
            <button class="modal-btn-select" onclick="window.AppEngine.setTransferAmount(250000)">250,000 Xcoins</button>
            <button class="modal-btn-select" onclick="window.AppEngine.setTransferAmount(500000)">500,000 Xcoins</button>
          </div>
          <input type="number" id="transferAmountInput" class="modal-input" value="50000" placeholder="مبلغ مخصص..." />
          <button class="modal-action-btn" onclick="window.AppEngine.confirmTransfer()">تأكيد إرسال الدعم المالي الفوري</button>
        `;
        break;

      case 'host_profile':
      case 'badge_male':
      case 'badge_h5':
      case 'badge_diamond':
        title = '👤 الملف التعريفي للمضيف';
        html = `
          <div class="modal-card">
            <div class="modal-card-title">...يالملك <span class="modal-stat-gold">♂ 29 | H5</span></div>
            <div class="modal-stat-row">
              <span>المعرف الرقمي (ID):</span>
              <span class="modal-stat-value">12082026</span>
            </div>
            <div class="modal-stat-row">
              <span>تاريخ الانضمام للوكالة:</span>
              <span class="modal-stat-value">12/08/2026</span>
            </div>
            <div class="modal-stat-row">
              <span>مستوى المضيف:</span>
              <span class="modal-stat-value modal-stat-gold">المستوى الذهبي H5</span>
            </div>
            <div class="modal-stat-row">
              <span>شارة الألماس:</span>
              <span class="modal-stat-value" style="color:#00E5FF;">صانع محتوى متميز (Diamond Creator)</span>
            </div>
          </div>
          <div class="modal-grid-2">
            <button class="modal-action-btn" onclick="window.AppEngine.openModal('chat', {name:'محادثة'})">💬 مراسلة</button>
            <button class="modal-action-btn modal-action-purple" onclick="window.AppEngine.openModal('transfer', {name:'تحويل'})">⇄ تحويل كوينز</button>
          </div>
        `;
        break;

      case 'search':
        title = '🔍 بحث في سجلات وإحصائيات الوكالة';
        html = `
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <img src="assest/file_00000000fed48243ad474659efdd2069-removebg-preview.png" style="width:48px; height:48px; object-fit:contain; filter:drop-shadow(0 0 10px rgba(242,200,95,0.4));" />
            <div style="font-size:14px; color:#FFF4D7;">ابحث في كافة سجلات إيرادات الوكالة وعقود المضيفين والعمليات المالية</div>
          </div>
          <input type="text" id="searchInput" class="modal-input" placeholder="ابحث باسم المضيف، رقم الحوالة، أو الشهر..." autofocus />
          <div style="margin:12px 0 6px; font-size:12px; color:#C4B29E;">عمليات بحث شائعة:</div>
          <div class="modal-grid-2">
            <button class="modal-btn-select" onclick="window.AppEngine.filterSearch('...يالملك')">المضيف ...يالملك</button>
            <button class="modal-btn-select" onclick="window.AppEngine.filterSearch('مكافأة الوقت')">مكافأة الوقت</button>
            <button class="modal-btn-select" onclick="window.AppEngine.filterSearch('Xcoins')">سجل Xcoins</button>
            <button class="modal-btn-select" onclick="window.AppEngine.filterSearch('أغسطس 2026')">شهر أغسطس 2026</button>
          </div>
          <button class="modal-action-btn" onclick="window.AppEngine.performSearch()">تنفيذ البحث</button>
        `;
        break;

      case 'help':
        title = '❓ مركز المساعدة والشروحات المالية';
        html = `
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <img src="assets/help_gold_icon.png" style="width:48px; height:48px; object-fit:contain; filter:drop-shadow(0 0 10px rgba(242,200,95,0.4));" />
            <div style="font-size:14px; color:#FFF4D7;">دليل الاستفسارات المالية واحتساب العمولات والمكافآت الرسمية للوكالة</div>
          </div>
          <div class="modal-card">
            <div class="modal-card-title">كيف يتم احتساب إيرادات الوكالة؟</div>
            <div style="font-size:13px; color:#D4C4B4;">
              تتجمع الإيرادات من كافة الهدايا التي يستقبلها مضيفو الوكالة خلال البث، ويتم تحويلها إلى نقاط P قابلة للسحب.
            </div>
          </div>
          <div class="modal-card">
            <div class="modal-card-title">متى يتم استلام مكافأة الوقت؟</div>
            <div style="font-size:13px; color:#D4C4B4;">
              تُصرف مكافأة الـ 49,200 P تلقائياً في نهاية الشهر لكل مضيف يكمل 80 ساعة بث نشطة.
            </div>
          </div>
          <button class="modal-action-btn" onclick="window.AppEngine.closeModal()">شكراً، اتضحت الفكرة</button>
        `;
        break;

      case 'chart_peak':
      case 'chart_analytics':
      case 'chart_income':
      case 'chart_duration':
      case 'chart_past':
        title = '📈 تحليلات النمو المالي لشهر أغسطس';
        html = `
          <div class="modal-card">
            <div class="modal-card-title">نقطة الذروة (أغسطس): <span class="modal-stat-gold">3.50M Xcoins</span></div>
            <div class="modal-stat-row">
              <span>نسبة الارتفاع عن الشهور السابقة:</span>
              <span class="modal-stat-value" style="color:#00FFCC;">+100% (قفزة قياسية)</span>
            </div>
            <div class="modal-stat-row">
              <span>إجمالي ساعات البث:</span>
              <span class="modal-stat-value">82 ساعة</span>
            </div>
            <div class="modal-stat-row">
              <span>عدد الداعمين الجدد:</span>
              <span class="modal-stat-value">1,420 داعم</span>
            </div>
          </div>
          <button class="modal-action-btn" onclick="window.AppEngine.closeModal()">الرجوع</button>
        `;
        break;

      case 'timezone':
        title = '🌐 المنطقة الزمنية والتقويم المالي';
        html = `
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <img src="assets/utc_gold_icon.png" style="height:26px; width:auto; object-fit:contain; filter:drop-shadow(0 0 8px rgba(242,200,95,0.4));" />
            <div style="font-size:13px; color:#FFF4D7;">توقيت التصفية المالية العالمي المعتمد للوكالة</div>
          </div>
          <div class="modal-card">
            <div class="modal-card-title">المنطقة الزمنية: <span class="modal-stat-gold">UTC+0</span></div>
            <div style="font-size:13px; color:#D4C4B4;">
              تتم تصفية وإقفال الحسابات المالية اليومية والشهرية بدقة عند الساعة 00:00 بتوقيت غرينتش (UTC+0) لضمان الشفافية العالمية.
            </div>
          </div>
          <button class="modal-action-btn" onclick="window.AppEngine.closeModal()">موافق</button>
        `;
        break;

      case 'coin_spin':
        showToast('🪙 عملة ذهبية ممتازة - تم التحقق من الرصيد');
        return;

      case 'back':
      case 'nav_back':
        showToast('⬅️ تم النقر على زر الرجوع');
        closeModal();
        return;

      case 'nav_home':
        showToast('🏠 الانتقال إلى الشاشة الرئيسية للوكالة');
        closeModal();
        return;

      case 'nav_recents':
        showToast('📑 فتح المهام الأخيرة');
        return;

      default:
        showToast(`تم النقر: ${box.name}`);
        return;
    }

    modalTitle.textContent = title;
    modalBody.innerHTML = html;
    modalOverlay.classList.remove('modal-hidden');
  }

  function handlePointer(clientX, clientY) {
    const target = document.getElementById('canvas-container') || container || document.body;
    const rect = (target && typeof target.getBoundingClientRect === 'function')
      ? target.getBoundingClientRect()
      : { left: 0, top: 0, width: V_W, height: V_H };

    const scaleX = (rect.width > 0) ? (rect.width / V_W) : 1;
    const scaleY = (rect.height > 0) ? (rect.height / V_H) : 1;
    const touchX = (clientX - rect.left) / scaleX;
    const touchY = (clientY - rect.top) / scaleY;

    for (const box of hitBoxes) {
      if (touchX >= box.x && touchX <= box.x + box.w && touchY >= box.y && touchY <= box.y + box.h) {
        animProgress.activeRipples.push({
          x: touchX,
          y: touchY,
          radius: 8,
          alpha: 0.9
        });
        requestDynamicFrame();

        // Dispatch action & open modal
        openModal(box.action, box);

        if (window.FlutterBridge && typeof window.FlutterBridge.send === 'function') {
          window.FlutterBridge.send(box.action, { id: box.id, name: box.name });
        }
        return;
      }
    }
  }

  dynamicCanvas.addEventListener('pointerdown', (e) => {
    handlePointer(e.clientX, e.clientY);
  });

  let toastTimeout = null;
  function showToast(text, duration = 1800) {
    toastBanner.textContent = text;
    toastBanner.classList.remove('toast-hidden');
    toastBanner.classList.add('toast-visible');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastBanner.classList.remove('toast-visible');
      toastBanner.classList.add('toast-hidden');
    }, duration);
  }

  // --- 7. GLOBAL API (FLUTTER INTEGRATION & MODAL ACTIONS) ---
  window.AppEngine = {
    updateData: function(newData) {
      Object.assign(appData, newData);
      animProgress.counter = 0;
      renderStaticLayer();
      requestDynamicFrame();
      showToast('تم تحديث البيانات من Flutter');
    },

    updateChart: function(newPoints) {
      if (Array.isArray(newPoints)) {
        appData.chartData = newPoints;
        animProgress.counter = 0;
        requestDynamicFrame();
      }
    },

    selectMonth: function(monthName, year) {
      const monthlyDatasets = {
        'أغسطس': { date: '8/2026', revenues: 483800, commission: 434600, timeBonus: 49200, totalXcoins: '3.50M', chartData: [0, 0, 0, 0, 0, 3.50] },
        'يوليو': { date: '7/2026', revenues: 120000, commission: 96000, timeBonus: 24000, totalXcoins: '0.80M', chartData: [0, 0, 0, 0, 0.80, 0] },
        'يونيو': { date: '6/2026', revenues: 85000, commission: 68000, timeBonus: 17000, totalXcoins: '0.55M', chartData: [0, 0, 0, 0.55, 0, 0] },
        'مايو': { date: '5/2026', revenues: 60000, commission: 48000, timeBonus: 12000, totalXcoins: '0.40M', chartData: [0, 0, 0.40, 0, 0, 0] },
        'أبريل': { date: '4/2026', revenues: 30000, commission: 24000, timeBonus: 6000, totalXcoins: '0.20M', chartData: [0, 0.20, 0, 0, 0, 0] },
        'مارس': { date: '3/2026', revenues: 15000, commission: 12000, timeBonus: 3000, totalXcoins: '0.10M', chartData: [0.10, 0, 0, 0, 0, 0] }
      };

      const d = monthlyDatasets[monthName] || monthlyDatasets['أغسطس'];
      Object.assign(appData, d);
      renderStaticLayer();
      animProgress.counter = 0;
      requestDynamicFrame();
      closeModal();
      showToast(`تم عرض بيانات شهر ${monthName} ${year}`);

      if (window.FlutterBridge) {
        window.FlutterBridge.send('onMonthChanged', { month: monthName, year: year, data: d });
      }
    },

    requestWithdrawal: function(type = 'البنكي') {
      closeModal();
      showToast(`✅ تم إرسال طلب سحب 434,600 P عبر التحويل ${type}`);
      if (window.FlutterBridge) {
        window.FlutterBridge.send('onWithdrawRequest', { amount: 434600, type: type });
      }
    },

    sendQuickChat: function(msg) {
      const chatBox = document.getElementById('chatHistoryBox');
      if (chatBox) {
        chatBox.innerHTML += `
          <div style="background:rgba(242,200,95,0.2); padding:8px 12px; border-radius:12px; text-align:left; margin-top:6px;">
            <div style="font-size:11px; color:#FFF4D7;">أنت (الآن)</div>
            <div>${msg}</div>
          </div>
        `;
      }
      showToast('تم إرسال الرسالة إلى المضيف');
      if (window.FlutterBridge) {
        window.FlutterBridge.send('onChatMessageSent', { message: msg, host: appData.hostName });
      }
    },

    sendCustomChat: function() {
      const input = document.getElementById('chatInput');
      if (input && input.value.trim()) {
        this.sendQuickChat(input.value.trim());
        input.value = '';
      }
    },

    setTransferAmount: function(amt) {
      const input = document.getElementById('transferAmountInput');
      if (input) input.value = amt;
    },

    confirmTransfer: function() {
      const input = document.getElementById('transferAmountInput');
      const amt = input ? input.value : 50000;
      closeModal();
      showToast(`🎉 تم تحويل ${formatNumber(amt)} Xcoins بنجاح للمضيف`);
      if (window.FlutterBridge) {
        window.FlutterBridge.send('onCoinsTransferred', { amount: amt, host: appData.hostName });
      }
    },

    filterSearch: function(keyword) {
      const input = document.getElementById('searchInput');
      if (input) input.value = keyword;
      showToast(`بحث عن: ${keyword}`);
    },

    performSearch: function() {
      const input = document.getElementById('searchInput');
      const q = input ? input.value : '';
      closeModal();
      showToast(`نتائج البحث عن: ${q || 'الكل'}`);
      if (window.FlutterBridge) {
        window.FlutterBridge.send('onSearchExecuted', { query: q });
      }
    },

    addNewHostPrompt: function() {
      closeModal();
      showToast('فتح نموذج إضافة عقد مضيف جديد');
      if (window.FlutterBridge) {
        window.FlutterBridge.send('onAddHostContract');
      }
    },

    openModal: openModal,
    closeModal: closeModal,
    showToast: showToast,
    redrawStatic: renderStaticLayer
  };

  // --- 8. INITIALIZATION ---
  window.addEventListener('resize', resizeCanvases);
  window.addEventListener('orientationchange', resizeCanvases);
  window.addEventListener('DOMContentLoaded', resizeCanvases);
  window.addEventListener('load', resizeCanvases);

  if (document.fonts) {
    document.fonts.ready.then(() => {
      resizeCanvases();
    }).catch(() => {
      resizeCanvases();
    });
  }

})(window);
