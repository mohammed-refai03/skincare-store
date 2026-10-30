// ==========================================================================
// 404 "GO BACK" SECTION PRESERVATION & REFRESH SCROLL RESTORATION
// ==========================================================================
function saveAndNavigateTo404(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  sessionStorage.setItem('stackly_is_back_from_404', 'true');
  sessionStorage.setItem('stackly_404_prev_url', window.location.href);
  sessionStorage.setItem('stackly_404_prev_scroll', String(currentScrollY));
  window.location.href = '404.html';
}

(function() {
  const isBackFrom404 = sessionStorage.getItem('stackly_is_back_from_404') === 'true';
  const savedScroll = sessionStorage.getItem('stackly_404_prev_scroll');

  // Check if current load is a browser page refresh
  const navEntry = window.performance && performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  const isReload = (navEntry && navEntry.type === 'reload') || (window.performance && performance.navigation && performance.navigation.type === 1);

  if (isReload) {
    // On refresh: Always go to top of page
    sessionStorage.removeItem('stackly_is_back_from_404');
    sessionStorage.removeItem('stackly_404_prev_scroll');
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.addEventListener('load', () => {
      window.scrollTo(0, 0);
    });
  } else if (isBackFrom404 && savedScroll !== null) {
    // Returning from 404 via Go Back: Suppress preloader immediately & snap to exact location without any scrolling
    document.documentElement.classList.add('no-preloader');
    document.documentElement.classList.add('instant-scroll');
    document.body?.classList.add('instant-scroll');

    const targetY = parseInt(savedScroll, 10);

    const applyExactPosition = () => {
      document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important');
      if (document.body) document.body.style.setProperty('scroll-behavior', 'auto', 'important');
      window.scrollTo(0, targetY);
      document.documentElement.scrollTop = targetY;
      if (document.body) document.body.scrollTop = targetY;
    };

    applyExactPosition();

    // Standing listeners to ensure exact position persists through render pipeline
    window.addEventListener('DOMContentLoaded', applyExactPosition);
    window.addEventListener('pageshow', applyExactPosition);
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(applyExactPosition);
    }
    window.addEventListener('load', () => {
      applyExactPosition();
      sessionStorage.removeItem('stackly_is_back_from_404');
      sessionStorage.removeItem('stackly_404_prev_scroll');
      setTimeout(() => {
        document.documentElement.classList.remove('instant-scroll');
        document.body?.classList.remove('instant-scroll');
        document.documentElement.style.removeProperty('scroll-behavior');
        if (document.body) document.body.style.removeProperty('scroll-behavior');
      }, 100);
    });
  }
})();

