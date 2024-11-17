
// Predefined credentials
const validCredentials = {
    id: "admin",       // Replace with your desired ID
    password: "12345"  // Replace with your desired password
};

function validateLogin(event) {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const inputId = document.getElementById("userId").value;
    const inputPassword = document.getElementById("userPassword").value;

    // Check if credentials match
    if (inputId === validCredentials.id && inputPassword === validCredentials.password) {
        alert("Login successful! Redirecting...");
        window.location.href = "index.html"; // Replace with the file you want to redirect to
    } else {
        alert("Invalid ID or password. Please try again.");
    }
}
