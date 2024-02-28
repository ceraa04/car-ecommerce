const rangeInput = document.querySelector(".rangeInputFilter");
function updateTargetPrice() {
    const targetPrice = document.querySelector(".targetPrice");
    const maxPrice = parseInt(document.querySelector(".maxPrice").textContent);
    const minPrice = parseInt(document.querySelector(".minPrice").textContent);
    const rangeInput = document.querySelector("input[type='range']");

    targetPrice.textContent = (minPrice + (rangeInput.value / 100) * (maxPrice - minPrice)).toFixed(0);
}

rangeInput.addEventListener("mousemove", updateTargetPrice);

window.addEventListener("load", updateTargetPrice);