const calendarGrid = document.getElementById("calendarGrid");
const viewMode = document.getElementById("viewMode");

let tasks = [];

tasks = [
    {
        id: 1,
        name: "Complete project report",
        description: "Write the final report for the project.",
        priority: "High",
        due_date: "2023-10-10",
        subtasks: ["Gather data", "Analyze results", "Write conclusions"],
        assignedBy: "Admin John",
    },
    {
        id: 2,
        name: "Prepare presentation slides",
        description: "Create slides for the upcoming presentation.",
        priority: "Medium",
        due_date: "2023-10-25",
        subtasks: ["Design template", "Add content", "Review slides"],
        assignedBy: "Admin Sarah",
    },
    {
        id: 3,
        name: "Organize team meeting",
        description: "Schedule and prepare for the team meeting.",
        priority: "Low",
        due_date: "2023-10-01",
        subtasks: ["Send invites", "Prepare agenda", "Book meeting room"],
        assignedBy: "Admin Mike",
    },
    {
        id: 4,
        name: "Update website content",
        description: "Revise and update the content on the company website.",
        priority: "High",
        due_date: "2023-10-08",
        subtasks: ["Review current content", "Draft new sections", "Publish updates"],
        assignedBy: "Admin Lisa",
    },
    {
        id: 5,
        name: "Plan team-building activity",
        description: "Organize a team-building event for the department.",
        priority: "Medium",
        due_date: "2023-10-03",
        subtasks: ["Choose activity", "Set date and time", "Send invitations"],
        assignedBy: "Admin David",
    },
];

// async function fetchTasks() {
//     try {
//         const taskRes = await fetch('../controllers/php/tasks.php', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         const userRes = await fetch('../controllers/php/userData.php', {

//         if (response.ok) {
//             const result = await response.json();



//             result.push(...tasks);
//             renderCalendar(tasks);
//         } else {
//             console.error("Failed to fetch tasks");
//         }
//     } catch (error) {
//         console.error("Error fetching tasks:", error);
//     }
// }

// fetchTasks();


const BASE_DATE = new Date("2023-10-01");

function getDateOffset(base, target) {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((target - base) / msPerDay);
}

const priorityColors = {
    High: "#f44336",    // Red
    Medium: "#ff9800",  // Orange
    Low: "#4CAF50"      // Green
};

function renderCalendar() {
    calendarGrid.innerHTML = "";

    let totalDays = viewMode.value === "month" ? 30 : viewMode.value === "week" ? 7 : 1;

    for (let i = 0; i < totalDays; i++) {
        const dayDate = new Date(BASE_DATE);
        dayDate.setDate(BASE_DATE.getDate() + i);
        const dayLabel = dayDate.toDateString();

        const dayDiv = document.createElement("div");
        dayDiv.className = "day";
        dayDiv.dataset.index = i;
        dayDiv.ondrop = drop;
        dayDiv.ondragover = allowDrop;

        const title = document.createElement("h4");
        title.textContent = dayLabel;
        dayDiv.appendChild(title);

        // Filter and add tasks for this date
        tasks.forEach((task, idx) => {
            const taskDate = new Date(task.due_date);
            const taskOffset = getDateOffset(BASE_DATE, taskDate);

            if (taskOffset === i) {
                const taskEl = document.createElement("div");
                taskEl.className = "task";
                taskEl.textContent = task.name;
                taskEl.title = `${task.description}\nBy: ${task.assignedBy}\nSubtasks:\n- ${task.subtasks.join('\n- ')}`;
                taskEl.draggable = true;
                taskEl.dataset.id = idx;
                taskEl.ondragstart = drag;

                // Apply priority color
                taskEl.style.backgroundColor = priorityColors[task.priority] || "#9E9E9E";

                // Add click event to show modal
                taskEl.addEventListener("click", () => showTaskDetails(task));

                dayDiv.appendChild(taskEl);
            }
        });

        calendarGrid.appendChild(dayDiv);
    }
}

function allowDrop(e) {
    e.preventDefault();
}

function drag(e) {
    e.dataTransfer.setData("text", e.target.dataset.id);
}

function drop(e) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text");
    const dayIndex = e.currentTarget.dataset.index;
    const newDate = new Date(BASE_DATE);
    newDate.setDate(BASE_DATE.getDate() + parseInt(dayIndex));
    tasks[taskId].due_date = newDate.toISOString().split('T')[0];
    renderCalendar();
}

function showTaskDetails(task) {
    const modal = document.createElement("div");
    modal.className = "modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const closeButton = document.createElement("span");
    closeButton.className = "close-button";
    closeButton.textContent = "×";
    closeButton.addEventListener("click", () => modal.remove());

    const taskDetails = `
        <h2>${task.name}</h2>
        <p><strong>Description:</strong> ${task.description}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p><strong>Due Date:</strong> ${task.due_date}</p>
        <p><strong>Assigned By:</strong> ${task.assignedBy}</p>
        <p><strong>Subtasks:</strong></p>
        <ul>${task.subtasks.map(subtask => `<li>${subtask}</li>`).join("")}</ul>
    `;

    modalContent.innerHTML = taskDetails;
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// Add styles for modal
const style = document.createElement("style");
style.textContent = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;

    }
    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 5px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .close-button {
        cursor: pointer;
        font-size: 20px;
        color: rgba;
        position: absolute;
        top: 10px;
        right: 10px;
    }
`;
document.head.appendChild(style);

viewMode.addEventListener("change", renderCalendar);

renderCalendar();


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
