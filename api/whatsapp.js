const ADMIN_NUMBER = "6285177170851";

function clean(value, fallback = "") {
  return String(value || fallback)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 700);
}

function buildMessage(body) {
  const name = clean(body.name, "[nama]");
  const email = clean(body.email, "[email]");
  const customerWhatsapp = clean(body.customerWhatsapp, "Belum diisi");
  const outlet = clean(body.outlet, "Amanah Servis terdekat");
  const phoneModel = clean(body.phoneModel, "[tipe HP]");
  const problem = clean(body.problem, "[masalah HP]");
  const urgency = clean(body.urgency, "Mau tanya estimasi dulu");
  const story = clean(body.story, "[cerita kondisi HP]");
  const quickNotes = Array.isArray(body.quickNotes)
    ? body.quickNotes.map((item) => clean(item)).filter(Boolean).join(", ")
    : "Belum dipilih";

  return `Hai Kak, aku tahu dari website. Saya ingin bertanya, HP saya ${phoneModel} mengalami ${problem}. ${story} Dan berapa biayanya? :)\n\nNama: ${name}\nEmail: ${email}\nNo WhatsApp saya: ${customerWhatsapp}\nOutlet pilihan: ${outlet}\nKapan ingin ditangani: ${urgency}\nKondisi tambahan: ${quickNotes || "Belum dipilih"}`;
}

module.exports = function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const required = ["name", "email", "phoneModel", "problem", "story"];
  const missing = required.filter((field) => !clean(body[field]));

  if (missing.length) {
    return res.status(400).json({
      error: "Data belum lengkap",
      missing,
    });
  }

  const message = buildMessage(body);
  return res.status(200).json({
    message,
    waUrl: `https://wa.me/${ADMIN_NUMBER}?text=${encodeURIComponent(message)}`,
  });
};
