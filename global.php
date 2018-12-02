<?php

set_include_path(dirname(__FILE__)); 

include_once 'config.php';

function __autoload($class_name) {
	require_once 'model/'.$class_name.'.class.php';
}
