// Function for showing message when user submits his message on contacts page
const showMessage = () => {
    const message = document.querySelector(".messageContact");
    const inputs = document.querySelectorAll(".inputContact input");
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        message.classList.remove("opacity-0");
        message.classList.add("opacity-1");
        // After 2 seconds it returns to opacity 0
        setTimeout(() => {
            message.classList.remove("opacity-1");
            message.classList.add("opacity-0");
        }, 2000);
        // Reseting inputs to empty strings
        document.querySelector(".message").value = "";
        inputs.forEach(input => {
            input.value = "";
        });
    });
};
showMessage();