// Dummy data for demonstration
const employees = [
    { id: 'EMP001', name: 'Alice Johnson', assigned: 10, completed: 8, status: 'Active' },
    { id: 'EMP002', name: 'Bob Smith', assigned: 12, completed: 12, status: 'Active' },
    { id: 'EMP003', name: 'Charlie Lee', assigned: 8, completed: 5, status: 'Inactive' },
    { id: 'EMP004', name: 'Diana Prince', assigned: 7, completed: 7, status: 'Active' },
    { id: 'EMP005', name: 'Evan Wright', assigned: 6, completed: 3, status: 'Active' }
];

const tasks = [
    { id: 'T001', name: 'Design UI', assignedTo: 'Alice Johnson', deadline: '2024-06-10', status: 'Completed' },
    { id: 'T002', name: 'Backend API', assignedTo: 'Bob Smith', deadline: '2024-06-12', status: 'Pending' },
    { id: 'T003', name: 'Testing', assignedTo: 'Charlie Lee', deadline: '2024-06-15', status: 'Completed' },
    { id: 'T004', name: 'Documentation', assignedTo: 'Diana Prince', deadline: '2024-06-18', status: 'Pending' },
    { id: 'T005', name: 'Client Meeting', assignedTo: 'Evan Wright', deadline: '2024-06-20', status: 'Pending' }
];

// Populate widgets
function updateWidgets() {
    document.getElementById('totalEmployees').textContent = employees.length;
    document.getElementById('tasksAssigned').textContent = tasks.length;
    document.getElementById('tasksCompleted').textContent = tasks.filter(t => t.status === 'Completed').length;
    document.getElementById('pendingTasks').textContent = tasks.filter(t => t.status === 'Pending').length;
}

// Populate employee table
function populateEmployeeTable() {
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = '';
    employees.forEach(emp => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${emp.id}</td>
          <td>${emp.name}</td>
          <td>${emp.assigned}</td>
          <td>${emp.completed}</td>
          <td>
            <span class="status-badge ${emp.status === 'Active' ? 'status-active' : 'status-inactive'}">
            ${emp.status}
            </span>
          </td>
          <td>
            <button class="action-btn" onclick="editEmployee('${emp.id}')">Edit</button>
            <button class="action-btn" onclick="removeEmployee('${emp.id}')">Remove</button>
          </td>
        `;
        tbody.appendChild(tr);
    });
}

// Populate task table
function populateTaskTable() {
    const tbody = document.getElementById('taskTableBody');
    tbody.innerHTML = '';
    tasks.forEach(task => {
        tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${task.id}</td>
          <td>${task.name}</td>
          <td>${task.assignedTo}</td>
          <td>${task.deadline}</td>
          <td>
            <span class="status-badge ${task.status === 'Completed' ? 'status-completed' : 'status-pending'}">
            ${task.status}
            </span>
          </td>
          <td>
            <button class="action-btn" onclick="editTask('${task.id}')">Edit</button>
            <button class="action-btn" onclick="removeTask('${task.id}')">Remove</button>
          </td>
        `;
        tbody.appendChild(tr);
    });
}

// Widget click handler
function showDetails(type) {
    alert('Show details for: ' + type);
}

// Employee actions
function editEmployee(empId) {
    alert('Edit Employee: ' + empId);
}
function removeEmployee(empId) {
    if (confirm('Are you sure you want to remove employee ' + empId + '?')) {
        // Remove logic here
        alert('Employee ' + empId + ' removed (demo only)');
    }
}

// Task actions
function editTask(taskId) {
    alert('Edit Task: ' + taskId);
}
function removeTask(taskId) {
    if (confirm('Are you sure you want to remove task ' + taskId + '?')) {
        // Remove logic here
        alert('Task ' + taskId + ' removed (demo only)');
    }
}

// Notification center toggle
function toggleNotificationCenter() {
    document.getElementById('notificationCenter').classList.toggle('active');
}

// Close notification center when clicking outside
document.addEventListener('click', function (e) {
    const bell = document.querySelector('.bell-icon');
    const notif = document.getElementById('notificationCenter');
    if (!notif.contains(e.target) && !bell.contains(e.target)) {
        notif.classList.remove('active');
    }
});

// On page load
document.addEventListener("DOMContentLoaded", updateWidgets)
document.addEventListener("DOMContentLoaded", populateEmployeeTable);
populateTaskTable();


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







