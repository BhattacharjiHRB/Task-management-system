

function showDetails(widgetName) {
    window.location.href = 'page-not-found.html'
}
function performAction(actionName) {
    window.location.href = 'page-not-found.html'
}

function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}


const tasks = [
    { id: 1, name: "Design Homepage", deadline: "2023-10-15", status: "Completed" },
    { id: 2, name: "Fix Bugs", deadline: "2023-10-20", status: "In Progress" },
    { id: 3, name: "Write Documentation", deadline: "2023-10-25", status: "Pending" },
    { id: 4, name: "Implement Authentication", deadline: "2023-11-01", status: "In Progress" },
    { id: 5, name: "Optimize Database", deadline: "2023-11-10", status: "Pending" },
];

function populateTaskTable() {
    const taskTableBody = document.getElementById("taskTableBody");
    tasks.forEach(task => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${task.id}</td>
      <td>${task.name}</td>
      <td>${task.deadline}</td>
      <td>${task.status}</td>
    `;
        taskTableBody.appendChild(row);
    });
}


document.addEventListener("DOMContentLoaded", populateTaskTable);



async function showUserData() {

    const welcomeMessage = document.getElementById("welcomeMsg");

    const response = await fetch('../controllers/php/userData.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    if (response.ok) {
        const data = await response.json();
        if (data.success) {
            welcomeMessage.innerHTML = `<a href="my-profile.html" style="color: inherit; text-decoration: none;">Welcome, @${data.user.username}!</a>`;

        } else {
            location.href = "login.html";
        }
    } else {
        console.error("Failed to fetch user data");
    }

}

document.addEventListener("DOMContentLoaded", showUserData);



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

const logoutButton = document.getElementById("logout-li");

async function logoutUser() {
    try {

        const res = await fetch("../controllers/php/logout.php", {
            method: "POST",
            credentials: "include"
        });

        if (res.ok) {
            alert("Are you sure you want to logout?");
            cookieStore.delete("PHPSESSID");
            window.location.href = "login.html";

        }


    } catch (error) {
        console.log("Error logging out:", error);
    }

}

logoutButton.addEventListener("click", logoutUser);







