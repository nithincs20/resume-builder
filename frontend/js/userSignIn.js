document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Get form values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        // Send login request to backend
        const response = await fetch("http://localhost:5000/AdminLogin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.status === "success") {
            localStorage.setItem("token", data.token); // Store JWT token in localStorage
            window.location.href = "template.html"; // Redirect to Admin Dashboard
        } else {
            alert(data.message || "Invalid credentials,Login Failed!");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
});
