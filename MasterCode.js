document.addEventListener("DOMContentLoaded", function () {
  const urlBase = "http://proctest.apfirstonline.online/LAMPAPI";
  const extension = "php";

  let userId = 0;
  let loginName = "";
  let loginPassword = "";

  // ------------------- LOGIN -------------------

 window.doLogin = function() {
  userId = 0;
  loginName = "";
  loginPassword = "";

  let login = document.getElementById("loginName").value;
  let password = document.getElementById("loginPassword").value;

  document.getElementById("loginResult").innerHTML = "";

  let tmp = { login: login, password: password };
  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + '/Login.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if (userId < 1) {
          document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
          return;
        }

        loginName = jsonObject.loginName;
        loginPassword = jsonObject.lastPassword;
        saveSession();
        window.location.href = "Contacts.html";
        loadContacts();
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }

}

  // ------------------- REGISTRATION -------------------
  // This function can be called from a "Register" page or same page, etc.
  window.doRegister = function() {
    let username = document.getElementById("registerName").value;
    let password = document.getElementById("registerPassword").value;

    document.getElementById("registerResult").innerHTML = "";

    let tmp = { username: username, password: password };
    let url = urlBase + "/createUser." + extension;

    console.log("Attempting register fetch to:", url);

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(tmp),
    })
      .then((response) => {
        // If the server or file doesn't exist, you'd see 404 or 500 here
        if (!response.ok) {
          // "failed to fetch" typically occurs if the endpoint is unreachable
          throw new Error(
            "Network response not OK. Status: " + response.status
          );
        }
        return response.json();
      })
      .then((jsonObject) => {
        console.log("Register response:", jsonObject);
        if (jsonObject.error) {
          document.getElementById("registerResult").innerHTML =
            jsonObject.error;
        } else {
          alert(jsonObject.message || "Registered successfully!");
          // If there's a new page for registration success
          window.location.href = "index.html";
        }
      })
      .catch((err) => {
        document.getElementById("registerResult").innerHTML =
          "Failed to register: " + err.message;
        console.error("Registration error:", err);
      });
  };

  // ------------------- SHOW PASSWORD ----------------------
  window.displayPw = function() {
        var x = document.getElementById("loginPassword");
        if (x.type === "password") {
                x.type = "text";
        } else {
                x.type = "password";
        }
   }

  // ------------------- COOKIE FUNCTIONS -------------------
 /*
 window.saveCookie = function() {
        let minutes = 20;
        let date = new Date();
        date.setTime(date.getTime() + minutes * 60 * 1000);

        let sessionData = `userId=${userId},username=${loginName},password=${loginPassword}`;
        document.cookie = `sessionData=${encodeURIComponent(sessionData)};expires=${date.toGMTString()};path=/`;

        console.log("Saving cookie with userId:", userId, " Username:", loginName);
        }

  window.readCookie = function() {
        userId = -1;
        let data = document.cookie;
        console.log("readCookie -> current raw cookie data:", data);

        let theyMatch = data.match(/(?:^|; )sessionData=([^;]*)/);
        if (theyMatch) {
                let cookieValue = decodeURIComponent(theyMatch[1]);
                let splits = cookieValue.split(",");
                        for (let i = 0; i < splits.length; i++) {
                                let [key, value] = splits[i].trim().split("=");
                                        if (key === "userId") userId = parseInt(value.trim());
                                        else if (key === "username") username = value.trim();
                                        else if (key === "password") password = value.trim();
                        }
        }

        console.log("After parse, userId =", userId);
        if (userId < 1) {
                console.log("readCookie -> userId < 0, redirecting to index.html");
        window.location.href = "index.html";
        }
  }

  window.doLogout = function() {
        console.log("Logging out...");
        userId = 0;
        username = "";
        password = "";

        document.cookie = "sessionData=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        window.location.href = "index.html";
        }

        */
  window.saveSession = function() {
        sessionStorage.setItem("id", userId);
        sessionStorage.setItem("username", loginName);
        sessionStorage.setItem("password", loginPassword);
        console.log("Session saved: userId =", sessionStorage.getItem("id"), " username =", sessionStorage.getItem("username"));
  };

  window.readSession = function() {
        userId = parseInt(sessionStorage.getItem("id")) || -1;
        loginName = sessionStorage.getItem("username") || "";
        loginPassword = sessionStorage.getItem("password") || "";

        console.log("Session read: userId =", sessionStorage.getItem("id"));

        if (userId < 1) {
                console.log("Invalid session, redirecting...");
                window.location.href = "index.html";
        }
  };

  window.doLogout = function() {
        console.log("Logging out...");
        sessionStorage.clear();
        window.location.href = "index.html";
  };



  // -------------- ADD CONTACT --------------------
  window.createContact = function() {
    // Get the input values for the new contact
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;

    const name = `${firstName} ${lastName}`;


    // Ensure that user is logged in by checking userId

    // Create a data object to send to the server
    const contactData = {
      user_id: sessionStorage.getItem("id"), // User's unique ID (to associate the contact)
      name: name, // First name of the contact
      email: email, // Phone number of the contact
    };

        console.log(contactData);

    // Convert the data object to JSON format
    const jsonPayload = JSON.stringify(contactData);

    // Define the URL to send the request to
    const url = urlBase + "/createContact." + extension;

    // Send the request using fetch
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: jsonPayload,
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        if (jsonResponse.error) {
          alert("Error: " + jsonResponse.error);
        } else {
          alert("Contact created successfully!");
                window.location.href = "Contacts.html";
      //    loadContacts();  Reload contacts list after adding a new contact
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(
          "An error occurred while creating the contact. Please try again."
        );
      });
  }
  // ----------- DELETE CONTACT --------------
  window.deleteContact = function(contactId) {
    // Ensure that user is logged in by checking userId
    if (userId < 0) {
      alert("You need to log in to delete contacts.");
      return;
    }

    // Confirm deletion before proceeding
    const confirmAction = confirm(
      "Are you sure you want to delete this contact?"
    );
    if (!confirmAction) {
      return;
    }

    // Create a data object to send to the server
    const contactData = {
      user_id: sessionStorage.getItem("id"), // User's unique ID (to associate the contact)
      id: contactId, // The contact's ID to be deleted
    };

    // Convert the data object to JSON format
    const jsonPayload = JSON.stringify(contactData);

        console.log(jsonPayload);

    // Define the URL to send the request to
    const url = urlBase + "/removeContact." + extension;

    // Send the request using fetch
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: jsonPayload,
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        if (jsonResponse.error) {
          alert("Error: " + jsonResponse.error);
        } else {
          alert("Contact deleted successfully!");
          loadContacts(); // Reload the contacts list after deletion
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(
          "An error occurred while deleting the contact. Please try again."
        );
      });
  }
  // ---------------- LOAD CONTACTS ---------------------------------
  window.loadContacts = function() {
    let userId = sessionStorage.getItem("id"); // Retrieve userId from session storage

    if (!userId || userId < 1) {
        console.log("Invalid session, redirecting...");
        window.location.href = "index.html";
        return;
    }

    let url = urlBase + "/loadContacts." + extension;
    let jsonPayload = JSON.stringify({ user_id: userId });
    console.log(jsonPayload);

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: jsonPayload,
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        if (jsonResponse.error) {
          alert("Error: " + jsonResponse.error);
          return;
        }

        let contactList = document.getElementById("contactList");
        contactList.innerHTML = ""; // Clear the table before loading new contacts

        jsonResponse.results.forEach((contact) => {
          let row = document.createElement("tr");

          row.innerHTML = `
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>
                <button class="edit-btn" onclick="window.location.href='EditContact.html?id=${contact.id}'">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
                </td>

            `;

          contactList.appendChild(row);
        });

        if (jsonResponse.results.length === 0) {
          let noResultsRow = document.createElement("tr");
          noResultsRow.innerHTML = `<td colspan="3" style="text-align: center;">No contacts found</td>`;
          contactList.appendChild(noResultsRow);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while loading contacts. Please try again.");
      });
  }

  // ----------------------- Update Contact ------------------------------
  window.UpdateContact = function(contactData, row) {
    let url = urlBase + "/editContact." + extension;
    let jsonPayload = JSON.stringify(contactData);

        console.log(jsonPayload);

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: jsonPayload,
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        if (jsonResponse.error) {
          alert("Error: " + jsonResponse.error);
          return;
        } else {
          alert("You just updated your contact!");
          row.innerHTML = `
          <td>${contact.name}</td>
          <td>${contact.email}</td>
          <td>
          <button class="edit-btn" onclick="editContact(${contact.id})">Edit</button>
          <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
          </td>

          `;
          const editButton = row.querySelector(".edit-btn");
          editButton.addEventListener("click", function () {
            editContact(row, contactData);
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(
          "An error occurred while updating your contacts. Please try again."
        );
      });
  }

 // -------------------------- Edit (Wraps Update) ------------------
  window.editContact = function(contact) {
    const row.innerHTML = `
    <td><input type = "text" class = "edit-name" value="${contact.name}"></td>
    <td><input type = "text" class = "edit-email" value="${contact.email}"></td>
    <td>
      <button class="save-btn">Confirm</button>
      <button class="cancel-btn">Cancel</button>
    </td>

    `;
    // Click confirm and it'll lock in the updated changes
    const confirmButton = row.querySelector(".save-btn");
    confirmButton.addEventListener("click", function () {
      //The buttons below is saving the data representing the updated changes which will be changed to proper JSON later in finalUpdate const structure
      const updatedName = row.querySelector(".edit-name").value;
      const updatedEmailAddr = row.querySelector(".edit-email").value;
      const finalUpdate = {
        id: contact.id,
        user_id: userId,
        name: updatedName,
        email: updatedEmailAddr,
      };
      UpdateContact(finalUpdate, row);
    });
  }

  window.SearchBar = function() {
    const searchBar = document.getElementById("searchBar");
    if (!searchBar) return;
    let debounceTimer;
    searchBar.addEventListener("input", function () {
      clearTimeout(debounceTimer); // clears thedelay
      debounceTimer = setTimeout(() => {
        const filterSearch = searchBar.value.toLowerCase();
        const contactsTable = document.getElementById("contactsTable");
        if (!contactsTable) return;
        const rows = table.getElementsByTagName("tr");
        for (let i = 0; i < rows.length; i++) {
          const cells = rows[i].getElementsByTagName("td");
          let theyMatch = false;
          for (let j = 0; j < cells.length; j++) {
            if (cells[i].textContent.toLowerCase().includes(filterSearch)) {
              theyMatch = true;
              break;
            }
          }
          rows[i].style.display = theyMatch ? "" : "none"; //tenary operator basically sayingif they match return the empty string, otherwise return none to the display.
        }
      }, 300);
    });
  }
  document.addEventListener("DOMContentLoaded", function () {
    SearchBar();
  });
  // Optionally expose readCookie/doLogout to window if you call them from HTML
  //window.readCookie = readCookie;
  //window.doLogout = doLogout;
  window.onLoad = function() {
        readSession();
  }

});
