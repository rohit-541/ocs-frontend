const API_URL = "http://localhost:3000";

async function login() {
    showLoading();
    let usernameEl = document.getElementById("login-username");
    let passwordEl = document.getElementById("login-password");
    let username = usernameEl.value;
    let password = passwordEl.value;

    usernameEl.value = "";
    passwordEl.value = "";

    let response = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userName:username,
            password:password
        })
    });

    let data = await response.json();
    
    if (response.ok) {
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("users",JSON.stringify(data.users));
        showDashboard(data.user);
        hideLoading();
    } else {
        hideLoading();
        alert(data.message);
    }

}

async function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("users");
    document.getElementById("login-container").classList.remove("hidden");
    document.getElementById("admin-dashboard").classList.add("hidden");
    document.getElementById("user-profile").classList.add("hidden");
}

async function showDashboard(user) {
    showLoading();
    document.getElementById("login-container").classList.add("hidden");

    if (user.role === "Admin") {
        document.getElementById("admin-dashboard").classList.remove("hidden");
        await renderUsers();
    } else {
        document.getElementById("user-profile").classList.remove("hidden");
        document.getElementById("profile-username").innerText = user.username;
        document.getElementById("profile-name").innerText = user.name;
        document.getElementById("profile-role").innerText = user.role;
    }
    hideLoading();
}

async function registerUser() {
    showLoading();
    let username = document.getElementById("reg-username").value;
    let password = document.getElementById("reg-password").value;
    let name = document.getElementById("reg-name").value;
    let role = document.getElementById("reg-role").value;
    let adminUserName = JSON.parse(localStorage.getItem('user')).username;
    let adminPass = prompt("Enter your password to continue");

    if(!adminPass){
        return;
    }


    let response = await fetch(`${API_URL}/user/create`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminUserName,adminPass,username, password, name, role })
    });

    let data = await response.json();

    if (response.ok) {
        alert("User registered successfully!");
        await renderUsers();
        hideLoading();
    } else {
        hideLoading();
        alert(data.message);
    }
}

async function renderUsers() {

    const users = JSON.parse(localStorage.getItem("users"));
    let userTable = document.getElementById("UserTable");
    let tableBody = document.getElementById("user-list");
    tableBody.innerHTML = "";
    users.forEach(user => {
        let row = `<tr>
            <td>${user.username}</td>
            <td>${user.name}</td>
            <td>${user.role}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
    userTable.classList.remove("hidden");
}

window.onload = async () => {
    let user = localStorage.getItem("user")
    console.log(user);
    if (user) {
        try {
            console.log("Refereshed");
            showDashboard(JSON.parse(user));
        } catch (error) {
            console.error("Error parsing user data:", error);
            localStorage.removeItem("user"); 
        }
    }
};


// Show the loading spinner
function showLoading() {
    document.getElementById("loading").classList.remove("hidden");
}

// Hide the loading spinner
function hideLoading() {
    document.getElementById("loading").classList.add("hidden");
}