// ==========================================================================
// GLOBAL 404 NAVIGATION HANDLER
// Intercepts general buttons, links, and i tags outside navbar, footer, login/signup/dashboards, forms,
// while preserving 100% full functional behavior for testimonials, sliders, FAQs, filters, cart, etc.
// ==========================================================================
document.addEventListener('click', function(e) {
  const currentPath = window.location.pathname.toLowerCase();
  if (currentPath.includes('login') || currentPath.includes('signup') || currentPath.includes('dashboard') || currentPath.includes('404') || currentPath.includes('cart')) {
    return;
  }

  // Find closest clicked element: a, button, or i
  const target = e.target.closest('a, button, i');
  if (!target) return;

  // EXEMPTION 1: Navbar & Cart Navigation
  if (target.closest('.site-header, #site-header, .mobile-nav-drawer, #mobile-nav-drawer, .nav-links, .nav-actions, .nav-wrapper, .cart-btn, #nav-cart-btn, [href*="cart.html"], #mobile-drawer-close, .mobile-drawer-close')) {
    return;
  }

  // EXEMPTION 2: Footer (Social Media Icons navigate to 404.html)
  if (target.closest('.site-footer, #footer, footer')) {
    if (target.closest('.social-icon, .footer-socials a, .footer-social a, [class*="social"], a[href*="404"]')) {
      saveAndNavigateTo404(e);
      return;
    }
    return;
  }

  // EXEMPTION 3: Form Controls & Inputs
  if (target.closest('form, input, select, textarea, label, button[type="submit"], .contact-form')) {
    return;
  }

  // EXEMPTION 4: FAQ Accordions (triggers, buttons, icons)
  if (target.closest('.shop-faq-question, .contact-faq-trigger, .guide-faq-question, .faq-question, .shop-faq-item, .contact-faq-item, .guide-faq-item, .faq-item, .contact-faq-icon, .shop-faq-icon')) {
    return;
  }

  // EXEMPTION 5: Testimonials & Hero Sliders (arrows, buttons, dots, icons)
  if (target.closest('.slider-arrow-btn, .slider-prev-btn, .slider-next-btn, #slider-prev-btn, #slider-next-btn, .reviews-slider-arrow, .reviews-nav-btn, #reviews-prev-btn, #reviews-next-btn, .reviews-slider-dots, .reviews-dot, .slider-dot, .slider-dots')) {
    return;
  }

  // EXEMPTION 6: Category Filter Tabs / Toolbar Controls
  if (target.closest('.shop-filter-btn, .filter-btn, .shop-toolbar, .shop-sort-select')) {
    return;
  }

  // EXEMPTION 7: Mobile Hamburger Menu Toggle & Drawer Controls
  if (target.closest('#mobile-toggle, .mobile-menu-toggle, #mobile-drawer-close, .mobile-drawer-close')) {
    return;
  }

  // EXEMPTION 8: All Cart & Add-to-Cart Buttons & Quantity Controls (Never route to 404)
  if (target.closest('.product-quick-add, .trending-quick-add, .shop-quick-add-btn, .shop-card-link-btn, .btn-ritual-shop, .cart-addon-btn, .cart-clear-btn, .promo-apply-btn, .btn-checkout-page, .btn-spotlight, .qty-btn, .cart-item-del-btn, .cart-qty-pill, .cart-item-remove, .cart-drawer, #cart-drawer, .cart-overlay, #cart-overlay, [onclick*="Cart"], [onclick*="cart"], [onclick*="Bag"], [onclick*="bag"], [onclick*="Qty"], [onclick*="qty"], [onclick*="Checkout"], [onclick*="checkout"]')) {
    return;
  }

  // All other generic buttons, links, and standalone i tags route to 404.html
  saveAndNavigateTo404(e);
}, true);

/**
 * STACKLY LUXURY BOTANICAL SKINCARE — MASTER JAVASCRIPT
 * Adheres strictly to the Stackly Master Setup & Development Guidelines
 */

