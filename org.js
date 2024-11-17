document.addEventListener("DOMContentLoaded", () => {
    const profileBtn = document.querySelector(".profile-btn");
    const profileDropdown = document.querySelector(".profile-dropdown");

    profileBtn.addEventListener("click", () => {
        profileDropdown.style.display =
            profileDropdown.style.display === "block" ? "none" : "block";
    });

    const form = document.getElementById("upload-form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const tokenNumber = document.getElementById("token-number").value;
        const reportDate = document.getElementById("report-date").value;
        const organizationName = document.getElementById("organization-name").value;
        const reportType = document.getElementById("report-type").value;

        alert(`Report for Token #${tokenNumber} uploaded successfully!`);
        form.reset();
    });
});
