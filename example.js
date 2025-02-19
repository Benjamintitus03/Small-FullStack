// code.js

const urlBase = 'http://YOURDOMAIN.com/LAMPAPI';
const extension = 'php';

// Example globals
let userId = 0;
let firstName = "";
let lastName = "";

// We'll store a timer reference for debouncing
let debounceTimer = null;

//--------------------------------------
// 1) MAIN SEARCH FUNCTION (SERVER-SIDE)
//--------------------------------------
async function doServerSearch(query)
{
  // If query is empty, you might choose to skip or fetch "all" results, up to you
  if (!query)
  {
    displayContacts([]);  // or do nothing
    return;
  }

  // Build the payload for the POST
  const payload = {
    search: query,
    userId: userId
  };
  const url = `${urlBase}/SearchContacts.${extension}`;

  try
  {
    const response = await fetch(url, {
      method: 'POST',
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    // data is expected to be { results: [ {firstName,lastName,email,phone}, ... ] }
    if (data.results)
    {
      displayContacts(data.results);
    }
    else
    {
      // If there's an error or no results field
      displayContacts([]);
    }
  }
  catch (err)
  {
    console.error("Search error:", err);
    // Show some error in the UI if you want
    displayContacts([]);
  }
}

//------------------------------------------------
// 2) DEBOUNCED HANDLER FOR KEYSTROKES
//------------------------------------------------
function onSearchInput(e)
{
  clearTimeout(debounceTimer);

  const searchTerm = e.target.value.trim();

  // Introduce ~300ms delay
  debounceTimer = setTimeout(() => {
    doServerSearch(searchTerm);
  }, 300);
}

//------------------------------------------------
// 3) DISPLAY THE "STRUCT-LIKE" RESULTS
//------------------------------------------------
function displayContacts(contactsArray)
{
  // Example: each contact has firstName, lastName, email, phone
  // We'll just build a table or list in HTML
  const listArea = document.getElementById("searchResults");
  if (!listArea) return;

  if (contactsArray.length === 0)
  {
    listArea.innerHTML = "<p>No matches found.</p>";
    return;
  }

  let html = "<table>";
  html += "<tr><th>First Name</th><th>Last Name</th><th>Email</th><th>Phone</th></tr>";

  contactsArray.forEach(contact => {
    html += `<tr>
      <td>${contact.firstName}</td>
      <td>${contact.lastName}</td>
      <td>${contact.email}</td>
      <td>${contact.phone}</td>
    </tr>`;
  });

  html += "</table>";
  listArea.innerHTML = html;
}