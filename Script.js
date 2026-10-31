// Mobile navigation

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", function () {
    navLinks.classList.toggle("active");
});

// Close menu after selecting a link

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", function () {
        navLinks.classList.remove("active");
    });
});

// WhatsApp ordering

const whatsappBtn = document.getElementById("whatsappBtn");

// Replace this number with your business WhatsApp number.
// Use country code without + or spaces.

const whatsappNumber = "923127433874";

whatsappBtn.href =
    "https://wa.me/" + whatsappNumber +
    "?text=" + encodeURIComponent(
        "Assalamualaikum! I want to know more about ZAYQORA Kitchen products."
    );
