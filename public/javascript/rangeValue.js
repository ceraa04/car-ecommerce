const rangeInput = document.querySelector(".rangeInputFilter");
// Function for updating price on range for price(products page)
function updateTargetPrice() {
    const targetPrice = document.querySelector(".targetPrice");
    const maxPrice = parseInt(document.querySelector(".maxPrice").textContent);
    const minPrice = parseInt(document.querySelector(".minPrice").textContent);
    const rangeInput = document.querySelector(".rangeInputFilter");
    targetPrice.textContent = (minPrice + (rangeInput.value / 100) * (maxPrice - minPrice)).toFixed(0);

}

// Range is updating on every drag-move of mouse
rangeInput.addEventListener("mousemove", updateTargetPrice);

// Loading function when page loads
window.addEventListener("load", updateTargetPrice);