document.addEventListener("DOMContentLoaded", () => {
    const profileBtn = document.querySelector(".profile-btn");
    const profileDropdown = document.querySelector(".profile-dropdown");
    const profileSection = document.querySelector(".profile-section");

    // Toggle Profile Dropdown
    profileBtn.addEventListener("click", async () => {
        try {
            const response = await fetch("/get-user");
            if (!response.ok) throw new Error("Failed to fetch user data");

            const user = await response.json();
            
            // Inject User Details into the Profile Dropdown
            profileDropdown.innerHTML = `
                <ul class="user-info">
                    <li><strong>Name:-</strong> <span id="name">${user.name}</span></li>
                    <li><strong>ABHA ID:-</strong> <span id="ABHAID">${user.ABHAID}</span></li>
                    <li><strong>Phone:-</strong> <span id="phno">${user.phno}</span></li>
                    <li><strong>Email:-</strong> <span id="email">${user.email}</span></li>
                   
                </ul>
                 
                 <li><button id="edit-profile">Edit</button></li>
                    <li><button id="logout">Logout</button></li>
                     
            `;

            profileDropdown.style.display = "block";

            // Attach event listener to Edit button AFTER injecting HTML
            document.getElementById("edit-profile").addEventListener("click", () => {
                showEditForm(user);
            });

            // Logout functionality
            document.getElementById("logout").addEventListener("click", async () => {
                await fetch("/logout", { method: "POST" });
                alert("Logged out successfully!");
                window.location.href = "Frontpage.html";
            });

        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
        if (!profileSection.contains(event.target)) {
            profileDropdown.style.display = " ";
        }
    });
});

// Function to Show Edit Form
function showEditForm(user) {
    const profileDropdown = document.querySelector(".profile-dropdown");

    // Replace existing profile details with input fields
    profileDropdown.innerHTML = `
        <ul class="edit-user-info">
            <li><strong>Name:-</strong> <input type="text" id="edit-name" value="${user.name}"></li>
            <li><strong>Phone:-</strong> <input type="text" id="edit-phno" value="${user.phno}"></li>
            <li><strong>Email:-</strong> <input type="email" id="edit-email" value="${user.email}"></li>
            <li><button id="save-profile">Save</button></li>
            <li><button id="cancel-edit">Cancel</button></li>
        </ul>
    `;

    // Attach event listeners for Save and Cancel buttons
    document.getElementById("save-profile").addEventListener("click", saveProfile);
    document.getElementById("cancel-edit").addEventListener("click", () => {
        profileDropdown.style.display = "none"; // Close edit form
    });
}

// Function to Save Updated Profile
async function saveProfile() {
    const name = document.getElementById("edit-name").value;
    const phno = document.getElementById("edit-phno").value;
    const email = document.getElementById("edit-email").value;

    try {
        const response = await fetch("/update-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phno, email })
        });

        if (!response.ok) throw new Error("Failed to update user");

        alert("Profile updated successfully!");
        location.reload(); // Refresh page to fetch updated profile data
    } catch (error) {
        console.error("Error updating profile:", error);
    }
}
