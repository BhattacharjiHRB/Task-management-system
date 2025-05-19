async function fetchUserData() {
    try {
        const response = await fetch('../controllers/php/userData.php', {
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
        const response = await fetch('../controllers/php/userData.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        console.log("result", result)

        if (result.success) {
            document.getElementById('employee-name').textContent = name;
            document.getElementById('employee-username').textContent = `@${userName}`;
            document.getElementById('employee-role').textContent = role;


            if (result.user && result.user.profile_image) {
                const avatarPath = result.user.profile_image
                document.getElementById('profile-picture').src = avatarPath;
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


const bellIcon = document.querySelector(".bell-icon");
const notificationCenter = document.getElementById("notificationCenter");
const unreadCount = document.getElementById("unreadCount");

function toggleNotificationCenter() {
    notificationCenter.style.display =
        notificationCenter.style.display === "flex" ? "none" : "flex";

    // Clear unread count when opened
    if (notificationCenter.style.display === "flex") {
        unreadCount.style.display = "none";
    }
}

// Settings toggles (can be hooked to backend)
document.getElementById("emailToggle").addEventListener("change", (e) => {
    console.log("Email alerts:", e.target.checked);
});

document.getElementById("pushToggle").addEventListener("change", (e) => {
    console.log("Push alerts:", e.target.checked);
});

// Close on outside click
window.addEventListener("click", function (e) {
    if (
        !bellIcon.contains(e.target) &&
        !notificationCenter.contains(e.target)
    ) {
        notificationCenter.style.display = "none";
    }
});
