<?php

include "urls.php";

$result = [];
for ($i = 0; $i < count($urls); $i++)
{
	// obtaining data
	$data = requestData($urls[$i]);

	// converting the data to object then to json
	$data = simplexml_load_string($data);

	$result[$i] = $data;
}

// JSON_UNESCAPED_UNICODE - necessary for latvian letters
$result = json_encode($result, JSON_UNESCAPED_UNICODE);
echo $result;


// requests data for an individual url
function requestData($url)
{
	// initialization
	$request = curl_init();

	// options
	curl_setopt($request, CURLOPT_URL, $url);
	curl_setopt($request, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($request, CURLOPT_SSL_VERIFYPEER, false);

	// execution
	$data = curl_exec($request);
	
	curl_close($request);

	return $data;
}
