<?php

	$inData = getRequestInfo();
	
	$userId = $inData["user_id"];
	$name = $inData["name"];
    $email = $inData["email"];

    // Connect to the database with the api credentials
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_manager");	
	if( $conn->connect_error )
	{
        // Error returned if connection fails
		returnWithError( $conn->connect_error );
	}
	else
	{
        // Prepare a query where we try to find an exact match of a contact (to prevent duplicates)
		$stmt = $conn->prepare("SELECT id FROM contacts WHERE user_id=? AND name=? AND email=?");
		$stmt->bind_param("iss", $userId, $name, $email);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc())
		
		{
			returnWithError("Duplicate contact found.");
            // exit program when error is found
            exit();
		}

        // close stmt to prepare for next query
        $stmt->close();
        
		// Insert new contact into the database for user (ID is set to auto-increment; name and email will be stored)
        $stmt = $conn->prepare("INSERT INTO contacts (user_id, name, email) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $userId, $name, $email);
    
        if ($stmt->execute()) 
        {
            returnWithSuccess("Contact created successfully!");
        }
        else
        {
            returnWithError("Error creating contact, please try again.");
        }
		

		$stmt->close();
		$conn->close();
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