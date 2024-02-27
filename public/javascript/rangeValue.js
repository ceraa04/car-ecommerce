const rangeInput = document.querySelector(".rangeInputFilter");

rangeInput.addEventListener("mousemove", (event) => {
    const targetPrice = document.querySelector(".targetPrice");
    const maxPrice = parseInt(document.querySelector(".maxPrice").textContent);
    const minPrice = parseInt(document.querySelector(".minPrice").textContent);
    targetPrice.textContent = minPrice + (event.target.value / 100) * (maxPrice - minPrice);

});