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

async function loadPortfolioData() {
  try {
    // 1. Fetch all data
    const [certRes, projRes, servRes, skillRes, resumeRes] = await Promise.all([
      fetch('./data/certificates.json'),
      fetch('./data/projects.json'),
      fetch('./data/services.json'),
      fetch('./data/skills.json'),
      fetch('./data/resume.json')
    ]);

    const certificates = await certRes.json();
    const projects = await projRes.json();
    const services = await servRes.json();
    const skills = await skillRes.json();
    const resume = await resumeRes.json();

    // 2. Render Services
    const servList = document.getElementById('services-list');
    if (servList) {
      servList.innerHTML = services.map(serv => `
        <li class="service-item">
          <div class="service-icon-box">
            <img src="${serv.icon}" alt="${serv.title} icon" width="${serv.iconWidth}" />
          </div>
          <div class="service-content-box">
            <h4 class="h4 service-item-title">${serv.title}</h4>
            <p class="service-item-text">${serv.description}</p>
          </div>
        </li>
      `).join('');
    }

    // 3. Render Skills (Logos/Slideshow)
    const skillsLogoList = document.getElementById('skills-logos-list');
    if (skillsLogoList) {
      skillsLogoList.innerHTML = skills.map(skill => `
        <li class="clients-item">
          <a href="#">
            <img src="${skill.image}" alt="${skill.name}" />
          </a>
        </li>
      `).join('');
    }

    // 4. Render Skills (Progress Bars)
    const skillsProgressList = document.getElementById('skills-progress-list');
    if (skillsProgressList) {
      skillsProgressList.innerHTML = skills.map(skill => `
        <li class="skills-item">
          <div class="title-wrapper">
            <h5 class="h5">${skill.name}</h5>
            <data value="${skill.level.replace('%', '')}">${skill.level}</data>
          </div>
          <div class="skill-progress-bg">
            <div class="skill-progress-fill" style="width: ${skill.level}"></div>
          </div>
        </li>
      `).join('');
    }

    // 5. Render Resume (Education)
    const eduList = document.getElementById('education-list');
    if (eduList) {
      eduList.innerHTML = resume.education.map(edu => `
        <li class="timeline-item">
          <h4 class="h4 timeline-item-title">${edu.institution}</h4>
          <span>${edu.date}</span>
          <p class="timeline-text">${edu.description}</p>
        </li>
      `).join('');
    }

    // 6. Render Resume (Experience)
    const expList = document.getElementById('experience-list');
    if (expList) {
      expList.innerHTML = resume.experience.map(exp => `
        <li class="timeline-item">
          <h4 class="h4 timeline-item-title">${exp.role} — ${exp.company}</h4>
          <span>${exp.date}</span>
          <p class="timeline-text">${exp.description}</p>
        </li>
      `).join('');
    }

    // 7. Render Projects
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

    // 8. Render Certificates
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

    // 9. Generate Filter Categories safely
    const rawCategories = [...new Set(certificates.map(c => c.category))];
    const categories = ["all", ...rawCategories];
    
    const filterList = document.getElementById('certificate-filter-list');
    if (filterList) {
      filterList.innerHTML = categories.map((cat, index) => {
        let displayCat = cat.replace(/\b\w/g, l => l.toUpperCase());
        if (cat === "intel a.i") displayCat = "Intel A.I";
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

    // 10. Initialize Filters
    initializeFilters();

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
loadPortfolioData();

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
