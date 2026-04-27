"use strict";

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
};

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector(
      "[data-testimonials-title]"
    ).innerHTML;
    modalText.innerHTML = this.querySelector(
      "[data-testimonials-text]"
    ).innerHTML;
    testimonialsModalFunc();
  });
}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

async function loadCertificatesAndProjects() {
  try {
    // 1. Fetch data
    const certRes = await fetch('./data/certificates.json');
    const certificates = await certRes.json();
    
    const projRes = await fetch('./data/projects.json');
    const projects = await projRes.json();

    // 2. Render Projects
    const projectsList = document.getElementById('projects-list');
    if (projectsList) {
      projectsList.innerHTML = projects.map(proj => `
        <li class="blog-post-item">
          <a href="${proj.link}">
            <figure class="blog-banner-box">
              <img src="${proj.image}" alt="${proj.category}" loading="lazy" />
            </figure>
            <div class="blog-content">
              <div class="blog-meta">
                <p class="blog-category">${proj.category}</p>
                <span class="dot"></span>
                <time datetime="${proj.datetime}">${proj.date}</time>
              </div>
              <h3 class="h3 blog-item-title">${proj.title}</h3>
              <p class="blog-text">${proj.description}</p>
            </div>
          </a>
        </li>
      `).join('');
    }

    // 3. Render Certificates
    const certList = document.getElementById('certificates-list');
    if (certList) {
      certList.innerHTML = certificates.map(cert => `
        <li class="project-item active" data-filter-item data-category="${cert.category}">
          <a href="${cert.link}">
            <figure class="project-img">
              <div class="project-item-icon-box">
                <ion-icon name="eye-outline"></ion-icon>
              </div>
              <img src="${cert.image}" alt="${cert.title}" loading="lazy" />
            </figure>
            <h3 class="project-title">${cert.title}</h3>
            <p class="project-category">${cert.issuer}</p>
          </a>
        </li>
      `).join('');
    }

    // 4. Generate Filter Categories safely
    const rawCategories = [...new Set(certificates.map(c => c.category))];
    const categories = ["all", ...rawCategories];
    
    const filterList = document.getElementById('certificate-filter-list');
    if (filterList) {
      filterList.innerHTML = categories.map((cat, index) => {
        // Use a better display name (e.g., intel a.i -> Intel A.I)
        let displayCat = cat.replace(/\b\w/g, l => l.toUpperCase());
        if (cat === "intel a.i") displayCat = "Intel A.I"; // Special cases
        
        return `
          <li class="filter-item">
            <button class="${index === 0 ? 'active' : ''}" data-filter-btn>${displayCat}</button>
          </li>
        `;
      }).join('');
    }

    const selectList = document.getElementById('certificate-select-list');
    if (selectList) {
      selectList.innerHTML = categories.map(cat => {
        let displayCat = cat.replace(/\b\w/g, l => l.toUpperCase());
        if (cat === "intel a.i") displayCat = "Intel A.I";
        return `
          <li class="select-item">
            <button data-select-item>${displayCat}</button>
          </li>
        `;
      }).join('');
    }

    // 5. Initialize Filters and Tilt after DOM populates
    initializeFilters();
    initializeTilt();

  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function initializeFilters() {
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-selecct-value]"); // Keep original typo for matching HTML
  const filterBtn = document.querySelectorAll("[data-filter-btn]");
  const filterItems = document.querySelectorAll("[data-filter-item]");

  // Prevent multiple attachment if this function gets called twice
  if (select && !select.dataset.listenerInstalled) {
    select.addEventListener("click", function () {
      elementToggleFunc(this);
    });
    select.dataset.listenerInstalled = 'true';
  }

  const filterFunc = function (selectedValue) {
    for (let i = 0; i < filterItems.length; i++) {
      if (selectedValue === "all") {
        filterItems[i].classList.add("active");
      } else if (selectedValue === filterItems[i].dataset.category) {
        filterItems[i].classList.add("active");
      } else {
        filterItems[i].classList.remove("active");
      }
    }
  };

  for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      if(selectValue) selectValue.innerText = this.innerText;
      if(select) elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  }

  let lastClickedBtn = filterBtn[0];
  for (let i = 0; i < filterBtn.length; i++) {
    filterBtn[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      filterFunc(selectedValue);
      if (lastClickedBtn) lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  }
}

// Call the load function on startup
loadCertificatesAndProjects();
initializeTilt();


// contact form variables (keep existing)
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field (keep existing validation)
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// Add this new form submission handler
form.addEventListener("submit", async function (e) {
  e.preventDefault(); // Stop the browser from redirecting to Formspree page

  // Show loading state
  const originalContent = formBtn.innerHTML;
  formBtn.innerHTML =
    '<ion-icon name="hourglass-outline"></ion-icon><span>Sending...</span>';
  formBtn.disabled = true;

  try {
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      formBtn.innerHTML =
        '<ion-icon name="checkmark-circle"></ion-icon><span>Message Sent!</span>';
      
      // Redirect to thankyou page after a short delay
      setTimeout(() => {
        window.location.href = "thankyou.html";
      }, 1500);
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    console.error("Submission error:", error);
    formBtn.innerHTML = '<ion-icon name="alert-circle-outline"></ion-icon><span>Error!</span>';
    formBtn.disabled = false;
    
    setTimeout(() => {
      formBtn.innerHTML = originalContent;
    }, 3000);
  }
});

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

/**
 * Mouse Spotlight Effect
 */
const spotlight = document.querySelector(".mouse-spotlight");

window.addEventListener("mousemove", (e) => {
  if (spotlight) {
    const x = e.clientX;
    const y = e.clientY;
    
    // Smoothly update spotlight position
    document.body.style.setProperty("--mouse-x", `${x}px`);
    document.body.style.setProperty("--mouse-y", `${y}px`);
  }
});

/**
 * 3D Tilt Effect
 */
function initializeTilt() {
  const cards = document.querySelectorAll(".service-item, .project-item, .blog-post-item, .content-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const cardRect = card.getBoundingClientRect();
      const cardWidth = cardRect.width;
      const cardHeight = cardRect.height;
      const centerX = cardRect.left + cardWidth / 2;
      const centerY = cardRect.top + cardHeight / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Calculate rotation (max 10 degrees)
      const rotateX = (-10 * mouseY) / (cardHeight / 2);
      const rotateY = (10 * mouseX) / (cardWidth / 2);

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = "transform 0.1s ease";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = "transform 0.5s ease";
    });
  });
}

/**
 * Typewriter Effect
 */
function initTypewriter() {
  const element = document.querySelector("[data-typewriter]");
  if (!element) return;

  const roles = [
    "Software Developer",
    "AI Enthusiast",
    "Tech Innovator",
    "Cybersecurity Student",
    "Creative Designer"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentRole = roles[roleIndex];
    let typeSpeed = 100;
    
    if (isDeleting) {
      element.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      element.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typeSpeed = 2000; // Wait at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 500; // Wait before next word
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

// Global initialization
initTypewriter();


