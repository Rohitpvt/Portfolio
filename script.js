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

// Global Data Variables for Recruiter Analyzer
window.globalCertificates = [];
window.globalProjects = [];
window.globalResumeData = null;

async function loadCertificatesAndProjects() {
  try {
    // 1. Fetch data
    const certRes = await fetch('./data/certificates.json');
    const certificates = await certRes.json();
    window.globalCertificates = certificates;
    
    const projRes = await fetch('./data/projects.json');
    const projects = await projRes.json();
    window.globalProjects = projects;

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
              <div class="project-tags">
                ${(proj.tags || []).map(tag => `<span class="tag-chip">${tag}</span>`).join('')}
              </div>
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

    // 4. Render Resume (Education & Experience)
    fetch('./data/resume.json')
      .then(res => res.json())
      .then(data => {
        window.globalResumeData = data;
        const eduList = document.getElementById('education-list');
        const expList = document.getElementById('experience-list');

        if (eduList) {
          eduList.innerHTML = data.education.map((item, index) => `
            <li class="timeline-item" style="cursor: pointer;">
              <h4 class="h4 timeline-item-title">${item.title}</h4>
              <span>${item.date}</span>
              <p class="timeline-text">${item.description}</p>
            </li>
          `).join('');
          
          eduList.querySelectorAll('.timeline-item').forEach((li, i) => {
            li.addEventListener('click', () => openResumeModal(data.education[i]));
          });
        }

        if (expList) {
          expList.innerHTML = data.experience.map((item, index) => `
            <li class="timeline-item" style="cursor: pointer;">
              <h4 class="h4 timeline-item-title">${item.title}</h4>
              <span>${item.date}</span>
              <p class="timeline-text">${item.description}</p>
            </li>
          `).join('');

          expList.querySelectorAll('.timeline-item').forEach((li, i) => {
            li.addEventListener('click', () => openResumeModal(data.experience[i]));
          });
        }

        // 5. Render Skills (Proficiency Bars)
        const skillsList = document.getElementById('skills-list');
        if (skillsList && data.skills_proficiency) {
          skillsList.innerHTML = data.skills_proficiency.map(skill => `
            <li class="skills-item">
              <div class="title-wrapper">
                <h5 class="h5">${skill.name}</h5>
                <data value="${skill.value}">${skill.value}%</data>
              </div>
              <div class="skill-progress-bg">
                <div class="skill-progress-fill" data-skill-value="${skill.value}" style="width: 0%"></div>
              </div>
            </li>
          `).join('');
        }

        // 6. Render Tech Stack (Categorized Bento Cards)
        const techStackContainer = document.getElementById('tech-stack-container');
        const categoryIcons = {
          "programming languages": "code-slash-outline",
          "ai & ml": "bulb-outline",
          "databases & backend": "server-outline",
          "web development": "globe-outline",
          "mobile development": "phone-portrait-outline",
          "soft skills": "people-outline"
        };


        if (techStackContainer && data.tech_stack) {
          techStackContainer.innerHTML = Object.entries(data.tech_stack).map(([category, skills]) => {
            const iconName = categoryIcons[category.toLowerCase().trim()] || 'cube-outline';
            return `
              <div class="tech-category">
                <div class="category-header">
                  <ion-icon name="${iconName}"></ion-icon>
                  <h4 class="h4 category-title">${category}</h4>
                </div>
                <div class="tech-list">
                  ${skills.map(skill => `<span class="tech-item">${skill}</span>`).join('')}
                </div>
              </div>
            `;
          }).join('');
        }
      });






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
    const data = new FormData(form);
    const body = JSON.stringify(Object.fromEntries(data.entries()));
    
    const response = await fetch(form.action, {
      method: "POST",
      body: body,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      formBtn.innerHTML = '<ion-icon name="checkmark-circle"></ion-icon><span>Sent!</span>';
      form.reset();
      setTimeout(() => {
        window.location.href = "thankyou.html";
      }, 1500);
    } else {
      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors.map(error => error.message).join(", "));
      } else {
        throw new Error("Oops! There was a problem submitting your form");
      }
    }
  } catch (error) {
    console.error("Submission error:", error);
    formBtn.innerHTML = '<ion-icon name="alert-circle-outline"></ion-icon><span>Try Again!</span>';
    formBtn.disabled = false;
    
    alert("Formspree Error: " + error.message + "\n\n(Note: Formspree usually blocks 'localhost' submissions. Try testing on the live site!)");
    
    setTimeout(() => {
      formBtn.innerHTML = originalContent;
    }, 4000);
  }
});


// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const pageName = this.innerHTML.toLowerCase();
    
    for (let i = 0; i < pages.length; i++) {
      if (pageName === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
        updateBackground(pageName);
        if (pageName === 'resume') {
          setTimeout(animateSkills, 500);
        }
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

/**
 * Skill Animation
 */
function animateSkills() {
  const skillFills = document.querySelectorAll('[data-skill-value]');
  skillFills.forEach(fill => {
    const value = fill.dataset.skillValue;
    fill.style.width = value + '%';
  });
}


/**
 * Section-Aware Background Colors
 */
function updateBackground(page) {
  const blobs = {
    about: { c1: "hsl(190, 100%, 55%)", c2: "hsl(280, 100%, 65%)" },     // Cyan / Purple
    resume: { c1: "hsl(280, 100%, 65%)", c2: "hsl(340, 100%, 65%)" },    // Purple / Pink
    portfolio: { c1: "hsl(160, 100%, 50%)", c2: "hsl(190, 100%, 55%)" }, // Emerald / Cyan
    projects: { c1: "hsl(210, 100%, 60%)", c2: "hsl(240, 100%, 70%)" },  // Blue / Indigo
    contact: { c1: "hsl(30, 100%, 60%)", c2: "hsl(10, 100%, 65%)" }      // Orange / Coral
  };

  const colors = blobs[page] || blobs.about;
  document.documentElement.style.setProperty("--blob-color-1", colors.c1);
  document.documentElement.style.setProperty("--blob-color-2", colors.c2);
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

/**
 * Particle Background System (Neural Network Style)
 */
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let particles = [];
  const particleCount = 100;
  const connectionDistance = 150;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 230, 255, 0.7)"; // Brighter Cyan
      ctx.fill();
    }
  }

  function createParticles() {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.update();
      p1.draw();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 230, 255, ${0.8 * (1 - dist / connectionDistance)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }


  createParticles();
  animate();
}

initParticles();

/**
 * Avatar Parallax Effect
 */
function initAvatarParallax() {
  const avatarBox = document.querySelector(".avatar-box");
  const avatarImg = avatarBox ? avatarBox.querySelector("img") : null;

  if (!avatarBox || !avatarImg) return;

  avatarBox.addEventListener("mousemove", (e) => {
    const { width, height, left, top } = avatarBox.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Movement intensity (lower is more subtle)
    const xMove = (mouseX / (width / 2)) * 10;
    const yMove = (mouseY / (height / 2)) * 10;

    avatarImg.style.transform = `scale(1.2) translate(${xMove}px, ${yMove}px)`;
    avatarImg.style.transition = "transform 0.1s ease-out";
  });

  avatarBox.addEventListener("mouseleave", () => {
    avatarImg.style.transform = "scale(1.1) translate(0, 0)";
    avatarImg.style.transition = "transform 0.6s ease-out";
  });
}

initAvatarParallax();

/**
 * Resume Modal Logic
 */
const resumeModalContainer = document.querySelector('[data-resume-modal-container]');
const resumeModalCloseBtn = document.querySelector('[data-resume-modal-container] [data-modal-close-btn]');
const resumeOverlay = document.querySelector('[data-resume-modal-container] [data-overlay]');

const rsModalTitle = document.querySelector('[data-resume-modal-container] [data-modal-title]');
const rsModalDate = document.querySelector('[data-resume-modal-container] [data-modal-date]');
const rsModalText = document.querySelector('[data-resume-modal-container] [data-modal-text]');

function openResumeModal(item) {
  if (!resumeModalContainer || !rsModalTitle) return;
  
  rsModalTitle.innerHTML = item.title;
  rsModalDate.innerHTML = item.date;
  rsModalText.innerHTML = item.details.replace(/\n/g, '<br>');
  
  resumeModalContainer.classList.add('active');
  resumeOverlay.classList.add('active');
}

const closeResumeModal = function () {
  resumeModalContainer.classList.remove('active');
  resumeOverlay.classList.remove('active');
}

resumeModalCloseBtn?.addEventListener('click', closeResumeModal);
resumeOverlay?.addEventListener('click', closeResumeModal);

/**
 * Skills Logo Marquee
 */
