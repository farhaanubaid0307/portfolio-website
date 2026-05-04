const root = document.documentElement;
const body = document.body;
const meter = document.querySelector(".scroll-meter span");
const hero = document.querySelector(".hero");
const particleCanvas = document.getElementById("particleCanvas");
const contactParticles = document.getElementById("contactParticles");
const ghostNumber = document.getElementById("ghostNumber");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const weightShift = document.querySelector(".weight-shift");
const navLinks = document.querySelectorAll("[data-section-link]");
const pageSections = document.querySelectorAll("main > section[id]");
const positions = document.querySelectorAll(".position");
const scoutBoard = document.getElementById("scoutBoard");
const pitchLabel = document.getElementById("pitchLabel");
const pitchTitle = document.getElementById("pitchTitle");
const pitchText = document.getElementById("pitchText");
const routeLines = document.querySelectorAll(".route");
const horizontalStory = document.querySelector(".horizontal-story");
const horizontalTrack = document.querySelector(".horizontal-story__track");
const horizontalProgress = document.querySelector(".horizontal-story__progress span");
const chapterCards = document.querySelectorAll(".chapter-card");
const timelineTrack = document.getElementById("experienceTimeline");
const timelineProgress = document.querySelector(".timeline-progress span");
const scoutingCard = document.querySelector(".scouting-card");
const tiltCards = document.querySelectorAll(".story-panel, .trait-card, .project-card");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const loadStartedAt = performance.now();

const pitchNotes = {
  defense: {
    label: "Defense",
    title: "Academics and discipline",
    text:
      "Class X ICSE 99.4% and Class XII PCMC 92% current score. This is the foundation: stable, repeatable, and built under pressure.",
  },
  midfield: {
    label: "Midfield",
    title: "Teamwork and communication",
    text:
      "Sport, event leadership, and team projects all sit here. The value is connecting people, ideas, and execution.",
  },
  builder: {
    label: "Creative Midfield",
    title: "Tools and technical growth",
    text:
      "Java from ICSE, Python basics, Firebase API collaboration, testing, and AI-assisted prototyping with honest project framing.",
  },
  attack: {
    label: "Attack",
    title: "Projects and ambition",
    text:
      "The highlight reel includes the Teacher Time-Efficiency Game and the Farmer Oriented App, with the strongest story focused on contribution and outcome.",
  },
  captain: {
    label: "Captain",
    title: "Leadership and identity",
    text:
      "Commerce Fest event head, Entrepreneurship Fest winner, and Future Commerce Fest event head. The captain role is about owning moments.",
  },
};

const cardRotations = ["-2deg", "1.5deg", "-1deg", "2deg"];

