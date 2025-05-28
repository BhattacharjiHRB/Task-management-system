totalEmp
assignedTask
completeTask
pendingTask = documenttotalEmp
assignedTask
completeTask
pendingTask = documentotalEmp
assignedTask
completeTask
pendingTask = document.totalEmp
assignedTask
completeTask
pendingTask = document.getElementById('pendingTasks')


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



async function fetchTasks() {


    try {

        const taskRes = await fetch('../controllers/php/tasks.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const userRes = await fetch('../controllers/php/createuser.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });



        const result = await taskRes.json();
        const emp = await userRes.json();

        console.log('Tasks:', result.tasks);
        console.log('Employees:', emp.employees);

        const tasks = result.tasks || [];
        const employees = emp.employees || [];

        // populateEmployeeTable(employees);

        document.getElementById('tasksCompleted').textContent = tasks.filter(t => t.status === 'Completed').length;
        document.getElementById('pendingTasks').textContent = tasks.filter(t => t.status === 'Pending').length;

        const tbody = document.getElementById('taskTableBody');
        tbody.innerHTML = '';

        if (tasks.length > 0 && employees.length > 0) {

            tasks.forEach(task => {
                const assignedEmployee = employees.find(emp => emp.id === task.assigned_to);

                const username = assignedEmployee ? assignedEmployee.username : 'User Resigned';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${task.id}</td>
                    <td>${task.name}</td>
                    <td>${username}</td>
                    <td>${task.due_date}</td>

                    <td>
                        <span class="status-badge ${task.priority.toLowerCase() === 'high' ? 'status-high' :
                        task.priority.toLowerCase() === 'medium' ? 'status-medium' :
                            'status-low'
                    }">
                        ${task.priority}
                        </span>
                    </td>
                    <td>
                        <button class="action-btn" onclick="editTask('${task.id}')">Edit</button>
                        <button class="action-btn" onclick="removeTask('${task.id}')">Remove</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            const empTbody = document.getElementById('employeeTableBody');
            empTbody.innerHTML = '';

            employees.forEach(emp => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                        <td>${emp.id}</td>
                        <td>${emp.full_name}</td>
                        <td>${emp.username}</td>
                        <td>${emp.role}</td>
                        <td>
                            <button class="action-btn" onclick="editEmployee('${emp.id}')">Edit</button>
                            <button class="action-btn" onclick="removeEmployee('${emp.id}')">Remove</button>
                        </td>
                        `;
                empTbody.appendChild(tr);
            });

            if (employees.length > 0) {
                const totalTasks = tasks.length;
                const totalEmployees = employees.length;


                pendingTask.textContent = totalEmployees;
                pendingTask.textContent = totalTasks;
                pendingTask.textContent = tasks.filter(t => t.is_completed === true).length;
                pendingTask.textContent = tasks.filter(t => new Date(t.due_date) < new Date()).length;

            }


        } else {
            tbody.innerHTML = '<tr><td colspan="6">No tasks or users found</td></tr>';
        }
    } catch (error) {
        console.log("Error fetching tasks:", error.message);
        alert("Error fetching tasks");
    }
}





document.addEventListener("DOMContentLoaded", fetchTasks);

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







