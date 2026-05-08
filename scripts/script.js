const cards = Array.from(document.querySelectorAll(".tattoo-card"));
const visibleCount = document.querySelector("#visible-count");
const modal = document.querySelector(".modal");
const modalImage = modal?.querySelector("img");
const modalStyle = modal?.querySelector(".modal-style");
const modalClose = modal?.querySelector(".modal-close");
const revealItems = document.querySelectorAll(".reveal");
const whatsappButtons = document.querySelectorAll(".whatsapp-contact");
const whatsappPhone = "656 267 1995";

function updateVisibleCount() {
    if (visibleCount) {
        visibleCount.textContent = String(cards.length);
    }
}

function openModal(card) {
    const image = card.querySelector("img");

    if (!modal || !modalImage || !modalStyle || !image) {
        return;
    }

    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalStyle.textContent = card.dataset.style || "Trabajo";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
}

function closeModal() {
    if (!modal) {
        return;
    }

    modal.hidden = true;
    document.body.style.overflow = "";
}

cards.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
});

whatsappButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const icon = button.querySelector("i")?.outerHTML || "";

        button.classList.add("is-showing-phone");
        button.setAttribute("aria-label", `WhatsApp: ${whatsappPhone}`);

        if (!button.classList.contains("whatsapp-float")) {
            button.innerHTML = `${icon}${whatsappPhone}`;
        }
    });
});

modalClose?.addEventListener("click", closeModal);

modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    revealItems.forEach((item) => observer.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

updateVisibleCount();
