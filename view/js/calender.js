const calendarGrid = document.getElementById("calendarGrid");
const viewMode = document.getElementById("viewMode");


const tasks = [
    {
        id: 1,
        name: "Complete project report",
        description: "Write the final report for the project.",
        priority: "High",
        dueDate: "2023-10-10",
        subtasks: ["Gather data", "Analyze results", "Write conclusions"],
        assignedBy: "Admin John",
    },
    {
        id: 2,
        name: "Prepare presentation slides",
        description: "Create slides for the upcoming presentation.",
        priority: "Medium",
        dueDate: "2023-10-25",
        subtasks: ["Design template", "Add content", "Review slides"],
        assignedBy: "Admin Sarah",
    },
    {
        id: 3,
        name: "Organize team meeting",
        description: "Schedule and prepare for the team meeting.",
        priority: "Low",
        dueDate: "2023-10-01",
        subtasks: ["Send invites", "Prepare agenda", "Book meeting room"],
        assignedBy: "Admin Mike",
    },
    {
        id: 4,
        name: "Update website content",
        description: "Revise and update the content on the company website.",
        priority: "High",
        dueDate: "2023-10-08",
        subtasks: ["Review current content", "Draft new sections", "Publish updates"],
        assignedBy: "Admin Lisa",
    },
    {
        id: 5,
        name: "Plan team-building activity",
        description: "Organize a team-building event for the department.",
        priority: "Medium",
        dueDate: "2023-10-03",
        subtasks: ["Choose activity", "Set date and time", "Send invitations"],
        assignedBy: "Admin David",
    },
];



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
            const taskDate = new Date(task.dueDate);
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
    tasks[taskId].dueDate = newDate.toISOString().split('T')[0];
    renderCalendar();
}

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
