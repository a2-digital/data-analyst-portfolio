const navbar = document.getElementById("navbar") || document.querySelector(".navbar");
const navMenu = document.getElementById("nav-menu");
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelectorAll(".nav-link");
const scrollTopBtn = document.getElementById("scroll-top");
const contactForm = document.getElementById("contact-form");

window.addEventListener(
  "scroll",
  () => {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 100);
    }

    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle("active", window.scrollY > 300);
    }
  },
  { passive: true },
);

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (navMenu) navMenu.classList.remove("active");
    if (hamburger) hamburger.classList.remove("active");
  });
});

const sections = document.querySelectorAll("section");

if (navLinks.length && sections.length) {
  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;

      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").slice(1) === current) {
        link.classList.add("active");
      }
    });
  });
}

const typingText = document.querySelector(".typing-text");
const phrases = [
  "Business Intelligence",
  "Data Analytics",
  "Ingeniería de Sistemas",
  "SQL | Python | Power BI",
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    // Borrando
    typingText.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 40; // Más rápido para borrado
  } else {
    // Escribiendo
    typingText.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 80; // Velocidad optimizada para escritura
  }

  // Cuando termina de escribir la frase
  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    typingSpeed = 1500; // Pausa antes de borrar
  }

  // Cuando termina de borrar
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typingSpeed = 300; // Pausa antes de escribir la siguiente frase
  }

  setTimeout(typeEffect, typingSpeed);
}

