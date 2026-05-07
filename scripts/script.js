const gallery = document.querySelector("[data-gallery]");
const visibleCount = document.querySelector("#visible-count");
const modal = document.querySelector(".modal");
const modalImage = modal?.querySelector("img");
const modalStyle = modal?.querySelector(".modal-style");
const modalClose = modal?.querySelector(".modal-close");
const revealItems = document.querySelectorAll(".reveal");
const whatsappButtons = document.querySelectorAll(".whatsapp-contact");
const whatsappPhone = "656 267 1995";
const imageExtensions = ["png", "jpeg", "jpg", "webp"];
const maxMissingPhotos = 8;

let cards = [];

const heightPattern = ["tall", "short", "medium", "tall", "medium", "short"];

function getPhotoHeight(index) {
    return heightPattern[(index - 1) % heightPattern.length];
}

function checkImage(src) {
    return new Promise((resolve) => {
        const image = new Image();

        image.onload = () => resolve(src);
        image.onerror = () => resolve(null);
        image.src = src;
    });
}

async function findPhoto(index) {
    for (const extension of imageExtensions) {
        const src = `recursos/foto_${index}.${extension}`;
        const found = await checkImage(src);

        if (found) {
            return found;
        }
    }

    return null;
}

function createTattooCard(src, index) {
    const card = document.createElement("button");
    const image = document.createElement("img");

    card.className = `tattoo-card ${getPhotoHeight(index)}`;
    card.type = "button";
    card.dataset.style = "Trabajo";

    image.src = src;
    image.alt = "Trabajo de tatuaje";

    card.append(image);
    card.addEventListener("click", () => openModal(card));

    return card;
}

async function loadGallery() {
    if (!gallery) {
        return;
    }

    gallery.innerHTML = "";

    const fragment = document.createDocumentFragment();
    let missingCount = 0;
    let index = 1;

    while (missingCount < maxMissingPhotos) {
        const src = await findPhoto(index);

        if (src) {
            fragment.append(createTattooCard(src, index));
            missingCount = 0;
        } else {
            missingCount += 1;
        }

        index += 1;
    }

    gallery.append(fragment);
    cards = Array.from(gallery.querySelectorAll(".tattoo-card"));
    updateVisibleCount();
}

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
    modalStyle.textContent = card.dataset.style || "Tattoo";
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

loadGallery();
