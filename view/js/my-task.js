
// Sample data for tasks
const tasks = [
    {
        name: "Complete project report",
        description: "Write the final report for the project.",
        priority: "High",
        dueDate: "2023-10-15",
        subtasks: ["Gather data", "Analyze results", "Write conclusions"],
        assignedBy: "Admin John",
    },
    {
        name: "Prepare presentation slides",
        description: "Create slides for the upcoming presentation.",
        priority: "Medium",
        dueDate: "2023-10-20",
        subtasks: ["Design template", "Add content", "Review slides"],
        assignedBy: "Admin Sarah",
    },
    {
        name: "Organize team meeting",
        description: "Schedule and prepare for the team meeting.",
        priority: "Low",
        dueDate: "2023-10-25",
        subtasks: ["Send invites", "Prepare agenda", "Book meeting room"],
        assignedBy: "Admin Mike",
    },
    {
        name: "Update website content",
        description: "Revise and update the content on the company website.",
        priority: "High",
        dueDate: "2023-10-18",
        subtasks: ["Review current content", "Draft new sections", "Publish updates"],
        assignedBy: "Admin Lisa",
    },
    {
        name: "Plan team-building activity",
        description: "Organize a team-building event for the department.",
        priority: "Medium",
        dueDate: "2023-10-30",
        subtasks: ["Choose activity", "Set date and time", "Send invitations"],
        assignedBy: "Admin David",
    },
];
async function fetchTasks() {
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
                    <td>${task.description}</td>
                    <td>${task.label}</td>
                    <td>${task.category}</td>

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


        } else {
            tbody.innerHTML = '<tr><td colspan="6">No tasks assigned to you</td></tr>';
        }

    } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Error fetching tasks");
    }
}

fetchTasks();


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
