// // Added eventListener to load up the DOM before other functions get executed.
// document.addEventListener('DOMContentLoaded', function () { 
//   const urlBase = 'http://proctest.titusknights.help/LAMPAPI';
//   const extension = 'php';

//   let userId = 0;
//   let firstName = "";
//   let lastName = "";

//   // ------------------- LOGIN -------------------
//   // window.doLogin = function () {
//   //   console.log("doLogin triggered");
//   //   userId = 0;
//   //   firstName = "";
//   //   lastName = "";

//   //   let login = document.getElementById("loginName").value;
//   //   let password = document.getElementById("loginPassword").value;

//   //   document.getElementById("loginResult").innerHTML = "";

//   //   let tmp = { login: login, password: password };
//   //   let jsonPayload = JSON.stringify(tmp);
//   //   let url = urlBase + '/Login.' + extension;

//   //   let xhr = new XMLHttpRequest();
//   //   xhr.open("POST", url, true);
//   //   xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
//   //   // try {
//   //   //   xhr.onreadystatechange = function () {
//   //   //     if (this.readyState == 4 && this.status == 200) {
//   //   //       let jsonObject = JSON.parse(xhr.responseText);
//   //   //       userId = jsonObject.id;

//   //   //       if (userId < 1) {
//   //   //         document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
//   //   //         return;
//   //   //       }

//   //   //       firstName = jsonObject.firstName;
//   //   //       lastName = jsonObject.lastName;
//   //   //       saveCookie();
//   //   //       window.location.href = "AddContact.html";// window.location.href = "color.html";
//   //   //     }
//   //   //   };
//   //   //   xhr.send(jsonPayload);
//   //   // } catch (err) {
//   //   //   document.getElementById("loginResult").innerHTML = err.message;
//   //   // }
//   // };
//   try{
//   document.getElementById("doLogin").onclick = function () {
//     console.log("doLogin triggered");
//     userId = 0;
//     firstName = "";
//     lastName = "";

//     let login = document.getElementById("loginName").value;
//     let password = document.getElementById("loginPassword").value;

//     document.getElementById("loginResult").innerHTML = "";

//     let tmp = { login: login, password: password };
//     let jsonPayload = JSON.stringify(tmp);
//     let url = urlBase + '/Login.' + extension;

//     let xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
//     // try {
//     //   xhr.onreadystatechange = function () {
//     //     if (this.readyState == 4 && this.status == 200) {
//     //       let jsonObject = JSON.parse(xhr.responseText);
//     //       userId = jsonObject.id;

//     //       if (userId < 1) {
//     //         document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
//     //         return;
//     //       }

//     //       firstName = jsonObject.firstName;
//     //       lastName = jsonObject.lastName;
//     //       saveCookie();
//     //       window.location.href = "AddContact.html";// window.location.href = "color.html";
//     //     }
//     //   };
//     //   xhr.send(jsonPayload);
//     // } catch (err) {
//     //   document.getElementById("loginResult").innerHTML = err.message;
//     // }
//   };
// }
// catch{
//   console.log("do something");
// }
//   // ------------------- REGISTRATION -------------------
//   window.doRegister = function () {
//     let username = document.getElementById("registerName").value;
//     let password = document.getElementById("registerPassword").value;

//     document.getElementById("registerResult").innerHTML = "";

//     let tmp = { username: username, password: password };
//     let jsonPayload = JSON.stringify(tmp);
//     let url = urlBase + '/createUser.' + extension;

//     let xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
//     try {
//       xhr.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//           let jsonObject = JSON.parse(xhr.responseText);

//           if (jsonObject.error) {
//             document.getElementById("registerResult").innerHTML = jsonObject.error;
//           } else {
//             alert(jsonObject.message);
//             window.location.href = "UpdateContact.html"; // Redirect to login
//           }
//         }
//       };
//       xhr.send(jsonPayload);
//     } catch (err) {
//       document.getElementById("registerResult").innerHTML = err.message;
//     }
//   };

//   // ------------------- COOKIE FUNCTIONS -------------------
//   function saveCookie() {
//     let minutes = 20;
//     let date = new Date();
//     date.setTime(date.getTime() + (minutes * 60 * 1000));
//     document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
//   }

//   function readCookie() {
//     userId = -1;
//     let data = document.cookie;
//     let splits = data.split(",");
//     for (let i = 0; i < splits.length; i++) {
//       let thisOne = splits[i].trim();
//       let tokens = thisOne.split("=");
//       if (tokens[0] == "firstName") firstName = tokens[1];
//       else if (tokens[0] == "lastName") lastName = tokens[1];
//       else if (tokens[0] == "userId") userId = parseInt(tokens[1].trim());
//     }
//     if (userId < 0) window.location.href = "index.html";
//   }

//   function doLogout() {
//     userId = 0;
//     firstName = "";
//     lastName = "";
//     document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
//     window.location.href = "index.html";
//   }
// });