// --- 1. Product Catalog Database ---
const PRODUCTS = {
  1: {
    id: 1,
    name: "Purifying Gel Cleanser",
    category: "cleanser",
    price: 38,
    img: "assets/images/product_cleanser.webp",
    desc: "A gentle botanical gel cleanser infused with cold-pressed camellia seed and calendula to balance sebum without stripping."
  },
  2: {
    id: 2,
    name: "Hydrating Night Elixir",
    category: "serum",
    price: 54,
    img: "assets/images/product_duo.webp",
    desc: "Triple-ceramide complex with bio-hyaluronic acid designed to restore the skin barrier while you sleep."
  },
  3: {
    id: 3,
    name: "Botanical Glow Facial Oil",
    category: "serum",
    price: 48,
    img: "assets/images/product_oil.webp",
    desc: "100% cold-pressed organic rosehip seed, jojoba, and blue tansy oil to calm redness and seal in deep radiance."
  },
  4: {
    id: 4,
    name: "Rejuvenating Jade Ritual Set",
    category: "sets",
    price: 62,
    img: "assets/images/product_roller_set.webp",
    desc: "Authentic Xiuyan jade facial roller paired with our calming peptides cream to stimulate lymphatic drainage."
  },
  5: {
    id: 5,
    name: "The Lily Ritual Set",
    category: "sets",
    price: 89,
    img: "assets/images/lily_ritual_set.webp",
    desc: "Signature cold-extracted white lily petals and plant-derived ceramide barrier repair set."
  },
  6: {
    id: 6,
    name: "Silky Replenishing Botanical Serum",
    category: "serums",
    price: 48,
    img: "assets/images/shop_prod_amber_serum.webp",
    desc: "Silky replenishing antioxidant serum with bio-fermented actives for glass-skin hydration."
  },
  7: {
    id: 7,
    name: "Night Repair Barrier Trio",
    category: "treatments",
    price: 62,
    img: "assets/images/shop_prod_purple_trio.webp",
    desc: "Intensive 3-step overnight lipid barrier recovery trio with botanical ceramides."
  },
  8: {
    id: 8,
    name: "Radiance Gold Face Elixir",
    category: "serums",
    price: 54,
    img: "assets/images/shop_prod_gold_dropper.webp",
    desc: "Luminous micro-gold infused cold-pressed plant oil for instant skin vitality."
  },
  9: {
    id: 9,
    name: "Ocean Mineral Balancing Mist",
    category: "toners",
    price: 38,
    img: "assets/images/shop_prod_blue_toner.webp",
    desc: "Marine botanicals, spirulina extract, and sea kelp minerals to balance and refresh."
  },
  10: {
    id: 10,
    name: "Gentle Botanical Gel Cleanser",
    category: "cleansers",
    price: 32,
    img: "assets/images/shop_prod_white_gel.webp",
    desc: "Ultra-soothing pH-balanced cleanser that melts impurities while preserving moisture."
  },
  11: {
    id: 11,
    name: "Artisanal Herb Cold-Pressed Soap",
    category: "cleansers",
    price: 24,
    img: "assets/images/shop_prod_herbal_bar.webp",
    desc: "Traditional saponified botanical bar crafted with cold-pressed herbs and calendula."
  },
  12: {
    id: 12,
    name: "Velvet Dew Ceramide Barrier Cream",
    category: "creams",
    price: 46,
    img: "assets/images/shop_prod_ceramide_cream.webp",
    desc: "Velvety whipped barrier cream packed with 5 skin-identical ceramides and squalane."
  },
  13: {
    id: 13,
    name: "Phyto-Collagen Restorative Night Butter",
    category: "creams",
    price: 58,
    img: "assets/images/shop_prod_night_butter.webp",
    desc: "Rich restorative balm infused with plant collagen and organic shea butter."
  },
  14: {
    id: 14,
    name: "Hydra-Calm Centella Clarifying Toner",
    category: "toners",
    price: 34,
    img: "assets/images/shop_prod_centella_toner.webp",
    desc: "Centella asiatica and madecassoside toner to calm visible redness and balance pore texture."
  },
  15: {
    id: 15,
    name: "Youth Cellular Peptide Ampoule",
    category: "treatments",
    price: 68,
    img: "assets/images/shop_prod_peptide_ampoule.webp",
    desc: "High-potency multi-peptide ampoule targeting firmness, elasticity, and dermal density."
  },
  16: {
    id: 16,
    name: "Bakuchiol Cellular Resurfacing Mask",
    category: "treatments",
    price: 52,
    img: "assets/images/shop_prod_bakuchiol_mask.webp",
    desc: "Gentle plant-derived retinol alternative mask for smooth cellular regeneration."
  },
  17: {
    id: 17,
    name: "Superberry Antioxidant Eye Recovery Balm",
    category: "creams",
    price: 42,
    img: "assets/images/shop_prod_eye_balm.webp",
    desc: "Nutrient-dense berry extract eye treatment targeting dark circles and micro-lines."
  },
  18: {
    id: 18,
    name: "The Daily Ritual Set",
    category: "sets",
    price: 78,
    img: "assets/images/shop_ritual_set_pink.webp",
    desc: "Complete 4-piece essential botanical morning and evening skincare ritual collection."
  }
};

// Persistent Cart State with LocalStorage
function loadStoredCart() {
  try {
    const saved = localStorage.getItem("stackly_cart");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [
    { id: 1, qty: 1 },
    { id: 2, qty: 1 }
  ];
}

let cart = loadStoredCart();

function persistCart() {
  try {
    localStorage.setItem("stackly_cart", JSON.stringify(cart));
  } catch (e) {}
}

// --- 2. Initialize on DOM Content Loaded ---
document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS (Guideline #9)
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches
    });
  }

  // Setup core components
  renderCart();
  setupHeroSlider();
  setupReviewsSlider();
  setupFilterTabs();
  setupHeaderScroll();
  setupMobileMenu();
  setupFormValidation();
  trackActiveSection();
  initPreloader();
  initStatsCounter();
});

