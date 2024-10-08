document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (response.ok) {
      if (data.user.role === "manager") {
        window.location.href = "./manager.html";
      } else if (data.user.role === "worker") {
        window.location.href = "./user.html";
      }
    } else {
      alert("Login fallido: " + data.message);
    }
  });
