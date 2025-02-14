
<?php
$inData = getRequestInfo();

// Connect to the database (need to find out if we have a user credential to connect to it first...)
$conn = new mysqli("localhost", "root", "passwordplaceholder", "contact_manager");
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
    $stmt->bind_param("s", $inData["username"]);
    $stmt->execute();
    $result = $stmt->get_result();
    // If information successfully returns a user, return error msg "user already exists"
    if ($result->fetch_assoc())
    {
        returnWithError("User already exists");
    }
    // Else, we will use the input to add a user to the DB
    else
    {
        // Insert new user into the database (providing a username and password, ID is set to auto-increment)
        $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $inData["username"], $inData["password"]);

        if ($stmt->execute()) 
        {
            returnWithSuccess("Account created successfully!");
        }
        else
        {
            returnWithError("Error creating account, please try again.");
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
