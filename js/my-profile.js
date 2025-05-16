async function fetchUserData() {
    try {
        const response = await fetch('app/php/userData.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            alert('Failed to fetch user data');
            return;
        }

        const { user } = await response.json();

        // Display values
        document.getElementById('employee-name').textContent = user.full_name || '';
        document.getElementById('employee-username').innerHTML = `<b>@${user.username || ''}</b>`;
        document.getElementById('employee-role').textContent = user.role.toUpperCase() || '';
        document.getElementById('profile-image').src = user.profile_image || '';

    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

window.addEventListener('DOMContentLoaded', fetchUserData);

function toggleEditProfile() {
    const form = document.getElementById('edit-profile-form');

    if (form.classList.contains('hidden')) {

        document.getElementById('full_name').value = document.getElementById('employee-name').textContent;
        document.getElementById('username').value = document.getElementById('employee-username').textContent.replace(/^@/, '');
        document.getElementById('role').value = document.getElementById('employee-role').textContent;
    }

    form.classList.toggle('hidden');
}

async function saveChanges() {
    const name = document.getElementById('full_name').value;
    const userName = document.getElementById('username').value;
    const role = document.getElementById('role').value;
    const avatarInput = document.getElementById('avatar');

    const formData = new FormData();


    formData.append('full_name', name);
    formData.append('username', userName);
    formData.append('role', role);

    if (avatarInput && avatarInput.files.length > 0) {
        formData.append('avatar', avatarInput.files[0]);
    }


    try {
        const response = await fetch('app/php/userData.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();



        if (result.success) {
            document.getElementById('employee-name').textContent = name;
            document.getElementById('employee-username').textContent = `@${userName}`;
            document.getElementById('employee-role').textContent = role;

            if (result.user && result.user.profile_image) {
                document.getElementById('profile-picture').src = result.user.profile_image;
            }

            alert('Profile updated successfully!');
            toggleEditProfile();
        } else {
            alert('Failed to update profile: ' + result.message);
        }

    } catch (error) {
        console.error('Error updating profile:', error);
    }
}
