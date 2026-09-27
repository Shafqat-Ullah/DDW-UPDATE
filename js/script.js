/* ============================================================
   DIGITAL DREAM WEB (DDW) — Main JavaScript
   Author : Digital Dream Web
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  initNavbar();
  initMobileMenu();
  initBackToTop();
  initRevealOnScroll();
  initCounters();
  initSlider();
  initPortfolioFilter();
  initCourseModal();
  initContactForm();

  document.body.classList.remove("no-scroll");
});

/* ------------------------------------------------------------
   1. Sticky Navbar — shadow on scroll
   ------------------------------------------------------------ */
function initNavbar() {
  const header = document.querySelector(".header");
  const onScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", onScroll);
  onScroll();
}

/* ------------------------------------------------------------
   2. Mobile Menu — hamburger open/close
   ------------------------------------------------------------ */
function initMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", function () {
    const isOpen = links.classList.toggle("open");
    toggle.classList.toggle("active", isOpen);
    document.body.classList.toggle("no-scroll", isOpen);
  });

  links.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.classList.remove("active");
      document.body.classList.remove("no-scroll");
    });
  });
}

/* ------------------------------------------------------------
   3. Back To Top button
   ------------------------------------------------------------ */
function initBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ------------------------------------------------------------
   4. Reveal on scroll with IntersectionObserver
   ------------------------------------------------------------ */
function initRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach(function (item) {
    observer.observe(item);
  });
}

/* ------------------------------------------------------------
   5. Animated counters
   ------------------------------------------------------------ */
function initCounters() {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const animate = function (el) {
    const target = parseFloat(el.getAttribute("data-counter"));
    const duration = 1800;
    const suffix = el.getAttribute("data-suffix") || "";
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach(function (el) {
    observer.observe(el);
  });
}

/* ------------------------------------------------------------
   6. Testimonial slider
   ------------------------------------------------------------ */
function initSlider() {
  const wrap = document.querySelector(".slider-wrap");
  if (!wrap) return;

  const track = wrap.querySelector(".slider-track");
  const slides = Array.from(track.children);
  const prev = wrap.querySelector("[data-prev]");
  const next = wrap.querySelector("[data-next]");
  const dotsWrap = wrap.querySelector(".slider-dots");
  const counter = wrap.querySelector("[data-slide-num]");

  let index = 0;
  let slidesPerView = 1;

  function buildDots() {
    dotsWrap.innerHTML = "";
    slides.forEach(function (_, i) {
      const dot = document.createElement("button");
      dot.classList.add("dot");
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", function () {
        goTo(i);
      });
      dotsWrap.appendChild(dot);
    });
  }

  function goTo(i) {
    const max = Math.max(0, slides.length - slidesPerView);
    index = Math.min(Math.max(0, i), max);
    update();
  }

  function update() {
    const offset = index * (100 / slidesPerView);
    track.style.transform = "translateX(-" + offset + "%)";
    Array.from(dotsWrap.children).forEach(function (d, i) {
      d.classList.toggle("active", i === index);
    });
    if (counter) counter.textContent = index + 1;
  }

  prev.addEventListener("click", function () {
    goTo(index - 1);
  });
  next.addEventListener("click", function () {
    goTo(index + 1);
  });

  buildDots();
}

/* ------------------------------------------------------------
   7. Portfolio filter
   ------------------------------------------------------------ */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project-card");
  if (!filterBtns.length || !projects.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      projects.forEach(function (card) {
        const cat = card.getAttribute("data-category");
        if (filter === "all" || filter === cat) {
          card.classList.remove("hide");
          card.style.animation = "none";
          card.offsetHeight;
          card.style.animation = "";
        } else {
          card.classList.add("hide");
        }
      });
    });
  });
}

/* ------------------------------------------------------------
   8. Course modal
   ------------------------------------------------------------ */
