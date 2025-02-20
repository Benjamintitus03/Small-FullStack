document.addEventListener("DOMContentLoaded", function () {
const urlBase = "http://proctest.apfirstonline.online/LAMPAPI";
  const extension = "php";

  let userId = 0;
  let firstName = "";
  let lastName = "";

  // ------------------- LOGIN -------------------

 window.doLogin = function() {
  userId = 0;
  firstName = "";
  lastName = "";

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

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;
        saveCookie();
        window.location.href = "Contacts.html";
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

  // ------------------- COOKIE FUNCTIONS -------------------
  window.saveCookie = function() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);

    // For debugging, let's log out what we're setting
    console.log(
      "Saving cookie with userId:",
      userId,
      " Name:",
      firstName,
      lastName
    );

    // Optionally, add "; path=/" or a domain if needed
    // e.g. "; path=/; domain=proctest.titusknights.help"
    document.cookie ="firstName="+firstName+",lastName="+lastName+
    ",userId="+userId + ";expires=" + date.toGMTString() + ";path=/"; // path ensures the cookie is valid site-wide
  }

   window.readCookie = function() {
    userId = -1;
    let data = document.cookie;
    console.log("readCookie -> current raw cookie data:", data);
    // Extract the sessionData cookie using a regex
    let theyMatch = data.match(/(?:^|; )sessionData=([^;]*)/);
    if (theyMatch) {
      let cookieValue = decodeURIComponent(match[1]);
      let splits = cookieValue.split(",");
      for (let i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] === "firstName")
          firstName = tokens[1];
        else if (tokens[0] === "lastName")
          lastName = tokens[1];
        else if (tokens[0] === "userId")
          userId = parseInt(tokens[1].trim());
      }
    }
    console.log("After parse, userId =", userId);
    if (userId < 0) {
      console.log("readCookie -> userId < 0, redirecting to index.html");
      window.location.href = "index.html";
    }
  }

  window.doLogout = function() {
    console.log("Logging out...");
    userId = 0;
    firstName = "";
    lastName = "";
    // Invalidate cookie
    document.cookie =
      "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie =
      "lastName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    window.location.href = "index.html";
  }
  // -------------- ADD CONTACT --------------------
  window.createContact = function() {
    // Get the input values for the new contact
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;

    const name = `S{firstName} ${lastName}`;


    // Ensure that user is logged in by checking userId
    if (userId <= 0) {
      alert("You need to log in to add contacts.");
      return;
    }

    // Create a data object to send to the server
    const contactData = {
      user_id: userId, // User's unique ID (to associate the contact)
      name: name, // First name of the contact
      email: email, // Phone number of the contact
    };

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
          loadContacts(); // Reload contacts list after adding a new contact
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
    if (userId <= 0) {
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
      user_id: userId, // The user's ID to verify ownership
      id: contactId, // The contact's ID to be deleted
    };

    // Convert the data object to JSON format
    const jsonPayload = JSON.stringify(contactData);

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
    let url = urlBase + "/loadContacts." + extension;
    let jsonPayload = JSON.stringify({ user_id: userId });

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
                <td>${contact.first_name}</td>
                <td>${contact.last_name}</td>
                <td>${contact.phone}</td>
                <td>${contact.email}</td>
                <td>
                <button class="edit-btn" onclick="editContact(${contact.id})">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
                </td>

            `;

          contactList.appendChild(row);
        });

        if (jsonResponse.results.length === 0) {
          let noResultsRow = document.createElement("tr");
          noResultsRow.innerHTML = `<td colspan="5" style="text-align: center;">No contacts found</td>`;
          contactList.appendChild(noResultsRow);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while loading contacts. Please try again.");
      });
  }

  window.UpdateContact = function(contactData, row) {
    let url = urlBase + "/editContact." + extension;
    let jsonPayload = JSON.stringify(contactData);

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
          <td>${contact.first_name}</td>
          <td>${contact.last_name}</td>
          <td>${contact.phone}</td>
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

  window.editContact = function(row, contact) {
    row.innerHTML = `
    <td><input type = "text" class = "edit-first" value="${contact.first_name}"></td>
    <td><input type = "text" class = "edit-last" value="${contact.last_name}"></td>
    <td><input type = "text" class = "edit-phone" value="${contact.phone}"></td>
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
      const updatedFirst = row.querySelector(".edit-first").value;
      const updatedLast = row.querySelector(".edit-last").value;
      const updatedPhoneNumber = row.querySelector(".edit-phone").value;
      const updatedEmailAddr = row.querySelector(".edit-email").value;
      const first_And_Last_Name = updatedFirst + " " + updatedLast;
      const finalUpdate = {
        id: contact.id,
        user_id: userId,
        first_name: updatedFirst,
        last_name: updatedLast,
        phone: updatedPhoneNumber,
        email: updatedEmailAddr,
        full_name: first_And_Last_Name,
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
  window.readCookie = readCookie;
  window.doLogout = doLogout;
});