// --- 3. Hero Section Image Slider (Guideline #4) ---
function setupHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const prevBtn = document.getElementById("slider-prev-btn");
  const nextBtn = document.getElementById("slider-next-btn");
  const dotsContainer = document.getElementById("slider-dots-container");
  const sliderWrapper = document.getElementById("hero-slides-wrapper");

  if (!slides || slides.length === 0) return;

  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 5500; // 5.5 seconds per slide

  // Create dot indicators
  if (dotsContainer && dotsContainer.children.length === 0) {
    slides.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.className = `slider-dot ${idx === 0 ? "active" : ""}`;
      dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
      dot.addEventListener("click", () => {
        goToSlide(idx);
        restartAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = document.querySelectorAll(".slider-dot");

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
    if (dots[currentSlide]) dots[currentSlide].classList.add("active");
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // Event Listeners for manual controls
  nextBtn?.addEventListener("click", () => {
    nextSlide();
    restartAutoSlide();
  });

  prevBtn?.addEventListener("click", () => {
    prevSlide();
    restartAutoSlide();
  });

  // Auto sliding
  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function stopAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
  }

  function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Pause on mouse hover / touch interaction
  sliderWrapper?.addEventListener("mouseenter", stopAutoSlide);
  sliderWrapper?.addEventListener("mouseleave", startAutoSlide);
  sliderWrapper?.addEventListener("touchstart", stopAutoSlide, { passive: true });
  sliderWrapper?.addEventListener("touchend", startAutoSlide, { passive: true });

  startAutoSlide();
}

// --- 3B. Testimonials / Real Results Auto & Manual Slider ---
function setupReviewsSlider() {
  const track = document.getElementById("reviews-slider-track");
  const viewport = document.getElementById("reviews-slider-viewport");
  const wrapper = document.getElementById("reviews-slider-wrapper");
  const prevBtn = document.getElementById("reviews-prev-btn");
  const nextBtn = document.getElementById("reviews-next-btn");
  const dotsContainer = document.getElementById("reviews-dots-container");
  const playPauseBtn = document.getElementById("reviews-play-pause-btn");

  if (!track || !viewport) return;

  const cards = track.querySelectorAll(".review-card");
  if (cards.length === 0) return;

  let currentIndex = 0;
  let isAutoPlaying = true;
  let slideInterval = null;
  const slideDuration = 4500; // 4.5 seconds per slide transition

  function getCardsPerView() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    const cpv = getCardsPerView();
    return Math.max(0, cards.length - cpv);
  }

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    const maxIdx = getMaxIndex();
    for (let i = 0; i <= maxIdx; i++) {
      const dot = document.createElement("button");
      dot.className = `reviews-dot ${i === currentIndex ? "active" : ""}`;
      dot.setAttribute("aria-label", `Go to customer feedback slide ${i + 1}`);
      dot.addEventListener("click", () => {
        goToSlide(i);
        restartAutoSlide();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateSliderPosition() {
    const card = cards[0];
    if (!card) return;
    const cardWidth = card.getBoundingClientRect().width;
    const computedStyle = window.getComputedStyle(track);
    const gap = parseFloat(computedStyle.gap) || 30;

    const maxIdx = getMaxIndex();
    if (currentIndex > maxIdx) {
      currentIndex = maxIdx;
    }

    const shift = (cardWidth + gap) * currentIndex;
    track.style.transform = `translateX(-${shift}px)`;

    // Update active state on pagination dots
    const dots = dotsContainer?.querySelectorAll(".reviews-dot");
    if (dots) {
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentIndex);
      });
    }
  }

  function goToSlide(index) {
    const maxIdx = getMaxIndex();
    if (index > maxIdx) {
      currentIndex = 0; // Smooth circular wrap
    } else if (index < 0) {
      currentIndex = maxIdx;
    } else {
      currentIndex = index;
    }
    updateSliderPosition();
  }

  function nextSlide() {
    const maxIdx = getMaxIndex();
    if (currentIndex >= maxIdx) {
      goToSlide(0);
    } else {
      goToSlide(currentIndex + 1);
    }
  }

  function prevSlide() {
    const maxIdx = getMaxIndex();
    if (currentIndex <= 0) {
      goToSlide(maxIdx);
    } else {
      goToSlide(currentIndex - 1);
    }
  }

  // Manual Arrow controls
  nextBtn?.addEventListener("click", () => {
    nextSlide();
    restartAutoSlide();
  });

  prevBtn?.addEventListener("click", () => {
    prevSlide();
    restartAutoSlide();
  });

  // Autoplay methods
  function startAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    if (isAutoPlaying) {
      slideInterval = setInterval(nextSlide, slideDuration);
    }
  }

  function stopAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
  }

  function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Play / Pause toggle
  playPauseBtn?.addEventListener("click", () => {
    isAutoPlaying = !isAutoPlaying;
    if (isAutoPlaying) {
      playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      playPauseBtn.setAttribute("aria-label", "Pause testimonial slider");
      startAutoSlide();
    } else {
      playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      playPauseBtn.setAttribute("aria-label", "Play testimonial slider");
      stopAutoSlide();
    }
  });

  // Pause on mouse hover (Desktop)
  wrapper?.addEventListener("mouseenter", stopAutoSlide);
  wrapper?.addEventListener("mouseleave", () => {
    if (isAutoPlaying) startAutoSlide();
  });

  // Mobile / Tablet Touch Swipe
  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoSlide();
  }, { passive: true });

  viewport.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    if (isAutoPlaying) startAutoSlide();
  }, { passive: true });

  // Handle window resizing
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderDots();
      updateSliderPosition();
    }, 150);
  });

  // Keyboard navigation
  wrapper?.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
      restartAutoSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
      restartAutoSlide();
    }
  });

  // Initial initialization
  renderDots();
  updateSliderPosition();
  startAutoSlide();
}

