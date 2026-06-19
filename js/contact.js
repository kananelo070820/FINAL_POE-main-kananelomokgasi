// ============================================================
//  contact.js  Peak Performance Fitness | Contact Page
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  // 1. LOCATION TABS
  // Turns the plain <p> location list into clickable tabs with
  // gym details (hours, map link, phone) for each branch.

  const locationData = {
    "Bloemfontein": {
      address:  "123 Main Street, Bloemfontein, 9301",
      phone:    "051 345 6789",
      hours:    "Mon-Fri 05:00-21:00 · Sat-Sun 07:00-18:00",
      mapUrl:   "https://maps.google.com/?q=123+Main+Street+Bloemfontein",
    },
    "Pretoria": {
      address:  "45 Fitness Road, Pretoria, 0001",
      phone:    "012 456 7890",
      hours:    "Mon-Fri 05:30-21:30 · Sat-Sun 07:00-17:00",
      mapUrl:   "https://maps.google.com/?q=45+Fitness+Road+Pretoria",

    }
  };

  const locationsH2 = [...document.querySelectorAll("h2")].find(h => h.textContent.trim() === "Locations");
  if (locationsH2) {
    // Remove existing <p> location entries
    let next = locationsH2.nextElementSibling;
    while (next && next.tagName === "P") {
      const toRemove = next;
      next = next.nextElementSibling;
      toRemove.remove();
    }

    const tabsWrapper = document.createElement("div");
    tabsWrapper.className = "location-tabs";

    const strip = document.createElement("div");
    strip.className = "loc-strip";

    const panel = document.createElement("div");
    panel.className = "loc-panel";

    Object.keys(locationData).forEach((city, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "loc-btn" + (i === 0 ? " active" : "");
      btn.dataset.city = city;
      btn.textContent = `${locationData[city].emoji} ${city}`;
      btn.addEventListener("click", () => showLocation(city));
      strip.appendChild(btn);
    });

    tabsWrapper.appendChild(strip);
    tabsWrapper.appendChild(panel);
    locationsH2.insertAdjacentElement("afterend", tabsWrapper);

    function showLocation(city) {
      const d = locationData[city];
      document.querySelectorAll(".loc-btn").forEach(b =>
        b.classList.toggle("active", b.dataset.city === city));

      // Build an embedded Google Maps iframe using the address as query
      const encodedAddress = encodeURIComponent(d.address);
      const mapEmbedUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

      panel.innerHTML = `
        <div class="loc-detail">
          <p><span class="loc-label">Address</span><span>${d.address}</span></p>
          <p><span class="loc-label">Phone</span><span>${d.phone}</span></p>
          <p><span class="loc-label">Hours</span><span>${d.hours}</span></p>
          <a class="loc-map-link" href="${d.mapUrl}" target="_blank" rel="noopener">
            Open in Google Maps
          </a>
          <div class="map-embed-wrapper">
            <iframe
              class="loc-map-iframe"
              src="${mapEmbedUrl}"
              width="100%"
              height="300"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="${city} gym location map"
            ></iframe>
          </div>
        </div>`;
    }
    showLocation(Object.keys(locationData)[0]);
  }


  // 2. FORM VALIDATION 

  const form = document.querySelector("form");

  // Identify the inputs. Contact.html has no name attributes, so we
  // target by type/position and add them programmatically.
  const inputs   = form ? form.querySelectorAll("input[type='text'], input[type='email']") : [];
  const textarea = form ? form.querySelector("textarea") : null;

  let nameInput  = null;
  let emailInput = null;

  inputs.forEach(el => {
    if (el.type === "email") {
      emailInput = el;
      el.name = "email";
      el.placeholder = "you@example.com";
    } else {
      nameInput = el;
      el.name = "name";
      el.placeholder = "Your full name";
    }
  });

  if (textarea) {
    textarea.name = "message";
    textarea.placeholder = "Write your message here…";
    textarea.rows = 5;
  }

  const fieldDefs = [
    { key: "name",    el: nameInput  },
    { key: "email",   el: emailInput },
    { key: "message", el: textarea   }
  ];

  fieldDefs.forEach(({ key, el }) => {
    if (!el) return;
    const err = document.createElement("span");
    err.className = "field-error";
    err.id = `cerr-${key}`;
    el.insertAdjacentElement("afterend", err);
    el.addEventListener("input", () => clearErr(key));
  });

  function setErr(key, msg) {
    const def = fieldDefs.find(f => f.key === key);
    if (def?.el)  def.el.classList.add("invalid");
    const span = document.getElementById(`cerr-${key}`);
    if (span) span.textContent = msg;
  }

  function clearErr(key) {
    const def = fieldDefs.find(f => f.key === key);
    if (def?.el)  def.el.classList.remove("invalid");
    const span = document.getElementById(`cerr-${key}`);
    if (span) span.textContent = "";
  }

  function validateContact() {
    let valid = true;

    // Name
    const name = nameInput?.value.trim() ?? "";
    if (!name) {
      setErr("name", "Name is required."); valid = false;
    } else if (name.length < 2) {
      setErr("name", "Name must be at least 2 characters."); valid = false;
    } else if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      setErr("name", "Name may only contain letters, spaces, hyphens, or apostrophes."); valid = false;
    } else {
      clearErr("name");
    }

    // Email
    const email = emailInput?.value.trim() ?? "";
    const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email) {
      setErr("email", "Email address is required."); valid = false;
    } else if (!emailRE.test(email)) {
      setErr("email", "Please enter a valid email (e.g. you@example.com)."); valid = false;
    } else {
      clearErr("email");
    }

    // Message
    const message = textarea?.value.trim() ?? "";
    if (!message) {
      setErr("message", "Please enter your message."); valid = false;
    } else if (message.length < 10) {
      setErr("message", "Message is too short please add more detail (10+ characters)."); valid = false;
    } else if (message.length > 1000) {
      setErr("message", `Message is too long (${message.length}/1000 characters).`); valid = false;
    } else {
      clearErr("message");
    }

    return valid;
  }


  //  3. CHARACTER COUNTER

  if (textarea) {
    const counter = document.createElement("small");
    counter.className = "char-counter";
    counter.textContent = "0 / 1000";
    textarea.insertAdjacentElement("afterend", counter);

    textarea.addEventListener("input", () => {
      const len = textarea.value.length;
      counter.textContent = `${len} / 1000`;
      counter.classList.toggle("over-limit", len > 1000);
    });
  }


  // 4. SEND VIA MAIL TO 
  // Opens the user's mail client pre-filled with the form data,
  // addressed to info@peakfitness.com.

  const RECIPIENT = "info@peakfitness.com";

  function buildMailtoLink(name, email, message) {
    const subject = encodeURIComponent(`Website Contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    return `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;
  }


  

  const toast = document.createElement("div");
  toast.id = "contact-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);

  function showToast(msg, type = "success") {
    toast.textContent = msg;
    toast.className = `toast-visible toast-${type}`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.className = ""; }, 5000);
  }


  // 6. FORM SUBMIT 

  if (form) {
    const submitBtn = form.querySelector('input[type="submit"]');
    if (submitBtn) {
      // Replace input[type=submit] with a <button> for easier styling/state
      const btn = document.createElement("button");
      btn.type = "submit";
      btn.textContent = "Send Message";
      btn.className = "submit-btn";
      submitBtn.replaceWith(btn);
    }

    form.addEventListener("submit", e => {
      e.preventDefault();
      if (!validateContact()) return;

      const name    = nameInput.value.trim();
      const email   = emailInput.value.trim();
      const message = textarea.value.trim();

      // Open pre-filled email client
      const mailto = buildMailtoLink(name, email, message);
      window.location.href = mailto;

      showToast(` Your email client has opened with your message ready to send to ${RECIPIENT}.`);
      form.reset();
      document.getElementById("cerr-name")?.textContent === "";
    });
  }


  // 7. SMOOTH SCROLL TO FORM
  // A "Send us a message" anchor button is injected at the top of
  // <main> to let visitors jump straight to the form.

  const main = document.querySelector("main");
  const formEl = document.querySelector("form");
  if (main && formEl) {
    formEl.id = "contact-form";

    const jumpBtn = document.createElement("a");
    jumpBtn.href = "#contact-form";
    jumpBtn.className = "jump-btn";
    jumpBtn.textContent = "✉️ Send Us a Message";
    main.insertBefore(jumpBtn, main.firstChild);
  }

}); // end DOMContentLoaded
