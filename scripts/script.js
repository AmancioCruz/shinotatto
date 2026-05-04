const filterButtons = document.querySelectorAll(".filter-chip");
const cards = Array.from(document.querySelectorAll(".tattoo-card"));
const visibleCount = document.querySelector("#visible-count");
const modal = document.querySelector(".modal");
const modalImage = modal?.querySelector("img");
const modalStyle = modal?.querySelector(".modal-style");
const modalClose = modal?.querySelector(".modal-close");
const revealItems = document.querySelectorAll(".reveal");

function updateVisibleCount() {
    const count = cards.filter((card) => !card.classList.contains("is-hidden")).length;

    if (visibleCount) {
        visibleCount.textContent = String(count);
    }
}

function setFilter(filter) {
    filterButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.filter === filter);
    });

    cards.forEach((card) => {
        const isVisible = filter === "todos" || card.dataset.filter === filter;
        card.classList.toggle("is-hidden", !isVisible);
    });

    updateVisibleCount();
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

filterButtons.forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.filter || "todos"));
});

cards.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
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