// --- 4. Interactive Slide-out Shopping Cart ---
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const cartCounter = document.getElementById("cart-counter");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartSubtotalVal = document.getElementById("cart-subtotal-val");
const shippingText = document.getElementById("shipping-text");
const shippingProgress = document.getElementById("shipping-progress");
const toastNotice = document.getElementById("toast-notice");
const toastMessage = document.getElementById("toast-message");
const openCartBtn = document.getElementById("open-cart-btn");

function openCart() {
  // Modal drawer display disabled as per design requirement
  return;
}

function closeCart() {
  cartDrawer?.classList.remove("active");
  cartOverlay?.classList.remove("active");
  document.body.style.overflow = "";
}

openCartBtn?.addEventListener("click", openCart);

function addToCart(productId, customItem) {
  const pid = typeof productId === 'string' && !isNaN(Number(productId)) ? Number(productId) : productId;
  let existing = cart.find(item => item.id == pid || (customItem && item.name === customItem.name));
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    if (customItem) {
      cart.push({ id: pid, qty: 1, ...customItem });
    } else {
      cart.push({ id: pid, qty: 1 });
    }
  }

  persistCart();
  renderCart();
  if (typeof renderCartPage === "function") {
    renderCartPage();
  }

  // Update header badges across page
  const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  document.querySelectorAll("#cart-counter, .cart-count").forEach(b => {
    b.textContent = count;
  });

  const prod = PRODUCTS[pid] || customItem || { name: "Formulation" };
  const prodName = prod.name || "Formulation";

  // Provide feedback toast
  if (typeof showShopToast === "function") {
    showShopToast(`Added "${prodName}" to your bag`);
  } else {
    showToast(`Added ${prodName} to your bag`);
  }

  // Modal drawer opening removed on add to cart
}

function updateQty(productId, delta) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].qty += delta;
    if (cart[itemIndex].qty <= 0) {
      cart.splice(itemIndex, 1);
    }
  }
  persistCart();
  renderCart();
  if (typeof renderCartPage === "function") {
    renderCartPage();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  persistCart();
  renderCart();
  if (typeof renderCartPage === "function") {
    renderCartPage();
  }
  showToast("Item removed from your bag");
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartCounter) cartCounter.textContent = totalItems;

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div style="text-align: center; padding: 48px 16px; color: #8c8780;">
        <i class="fa-solid fa-bag-shopping" style="font-size: 40px; margin-bottom: 16px; opacity: 0.4;"></i>
        <p style="font-size: 15px; font-weight: 500; margin-bottom: 8px; color: #181614;">Your bag is empty</p>
        <p style="font-size: 13px;">Discover our botanical rituals to fill your bag.</p>
      </div>
    `;
    if (cartSubtotalVal) cartSubtotalVal.textContent = "$0.00";
    if (shippingProgress) shippingProgress.style.width = "0%";
    if (shippingText) shippingText.innerHTML = `Add $75.00 more for <strong>FREE Worldwide Shipping</strong>`;
    return;
  }

  let subtotal = 0;
  cartItemsContainer.innerHTML = cart.map(item => {
    const product = PRODUCTS[item.id] || {
      id: item.id,
      name: item.name || "Botanical Formulation",
      price: item.price || 48,
      img: item.img || item.image || "assets/images/shop_prod_amber_serum.webp"
    };
    const itemTotal = product.price * item.qty;
    subtotal += itemTotal;

    return `
      <div class="cart-item">
        <div class="cart-item-img">
          <img src="${product.img}" alt="${product.name}">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${product.name}</h4>
          <div class="cart-item-price">$${product.price}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateQty(${item.id}, -1)" aria-label="Decrease quantity">
              <i class="fa-solid fa-minus"></i>
            </button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${item.id}, 1)" aria-label="Increase quantity">
              <i class="fa-solid fa-plus"></i>
            </button>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  if (cartSubtotalVal) cartSubtotalVal.textContent = `$${subtotal.toFixed(2)}`;

  const freeShippingThreshold = 75;
  if (subtotal >= freeShippingThreshold) {
    if (shippingProgress) shippingProgress.style.width = "100%";
    if (shippingText) shippingText.innerHTML = `You unlocked <strong>FREE Worldwide Shipping!</strong>`;
  } else {
    const remaining = (freeShippingThreshold - subtotal).toFixed(2);
    const percent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
    if (shippingProgress) shippingProgress.style.width = `${percent}%`;
    if (shippingText) shippingText.innerHTML = `Add $${remaining} more for <strong>FREE Worldwide Shipping</strong>`;
  }
}

