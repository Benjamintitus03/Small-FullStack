<?php

	$inData = getRequestInfo();
	
	$userId = $inData["user_id"];
	$name = $inData["name"];
    $email = $inData["email"];
    $id = $inData["id"];

    $newEmail = $inData["new_email"];
    $newName = $inData["new_name"];
    $updateFlag = false;

    // Connect to the database with the api credentials
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_manager");	
	if( $conn->connect_error )
	{
        // Error returned if connection fails
		returnWithError( $conn->connect_error );
        exit();
	}
	else
	{
        // Prepare a query where we try to find an exact match of a contact (to prevent duplicates)
		$stmt = $conn->prepare("SELECT id FROM contacts WHERE user_id=? AND name=? AND email=?");
		$stmt->bind_param("iss", $userId, $name, $email);
		$stmt->execute();
		$result = $stmt->get_result();
        $stmt->close();

		if( $row = $result->fetch_assoc())
		
		{
            // case 0: user didn't give any new fields to update
            if (empty($newName) && empty($newEmail))
            {
                returnWithError("No fields given for update");
                exit();
            }

            // case 1: user wants to change email
            if (empty($newName) )
            {
                $stmt = $conn->prepare("UPDATE contacts SET email=? WHERE user_id=? AND id=?");
		        $stmt->bind_param("sii", $newEmail, $userId, $id);
		        $updateFlag = $stmt->execute();
            }

            // case 2: user wants to change name
            elseif (empty($newEmail) )
            {
                $stmt = $conn->prepare("UPDATE contacts SET name=? WHERE user_id=? AND id=?");
		        $stmt->bind_param("sii", $newName, $userId, $id);
		        $updateFlag = $stmt->execute();
            }

            // case 3: user wants to change both name and email
            else
            {
                $stmt = $conn->prepare("UPDATE contacts SET email=?, name=? WHERE user_id=? AND id=?");
		        $stmt->bind_param("ssii", $newEmail, $newName, $userId, $id);
		        $updateFlag = $stmt->execute();
            }

            // close stmt and check if update was successful
            $stmt->close();
            if ($updateFlag)
            {
                returnWithSuccess("Contact updated successfully!");
            }
            else
            {
                returnWithError("Error updating contact, please try again.");
            }

		}

        else
        {
            returnWithError("Contact not found.");
            // exit program when error is found
            exit();
        }
	}
	
    // handler for json input for this api
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

    // helper for returnWithInfo
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
    // for returning errors with apis
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
    // for returning info with apis
	function returnWithInfo( $username, $id )
	{
		$retValue = '{"id":' . $id . ',"username":"' . $username . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>