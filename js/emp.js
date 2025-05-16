function showDetails(widgetName) {
    alert(`Showing details for ${widgetName}`);
}
function performAction(actionName) {
    alert(`Performing action: ${actionName}`);
}
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}


const tasks = [
    { id: 1, name: "Design Homepage", deadline: "2023-10-15", status: "Completed" },
    { id: 2, name: "Fix Bugs", deadline: "2023-10-20", status: "In Progress" },
    { id: 3, name: "Write Documentation", deadline: "2023-10-25", status: "Pending" },
    { id: 4, name: "Implement Authentication", deadline: "2023-11-01", status: "In Progress" },
    { id: 5, name: "Optimize Database", deadline: "2023-11-10", status: "Pending" },
];

function populateTaskTable() {
    const taskTableBody = document.getElementById("taskTableBody");
    tasks.forEach(task => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${task.id}</td>
      <td>${task.name}</td>
      <td>${task.deadline}</td>
      <td>${task.status}</td>
    `;
        taskTableBody.appendChild(row);
    });
}

// Call the function to populate the table on page load
document.addEventListener("DOMContentLoaded", populateTaskTable);



async function showUserData() {

    const welcomeMessage = document.getElementById("welcomeMsg");

    const response = await fetch('app/php/userData.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    if (response.ok) {
        const data = await response.json();
        if (data.success) {
            welcomeMessage.innerHTML = `<a href="my-profile.html" style="color: inherit; text-decoration: none;">Welcome, ${data.user.username.toUpperCase()}!</a>`;

        } else {
            location.href = "login.html";
        }
    } else {
        console.error("Failed to fetch user data");
    }

}

document.addEventListener("DOMContentLoaded", showUserData);

