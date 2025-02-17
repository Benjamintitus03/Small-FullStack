<?php

	ini_set('display_erros', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);


	$inData = getRequestInfo();
	
	$id = 0;
	$username = "";

	$conn = new mysqli("localhost", "root", "WeLoveCOP4331", "contact_manager"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT ID,username,password FROM users WHERE username=? AND password=?");
		$stmt->bind_param("ss", $inData["username"], $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		
		{
			returnWithInfo($row['username'], $row['ID']);
		}
		else
		{
			returnWithError("Username not found or password not correct.");
		}

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"username":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $username, $id )
	{
		$retValue = '{"id":' . $id . ',"username":"' . $username . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
