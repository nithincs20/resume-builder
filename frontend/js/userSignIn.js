document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    try {
        // Send login request to backend
        const response = await fetch("http://localhost:5000/AdminLogin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok && data.status === "success") {
            localStorage.setItem("token", data.token); 
            localStorage.setItem("isAdmin", "true");
            window.location.href = "template.html"; 
        } else {
            alert(data.message || "Invalid credentials, Login Failed!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
});