// Iniciar efecto typing cuando carga la página
if (typingText) {
  document.addEventListener("DOMContentLoaded", typeEffect);
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const id = this.getAttribute("href");
    if (id === "#") return; // enlace vacío: no hay a dónde ir

    e.preventDefault();
    const target = document.querySelector(id);

    if (target) {
      const offsetTop = target.offsetTop - 70; // 70px por el navbar fijo

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// SCROLL TO TOP
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observar elementos para animaciones
const animateElements = document.querySelectorAll(
  ".project-card, .skill-item, .timeline-item, .about-text, .skills-container",
);

animateElements.forEach((el) => {
  observer.observe(el);
});

// Enlace de correo con opciones (solo en el index)
const emailLink = document.querySelector(".email-link");

if (emailLink) {
  emailLink.addEventListener("click", (e) => {
    e.preventDefault();

    const email = "andresdal090@gmail.com";

    // Mostrar modal con opciones
    const userChoice = confirm(
      "¿Cómo prefieres contactarme?\n\n" +
        "Aceptar = Se abrirá Gmail en navegador\n" +
        "Cancelar = Usará tu cliente de email predeterminado (Outlook, etc.)",
    );

    if (userChoice) {
      // Abrir Gmail web
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Contacto%20desde%20portafolio&body=Cordial%20Saludo`,
        "_blank",
      );
    } else {
      // Usar mailto (Outlook/cliente predeterminado)
      window.location.href = `mailto:${email}`;
    }
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Enviando...";
    submitBtn.disabled = true;

    const templateParams = {
      from_name: contactForm.name.value,
      from_email: contactForm.email.value,
      subject: contactForm.subject.value || "Sin asunto",
      message: contactForm.message.value,
    };

    emailjs
      .send("service_portafolio", "template_fabze5h", templateParams)
      .then((response) => {
        console.log("✅ Éxito:", response);
        showNotification("✅ ¡Mensaje enviado con éxito!", "success");
        contactForm.reset();
      })
      .catch((error) => {
        console.error("❌ Error completo:", error);
        showNotification(
          `❌ Error: ${error.text || "Intenta de nuevo"}`,
          "error",
        );
      })
      .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
  });
}

function showNotification(message, type = "success") {
  // Crear elemento de notificación
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Estilos inline
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === "success" ? "#e50914" : "#c4070f"};
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

  document.body.appendChild(notification);

  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Agregar estilos de animación para notificaciones
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .fade-in {
        animation: fadeInUp 0.8s ease both;
    }
`;
document.head.appendChild(style);

const hero = document.querySelector(".hero");

function createParticle() {
  if (!hero || document.hidden) return;

  const particle = document.createElement("div");
  particle.className = "particle";

  const size = Math.random() * 5 + 2;
  const posX = Math.random() * window.innerWidth;
  const duration = Math.random() * 3 + 2;

  particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(229, 9, 20, 0.5);
        border-radius: 50%;
        left: ${posX}px;
        top: 100%;
        pointer-events: none;
        animation: floatUp ${duration}s linear;
    `;

  hero.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, duration * 1000);
}

// Función para copiar correo con notificación emergente (Toast)
const copyEmailBtn = document.getElementById("copyEmailBtn");

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = "andresdal090@gmail.com";

    navigator.clipboard
      .writeText(email)
      .then(() => {
        showToast("¡Correo copiado al portapapeles!");
      })
      .catch((err) => {
        console.error("Error al copiar: ", err);
      });
  });
}

function showToast(message) {
  const existingToast = document.querySelector(".toast-notification");
  if (existingToast) existingToast.remove();

  // Crear elemento de notificación
  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Agregar animación de partículas
const particleStyle = document.createElement("style");
particleStyle.textContent = `
    @keyframes floatUp {
        to {
            transform: translateY(-100vh);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Crear partículas cada cierto tiempo (solo si existe el hero)
if (hero) {
  setInterval(createParticle, 300);
}

document.querySelectorAll("img[data-src]").forEach((img) => {
  img.src = img.dataset.src;
});

const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
emailLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // IMPORTANTE: prevenir el comportamiento default

    const email = link.href.replace("mailto:", "").split("?")[0]; // Limpiar parámetros

    // Copiar al clipboard
    navigator.clipboard
      .writeText(email)
      .then(() => {
        showNotification("📧 Email copiado: " + email, "success");
      })
      .catch(() => {
        // Si falla el clipboard, mostrar el email
        showNotification("Email: " + email, "success");
      });
  });
});

console.log(
  "%c¡Hola! 👋",
  "color: #e50914; font-size: 20px; font-weight: bold;",
);
console.log(
  "%c¿Interesado en mi código? Revisa mi GitHub: https://github.com/a2-digital",
  "color: #cccccc; font-size: 14px;",
);

window.addEventListener("load", () => {
  console.log("✅ Portafolio cargado correctamente");
});

const projectsCarousel = document.getElementById("projectsCarousel");
const carouselPrev = document.getElementById("carouselPrev");
const carouselNext = document.getElementById("carouselNext");
const carouselDots = document.getElementById("carouselDots");

if (projectsCarousel && carouselPrev && carouselNext && carouselDots) {
  const cards = Array.from(projectsCarousel.querySelectorAll(".project-card"));

  const cardStep = () => {
    if (!cards.length) return 300;
    const carouselStyle = getComputedStyle(projectsCarousel);
    const gap = parseInt(carouselStyle.columnGap || carouselStyle.gap || "24");
    return cards[0].offsetWidth + gap;
  };

  // Genera un punto por cada card
  cards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot" + (index === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Ir al proyecto ${index + 1}`);
    dot.addEventListener("click", () => {
      projectsCarousel.scrollTo({
        left: index * cardStep(),
        behavior: "smooth",
      });
    });
    carouselDots.appendChild(dot);
  });

  const dots = Array.from(carouselDots.querySelectorAll(".carousel-dot"));

  const updateActiveDot = () => {
    const index = Math.round(projectsCarousel.scrollLeft / cardStep());
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  };

  let scrollTimeout;
  projectsCarousel.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveDot, 100);
  });

  carouselPrev.addEventListener("click", () => {
    projectsCarousel.scrollBy({ left: -cardStep(), behavior: "smooth" });
  });

  carouselNext.addEventListener("click", () => {
    projectsCarousel.scrollBy({ left: cardStep(), behavior: "smooth" });
  });
}

// ===============================
// CASOS DE ESTUDIO: marcar el proyecto actual en el footer
// ===============================
const limpiarRuta = (ruta) =>
  ruta.replace(/\/$/, "").split("/").pop().replace(".html", "");

const paginaActual = limpiarRuta(location.pathname);

document.querySelectorAll(".footer-mini-card").forEach((card) => {
  if (limpiarRuta(card.getAttribute("href")) === paginaActual) {
    card.setAttribute("aria-current", "page");
  }
});