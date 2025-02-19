/**
 * MasterCode.js (revised)
 * - Uses fetch() (no XHR).
 * - Minimizes double event.preventDefault().
 * - Adds domain/path to cookies and extra console logs for debugging.
 */
document.addEventListener("DOMContentLoaded", function () {
    const urlBase = "http://proctest.titusknights.help/LAMPAPI";
    const extension = "php";

    let userId = 0;
    let firstName = "";
    let lastName = "";

    // ------------------- LOGIN -------------------
    try {
        // If the page has an element with id="doLogin", attach the click event
        const loginBtn = document.getElementById("doLogin");

        if (loginBtn) {
            loginBtn.onclick = function (event) {
                event.preventDefault(); // avoid form submission / page reload
                console.log("doLogin triggered");

                // Reset or not, but let's do it to be sure
                userId = 0;
                firstName = "";
                lastName = "";

                let login = document.getElementById("loginName").value;
                let password = document.getElementById("loginPassword").value;
                document.getElementById("loginResult").innerHTML = "";

                // Build the payload
                let tmp = { login: login, password: password };
                let url = urlBase + "/Login." + extension;

                console.log("Attempting login fetch to:", url);

                fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json; charset=UTF-8" },
                    body: JSON.stringify(tmp),
                })
                    .then((response) => response.json())
                    .then((jsonObject) => {
                        console.log("Login response:", jsonObject);
                        userId = jsonObject.id;

                        if (userId < 1) {
                            document.getElementById("loginResult").innerHTML =
                                "User/Password combination incorrect";
                            return;
                        }

                        // If valid user
                        firstName = jsonObject.firstName;
                        lastName = jsonObject.lastName;
                        saveCookie();

                        // Redirect to AddContact.html
                        // (Ensure that file actually exists in the same folder)
                        window.location.href = "AddContact.html";
                    })
                    .catch((err) => {
                        document.getElementById("loginResult").innerHTML =
                            "Error: " + err.message;
                    });
            };
        }
    } catch (err) {
        console.log("doLogin setup encountered error:", err);
    }

    // ------------------- REGISTRATION -------------------
    // This function can be called from a "Register" page or same page, etc.
    window.doRegister = function () {
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
                    window.location.href = "UpdateContact.html";
                }
            })
            .catch((err) => {
                document.getElementById("registerResult").innerHTML =
                    "Failed to register: " + err.message;
                console.error("Registration error:", err);
            });
    };

    // ------------------- COOKIE FUNCTIONS -------------------
    function saveCookie() {
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
        document.cookie =
            "firstName=" +
            firstName +
            ",lastName=" +
            lastName +
            ",userId=" +
            userId +
            ";expires=" +
            date.toGMTString() +
            ";path=/"; // path ensures the cookie is valid site-wide
    }

    // We usually call this in the body onload of AddContact.html, for example
    function readCookie() {
        userId = -1;
        let data = document.cookie || "";
        console.log("readCookie -> current raw cookie data:", data);

        let splits = data.split(",");
        for (let i = 0; i < splits.length; i++) {
            let thisOne = splits[i].trim();
            let tokens = thisOne.split("=");
            if (tokens[0] == "firstName") firstName = tokens[1];
            else if (tokens[0] == "lastName") lastName = tokens[1];
            else if (tokens[0] == "userId") userId = parseInt(tokens[1].trim());
        }

        console.log("After parse, userId =", userId);
        // If userId < 0, we redirect to index
        if (userId < 0) {
            console.log("readCookie -> userId < 0, redirecting to index.html");
            window.location.href = "index.html";
        }
    }

    function doLogout() {
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

    // Optionally expose readCookie/doLogout to window if you call them from HTML
    window.readCookie = readCookie;
    window.doLogout = doLogout;
});
// -------------- ADD CONTACT --------------------
function createContact() {
  // Get the input values for the new contact
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;

  // Combine first and last name into a full name
  const fullName = `${firstName} ${lastName}`;

  // Ensure that user is logged in by checking userId
  if (userId <= 0) {
      alert("You need to log in to add contacts.");
      return;
  }

  // Create a data object to send to the server
  const contactData = {
      user_id: userId,     // User's unique ID (to associate the contact)
      first_name: firstName,  // First name of the contact
      last_name: lastName,    // Last name of the contact
      full_name: fullName,    // Full name (combination of first and last)
      phone: phone,          // Phone number of the contact
      email: email           // Email of the contact
  };

  // Convert the data object to JSON format
  const jsonPayload = JSON.stringify(contactData);

  // Define the URL to send the request to
  const url = urlBase + '/createContact.' + extension;

  // Send the request using fetch
  fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: jsonPayload
  })
  .then(response => response.json())
  .then(jsonResponse => {
      if (jsonResponse.error) {
          alert("Error: " + jsonResponse.error);
      } else {
          alert("Contact created successfully!");
          loadContacts(); // Reload contacts list after adding a new contact
      }
  })
  .catch(error => {
      console.error("Error:", error);
      alert("An error occurred while creating the contact. Please try again.");
  });
}

// ----------- DELETE CONTACT --------------
function deleteContact(contactId) {
  // Ensure that user is logged in by checking userId
  if (userId <= 0) {
      alert("You need to log in to delete contacts.");
      return;
  }

  // Confirm deletion before proceeding
  const confirmAction = confirm("Are you sure you want to delete this contact?");
  if (!confirmAction) {
      return;
  }

  // Create a data object to send to the server
  const contactData = {
      user_id: userId, // The user's ID to verify ownership
      id: contactId    // The contact's ID to be deleted
  };

  // Convert the data object to JSON format
  const jsonPayload = JSON.stringify(contactData);

  // Define the URL to send the request to
  const url = urlBase + '/removeContact.' + extension;

  // Send the request using fetch
  fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: jsonPayload
  })
  .then(response => response.json())
  .then(jsonResponse => {
      if (jsonResponse.error) {
          alert("Error: " + jsonResponse.error);
      } else {
          alert("Contact deleted successfully!");
          loadContacts(); // Reload the contacts list after deletion
      }
  })
  .catch(error => {
      console.error("Error:", error);
      alert("An error occurred while deleting the contact. Please try again.");
  });
}
