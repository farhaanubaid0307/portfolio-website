const root = document.documentElement;
const body = document.body;
const meter = document.querySelector(".scroll-meter span");
const heroImage = document.querySelector(".hero__image");
const football = document.querySelector(".football");
const cards = document.querySelectorAll(".trait-card");
const positions = document.querySelectorAll(".position");
const pitchLabel = document.getElementById("pitchLabel");
const pitchTitle = document.getElementById("pitchTitle");
const pitchText = document.getElementById("pitchText");

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

window.addEventListener("load", () => {
  window.setTimeout(() => body.classList.add("loaded"), 450);
});

window.setTimeout(() => body.classList.add("loaded"), 1200);

cards.forEach((card, index) => {
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

let latestMouseX = 0;
let latestMouseY = 0;
let currentMouseX = 0;
let currentMouseY = 0;
let ticking = false;

window.addEventListener("pointermove", (event) => {
  const x = event.clientX / window.innerWidth - 0.5;
  const y = event.clientY / window.innerHeight - 0.5;
  latestMouseX = x * 28;
  latestMouseY = y * 18;
});

function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = scrollTop / docHeight;

  if (meter) {
    meter.style.width = `${progress * 100}%`;
  }

  if (heroImage) {
    const heroProgress = Math.min(1, scrollTop / Math.max(1, window.innerHeight));
    heroImage.style.transform = `translateY(${heroProgress * 52}px) scale(${1.04 + heroProgress * 0.035})`;
  }

  currentMouseX += (latestMouseX - currentMouseX) * 0.08;
  currentMouseY += (latestMouseY - currentMouseY) * 0.08;

  if (football) {
    football.style.setProperty("--ball-x", `${currentMouseX}px`);
    football.style.setProperty("--ball-y", `${currentMouseY}px`);
    football.style.setProperty("--ball-rotate", `${scrollTop * 0.12}deg`);
  }

  ticking = false;
}

function requestTick() {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}

window.addEventListener("scroll", requestTick, { passive: true });
window.addEventListener("resize", requestTick);
window.addEventListener("pointermove", requestTick, { passive: true });
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

    pitchLabel.textContent = note.label;
    pitchTitle.textContent = note.title;
    pitchText.textContent = note.text;
  });
});

cards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-0.45rem) rotate(var(--card-rotate)) rotateX(${-y * 6}deg) rotateY(${x * 8}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "rotate(var(--card-rotate))";
  });
});
