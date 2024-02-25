const message = document.querySelector(".messageContact");
const showMessage = () => {
    const inputs = document.querySelectorAll(".inputContact input");
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Show message!");
        message.classList.remove("opacity-0");
        message.classList.add("opacity-1");
        setTimeout(() => {
            message.classList.remove("opacity-1");
            message.classList.add("opacity-0");
        }, 2000);
        document.querySelector("#message").value = "";
        inputs.forEach(input => {
            input.value = "";
        });
    });

};
showMessage();