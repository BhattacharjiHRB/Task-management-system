
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

// Voice Input Support
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