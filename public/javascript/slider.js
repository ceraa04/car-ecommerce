let slideIndex = 0;

function showSlides() {
    let i;
    let slides = document.querySelectorAll(".slide");
    console.log(slides[slideIndex]);
    for (i = 0; i < slides.length; i++) {
        slides[i].classList.add("hidden");
    }
    if (slideIndex > slides.length - 1) { slideIndex = 0; }
    slides[slideIndex].classList.remove("hidden");
    slideIndex++;

    setTimeout(showSlides, 4000);
}

showSlides();
