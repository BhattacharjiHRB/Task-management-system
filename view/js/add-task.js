
const taskInput = document.getElementById("taskInput");
const advancedOptions = document.getElementById("advancedOptions");
const detailedTaskForm = document.getElementById("detailedTaskForm");
const addTaskButton = document.getElementById("addTaskButton");

// Quick Add Task
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && taskInput.value.trim() !== "") {
        alert(`Task Added: ${taskInput.value}`);
        taskInput.value = "";
    }
});

// Show Detailed Task Form
advancedOptions.addEventListener("click", () => {
    detailedTaskForm.style.display = "flex";
    detailedTaskForm.style.flexDirection = "column";
});

// Add Task from Detailed Form
addTaskButton.addEventListener("click", () => {
    const taskName = document.getElementById("taskName").value.trim();
    const taskDescription = document
        .getElementById("taskDescription")
        .value.trim();
    const taskLabels = document.getElementById("taskLabels").value.trim();

    if (taskName) {
        alert(
            `Task Added:\nName: ${taskName}\nDescription: ${taskDescription}\nLabels: ${taskLabels}`,
        );
        detailedTaskForm.style.display = "none";
        document.getElementById("taskName").value = "";
        document.getElementById("taskDescription").value = "";
        document.getElementById("taskLabels").value = "";
    } else {
        alert("Task Name is required!");
    }
});


if ("webkitSpeechRecognition" in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const voiceInput = event.results[0][0].transcript;
        if (voiceInput.toLowerCase().startsWith("add task:")) {
            const task = voiceInput.replace(/add task:/i, "").trim();
            if (task) {
                alert(`Task Added via Voice: ${task}`);
            }
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };

    taskInput.addEventListener("dblclick", () => {
        recognition.start();
    });
} else {
    alert("Voice input is not supported in this browser.");
}

let subtasks = [];

document.getElementById('subtaskInput').addEventListener('keypress', function (e) {
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
      <input type="checkbox" onchange="toggleSubtask(${index})" ${task.done ? 'checked' : ''}>
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
