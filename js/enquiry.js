//  enquiry.js   Peak Performance Fitness | Enquiry Page

document.addEventListener("DOMContentLoaded", () => {

  // ── 1. INTERACTIVE SERVICE TABS ──────────────────────────────
  // Replaces the plain <select> with clickable tab buttons so
  // users can browse services visually before choosing one.

  const serviceInfo = {
    "Personal Training": {
      desc: "One-on-one sessions tailored to your goals strength, weight loss, or athletic performance. Our certified trainers build a personalised programme just for you.",
      badge: "Most Popular"
    },
    "Group Training": {
      desc: "High-energy classes in a motivating team environment. Choose from HIIT, circuit training, boxing fitness, and more up to 12 people per class.",
      badge: "Great Value"
    },
    "Nutrition Plan": {
      desc: "A custom meal plan created by a registered dietitian that complements your training. Includes a 30-day check-in and macro tracking guidance.",
      badge: "Holistic"
    }
  };

  const selectEl = document.querySelector("select");
  if (selectEl) {
    // Build the tab UI
    const wrapper = document.createElement("div");
    wrapper.className = "service-tabs";

    const tabStrip = document.createElement("div");
    tabStrip.className = "tab-strip";

    const tabPanel = document.createElement("div");
    tabPanel.className = "tab-panel";

    Object.keys(serviceInfo).forEach((name, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tab-btn" + (i === 0 ? " active" : "");
      btn.dataset.service = name;
      btn.textContent = name;
      btn.addEventListener("click", () => selectService(name));
      tabStrip.appendChild(btn);
    });

    wrapper.appendChild(tabStrip);
    wrapper.appendChild(tabPanel);

    // Hidden input carries the actual value to validation
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "service";
    hiddenInput.id = "selected-service";
    hiddenInput.value = Object.keys(serviceInfo)[0];

    selectEl.parentNode.insertBefore(wrapper, selectEl);
    selectEl.parentNode.insertBefore(hiddenInput, selectEl);
    selectEl.style.display = "none";

    function selectService(name) {
      hiddenInput.value = name;
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.service === name));
      const info = serviceInfo[name];
      tabPanel.innerHTML = `
        <span class="tab-icon">${info.icon}</span>
        <div class="tab-text">
          <strong>${name}</strong>
          <span class="tab-badge">${info.badge}</span>
          <p>${info.desc}</p>
        </div>`;
    }
    selectService(Object.keys(serviceInfo)[0]);
  }


  // 2. FORM VALIDATION 

  const form = document.querySelector("form");
  const fields = {
    name: document.querySelector('input[name="name"]'),
    email: document.querySelector('input[name="email"]'),
    message: document.querySelector("textarea")
  };

  // Attach a real-time error field beneath each input
  Object.entries(fields).forEach(([key, el]) => {
    if (!el) return;
    const err = document.createElement("span");
    err.className = "field-error";
    err.id = `err-${key}`;
    el.insertAdjacentElement("afterend", err);

    // Clear error on input
    el.addEventListener("input", () => clearError(key));
  });

  function setError(key, msg) {
    const el = fields[key];
    const err = document.getElementById(`err-${key}`);
    if (el)  el.classList.add("invalid");
    if (err) err.textContent = msg;
  }

  function clearError(key) {
    const el = fields[key];
    const err = document.getElementById(`err-${key}`);
    if (el)  el.classList.remove("invalid");
    if (err) err.textContent = "";
  }

  function validateEnquiry() {
    let valid = true;

    // Name required, letters/spaces only, 2+ chars
    const name = fields.name?.value.trim() ?? "";
    if (!name) {
      setError("name", "Please enter your full name."); valid = false;
    } else if (name.length < 2) {
      setError("name", "Name must be at least 2 characters."); valid = false;
    } else if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      setError("name", "Name may only contain letters, spaces, hyphens, or apostrophes."); valid = false;
    } else {
      clearError("name");
    }

    // Email – required, valid format
    const email = fields.email?.value.trim() ?? "";
    const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email) {
      setError("email", "Please enter your email address."); valid = false;
    } else if (!emailRE.test(email)) {
      setError("email", "Please enter a valid email (e.g. you@example.com)."); valid = false;
    } else {
      clearError("email");
    }

    // Message required, 10+ chars
    const message = fields.message?.value.trim() ?? "";
    if (!message) {
      setError("message", "Please tell us a bit about your goals or questions."); valid = false;
    } else if (message.length < 10) {
      setError("message", "Message is too short please provide at least 10 characters."); valid = false;
    } else {
      clearError("message");
    }

    return valid;
  }


  // 3. SUCCESS MODAL

  // Build modal once and reuse
  const modal = document.createElement("div");
  modal.id = "success-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "modal-title");
  modal.innerHTML = `
    <div class="modal-card">
      <h2 id="modal-title">Enquiry Received!</h2>
      <p id="modal-body"></p>
      <button id="modal-close" type="button">Done</button>
    </div>`;
  document.body.appendChild(modal);

  document.getElementById("modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  function openModal(name, service) {
    document.getElementById("modal-body").innerHTML =
      `Thank you, <strong>${name}</strong>! Your enquiry about <strong>${service}</strong> has been submitted.<br>
       A Peak Performance coach will contact you within <strong>1-2 business days</strong>.`;
    modal.classList.add("open");
    document.getElementById("modal-close").focus();
  }

  function closeModal() {
    modal.classList.remove("open");
  }


  // 4. FORM SUBMIT 

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (!validateEnquiry()) return;

      const name    = fields.name.value.trim();
      const service = document.getElementById("selected-service")?.value
                      || document.querySelector("select")?.value
                      || "your chosen service";
      openModal(name, service);
      form.reset();
      // Reset tabs to first option
      const firstService = Object.keys(serviceInfo)[0];
      if (typeof selectService === "function") selectService(firstService);
    });
  }


  // 5. ACCORDION – FAQ 
  // Appended below the form as a bonus interactive section.

  const faqs = [
    { q: "How do I sign up for a session?", a:"Complete the enquiry form above and a coach will reach out to schedule your first session within 1-2 business days."},
    { q: "Do I need prior fitness experience?", a:"Not at all! Our trainers design programmes for all fitness levels from complete beginners to competitive athletes."},
    { q: "Can I change my service after enquiring?", a:"Absolutely. Just mention your preferred change when the coach contacts you, or send a new enquiry."},
    { q: "Where are your gyms located?", a: "We currently have branches in Bloemfontein (123 Main Street) and Pretoria (45 Fitness Road). More locations coming soon."}
  ];

  const main = document.querySelector("main");
  if (main) {
    const section = document.createElement("section");
    section.className = "faq-section";
    section.innerHTML = `<h2>Frequently Asked Questions</h2>`;

    faqs.forEach(({ q, a }) => {
      const item = document.createElement("div");
      item.className = "accordion-item";
      item.innerHTML = `
        <button class="accordion-trigger" type="button" aria-expanded="false">
          <span>${q}</span>
          <span class="accordion-icon">+</span>
        </button>
        <div class="accordion-body" hidden><p>${a}</p></div>`;

      const trigger = item.querySelector(".accordion-trigger");
      const body    = item.querySelector(".accordion-body");
      const icon    = item.querySelector(".accordion-icon");

      trigger.addEventListener("click", () => {
        const open = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!open));
        body.hidden = open;
        icon.textContent = open ? "+" : "-";
      });

      section.appendChild(item);
    });

    main.appendChild(section);
  }


  // 6. LIGHTBOX GALLERY
  // Builds a gym image gallery below the FAQ section.
  // Clicking any image opens it in a full-screen lightbox overlay.

  const galleryImages = [
    { src: "images/gym_floor.jpg",       alt: "Main gym floor with equipment" },
    { src: "images/dumbbells.jpg",       alt: "Dumbbell rack" },
    { src: "images/bench_press.jpg",     alt: "Bench press station" },
    { src: "images/treadmill.jpg",       alt: "Treadmill cardio area" },
    { src: "images/squat_rack.jpg",      alt: "Squat rack" },
    { src: "images/spin_bike.jpg",       alt: "Spin bike studio" }
  ];

  const gallerySection = document.createElement("section");
  gallerySection.className = "gallery-section";
  gallerySection.innerHTML = `<h2>Our Facilities</h2>
    <p class="gallery-subtitle">Click any image to view it in full screen.</p>
    <div class="gallery-grid"></div>`;

  const grid = gallerySection.querySelector(".gallery-grid");

  galleryImages.forEach((img, index) => {
    const item = document.createElement("div");
    item.className = "gallery-item";
    item.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy" data-index="${index}" />
      <div class="gallery-overlay"><span>&#128269; View</span></div>`;
    item.addEventListener("click", () => openLightbox(index));
    grid.appendChild(item);
  });

  if (main) main.appendChild(gallerySection);

  // Build the lightbox overlay once and reuse
  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Image viewer");
  lightbox.innerHTML = `
    <button id="lb-close" aria-label="Close image viewer">&times;</button>
    <button id="lb-prev" aria-label="Previous image">&#10094;</button>
    <div class="lb-content">
      <img id="lb-img" src="" alt="" />
      <p id="lb-caption"></p>
    </div>
    <button id="lb-next" aria-label="Next image">&#10095;</button>`;
  document.body.appendChild(lightbox);

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    document.getElementById("lb-close").focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  function updateLightbox() {
    const img = galleryImages[currentIndex];
    document.getElementById("lb-img").src = img.src;
    document.getElementById("lb-img").alt = img.alt;
    document.getElementById("lb-caption").textContent = img.alt;
    document.getElementById("lb-prev").style.visibility = currentIndex === 0 ? "hidden" : "visible";
    document.getElementById("lb-next").style.visibility = currentIndex === galleryImages.length - 1 ? "hidden" : "visible";
  }

  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  document.getElementById("lb-prev").addEventListener("click", () => {
    if (currentIndex > 0) { currentIndex--; updateLightbox(); }
  });
  document.getElementById("lb-next").addEventListener("click", () => {
    if (currentIndex < galleryImages.length - 1) { currentIndex++; updateLightbox(); }
  });

  // Close on backdrop click
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

  // Keyboard navigation
  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape")      closeLightbox();
    if (e.key === "ArrowLeft"  && currentIndex > 0) { currentIndex--; updateLightbox(); }
    if (e.key === "ArrowRight" && currentIndex < galleryImages.length - 1) { currentIndex++; updateLightbox(); }
  });

}); // end DOMContentLoaded
