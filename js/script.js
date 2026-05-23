document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("nav");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 20) {
      header.classList.add("nav-scrolled");
    } else {
      header.classList.remove("nav-scrolled");
    }
  });

  const smoothLinks = document.querySelectorAll('a[href^="#"]');
  smoothLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");
      if (targetId.length > 1) {
        event.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
      const offcanvas = document.querySelector(".offcanvas.show");
      if (offcanvas) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
        if (bsOffcanvas) {
          bsOffcanvas.hide();
        }
      }
    });
  });
});
/**
 * ADUA Landing Page — interactions
 */

(function () {
  "use strict";

  // Mobile navigation
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  function setNavOpen(open) {
    navLinks.classList.toggle("is-open", open);
    navToggle.classList.toggle("is-active", open);
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      setNavOpen(!navLinks.classList.contains("is-open"));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNavOpen(false));
    });

    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth > 1100) setNavOpen(false);
      },
      { passive: true },
    );
  }

  // Active nav link on scroll
  const sections = document.querySelectorAll("section[id]");
  const navLinkEls = document.querySelectorAll(".nav__link");

  function setActiveNav() {
    const scrollY = window.scrollY + 120;
    let current = "";

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = section.getAttribute("id") || "";
      }
    });

    navLinkEls.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      link.classList.toggle("nav__link--active", href === `#${current}`);
    });
  }

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  // Curriculum carousel
  const track = document.getElementById("curriculumTrack");
  const prevBtn = document.getElementById("curriculumPrev");
  const nextBtn = document.getElementById("curriculumNext");

  if (track && prevBtn && nextBtn) {
    const cards = track.querySelectorAll(".program-card");
    let index = 0;
    let touchStartX = 0;

    function getGap() {
      const styles = getComputedStyle(track);
      return parseFloat(styles.gap) || 28;
    }

    function getCardWidth() {
      const wrap = track.parentElement;
      const card = cards[0];
      if (!wrap || !card) return 316;
      return Math.min(card.offsetWidth, wrap.clientWidth) + getGap();
    }

    function getMaxIndex() {
      const wrap = track.parentElement;
      if (!wrap || !cards.length) return 0;
      const visible = Math.max(
        1,
        Math.floor(wrap.offsetWidth / getCardWidth()),
      );
      return Math.max(0, cards.length - visible);
    }

    function updateCarousel() {
      const offset = index * getCardWidth();
      track.style.transform = `translateX(-${offset}px)`;
      const max = getMaxIndex();
      prevBtn.disabled = index <= 0;
      nextBtn.disabled = index >= max;
    }

    prevBtn.addEventListener("click", () => {
      index = Math.max(0, index - 1);
      updateCarousel();
    });

    nextBtn.addEventListener("click", () => {
      index = Math.min(getMaxIndex(), index + 1);
      updateCarousel();
    });

    track.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    track.addEventListener(
      "touchend",
      (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) < 40) return;
        if (diff > 0) {
          index = Math.min(getMaxIndex(), index + 1);
        } else {
          index = Math.max(0, index - 1);
        }
        updateCarousel();
      },
      { passive: true },
    );

    window.addEventListener(
      "resize",
      () => {
        index = Math.min(index, getMaxIndex());
        updateCarousel();
      },
      { passive: true },
    );

    updateCarousel();
  }

  // FAQ accordion
  const faqList = document.getElementById("faqList");

  if (faqList) {
    faqList.querySelectorAll(".faq-item").forEach((item) => {
      const trigger = item.querySelector(".faq-item__trigger");
      if (!trigger) return;

      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("faq-item--open");

        faqList.querySelectorAll(".faq-item").forEach((other) => {
          other.classList.remove("faq-item--open");
          const btn = other.querySelector(".faq-item__trigger");
          if (btn) btn.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("faq-item--open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  // Contact form
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(contactForm);
      const name = data.get("fullName");
      alert(
        `Thank you, ${name}! Your enquiry has been received. Our team will contact you shortly.`,
      );
      contactForm.reset();
    });
  }

  // Newsletter form
  const newsletterForm = document.getElementById("newsletterForm");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you for subscribing to ADUA updates!");
      newsletterForm.reset();
    });
  }
})();
