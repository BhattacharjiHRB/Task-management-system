
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

const taskTableBody = document.querySelector("#taskTable tbody");

// Function to render tasks in the table
function renderTasks() {
    tasks.forEach((task) => {
        const row = document.createElement("tr");


        const indexCell = document.createElement("td");
        indexCell.textContent = tasks.indexOf(task) + 1;
        row.appendChild(indexCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = task.name;
        row.appendChild(nameCell);

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = task.description;
        row.appendChild(descriptionCell);

        const priorityCell = document.createElement("td");
        priorityCell.textContent = task.priority;
        priorityCell.classList.add(`priority-${task.priority.toLowerCase()}`);
        row.appendChild(priorityCell);

        const dueDateCell = document.createElement("td");
        dueDateCell.textContent = task.dueDate;
        row.appendChild(dueDateCell);

        const subtasksCell = document.createElement("td");
        const subtaskList = document.createElement("ul");
        subtaskList.classList.add("subtasks");
        task.subtasks.forEach((subtask) => {
            const subtaskItem = document.createElement("li");
            subtaskItem.textContent = subtask;
            subtaskList.appendChild(subtaskItem);
        });
        subtasksCell.appendChild(subtaskList);
        row.appendChild(subtasksCell);

        taskTableBody.appendChild(row);

        const assignedByCell = document.createElement("td");
        assignedByCell.textContent = task.assignedBy;
        row.appendChild(assignedByCell);
    });
}

// Render tasks on page load
renderTasks();