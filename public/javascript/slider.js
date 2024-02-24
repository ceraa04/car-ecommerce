let slideIndex = 0;

function showSlides() {
    let slides = document.querySelectorAll(".slide");
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.add("hidden");
    }
    if (slideIndex > slides.length - 1) { slideIndex = 0; }
    slides[slideIndex].classList.remove("hidden");
    slideIndex++;

    let progressBars = document.querySelectorAll(".progressBar");
    progressBars.forEach(progressBar => {
        let currentWidth = 0;
        let interval = setInterval(() => {
            if (currentWidth >= 100) {
                clearInterval(interval);
            } else {
                currentWidth += 1;
                progressBar.style.width = `${currentWidth}%`;
            }
        }, 35);
    });

    setTimeout(showSlides, 4000);
}

showSlides();