function initSkillsMarquee() {
  const marquee = document.querySelector(".clients-list");
  if (!marquee) return;

  // Duplicate items for seamless loop
  const items = marquee.innerHTML;
  marquee.innerHTML += items + items; // Triple for safety in large viewports

  let isDragging = false;
  let startX;
  let scrollLeft;
  let animationId;
  let scrollPos = 0;
  const speed = 0.5; // Very slow speed
  let isHovered = false;

  const startAnimation = () => {
    if (!isDragging && !isHovered) {
      scrollPos += speed;
      if (scrollPos >= marquee.scrollWidth / 3) {
        scrollPos = 0;
      }
      marquee.scrollLeft = scrollPos;
    }
    animationId = requestAnimationFrame(startAnimation);
  };

  marquee.addEventListener("mouseenter", () => isHovered = true);
  marquee.addEventListener("mouseleave", () => {
    isHovered = false;
    isDragging = false;
  });

  // Drag Support
  marquee.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - marquee.offsetLeft;
    scrollLeft = marquee.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  marquee.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - marquee.offsetLeft;
    const walk = (x - startX) * 2;
    marquee.scrollLeft = scrollLeft - walk;
    scrollPos = marquee.scrollLeft;
  });

  // Start the engine
  startAnimation();
}

// --- Recruiter Fit Analyzer Logic ---
document.addEventListener("DOMContentLoaded", () => {
  const openModalBtn = document.getElementById("open-recruiter-modal-btn");
  const modal = document.getElementById("recruiter-modal");
  const closeBtn = document.getElementById("recruiter-close-btn");
  const overlay = document.getElementById("recruiter-overlay");
  const analyzeBtn = document.getElementById("recruiter-analyze-btn");
  const textarea = document.getElementById("recruiter-input");

  const stateInput = document.getElementById("recruiter-state-input");
  const stateAnim = document.getElementById("recruiter-state-anim");
  const stateResults = document.getElementById("recruiter-state-results");
  const animText = document.getElementById("recruiter-anim-text");

  const keywordDict = {
    "python": "Python", "react": "React", "reactjs": "React", "react.js": "React",
    "node": "Node.js", "nodejs": "Node.js", "node.js": "Node.js", "firebase": "Firebase",
    "flutter": "Flutter", "dart": "Dart", "mongodb": "MongoDB", "mongo": "MongoDB",
    "mysql": "MySQL", "sql": "SQL", "fastapi": "FastAPI", "api": "REST APIs",
    "apis": "REST APIs", "backend": "Backend", "frontend": "Frontend",
    "fullstack": "Full Stack", "full-stack": "Full Stack", "cloud": "Cloud Computing",
    "aws": "AWS", "devops": "DevOps", "docker": "Docker", "kubernetes": "Kubernetes",
    "ai": "Artificial Intelligence", "artificial intelligence": "Artificial Intelligence",
    "machine learning": "Machine Learning", "ml": "Machine Learning", "nlp": "NLP",
    "llm": "LLM", "generative ai": "Generative AI", "cybersecurity": "Cyber Security",
    "cyber security": "Cyber Security", "javascript": "JavaScript", "js": "JavaScript",
    "html": "HTML", "css": "CSS", "c++": "C++", "cpp": "C++", "java": "Java",
    "c": "C", "c#": "C Sharp", "go": "GoLang", "golang": "GoLang", "data analysis": "Data Analysis"
  };

  function toggleRecruiterModal() {
    if(!modal) return;
    modal.classList.toggle("active");
    if(!modal.classList.contains("active")) {
      setTimeout(() => {
        if(stateInput) stateInput.classList.add("active");
        if(stateAnim) stateAnim.classList.remove("active");
        if(stateResults) stateResults.classList.remove("active");
        if(textarea) textarea.value = "";
      }, 300);
    }
  }

  if(openModalBtn) openModalBtn.addEventListener("click", toggleRecruiterModal);
  if(closeBtn) closeBtn.addEventListener("click", toggleRecruiterModal);
  if(overlay) overlay.addEventListener("click", toggleRecruiterModal);

  if(analyzeBtn) {
    analyzeBtn.addEventListener("click", () => {
      if(!textarea) return;
      const input = textarea.value.toLowerCase();
      if(input.trim() === "") return;

      if(stateInput) stateInput.classList.remove("active");
      if(stateAnim) stateAnim.classList.add("active");

      const texts = [
        "Reading role requirements...",
        "Matching skills...",
        "Finding relevant projects...",
        "Preparing recruiter pitch..."
      ];
      let i = 0;
      let textInterval;
      if(animText) {
        textInterval = setInterval(() => {
          i++;
          if(i < texts.length) animText.textContent = texts[i];
        }, 800);
      }

      setTimeout(() => {
        if(textInterval) clearInterval(textInterval);
        processFit(input);
        if(stateAnim) stateAnim.classList.remove("active");
        if(stateResults) stateResults.classList.add("active");
      }, 3200);
    });
  }

  function processFit(input) {
    let matchedKeywords = new Set();
    for (let key in keywordDict) {
      let regex = new RegExp("\\b" + key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\b", "i");
      if(regex.test(input)) matchedKeywords.add(keywordDict[key]);
    }
    
    let matchesArray = Array.from(matchedKeywords);

    let matchedProjects = [];
    if(window.globalProjects) {
      window.globalProjects.forEach(proj => {
        let isMatch = false;
        let projText = (proj.title + " " + proj.description + " " + (proj.tags||[]).join(" ")).toLowerCase();
        matchesArray.forEach(kw => {
          if(projText.includes(kw.toLowerCase())) isMatch = true;
        });
        if(isMatch) matchedProjects.push(proj);
      });
    }

    let matchedCerts = [];
    if(window.globalCertificates) {
      window.globalCertificates.forEach(cert => {
        let isMatch = false;
        let certText = (cert.title + " " + cert.category).toLowerCase();
        matchesArray.forEach(kw => {
          if(certText.includes(kw.toLowerCase())) isMatch = true;
        });
        if(isMatch) matchedCerts.push(cert);
      });
    }

    let missingSkills = [];
    const myCoreSkills = ["Python", "React", "Firebase", "Flutter", "Dart", "MongoDB", "MySQL", "FastAPI", "REST APIs", "HTML", "CSS", "JavaScript", "Java", "C++", "C", "Machine Learning", "Artificial Intelligence", "Generative AI"];
    matchesArray.forEach(kw => {
      if(!myCoreSkills.includes(kw)) missingSkills.push(kw);
    });

    let pitchHTML = ``;
    if(matchesArray.length > 0) {
      pitchHTML += `<p>Based on your requirements, Rohit has a strong foundation aligned with this role. His portfolio shows practical exposure through related projects and certifications, specifically in <strong>${matchesArray.slice(0,4).join(", ")}</strong>.</p>`;
    } else {
      pitchHTML += `<p>Rohit has a versatile and highly adaptable skill set. While the specific keywords weren't directly matched in his core projects, his strong foundation in software engineering, frontend/backend architecture, and rapid learning ability make him a strong fit to ramp up quickly for this role.</p>`;
    }

    if(missingSkills.length > 0 && matchesArray.length > 0) {
      pitchHTML += `<p style="margin-top: 10px; color: var(--light-gray);">For requirements like <em>${missingSkills.slice(0,3).join(", ")}</em>, Rohit demonstrates strong learning speed and adaptability, making these excellent growth areas where he can quickly deliver value.</p>`;
    }

    let skillsHTML = matchesArray.length > 0 
      ? `<div><h4 class="fit-section-title">Matching Skills</h4><div class="matched-skills-list">` + matchesArray.map(kw => `<span class="matched-skill-chip">${kw}</span>`).join('') + `</div></div>`
      : ``;

    let projectsHTML = matchedProjects.length > 0
      ? `<div><h4 class="fit-section-title">Relevant Projects</h4><div class="matched-projects">` + matchedProjects.slice(0,3).map(proj => `
          <a href="${proj.link}" target="_blank" class="match-card">
            <img src="${proj.image}" alt="${proj.title}" class="match-img">
            <div class="match-info">
              <h4>${proj.title}</h4>
              <p>${proj.category}</p>
            </div>
          </a>
        `).join('') + `</div></div>`
      : ``;

    let certsHTML = matchedCerts.length > 0
      ? `<div><h4 class="fit-section-title">Relevant Certificates</h4><div class="matched-certs">` + matchedCerts.slice(0,3).map(cert => `
          <a href="${cert.link}" target="_blank" class="match-card">
            <img src="${cert.image}" alt="${cert.title}" class="match-img">
            <div class="match-info">
              <h4>${cert.title}</h4>
              <p>${cert.issuer}</p>
            </div>
          </a>
        `).join('') + `</div></div>`
      : ``;

    let ctaHTML = `
      <div class="fit-cta-group">
        <button class="fit-cta-btn primary" onclick="document.getElementById('recruiter-close-btn').click(); document.querySelector('[data-nav-link=\\'portfolio\\']').click(); window.scrollTo(0,0);">
          <ion-icon name="folder-outline"></ion-icon> View All Projects
        </button>
        <button class="fit-cta-btn secondary" onclick="document.getElementById('recruiter-close-btn').click(); document.querySelector('[data-nav-link=\\'contact\\']').click(); window.scrollTo(0,0);">
          <ion-icon name="mail-outline"></ion-icon> Contact Rohit
        </button>
      </div>
    `;

    if(stateResults) {
      stateResults.innerHTML = `
        <h3 class="h3 modal-title" style="margin-bottom: 20px;">Role Fit Summary</h3>
        <div class="fit-pitch">${pitchHTML}</div>
        ${skillsHTML}
        ${projectsHTML}
        ${certsHTML}
        ${ctaHTML}
      `;
    }
  }
});
