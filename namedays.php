<?php

$str = file_get_contents("namedays.json");
echo join(", ", json_decode($str, true)[date("m-d")]);
