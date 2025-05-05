document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        let isValid = true;

        // Validate username
        const usernameError = document.getElementById("usernameError");
        if (username === "") {
            usernameError.style.display = "block";
            isValid = false;
        } else {
            usernameError.style.display = "none";
        }

        // Validate password
        const passwordError = document.getElementById("passwordError");
        if (password === "") {
            passwordError.style.display = "block";
            isValid = false;
        } else {
            passwordError.style.display = "none";
        }

        if (isValid) {
            alert("Login successful!");
            location.href = "employee.html";
        }
    });