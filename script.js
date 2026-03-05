/* Sticky Header using IntersectionObserver */

document.addEventListener("DOMContentLoaded", () => {
  const stickyHeader = document.getElementById("sticky-header");

  const sensor = document.getElementById("scroll-sensor");

  const options = {
    root: null, // viewport
    threshold: 0, // trigger when sensor leaves viewport
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // When sensor is NOT visible and user has scrolled
      if (!entry.isIntersecting && window.scrollY > 0) {
        stickyHeader.classList.add("is-visible");
      } else {
        stickyHeader.classList.remove("is-visible");
      }
    });
  }, options);

  observer.observe(sensor);
});

/* Product Image Carousel + Zoom Lens */

document.addEventListener("DOMContentLoaded", () => {
  // Main product image
  const img = document.getElementById("mainImage");

  // Zoom lens overlay
  const lens = document.getElementById("lens");

  // Zoom result container
  const result = document.getElementById("zoomResult");

  // Thumbnail container track
  const track = document.querySelector(".product__thumbnails-track");

  // All thumbnail
  const thumbnails = document.querySelectorAll(".product__thumbnail");

  // Navigation buttons
  const prevBtn = document.querySelector(".product__carousel-btn--prev");
  const nextBtn = document.querySelector(".product__carousel-btn--next");

  let currentIndex = 0;

  // Extract image sources from thumbnails
  const images = Array.from(thumbnails).map((thumb) => thumb.src);

  /*Update main image and active thumbnail*/

  function updateMainImage(index) {
    currentIndex = index;
    const newSrc = images[currentIndex];

    // Change main image
    img.src = newSrc;

    // Update zoom background
    result.style.backgroundImage = `url('${newSrc}')`;

    // Highlight active thumbnail
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle("product__thumbnail--active", i === currentIndex);
    });

    scrollThumbnails(index);
  }

  function scrollThumbnails(index) {
    if (!track || thumbnails.length === 0) return;

    const thumbStyle = window.getComputedStyle(thumbnails[0]);

    const marginRight = parseInt(thumbStyle.marginRight) || 8;

    const thumbWidth = thumbnails[0].offsetWidth + marginRight;

    const viewportWidth = document.querySelector(
      ".product__thumbnails-viewport",
    ).offsetWidth;

    const maxScroll = track.scrollWidth - viewportWidth;

    let offset = index * thumbWidth;

    offset = Math.max(0, Math.min(offset, maxScroll));

    track.style.transform = `translateX(-${offset}px)`;
  }

  /*Thumbnail click navigation */

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () => updateMainImage(index));
  });

  /* Next / Previous navigation buttons */

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();

    currentIndex = (currentIndex + 1) % images.length;

    updateMainImage(currentIndex);
  });

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();

    currentIndex = (currentIndex - 1 + images.length) % images.length;

    updateMainImage(currentIndex);
  });

  /* Zoom Lens Logic */

  const zoom = 2;

  // Show zoom elements on hover
  img.addEventListener("mouseenter", () => {
    lens.style.display = "block";
    result.style.display = "block";

    result.style.backgroundImage = `url('${img.src}')`;
  });

  // Hide zoom elements
  img.addEventListener("mouseleave", () => {
    lens.style.display = "none";
    result.style.display = "none";
  });

  /* Move zoom lens with mouse */

  function moveLens(e) {
    const rect = img.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    const lensW = lens.offsetWidth;
    const lensH = lens.offsetHeight;

    let lensX = x - lensW / 2;
    let lensY = y - lensH / 2;

    // Prevent lens leaving image boundaries
    lensX = Math.max(0, Math.min(lensX, rect.width - lensW));
    lensY = Math.max(0, Math.min(lensY, rect.height - lensH));

    lens.style.left = lensX + "px";
    lens.style.top = lensY + "px";

    result.style.backgroundSize =
      rect.width * zoom + "px " + rect.height * zoom + "px";

    result.style.backgroundPosition =
      "-" + lensX * zoom + "px -" + lensY * zoom + "px";
  }

  img.addEventListener("mousemove", moveLens);
  lens.addEventListener("mousemove", moveLens);
});

/* Trusted Clients Logos (Auto-fit responsive logos) */

const logos = Array(13).fill(
  "https://res.cloudinary.com/dngwbnqjg/image/upload/v1772639193/client_t9bnky.jpg",
);

const container = document.getElementById("trustedLogos");

function renderLogos() {
  container.innerHTML = "";

  const containerWidth = container.offsetWidth;

  const logoWidth = 110;
  const baseGap = 30;

  let fitCount = 0;

  // Determine how many logos fit in the container
  for (let i = 1; i <= logos.length; i++) {
    const requiredWidth = i * logoWidth + (i - 1) * baseGap;

    if (requiredWidth <= containerWidth) {
      fitCount = i;
    } else {
      break;
    }
  }

  if (fitCount === 0) return;

  const visibleLogos = logos.slice(0, fitCount);

  const logosWidth = fitCount * logoWidth;
  const gapsCount = fitCount - 1;

  let dynamicGap = baseGap;

  if (gapsCount > 0) {
    const usedWidth = logosWidth + gapsCount * baseGap;

    const remainingSpace = containerWidth - usedWidth;

    dynamicGap = baseGap + remainingSpace / gapsCount;
  }

  container.style.display = "flex";
  container.style.gap = `${dynamicGap}px`;

  visibleLogos.forEach((logo) => {
    const wrapper = document.createElement("div");

    wrapper.classList.add("trusted__logo");

    const img = document.createElement("img");

    img.src = logo;

    img.classList.add("trusted__logo-img");

    img.style.width = `${logoWidth}px`;

    wrapper.appendChild(img);

    container.appendChild(wrapper);
  });
}

renderLogos();

window.addEventListener("resize", renderLogos);

/* FAQ Accordion */

document.querySelectorAll(".faq__question").forEach((button) => {
  button.addEventListener("click", () => {
    const currentItem = button.parentElement;

    currentItem.classList.toggle("is-active");

    // Close other open items
    document.querySelectorAll(".faq__item").forEach((item) => {
      if (item !== currentItem) {
        item.classList.remove("is-active");
      }
    });
  });
});

/* Callback Request Modal */

const modal = document.getElementById("callbackModal");

const openBtn = document.getElementById("request_quota");

const closeBtn = document.getElementById("closeModal");

// Open modal
openBtn.addEventListener("click", () => {
  modal.style.display = "flex";

  document.body.style.overflow = "hidden";
});

// Close modal via X button
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";

  document.body.style.overflow = "auto";
});

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";

    document.body.style.overflow = "auto";
  }
});
