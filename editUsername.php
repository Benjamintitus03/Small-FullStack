<?php
$inData = getRequestInfo();

// Connect to the database (need to find out if we have a user credential to connect to it first...)
$conn = new mysqli("localhost", "root", "KkRzm9FjDZ@g", "contact_manager");
// Check if the connection was successful
if ($conn->connect_error)
{
    returnWithError($conn->connect_error);
}
// If we can connect, continue.
else
{
    // Check if the login already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username=?");
    $stmt->bind_param("s", $inData["newUsername"]);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    // If information successfully returns a user, return error msg "user already exists"
    if ($result->fetch_assoc())
    {
        returnWithError("Username already exists");
    }
    // Else, we will use the input to edit a username in the DB
    else
    {
        // Insert new username for the ID provided
        $stmt = $conn->prepare("UPDATE users SET username=? WHERE id=?");
        $stmt->bind_param("si", $inData["newUsername"], $inData["id"]);

        if ($stmt->execute())
        {
            returnWithSuccess("Username updated successfully!");
        }
        else
        {
            returnWithError("Error updating your username, please try again later.");
        }
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

// possibly need to edit this function ; unsure if it is going to send the correct info out (this is essentially returnWithInfo from login.php)
function returnWithSuccess($msg)
{
    $retValue = '{"message":"' . $msg . '","error":""}';
    sendResultInfoAsJson($retValue);
}
?>
