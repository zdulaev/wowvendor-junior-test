<?php 
ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

if (!isset($_POST['is_ajax'])) die;

$mysqli = new mysqli('zmailrtb.beget.tech', 'zmailrtb_test', '12345aA', 'zmailrtb_test');
        
if ($mysqli->connect_errno) {
    echo "Не удалось подключиться к MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$query = "INSERT INTO app (rock_position, time, jump_position, terrain_size, result) VALUES ({$_POST['rockPosition']}, {$_POST['time']}, {$_POST['jumpPosition']}, {$_POST['terrainSize']}, {$_POST['result']}) ";
if (!$mysqli->query($query)) {
    echo "error: (" . $mysqli->errno . ") " . $mysqli->error;
} else {
    echo "succeful";
}
$mysqli->close();

