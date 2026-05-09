const adminNumber = "6285177170851";
const form = document.querySelector("#consultForm");
const preview = document.querySelector("#messagePreview");
const formStatus = document.querySelector("#formStatus");
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
  const customerWhatsapp = getValue("#customerWhatsapp") || "Belum diisi";
  const outlet = getValue("#outlet") || "Amanah Servis terdekat";
  const phoneModel = getValue("#phoneModel") || "[tipe HP]";
  const problem = getValue("#problem") || "[masalah HP]";
  const urgency = getValue("#urgency") || "Mau tanya estimasi dulu";
  const story = getValue("#story") || "[cerita kondisi HP]";
  const quickNotes = getCheckedQuickNotes();
  const quickText = quickNotes.length ? quickNotes.join(", ") : "Belum dipilih";

  return `Hai Kak, aku tahu dari website. Saya ingin bertanya, HP saya ${phoneModel} mengalami ${problem}. ${story} Dan berapa biayanya? :)\n\nNama: ${name}\nEmail: ${email}\nNo WhatsApp saya: ${customerWhatsapp}\nOutlet pilihan: ${outlet}\nKapan ingin ditangani: ${urgency}\nKondisi tambahan: ${quickText}`;
}

function collectPayload() {
  return {
    name: getValue("#name"),
    email: getValue("#email"),
    customerWhatsapp: getValue("#customerWhatsapp"),
    outlet: getValue("#outlet"),
    phoneModel: getValue("#phoneModel"),
    problem: getValue("#problem"),
    urgency: getValue("#urgency"),
    story: getValue("#story"),
    quickNotes: getCheckedQuickNotes(),
  };
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

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.reportValidity()) {
    return;
  }

  formStatus.textContent = "Menyiapkan chat WhatsApp...";
  formStatus.className = "form-status is-loading";

  try {
    const response = await fetch("/api/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(collectPayload()),
    });

    if (!response.ok) {
      throw new Error("Backend tidak merespons dengan benar.");
    }

    const data = await response.json();
    window.open(data.waUrl, "_blank", "noopener");
    formStatus.textContent = "WhatsApp sudah dibuka. Tinggal kirim pesannya.";
    formStatus.className = "form-status";
  } catch (error) {
    const message = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/${adminNumber}?text=${message}`, "_blank", "noopener");
    formStatus.textContent = "Mode cepat aktif. WhatsApp tetap dibuka dari browser.";
    formStatus.className = "form-status is-error";
  }
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
