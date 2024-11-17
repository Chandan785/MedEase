document.addEventListener("DOMContentLoaded", () => {
    const profileBtn = document.querySelector(".profile-btn");
    const profileDropdown = document.querySelector(".profile-dropdown");

    profileBtn.addEventListener("click", () => {
        profileDropdown.style.display =
            profileDropdown.style.display === "block" ? "none" : "block";
    });

    const form = document.getElementById("date-filter-form");
    const reportRows = document.getElementById("report-rows");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const startDate = document.getElementById("start-date").value;
        const endDate = document.getElementById("end-date").value;

        // Mock data to demonstrate functionality
        const reports = [
            { date: "2023-09-15", organization: "Clinic A", type: "X-Ray", link: "#" },
            { date: "2023-10-10", organization: "Hospital B", type: "Blood Test", link: "#" },
            { date: "2023-11-01", organization: "Lab C", type: "MRI", link: "#" }
        ];

        const filteredReports = reports.filter(report => {
            return report.date >= startDate && report.date <= endDate;
        });

        reportRows.innerHTML = filteredReports.map(report => `
            <tr>
                <td>${report.date}</td>
                <td>${report.organization}</td>
                <td>${report.type}</td>
                <td><a href="${report.link}" download>Download</a></td>
            </tr>
        `).join("");

        if (filteredReports.length === 0) {
            reportRows.innerHTML = `<tr><td colspan="4">No reports found for the selected date range.</td></tr>`;
        }
    });
});