function handleCheckout() {
  if (cart.length === 0) {
    showToast("Your bag is empty! Add products first.");
    return;
  }
  if (typeof openCheckoutModal === "function") {
    openCheckoutModal();
  } else {
    window.location.href = "cart.html";
  }
}

// Toast Alert
let toastTimer = null;
function showToast(message) {
  if (!toastNotice || !toastMessage) return;
  toastMessage.textContent = message;
  toastNotice.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastNotice.classList.remove("show");
  }, 3500);
}

// --- 5. Bestseller Filter Tabs ---
function setupFilterTabs() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      productCards.forEach(card => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "flex";
          card.style.opacity = "0";
          card.style.transform = "translateY(10px)";
          setTimeout(() => {
            card.style.transition = "all 0.3s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 20);
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// --- 6. Mobile Menu & Full Screen Navigation Drawer ---
function setupMobileMenu() {
  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileDrawer = document.getElementById("mobile-nav-drawer");
  const drawerClose = document.getElementById("mobile-drawer-close");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link, .mobile-nav-drawer .btn-login, .mobile-drawer-header .logo");

  if (!mobileDrawer) return;

  let savedScrollY = 0;

  function openMenu() {
    savedScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    mobileDrawer.classList.add("active");
    document.documentElement.classList.add("menu-open");
    document.body.classList.add("menu-open");
    if (mobileToggle) {
      mobileToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      mobileToggle.setAttribute("aria-expanded", "true");
    }
  }

  function closeMenu() {
    mobileDrawer.classList.remove("active");
    document.documentElement.classList.remove("menu-open");
    document.body.classList.remove("menu-open");
    if (mobileToggle) {
      mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      mobileToggle.setAttribute("aria-expanded", "false");
    }
    // Stay on the exact section where hamburger was opened; avoid smooth scroll animation from top to mid
    const htmlElem = document.documentElement;
    const originalBehavior = htmlElem.style.scrollBehavior;
    htmlElem.style.scrollBehavior = 'auto';
    window.scrollTo(0, savedScrollY);
    document.documentElement.scrollTop = savedScrollY;
    document.body.scrollTop = savedScrollY;
    setTimeout(() => {
      htmlElem.style.scrollBehavior = originalBehavior;
    }, 50);
  }

  if (mobileToggle) {
    mobileToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (mobileDrawer.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
    });
  }

  // Stop background scrolling functionality when hamburger drawer is opened
  window.addEventListener('touchmove', (e) => {
    if (mobileDrawer.classList.contains("active") && !mobileDrawer.contains(e.target)) {
      e.preventDefault();
    }
  }, { passive: false });

  // Close mobile drawer after selecting any navigation link
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close when pressing Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileDrawer.classList.contains("active")) {
      closeMenu();
    }
  });

  // Close if window resizes past mobile breakpoint (> 991px)
  window.addEventListener("resize", () => {
    if (window.innerWidth > 991 && mobileDrawer.classList.contains("active")) {
      closeMenu();
    }
  });
}

// --- 7. Sticky Header ---
function setupHeaderScroll() {
  const siteHeader = document.getElementById("site-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add("scrolled");
    } else {
      siteHeader?.classList.remove("scrolled");
    }
  });
}

// --- 8. Comprehensive Form Validation Engine (Guideline #6) ---
/**
 * Strict rules:
 * Name: alphabetic characters and spaces only. Error: "Please enter a valid name using alphabetic characters only."
 * Phone: digits only, 10 digits Indian mobile. Error: "Please enter a valid phone number using digits only."
 * Email: standard format.
 * Passwords: >= 8 characters and confirm match.
 */
