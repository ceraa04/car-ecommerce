const deleteButton = document.querySelector(".deleteButton");
const editButton = document.querySelector(".editButton");

deleteButton.addEventListener("click", () => {
    const car = this.closest(".carModel");
    console.log(car);
    console.log("Delete clicked!");
});
editButton.addEventListener("click", () => {
    console.log("editButton clicked!");
});