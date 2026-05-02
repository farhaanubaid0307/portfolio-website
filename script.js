const root = document.documentElement;
const body = document.body;
const meter = document.querySelector(".scroll-meter span");
const hero = document.querySelector(".hero");
const ghostNumber = document.getElementById("ghostNumber");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const weightShift = document.querySelector(".weight-shift");
const positions = document.querySelectorAll(".position");
const scoutBoard = document.getElementById("scoutBoard");
const pitchLabel = document.getElementById("pitchLabel");
const pitchTitle = document.getElementById("pitchTitle");
const pitchText = document.getElementById("pitchText");
const routeLines = document.querySelectorAll(".route");
const horizontalStory = document.querySelector(".horizontal-story");
const horizontalTrack = document.querySelector(".horizontal-story__track");
const horizontalProgress = document.querySelector(".horizontal-story__progress span");
const scoutingCard = document.querySelector(".scouting-card");
const tiltCards = document.querySelectorAll(".story-panel, .trait-card");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
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

  document.querySelectorAll("a, button, .trait-card, .story-panel, .highlight, .position").forEach((item) => {
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
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "rotate(var(--card-rotate))";
  });
});
