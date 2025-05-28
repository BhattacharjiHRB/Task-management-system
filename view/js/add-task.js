
const taskNameInput = document.getElementById("name");
const advancedOptions = document.getElementById("advancedOptions");
const detailedTaskForm = document.getElementById("detailedTaskForm");
const addTaskButton = document.getElementById("addTaskButton");

const taskLabelsInput = document.getElementById("taskLabels");
const subtasksInputElem = document.getElementById("subtaskInput");
const taskPriorityInput = document.getElementById("taskPriority");
const taskDueDateInput = document.getElementById("dueDate");
const taskDescriptionInput = document.getElementById("taskDescription");

const assignedToDropdown = document.getElementById('assignedTo');


taskNameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        advancedOptions.click();
    }
})


advancedOptions.addEventListener("click", () => {
    detailedTaskForm.style.display = "flex";
    detailedTaskForm.style.flexDirection = "column";
});

async function populateAssignedToDropdown() {



    try {
        const response = await fetch('../controllers/php/createuser.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        const result = await response.json();
        if (result.employees && result.employees.length > 0) {
            result.employees.forEach(emp => {
                const option = document.createElement('option');
                option.value = emp.id;
                option.textContent = `${emp.full_name} (${emp.username})`;
                assignedToDropdown.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "No employees found";
            assignedToDropdown.appendChild(option);
        }
    } catch (error) {
        console.error('Error fetching emps:', error);
    }
}

document.addEventListener("DOMContentLoaded", populateAssignedToDropdown)


addTaskButton.addEventListener("click", async () => {
    // Get values
    const taskName = taskNameInput.value.trim();
    const taskLabels = taskLabelsInput.value.trim();
    const subtasksInput = subtasksInputElem.value.trim();
    const taskPriority = taskPriorityInput.value;
    const taskDueDate = taskDueDateInput.value;
    const taskDescription = taskDescriptionInput.value.trim();

    if (!taskName || !taskDescription || !taskLabels || !subtasksInput || !taskDueDate) {
        alert("Please fill in all fields.");
        return;
    }



    const formData = new FormData();
    formData.append("name", taskName);
    formData.append("description", taskDescription);
    formData.append("due_date", taskDueDate);
    formData.append("priority", taskPriority);
    formData.append("label", taskLabels);
    formData.append("category", document.getElementById("taskCategory").value);
    formData.append("assigned_to", assignedToDropdown.options[assignedToDropdown.selectedIndex].value);

    try {

        const response = await fetch("../controllers/php/tasks.php", {
            method: "POST",
            body: formData,
            credentials: "include"
        });

        console.log(response)
        const result = await response.json();

        if (result.success) {
            alert("Task created successfully!");
            taskNameInput.value = "";
            taskDescriptionInput.value = "";
            taskLabelsInput.value = "";
            subtasksInputElem.value = "";
            taskDueDateInput.value = "";
            taskPriorityInput.value = "";
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (err) {
        console.error("Error creating task:", err);
        alert("Failed to create task. Please try again.");
    }
});


// if ("webkitSpeechRecognition" in window) {
//     const recognition = new webkitSpeechRecognition();
//     recognition.continuous = false;
//     recognition.interimResults = false;

//     recognition.onresult = (event) => {
//         const voiceInput = event.results[0][0].transcript;
//         if (voiceInput.toLowerCase().startsWith("add task:")) {
//             const task = voiceInput.replace(/add task:/i, "").trim();
//             if (task) {
//                 alert(`Task Added via Voice: ${task}`);
//             }
//         }
//     };

//     recognition.onerror = (event) => {
//         console.error("Speech recognition error:", event.error);
//     };

//     taskNameInput.addEventListener("dblclick", () => {
//         recognition.start();
//     });
// } else {
//     alert("Voice input is not supported in this browser.");
// }

let subtasks = [];

subtasksInputElem.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && this.value.trim() !== '') {
        subtasks.push({ text: this.value, done: false });
        renderSubtasks();
        this.value = '';
    }
});

function renderSubtasks() {
    const list = document.getElementById('subtaskList');
    list.innerHTML = '';

    subtasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
      <input type="checkbox" onchange="toggleSubtask(${index})" ${task.done ? 'checked' : ''} />
      <span style="text-decoration: ${task.done ? 'line-through' : 'none'}">${task.text}</span>
    `;
        list.appendChild(li);
    });

    updateProgress();
}

function toggleSubtask(index) {
    subtasks[index].done = !subtasks[index].done;
    renderSubtasks();
}

function updateProgress() {
    const completed = subtasks.filter(t => t.done).length;
    const percent = subtasks.length ? Math.round((completed / subtasks.length) * 100) : 0;

    document.getElementById('taskProgress').value = percent;
    document.getElementById('progressPercent').innerText = `${percent}%`;
}



