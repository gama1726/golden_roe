<?php

$body = @file_get_contents('http://127.0.0.1:8000/up');

exit($body === false ? 1 : 0);