function setupFormValidation() {
  const forms = document.querySelectorAll("form[data-validate]");

  forms.forEach(form => {
    const inputs = form.querySelectorAll("input, textarea, select");

    // Real-time error removal as user inputs valid data
    inputs.forEach(input => {
      input.addEventListener("input", () => {
        validateSingleField(input);
      });
      input.addEventListener("blur", () => {
        validateSingleField(input);
      });
    });

    // Form submit validation
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let isFormValid = true;

      inputs.forEach(input => {
        const isValid = validateSingleField(input);
        if (!isValid) isFormValid = false;
      });

      if (isFormValid) {
        handleFormSuccess(form);
      } else {
        const firstInvalid = form.querySelector(".is-invalid");
        firstInvalid?.focus();
      }
    });
  });
}

function validateSingleField(input) {
  const type = input.getAttribute("data-type") || input.type;
  const val = input.value.trim();
  const isRequired = input.hasAttribute("required");
  const wrap = input.closest(".glow-club-form-wrap") || input.closest(".form-group") || input.parentElement;
  const form = input.closest("form");
  const errorElem = (wrap ? wrap.querySelector(".error-message") : null) || (form ? form.querySelector(".error-message") : null);

  let isValid = true;
  let errorMsg = "";

  // Required field check
  if (isRequired && !val) {
    isValid = false;
    errorMsg = "This field is required.";
  } 
  // Name validation rule (alphabetic characters and spaces only)
  else if (type === "name" || input.id.includes("name")) {
    const nameRegex = /^[A-Za-z\s'-]+$/;
    if (val && !nameRegex.test(val)) {
      isValid = false;
      errorMsg = "Please enter a valid name using alphabetic characters only.";
    }
  }
  // Phone validation rule (digits only, Indian 10 digits)
  else if (type === "phone" || type === "tel" || input.id.includes("phone")) {
    const cleanDigits = val.replace(/\s+/g, "");
    const phoneRegex = /^[6-9]\d{9}$/;
    if (val && (!/^\d+$/.test(cleanDigits) || !phoneRegex.test(cleanDigits))) {
      isValid = false;
      errorMsg = "Please enter a valid phone number using digits only.";
    }
  }
  // Email validation rule
  else if (type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      isValid = false;
      errorMsg = "Email address is required.";
    } else if (!emailRegex.test(val)) {
      isValid = false;
      errorMsg = "Please enter a valid email address.";
    }
  }
  // Password validation rule
  else if (type === "password" && !input.id.includes("confirm")) {
    if (val && val.length < 8) {
      isValid = false;
      errorMsg = "Password must be at least 8 characters.";
    }
  }
  // Confirm password rule
  else if (input.id.includes("confirm")) {
    const pwdInput = input.form ? input.form.querySelector("input[type='password']:not([id*='confirm'])") : null;
    if (val && pwdInput && val !== pwdInput.value) {
      isValid = false;
      errorMsg = "Passwords do not match.";
    }
  }

  // Update UI error state
  if (!isValid) {
    input.classList.add("is-invalid");
    if (form && input.classList.contains("glow-club-input")) {
      form.classList.add("is-invalid");
    }
    if (errorElem) {
      errorElem.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${errorMsg}`;
      errorElem.classList.add("visible");
    }
  } else {
    input.classList.remove("is-invalid");
    if (form && input.classList.contains("glow-club-input")) {
      form.classList.remove("is-invalid");
    }
    if (errorElem) {
      errorElem.classList.remove("visible");
      errorElem.textContent = "";
    }
  }

  return isValid;
}

function handleFormSuccess(form) {
  const formId = form.id;
  if (formId === "login-form") {
    showToast("Signed in successfully! Redirecting...");
    setTimeout(() => { window.location.href = "dashboard.html"; }, 1200);
  } else if (formId === "signup-form") {
    showToast("Account created successfully! Redirecting to login...");
    setTimeout(() => { window.location.href = "login.html"; }, 1500);
  } else if (formId === "contact-form") {
    showToast("Thank you! Your message has been sent to the Stackly team.");
    form.reset();
  } else if (formId === "newsletter-form") {
    form.reset();
    window.location.href = "404.html";
  } else {
    showToast("Form submitted successfully!");
    form.reset();
  }
}

// --- 11. Global Section Telemetry & 404 Navigation Router ---
function trackActiveSection() {
  if (window.location.pathname.endsWith("404.html")) return;

  const currentUrl = window.location.href;
  sessionStorage.setItem("stackly_last_section_url", currentUrl);

  // Identify visible in-page section with an ID
  const sections = document.querySelectorAll("section[id], div[id]");
  let activeId = null;
  const scrollPos = window.scrollY + 180;

  for (const sec of sections) {
    if (sec.id && !sec.id.includes("tab-") && !sec.id.includes("drawer") && !sec.id.includes("cart") && !sec.id.includes("header") && !sec.id.includes("modal")) {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        activeId = sec.id;
        break;
      }
    }
  }

  if (activeId) {
    const urlWithHash = window.location.origin + window.location.pathname + "#" + activeId;
    sessionStorage.setItem("stackly_last_section_url", urlWithHash);
    sessionStorage.setItem("stackly_last_section_name", "#" + activeId);
  }
}

// Debounced scroll listener for section tracking
let sectionTrackTimeout = null;
window.addEventListener("scroll", () => {
  if (sectionTrackTimeout) clearTimeout(sectionTrackTimeout);
  sectionTrackTimeout = setTimeout(trackActiveSection, 150);
}, { passive: true });

window.addEventListener("hashchange", trackActiveSection);

// Intercept unused buttons, placeholder href="#" links, policy links, and unhandled <i> tags to navigate to 404
document.addEventListener("click", (e) => {
  // Check anchor links with placeholder hrefs or 404 destinations
  const link = e.target.closest("a");
  if (link) {
    const href = link.getAttribute("href");
    // If href is literally "#" or empty or javascript:void(0)
    if (href === "#" || href === "#!" || href === "" || href === "javascript:void(0)") {
      e.preventDefault();
      trackActiveSection();
      window.location.href = "404.html";
      return;
    }

    // Explicit 404 link or policy link navigation
    if (href === "404.html" || (href && href.endsWith("/404.html")) || link.hasAttribute("data-policy")) {
      const footer = link.closest("footer");
      const section = link.closest("section[id], footer[id]");
      const currentPath = window.location.pathname.split("/").pop() || "index.html";
      const sectionId = section && section.id ? `#${section.id}` : (footer ? "#footer" : "");
      const linkText = link.textContent.trim().replace(/\s+/g, " ");

      sessionStorage.setItem("stackly_last_section_url", window.location.origin + window.location.pathname + sectionId);
      sessionStorage.setItem("stackly_last_section_name", `${currentPath}${sectionId ? " (" + sectionId + ")" : ""}`);
    }
  }

  // Check standalone unhandled <i> tags
  const icon = e.target.closest("i");
  if (icon && !icon.closest("a") && !icon.closest("button") && !icon.closest(".slider-dot") && !icon.closest(".tab-pane") && !icon.closest(".form-group") && !icon.closest(".dashboard-sidebar") && !icon.closest(".toast-notice")) {
    trackActiveSection();
    window.location.href = "404.html";
  }
});

