
const assignedTasks = document.getElementById('assignedTasks');
const completedTasks = document.getElementById('completedTasks');
const overdueTasks = document.getElementById('overdueTasks');


async function populateTaskTable() {


    try {

        const [userRes, taskRes] = await Promise.all([
            fetch('../controllers/php/userData.php'),
            fetch('../controllers/php/tasks.php')
        ]);

        const userData = await userRes.json();
        const taskData = await taskRes.json();

        const loggedInUserId = userData.user.id;
        const tasks = taskData.tasks || [];

        const userTasks = tasks.filter(task => task.assigned_to === loggedInUserId);


        const tbody = document.getElementById('taskTableBody');
        tbody.innerHTML = '';

        if (userTasks.length > 0) {
            userTasks.forEach(task => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${task.id}</td>
                    <td>${task.name}</td>

                    <td>${task.due_date}</td>
                    <td>
                        <span class="priority-badge${task.priority.toLowerCase() === 'high' ? 'priotiy-high' :
                        task.priority.toLowerCase() === 'medium' ? 'priotiry-medium' : 'priority-low'
                    }">
                            ${task.priority}
                        </span>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            if (userTasks.length > 0) {
                assignedTasks.textContent = userTasks.length;
                completedTasks.textContent = userTasks.filter(task => task.is_completed === true).length;
                overdueTasks.textContent = userTasks.filter(task => new Date(task.due_date) < new Date()).length;
            }

        } else {
            tbody.innerHTML = '<tr><td colspan="6">No tasks assigned to you</td></tr>';
        }

    } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Error fetching tasks");
    }
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
            window.location.reload();
            window.location.href = "login.html";

        }


    } catch (error) {
        console.log("Error logging out:", error);
    }

}

logoutButton.addEventListener("click", logoutUser);







