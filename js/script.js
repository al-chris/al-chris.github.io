// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navLinksItems = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('backToTop');
const typingElement = document.getElementById('typingElement');
const projectsGrid = document.getElementById('projectsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const currentYearElements = document.querySelectorAll('#currentYear');

// Set current year in footer
currentYearElements.forEach(element => {
  element.textContent = new Date().getFullYear();
});

// Typing Animation
const typingTexts = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Problem Solver"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 200;

function typeText() {
  const currentText = typingTexts[textIndex];
  
  if (isDeleting) {
    typingElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
    typingDelay = 100;
  } else {
    typingElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
    typingDelay = 200;
  }
  
  // If word is complete
  if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    typingDelay = 1000; // Pause at end
  }
  
  // If deleting is complete
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex++;
    // Reset to first text if reached end of array
    if (textIndex >= typingTexts.length) {
      textIndex = 0;
    }
  }
  
  setTimeout(typeText, typingDelay);
}

// Start the typing animation when page loads
window.addEventListener('load', () => {
  if (typingElement) {
    setTimeout(typeText, 1000);
  }
});

// Sticky Navbar
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('sticky');
    backToTopBtn.classList.add('active');
  } else {
    navbar.classList.remove('sticky');
    backToTopBtn.classList.remove('active');
  }
  
  // Active nav links based on scroll
  highlightActiveNavLink();
});

// Highlight active nav link on scroll
function highlightActiveNavLink() {
  const scrollPosition = window.scrollY;
  
  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile nav when clicking a nav link
navLinksItems.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Back to top button
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Projects Filter
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filter = btn.getAttribute('data-filter');
    filterProjects(filter);
  });
});

// Filter projects based on category
function filterProjects(filter) {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    if (filter === 'all' || card.classList.contains(filter)) {
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
}

// Load projects from JSON file
async function loadProjects() {
  try {
    const response = await fetch('js/projects.json');
    const projects = await response.json();
    
    // Clear loading spinner
    projectsGrid.innerHTML = '';
    
    // Add projects to the grid
    projects.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.className = `project-card ${project.category}`;
      
      projectCard.innerHTML = `
        <div class="project-image">
          <img src="${project.image}" alt="${project.title}">
          <span class="project-category">${getCategoryLabel(project.category)}</span>
        </div>
        <div class="project-info">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-links">
            ${project.liveLink ? `<a href="${project.liveLink}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
            ${project.codeLink ? `<a href="${project.codeLink}" target="_blank"><i class="fab fa-github"></i> Source Code</a>` : ''}
          </div>
        </div>
      `;
      
      projectsGrid.appendChild(projectCard);
    });
  } catch (error) {
    console.error('Error loading projects:', error);
    projectsGrid.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
  }
}

// Convert category code to label
function getCategoryLabel(category) {
  const labels = {
    'web': 'Web App',
    'mobile': 'Mobile App',
    'other': 'Other'
  };
  return labels[category] || 'Project';
}

// Handle contact form submission
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // In a real project, you would send this to a backend
    // For demo purposes, we'll just simulate a successful submission
    
    // Show loading status
    formStatus.textContent = 'Sending...';
    formStatus.className = 'form-status';
    formStatus.style.display = 'block';
    
    // Simulate API call
    setTimeout(() => {
      // Success response
      formStatus.textContent = 'Your message has been sent successfully!';
      formStatus.className = 'form-status success';
      
      // Reset form
      contactForm.reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 5000);
    }, 1500);
  });
}

// Animation on scroll (simple implementation)
function animateOnScroll() {
  const elements = document.querySelectorAll('[data-aos]');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    
    if (elementPosition < screenPosition) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Load projects
  loadProjects();
  
  // Initialize animation on scroll
  window.addEventListener('scroll', animateOnScroll);
  
  // Trigger once on load
  setTimeout(animateOnScroll, 500);
});
