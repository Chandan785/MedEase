// Handle form submissions
document.querySelectorAll('.form-section button').forEach(button => {
    button.addEventListener('click', (e) => {
        const formId = e.target.closest('.form-section').id;

        if (formId === 'signUpUserForm') {
            submitUserForm();
        } else if (formId === 'signUpOrgForm') {
            submitOrgForm();
        }
    });
});

async function submitUserForm() {
    const name = document.getElementById('userName').value;
    const abhaId = document.getElementById('userAbhaId').value;
    const contact = document.getElementById('userContact').value;
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;

    const response = await fetch('/api/signup/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, abhaId, contact, email, password }),
    });

    const result = await response.json();
    alert(result.message);
}

async function submitOrgForm() {
    const name = document.getElementById('orgName').value;
    const email = document.getElementById('orgEmail').value;
    const password = document.getElementById('orgPassword').value;

    const response = await fetch('/api/signup/org', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();
    alert(result.message);
}
