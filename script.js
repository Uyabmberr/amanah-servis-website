const adminNumber = "6285177170851";
const form = document.querySelector("#consultForm");
const preview = document.querySelector("#messagePreview");
const problemSelect = document.querySelector("#problem");
const serviceCards = document.querySelectorAll(".service-card");
const revealItems = document.querySelectorAll(".reveal");

const getValue = (selector) => document.querySelector(selector)?.value.trim() || "";

function getCheckedQuickNotes() {
  return [...document.querySelectorAll('input[name="quick"]:checked')].map((item) => item.value);
}

function buildMessage() {
  const name = getValue("#name") || "[nama]";
  const email = getValue("#email") || "[email]";
  const phoneModel = getValue("#phoneModel") || "[tipe HP]";
  const problem = getValue("#problem") || "[masalah HP]";
  const story = getValue("#story") || "[cerita kondisi HP]";
  const quickNotes = getCheckedQuickNotes();
  const quickText = quickNotes.length ? quickNotes.join(", ") : "Belum dipilih";

  return `Hai Kak, aku tahu dari website. Saya ingin bertanya, HP saya ${phoneModel} mengalami ${problem}. ${story} Dan berapa biayanya? 🙂\n\nNama: ${name}\nEmail: ${email}\nKondisi tambahan: ${quickText}`;
}

function updatePreview() {
  preview.textContent = buildMessage();
}

serviceCards.forEach((card) => {
  card.addEventListener("click", () => {
    serviceCards.forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    problemSelect.value = card.dataset.problem;
    updatePreview();
    document.querySelector("#konsultasi").scrollIntoView({ behavior: "smooth", block: "start" });
    document.querySelector("#phoneModel").focus({ preventScroll: true });
  });
});

form.addEventListener("input", updatePreview);
form.addEventListener("change", updatePreview);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) {
    return;
  }

  const message = encodeURIComponent(buildMessage());
  window.open(`https://wa.me/${adminNumber}?text=${message}`, "_blank", "noopener");
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item) => observer.observe(item));

document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("mousemove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});

updatePreview();
