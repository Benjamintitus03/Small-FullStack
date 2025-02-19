document.addEventListener('DOMContentLoaded', function () {
    const urlBase = 'http://proctest.titusknights.help/LAMPAPI';
    const extension = 'php';

    let userId = 0;
    let firstName = "";
    let lastName = "";

    // ------------------- LOGIN -------------------
    const loginButton = document.getElementById("loginButton");
    if (loginButton) {
      loginButton.addEventListener("click", async function (event) {
        event.preventDefault();
        console.log("doLogin triggered");
        userId = 0;
        firstName = "";
        lastName = "";

        const login = document.getElementById("loginName").value;
        const password = document.getElementById("loginPassword").value;
        document.getElementById("loginResult").innerHTML = "";

        const payload = { login, password };

        try {
          const response = await fetch(`${urlBase}/Login.${extension}`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const jsonObject = await response.json();
          userId = jsonObject.id;

          if (userId < 1) {
            document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
            return;
          }

          firstName = jsonObject.firstName;
          lastName = jsonObject.lastName;
          saveCookie();
          window.location.href = "AddContact.html";
        } catch (err) {
          document.getElementById("loginResult").innerHTML = err.message;
        }
      });
    }

    // ------------------- REGISTRATION -------------------
    const registerButton = document.getElementById("doRegister");
    if (registerButton) {
      registerButton.addEventListener("click", async function () {
        const username = document.getElementById("registerName").value;
        const password = document.getElementById("registerPassword").value;
        document.getElementById("registerResult").innerHTML = "";

        const payload = { username, password };

        try {
          const response = await fetch(`${urlBase}/createUser.${extension}`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const jsonObject = await response.json();
          if (jsonObject.error) {
            document.getElementById("registerResult").innerHTML = jsonObject.error;
          } else {
            alert(jsonObject.message);
            window.location.href = "UpdateContact.html"; // Redirect to update page after registration
          }
        } catch (err) {
          document.getElementById("registerResult").innerHTML = err.message;
        }
      });
    }

    // ------------------- COOKIE FUNCTIONS -------------------
    function saveCookie() {
      const minutes = 20;
      const date = new Date();
      date.setTime(date.getTime() + (minutes * 60 * 1000));
      document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId +
                        ";expires=" + date.toGMTString();
    }

    function readCookie() {
      userId = -1;
      const data = document.cookie;
      const splits = data.split(",");
      for (let i = 0; i < splits.length; i++) {
        const thisOne = splits[i].trim();
        const tokens = thisOne.split("=");
        if (tokens[0] === "firstName") firstName = tokens[1];
        else if (tokens[0] === "lastName") lastName = tokens[1];
        else if (tokens[0] === "userId") userId = parseInt(tokens[1].trim());
      }
      if (userId < 0) window.location.href = "index.html";
    }

    function doLogout() {
      userId = 0;
      firstName = "";
      lastName = "";
      document.cookie = "firstName= ; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = "index.html";
    }
  });