document
    .getElementById("loginForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const loadingMessage = document.getElementById("loadingText");
        const errorMessage = document.getElementById("errorMessage");


        let isValid = true;
        let isLoading = false;



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
            isLoading = true;
            loadingMessage.style.display = "block";
            errorMessage.style.display = "none";
            try {
                const response = await fetch("../controllers/php/login.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                    }),
                });
                const data = await response.json();
                if (data.success && data.role === "employee") {
                    window.location.href = "employee.html";
                } else if (data.success && data.role === "admin") {
                    window.location.href = "admin.html";
                }
                else {
                    errorMessage.textContent = data.message;
                    errorMessage.style.display = "block";
                    errorMessage.style.color = "red";
                    errorMessage.style.fontSize = "14px";

                    window.location.href = "page-not-found.html";
                }
            } catch (error) {
                console.error("Error:", error);
                errorMessage.textContent = error.message.toString();
                errorMessage.style.display = "block";
                errorMessage.style.color = "red";
                errorMessage.style.fontSize = "14px";
            } finally {
                isLoading = false;
                loadingMessage.style.display = "none";
            }
        }
    });







// logout user