function initParticleCanvas() {
  if (!particleCanvas || reducedMotion.matches) {
    return;
  }

  const context = particleCanvas.getContext("2d");
  if (!context) {
    return;
  }

  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrame = 0;
  let pointerX = 0.5;
  let pointerY = 0.5;

  function resizeCanvas() {
    const rect = particleCanvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    particleCanvas.width = Math.floor(width * ratio);
    particleCanvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(92, Math.max(42, Math.round(width / 18)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.26,
      vy: (Math.random() - 0.5) * 0.22,
      size: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.34 + 0.18,
    }));
  }

  function drawParticleLinks(particle, index) {
    for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
      const next = particles[nextIndex];
      const dx = particle.x - next.x;
      const dy = particle.y - next.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 118) {
        const opacity = (1 - distance / 118) * 0.16;
        context.strokeStyle = `rgba(200, 245, 60, ${opacity})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(next.x, next.y);
        context.stroke();
      }
    }
  }

  function animateParticles() {
    context.clearRect(0, 0, width, height);

    const driftX = (pointerX - 0.5) * 0.18;
    const driftY = (pointerY - 0.5) * 0.14;

    particles.forEach((particle, index) => {
      particle.x += particle.vx + driftX;
      particle.y += particle.vy + driftY;

      if (particle.x < -8) particle.x = width + 8;
      if (particle.x > width + 8) particle.x = -8;
      if (particle.y < -8) particle.y = height + 8;
      if (particle.y > height + 8) particle.y = -8;

      drawParticleLinks(particle, index);

      const glow = context.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.size * 5
      );
      glow.addColorStop(0, `rgba(244, 241, 232, ${particle.alpha})`);
      glow.addColorStop(0.55, `rgba(23, 137, 215, ${particle.alpha * 0.3})`);
      glow.addColorStop(1, "rgba(244, 241, 232, 0)");

      context.fillStyle = glow;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size * 5, 0, Math.PI * 2);
      context.fill();
    });

    animationFrame = window.requestAnimationFrame(animateParticles);
  }

  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX / window.innerWidth;
    pointerY = event.clientY / window.innerHeight;
  });

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  animateParticles();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationFrame);
    } else {
      animateParticles();
    }
  });
}

initParticleCanvas();

function initContactParticles() {
  if (!contactParticles || reducedMotion.matches) {
    return;
  }

  const context = contactParticles.getContext("2d");
  if (!context) {
    return;
  }

  let width = 0;
  let height = 0;
  let dots = [];
  let frame = 0;

  function resizeCanvas() {
    const rect = contactParticles.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    contactParticles.width = Math.floor(width * ratio);
    contactParticles.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    dots = Array.from({ length: Math.min(44, Math.max(20, Math.round(width / 24))) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.7,
      speed: Math.random() * 0.22 + 0.08,
      alpha: Math.random() * 0.22 + 0.12,
    }));
  }

  function animate() {
    context.clearRect(0, 0, width, height);
    dots.forEach((dot) => {
      dot.x += dot.speed;
      dot.y += Math.sin((dot.x + dot.y) * 0.01) * 0.08;

      if (dot.x > width + 8) {
        dot.x = -8;
        dot.y = Math.random() * height;
      }

      context.fillStyle = `rgba(244, 241, 232, ${dot.alpha})`;
      context.beginPath();
      context.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      context.fill();
    });

    frame = window.requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  animate();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(frame);
    } else {
      animate();
    }
  });
}

initContactParticles();

function initCustomCursor() {
  if (!cursorDot || !cursorRing || !finePointer.matches) {
    return;
  }

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isHovering = false;

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") {
      return;
    }

    mouseX = event.clientX;
    mouseY = event.clientY;
    cursorDot.classList.add("is-visible");
    cursorRing.classList.add("is-visible");
    cursorDot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
  });

  function animateCursorRing() {
    ringX += (mouseX - ringX) * 0.42;
    ringY += (mouseY - ringY) * 0.42;
    const offset = isHovering ? 21 : 12;
    cursorRing.style.transform = `translate3d(${ringX - offset}px, ${ringY - offset}px, 0)`;
    window.requestAnimationFrame(animateCursorRing);
  }

  animateCursorRing();

  document.addEventListener("pointerdown", () => cursorDot.classList.add("is-clicking"));
  document.addEventListener("pointerup", () => cursorDot.classList.remove("is-clicking"));

  document.querySelectorAll("a, button, .trait-card, .story-panel, .highlight, .position, .about-card, .skill-card").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      isHovering = true;
      cursorRing.classList.add("is-hovering");
    });

    item.addEventListener("mouseleave", () => {
      isHovering = false;
      cursorRing.classList.remove("is-hovering");
    });
  });
}

initCustomCursor();

function finishLoading() {
  if (body.classList.contains("loaded")) {
    return;
  }

  body.classList.add("loaded");
  document.querySelectorAll(".hero .reveal").forEach((item) => item.classList.add("is-visible"));

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    window.setTimeout(() => target?.scrollIntoView({ block: "start" }), 250);
  }
}

window.addEventListener("load", () => {
  const elapsed = performance.now() - loadStartedAt;
  window.setTimeout(finishLoading, Math.max(0, 1500 - elapsed));
});

window.setTimeout(finishLoading, 2400);

tiltCards.forEach((card, index) => {
  card.style.setProperty("--card-rotate", cardRotations[index % cardRotations.length]);
});

chapterCards.forEach((card, index) => {
  card.style.setProperty("--chapter-index", index);
});

pageSections.forEach((section) => {
  section.querySelectorAll(".reveal").forEach((item, index) => {
    item.style.setProperty("--reveal-order", Math.min(index, 8));
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.14,
  }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-entered");
      }
    });
  },
  {
    rootMargin: "-18% 0px -28% 0px",
    threshold: 0.12,
  }
);

pageSections.forEach((section) => sectionObserver.observe(section));

let horizontalDistance = 0;
let ticking = false;

function isHorizontalNative() {
  return window.matchMedia("(max-width: 760px), (prefers-reduced-motion: reduce)").matches;
}

function updateHorizontalMetrics() {
  if (!horizontalStory || !horizontalTrack) {
    return;
  }

  if (isHorizontalNative()) {
    horizontalStory.style.removeProperty("height");
    horizontalTrack.style.removeProperty("transform");
    horizontalDistance = 0;
    return;
  }

  horizontalDistance = Math.max(0, horizontalTrack.scrollWidth - window.innerWidth);
  horizontalStory.style.height = `${window.innerHeight + horizontalDistance}px`;
}

function updateHorizontalStory() {
  if (!horizontalStory || !horizontalTrack) {
    return;
  }

  if (isHorizontalNative()) {
    const scrollable = Math.max(1, horizontalTrack.scrollWidth - horizontalTrack.clientWidth);
    const nativeProgress = horizontalTrack.scrollLeft / scrollable;
    horizontalProgress?.style.setProperty("transform", `scaleX(${nativeProgress})`);
    return;
  }

  const rect = horizontalStory.getBoundingClientRect();
  const scrollable = Math.max(1, horizontalStory.offsetHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
  horizontalTrack.style.transform = `translate3d(${-horizontalDistance * progress}px, 0, 0)`;
  horizontalProgress?.style.setProperty("transform", `scaleX(${progress})`);
}

function updateTimelineProgress() {
  if (!timelineTrack || !timelineProgress) {
    return;
  }

  const scrollable = Math.max(1, timelineTrack.scrollWidth - timelineTrack.clientWidth);
  const progress = timelineTrack.scrollLeft / scrollable;
  timelineProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
}

function updateActiveNavigation() {
  if (!navLinks.length) {
    return;
  }

  const marker = window.innerHeight * 0.38;
  let activeLink = navLinks[0];
  let activeTarget = document.querySelector(activeLink.getAttribute("href"));

  navLinks.forEach((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) {
      return;
    }

    const rect = target.getBoundingClientRect();
    if (rect.top <= marker && rect.bottom >= marker) {
      activeLink = link;
      activeTarget = target;
    } else if (rect.top <= marker) {
      activeLink = link;
      activeTarget = target;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link === activeLink);
    if (link === activeLink) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  pageSections.forEach((section) => {
    section.classList.toggle("is-current-section", section === activeTarget);
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", link.getAttribute("href"));
  });
});

window.addEventListener("pointermove", (event) => {
  const x = event.clientX / window.innerWidth - 0.5;
  const y = event.clientY / window.innerHeight - 0.5;

  if (scoutBoard) {
    scoutBoard.style.setProperty("--board-mx", `${x * 70}px`);
    scoutBoard.style.setProperty("--board-my", `${y * 54}px`);
  }

  if (hero) {
    hero.style.setProperty("--hero-mx", `${x * 90}px`);
    hero.style.setProperty("--hero-my", `${y * 68}px`);
  }

  if (weightShift) {
    const weight = 620 + Math.round((event.clientX / window.innerWidth + event.clientY / window.innerHeight) * 140);
    const clampedWeight = Math.min(900, Math.max(620, weight));
    weightShift.style.fontVariationSettings = `"wght" ${clampedWeight}`;
  }

  if (scoutingCard) {
    const rect = scoutingCard.getBoundingClientRect();
    if (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    ) {
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      scoutingCard.style.setProperty("--scout-x", `${x}%`);
      scoutingCard.style.setProperty("--scout-y", `${y}%`);
    }
  }
});

function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = scrollTop / docHeight;

  if (meter) {
    meter.style.width = `${progress * 100}%`;
  }

  if (ghostNumber && window.innerWidth > 760) {
    const heroHeight = hero?.offsetHeight || window.innerHeight;
    if (scrollTop <= heroHeight) {
      ghostNumber.style.transform = `translateY(calc(-50% + ${scrollTop * 0.15}px))`;
    }
  }

  updateHorizontalStory();
  updateTimelineProgress();
  updateActiveNavigation();

  ticking = false;
}

function requestTick() {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}

window.addEventListener("scroll", requestTick, { passive: true });
window.addEventListener("resize", () => {
  updateHorizontalMetrics();
  requestTick();
});
horizontalTrack?.addEventListener("scroll", () => {
  if (isHorizontalNative()) {
    updateHorizontalStory();
  }
}, { passive: true });
timelineTrack?.addEventListener("scroll", updateTimelineProgress, { passive: true });

function initExperienceTimeline() {
  if (!timelineTrack) {
    return;
  }

  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;

  timelineTrack.addEventListener("wheel", (event) => {
    const canScroll = timelineTrack.scrollWidth > timelineTrack.clientWidth;
    if (!canScroll || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      return;
    }

    event.preventDefault();
    timelineTrack.scrollLeft += event.deltaY;
    updateTimelineProgress();
  }, { passive: false });

  timelineTrack.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    isDragging = true;
    startX = event.clientX;
    startScrollLeft = timelineTrack.scrollLeft;
    timelineTrack.classList.add("is-dragging");
    timelineTrack.setPointerCapture?.(event.pointerId);
  });

  timelineTrack.addEventListener("pointermove", (event) => {
    if (!isDragging) {
      return;
    }

    event.preventDefault();
    const delta = event.clientX - startX;
    timelineTrack.scrollLeft = startScrollLeft - delta;
    updateTimelineProgress();
  });

  function stopDragging(event) {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    timelineTrack.classList.remove("is-dragging");
    if (event?.pointerId !== undefined) {
      timelineTrack.releasePointerCapture?.(event.pointerId);
    }
  }

  timelineTrack.addEventListener("pointerup", stopDragging);
  timelineTrack.addEventListener("pointercancel", stopDragging);
  timelineTrack.addEventListener("pointerleave", stopDragging);

  timelineTrack.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    timelineTrack.scrollBy({
      left: direction * Math.min(360, timelineTrack.clientWidth * 0.72),
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  });
}

initExperienceTimeline();
updateHorizontalMetrics();
requestTick();

positions.forEach((position) => {
  position.addEventListener("click", () => {
    const role = position.dataset.role;
    const note = pitchNotes[role];

    if (!note) {
      return;
    }

    positions.forEach((item) => item.classList.remove("active"));
    position.classList.add("active");
    routeLines.forEach((route) => {
      route.classList.toggle("active", route.dataset.route === role);
    });

    pitchLabel.textContent = note.label;
    pitchTitle.textContent = note.title;
    pitchText.textContent = note.text;
  });
});

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-0.45rem) rotate(var(--card-rotate)) rotateX(${-y * 6}deg) rotateY(${x * 8}deg)`;

    if (card.classList.contains("project-card")) {
      card.style.setProperty("--project-x", `${(x + 0.5) * 100}%`);
      card.style.setProperty("--project-y", `${(y + 0.5) * 100}%`);
    }
  });

  card.addEventListener("pointerleave", () => {
    if (card.classList.contains("project-card")) {
      card.style.transform = "";
      return;
    }

    card.style.transform = "rotate(var(--card-rotate))";
  });
});
