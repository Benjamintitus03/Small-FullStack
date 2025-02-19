<?php

	$inData = getRequestInfo();
	
	$userId = $inData["user_id"];
	$id = $inData["id"];

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
        // Prepare a query where we try to find a contact via user_id and id (cant remove until found)
		$stmt = $conn->prepare("SELECT id FROM contacts WHERE user_id=? AND id=?");
		$stmt->bind_param("ii", $userId, $id);
		$stmt->execute();
		$result = $stmt->get_result();

		if($row = $result->fetch_assoc())
		
		{
            $stmt->close();
			// Remove contact from "contacts" table if we can find an id matching the user_id
            $stmt = $conn->prepare("DELETE FROM contacts WHERE id=? AND user_id=?");
            $stmt->bind_param("ii", $id, $userId);
        
            if ($stmt->execute()) 
            {
                returnWithSuccess("Contact deleted successfully!");
            }
            else
            {
                returnWithError("Error deleting contact, please try again.");
            }
            
    
            $stmt->close();
            $conn->close();
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