function initCourseModal() {
  const overlay = document.querySelector(".modal-overlay");
  if (!overlay) return;

  const closeBtn = overlay.querySelector(".modal-close");
  const body = overlay.querySelector(".modal-body");
  const headImg = overlay.querySelector(".modal-head img");

  const open = function (data) {
    headImg.src = data.img;
    headImg.alt = data.title;
    body.querySelector(".course-level").textContent = data.level;
    body.querySelector("h3").textContent = data.title;
    body.querySelector(".modal-desc").textContent = data.desc;
    body.querySelector(".modal-attr").textContent = data.attr;
    body.querySelector(".modal-meta .m-dur strong").textContent = data.duration;
    body.querySelector(".modal-meta .m-level strong").textContent = data.level;
    body.querySelector(".modal-meta .m-mod strong").textContent = data.modules;

    const skillList = body.querySelector(".modal-skills");
    skillList.innerHTML = "";
    data.skills.forEach(function (s) {
      const li = document.createElement("li");
      li.textContent = s;
      skillList.appendChild(li);
    });

    const enrollBtn = body.querySelector(".btn-enroll");
    enrollBtn.href = "contact.html?course=" + encodeURIComponent(data.title);

    overlay.classList.add("show");
    document.body.classList.add("no-scroll");
  };

  const close = function () {
    overlay.classList.remove("show");
    document.body.classList.remove("no-scroll");
  };

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });

  document.querySelectorAll("[data-course]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const name = btn.getAttribute("data-course");
      const course = COURSE_DATA[name];
      if (course) open(course);
    });
  });
}

/* Course data bank */
var COURSE_DATA = {
  "web-development": {
    title: "Web Development",
    img: "images/courses/web-development.jpg",
    level: "Beginner to Intermediate",
    duration: "8 Weeks",
    modules: "6 Modules",
    desc: "Learn to build modern, responsive websites from scratch using HTML, CSS and JavaScript. Start with the fundamentals and progress to complete, functional websites.",
    attr: "Hands-on practice with real projects and practical exercises at every stage.",
    skills: ["HTML", "CSS", "JavaScript", "Responsive Design", "Website Development", "JavaScript Fundamentals"]
  },
  "graphic-design": {
    title: "Graphic Design",
    img: "images/courses/graphic-design.jpg",
    level: "Beginner Friendly",
    duration: "6 Weeks",
    modules: "6 Modules",
    desc: "Develop a strong creative foundation and master essential design tools. Create professional visuals for brands, businesses and social media.",
    attr: "Project-based learning covering design fundamentals through to completed designs.",
    skills: ["Design Fundamentals", "Photoshop", "Illustrator", "Social Media Design", "Branding", "Creative Design"]
  },
  "freelancing": {
    title: "Freelancing",
    img: "images/courses/freelancing.jpg",
    level: "All Levels",
    duration: "5 Weeks",
    modules: "5 Modules",
    desc: "Learn how to start and grow a successful freelancing career. Build your profile, communicate with clients, and win real projects online.",
    attr: "Practical guidance for getting started and earning online with confidence.",
    skills: ["Freelancing Fundamentals", "Fiverr", "Upwork", "Client Communication", "Portfolio Building", "Getting Started Online"]
  },
  "ai": {
    title: "Artificial Intelligence",
    img: "images/courses/ai.jpg",
    level: "Beginner Friendly",
    duration: "6 Weeks",
    modules: "6 Modules",
    desc: "Understand what AI is and how to use smart tools effectively for study, work and business. Learn to write good prompts, use AI assistants and automate everyday tasks.",
    attr: "Hands-on practice with real AI tools including ChatGPT and other assistants.",
    skills: ["AI Basics", "ChatGPT", "Prompting", "AI Tools", "Automation", "AI for Business"]
  }
};

/* ------------------------------------------------------------
   9. Contact form validation
   ------------------------------------------------------------ */
function initContactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const waNumber = "923255635495"; // +92 325 5635495

  const courseFields = form.querySelector("#course-fields");
  const orderFields = form.querySelector("#order-fields");
  const courseSelect = form.querySelector("#course");
  const orderSelect = form.querySelector("#order");

  // Make the toggle function available globally so the "?course=" prefill
  // script on the contact page can switch to the course view.
  window.contactFormToggle = function (type) {
    if (type === "course") {
      courseFields.hidden = false;
      orderFields.hidden = true;
    } else if (type === "order") {
      courseFields.hidden = true;
      orderFields.hidden = false;
    } else {
      courseFields.hidden = true;
      orderFields.hidden = true;
    }
  };

  form.querySelectorAll('input[name="inquiry"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      window.contactFormToggle(radio.value);
    });
  });
  // Initialize based on default selected radio (course)
  window.contactFormToggle(
    (form.querySelector('input[name="inquiry"]:checked') || {}).value || "course"
  );

  form.addEventListener("submit", function (e) {
    // Clear previous errors
    form.querySelectorAll(".form-group").forEach(function (g) {
      g.classList.remove("invalid");
    });

    let valid = true;
    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const phone = form.querySelector("#phone");
    const message = form.querySelector("#message");
    const inquiry = form.querySelector('input[name="inquiry"]:checked');
    const inquiryType = inquiry ? inquiry.value : "course";

    if (!name.value.trim()) {
      markInvalid(name, "Please enter your full name.");
      valid = false;
    }

    if (!email.value.trim()) {
      markInvalid(email, "Please enter your email address.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      markInvalid(email, "Please enter a valid email address.");
      valid = false;
    }

    const phoneVal = phone.value.trim();
    if (!phoneVal) {
      markInvalid(phone, "Please enter your phone number.");
      valid = false;
    } else if (!/^[0-9+\-\s]{7,15}$/.test(phoneVal)) {
      markInvalid(phone, "Please enter a valid phone number.");
      valid = false;
    }

    if (inquiryType === "course" && !courseSelect.value) {
      markInvalid(courseSelect, "Please choose the course you want to apply for.");
      valid = false;
    } else if (inquiryType === "order" && !orderSelect.value) {
      markInvalid(orderSelect, "Please choose the service you want to order.");
      valid = false;
    }

    if (!message.value.trim() || message.value.trim().length < 10) {
      markInvalid(message, "Please enter a message (at least 10 characters).");
      valid = false;
    }

    if (!valid) {
      // Block submission (including Web2Phone's handler) and show errors.
      e.preventDefault();
      if (typeof e.stopImmediatePropagation === "function") {
        e.stopImmediatePropagation();
      }
      showMsg("error", "Please fix the highlighted fields and try again.");
      return;
    }

    // Open WhatsApp with the complete form data pre-filled as a message to
    // the Digital Dream Web WhatsApp number. The visitor taps Send and the
    // full application/order arrives on WhatsApp.
    e.preventDefault();
    const city = form.querySelector("#city");
    const typeLabel =
      inquiryType === "course" ? "Apply for a Course"
      : inquiryType === "order" ? "Place an Order"
      : "Send a Message";
    const selection =
      inquiryType === "course"
        ? "Course: " + ((courseSelect.options[courseSelect.selectedIndex] || {}).text || "Not selected")
        : inquiryType === "order"
        ? "Order/Service: " + ((orderSelect.options[orderSelect.selectedIndex] || {}).text || "Not selected")
        : "";

    const lines = [
      "*New Application - Digital Dream Web*",
      "",
      "Inquiry: " + typeLabel,
      "Name: " + name.value.trim(),
      "Email: " + email.value.trim(),
      "Phone: " + phoneVal,
      "City: " + (city && city.value.trim() ? city.value.trim() : "Not provided")
    ];
    if (selection) lines.push(selection);
    lines.push("Message: " + message.value.trim());

    const text = lines
      .map(function (line) { return encodeURIComponent(line); })
      .join("%0A");

    window.open("https://wa.me/" + waNumber + "?text=" + text, "_blank");
    showMsg("success", "Thank you! WhatsApp is opening with your application - just press Send to submit it to Digital Dream Web.");
    form.reset();
    window.contactFormToggle("course");
  });

  function markInvalid(input, text) {
    const group = input.closest(".form-group");
    group.classList.add("invalid");
    group.querySelector(".form-error").textContent = text;
  }

  function showMsg(type, text) {
    const msg = form.querySelector(".form-msg");
    if (!msg) return;
    msg.className = "form-msg " + type;
    msg.textContent = text;
    msg.style.display = "block";
    setTimeout(function () {
      msg.style.display = "none";
    }, 6000);
  }
}
