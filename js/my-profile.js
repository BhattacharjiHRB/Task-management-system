function toggleEditProfile() {
    const form = document.getElementById('edit-profile-form');
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const bioField = document.getElementById('bio');

    if (form.classList.contains('hidden')) {
        // Populate form fields with current profile data
        nameField.value = document.getElementById('employee-name').textContent;
        emailField.value = document.getElementById('employee-email').textContent;
        bioField.value = document.getElementById('employee-bio').textContent;
    }

    form.classList.toggle('hidden');
}

function previewAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profile-picture').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function saveChanges() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const bio = document.getElementById('bio').value;

    document.getElementById('employee-name').textContent = name;
    document.getElementById('employee-email').textContent = email;
    document.getElementById('employee-bio').textContent = bio;

    alert('Profile updated successfully!');
    toggleEditProfile();
}