// --- Luxury Botanical Preloader (< 2 Seconds) ---
function initPreloader() {
  const preloader = document.getElementById("site-preloader") || document.querySelector(".site-preloader");
  if (!preloader) return;

  if (document.documentElement.classList.contains('no-preloader')) {
    preloader.style.display = 'none';
    if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
    return;
  }

  const dismissPreloader = () => {
    if (preloader.classList.contains("fade-out")) return;
    preloader.classList.add("fade-out");
    setTimeout(() => {
      if (preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
      }
    }, 500);
  };

  // Dismiss within 1.35s + 0.45s fade = 1.8s (< 2 seconds total)
  setTimeout(dismissPreloader, 1350);
}

// --- Home Page Stats Number Counting Animation on Scroll ---
function initStatsCounter() {
  const statsSection = document.querySelector(".stats-section");
  if (!statsSection) return;

  const counters = statsSection.querySelectorAll(".stat-counter");
  if (!counters.length) return;

  let hasAnimated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute("data-target")) || 0;
      const decimals = parseInt(counter.getAttribute("data-decimals"), 10) || 0;
      const duration = 1600; // 1.6s smooth easing
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Cubic ease out
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeOut * target;

        if (decimals > 0) {
          counter.textContent = currentVal.toFixed(decimals);
        } else {
          counter.textContent = Math.floor(currentVal);
        }

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = decimals > 0 ? target.toFixed(decimals) : target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateCounters();
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.25
    });

    observer.observe(statsSection);
  } else {
    animateCounters();
  }
}
