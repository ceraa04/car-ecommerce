let slideIndex = 0;
// Slide show on index page
function showSlides() {
    let slides = document.querySelectorAll(".slide");
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.add("hidden");
    }
    // If slider reached last image, it resets to 0
    if (slideIndex > slides.length - 1) { slideIndex = 0; }
    slides[slideIndex].classList.remove("hidden");
    slideIndex++;
    // Timeout of 4s
    setTimeout(showSlides, 4000);
}

showSlides();