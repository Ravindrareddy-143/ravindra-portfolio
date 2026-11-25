document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // Mobile navigation
  // -----------------------------
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // -----------------------------
  // Active navbar link
  // -----------------------------
  const sections = document.querySelectorAll("main section[id]");
  const navItems = document.querySelectorAll(".nav-link");

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach(section => sectionObserver.observe(section));

  // -----------------------------
  // Scroll reveal
  // -----------------------------
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10 });

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // -----------------------------
  // Project filtering
  // -----------------------------
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      projectCards.forEach(card => {
        const show = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden", !show);
      });
    });
  });

  // -----------------------------
  // Project image lightbox
  // -----------------------------
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");

  document.querySelectorAll(".image-btn").forEach(button => {
    button.addEventListener("click", () => {
      lightboxImage.src = button.dataset.image;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.style.overflow = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeLightbox();
  });

  // -----------------------------
  // Chart.js
  // -----------------------------
  const chartFont = "'Inter', sans-serif";
  const gridColor = "rgba(120, 160, 195, 0.12)";
  const textColor = "#9fb2c8";

  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: { family: chartFont, size: 11 }
        }
      },
      tooltip: {
        backgroundColor: "#071625",
        borderColor: "rgba(53,224,255,.30)",
        borderWidth: 1,
        titleColor: "#ffffff",
        bodyColor: "#c9d9e8",
        padding: 12
      }
    }
  };

  const barCanvas = document.getElementById("projectBarChart");
  const pieCanvas = document.getElementById("projectPieChart");

  if (barCanvas && typeof Chart !== "undefined") {
    new Chart(barCanvas, {
      type: "bar",
      data: {
        labels: ["Power BI", "Excel","Python"],
        datasets: [{
          label: "Projects",
          data: [3, 5, 1],
          backgroundColor: [
            "rgba(53, 224, 255, 0.78)",
            "rgba(155, 123, 255, 0.78)",
            "rgba(168, 36, 153, 0.78)"
          ],
          borderColor: ["#35e0ff", "#9b7bff","#791b7c"],
          borderWidth: 1,
          borderRadius: 8
        }]
      },
      options: {
        ...chartDefaults,
        scales: {
          x: {
            ticks: { color: textColor, font: { family: chartFont, size: 11 } },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            suggestedMax: 10,
            ticks: { color: textColor, stepSize: 1, precision: 0 },
            grid: { color: gridColor }
          }
        }
      }
    });
  }

  if (pieCanvas && typeof Chart !== "undefined") {
    new Chart(pieCanvas, {
      type: "doughnut",
      data: {
        labels: ["Power BI", "Excel","Python"],
        datasets: [{
          data: [3, 5,1],
          backgroundColor: ["#35e0ff", "#9b7bff","#791b7c"],
          borderColor: "#0a1727",
          borderWidth: 5,
          hoverOffset: 8
        }]
      },
      options: {
        ...chartDefaults,
        cutout: "65%",
        plugins: {
          ...chartDefaults.plugins,
          legend: {
            position: "bottom",
            labels: {
              color: textColor,
              padding: 18,
              font: { family: chartFont, size: 11 }
            }
          }
        }
      }
    });
  }

  // -----------------------------
  // Professional highlights carousel
  // -----------------------------
  const slides = [...document.querySelectorAll(".highlight-slide")];
  const dotsContainer = document.getElementById("highlightDots");
  const prevButton = document.getElementById("prevHighlight");
  const nextButton = document.getElementById("nextHighlight");
  let currentSlide = 0;
  let autoPlay;

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = `slider-dot${index === currentSlide ? " active" : ""}`;
      dot.setAttribute("aria-label", `Show highlight ${index + 1}`);
      dot.addEventListener("click", () => {
        currentSlide = index;
        updateSlide();
        restartAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateSlide() {
    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === currentSlide);
    });
    renderDots();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide();
  }

  function previousSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlide();
  }

  function restartAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(nextSlide, 5000);
  }

  if (slides.length) {
    prevButton.addEventListener("click", () => {
      previousSlide();
      restartAutoPlay();
    });

    nextButton.addEventListener("click", () => {
      nextSlide();
      restartAutoPlay();
    });

    updateSlide();
    restartAutoPlay();
  }

  // Pause carousel while user is hovering/focusing on it.
  const slider = document.querySelector(".highlight-slider");
  if (slider) {
    slider.addEventListener("mouseenter", () => clearInterval(autoPlay));
    slider.addEventListener("mouseleave", restartAutoPlay);
    slider.addEventListener("focusin", () => clearInterval(autoPlay));
    slider.addEventListener("focusout", restartAutoPlay);
  }
});
