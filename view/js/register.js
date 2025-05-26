
document
    .getElementById("registerForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const full_name = document.getElementById("full_name").value.trim();
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;
        const messageDiv = document.getElementById("message");


        if (!username || !full_name || !password || !role) {
            messageDiv.textContent = "Please fill in all fields.";
            messageDiv.style.display = "block";
            messageDiv.style.backgroundColor = "#f8d7da";
            return;
        }

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("full_name", full_name);
            formData.append("password", password);
            formData.append("role", role);
            formData.append("action", "register");

            const response = await fetch("../controllers/php/createuser.php", {
                method: "POST",
                body: formData,
            });

            const data = response.json();

            if (data.success) {
                messageDiv.textContent = "User registered successfully!";
                messageDiv.style.display = "block";
                messageDiv.style.backgroundColor = "#d4edda";
            } else {
                messageDiv.textContent = data.message || "Registration failed.";
                messageDiv.className = "message error";
            }
        } catch (error) {
            console.error("Error during registration:", error);
            messageDiv.style.display = "block";
            messageDiv.style.backgroundColor = "#f8d7da";
            return;

        }



        messageDiv.textContent = "User registered successfully!";
        messageDiv.style.display = "block";
        messageDiv.style.backgroundColor = "#d4edda";
        messageDiv.style.color = "#155724";
        this.reset();
    });