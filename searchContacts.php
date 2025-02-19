<?php

    // gather json input
	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

    // establish connection / create handler
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_manager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        // find all contacts similar under the user_id
		$stmt = $conn->prepare("SELECT name, email from contacts where (name like ? OR email like ?) and UserID=?");
		$contactName = "%" . $inData["search"] . "%";
		$stmt->bind_param("ssi", $contactName, $email, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
        // fetch results into an array
        while ($row = $result->fetch_assoc()) {
            $searchResults[] = [
            "name" => $row["name"],
            "email" => $row["email"]
        ];
        $searchCount++;
}
		// if nothing found, return no records.
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
        // if results, return the array of json data found
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$stmt->close();
		$conn->close();
	}

    // helper for returnWithInfo
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

    // sends results in json format
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
        // if this doesnt work use json_encode method in echo instead
		echo $obj;
	}

	// returns an error and an error message specified
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	// returns results on a success
	function returnWithInfo( $searchResults )
	{
		$retValue = ["results" => $searchResults, "error" => ""];
		sendResultInfoAsJson( $retValue );
	}
	
?>