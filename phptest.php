<?php
    $username = "dashboard"; 
    $password = "dashboard";   
    $host = "xxx.xx.xx.xx";
    $database="Client";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

    $myquery = " 
SELECT * FROM `Scooters`
";
    $query = mysql_query($myquery);
    
    if ( ! $myquery ) {
        echo mysql_error();
        die;
    }
    
    $data = array();
    
    for ($x = 0; $x < mysql_num_rows($query); $x++) {
		$row = mysql_fetch_assoc($query);

		switch ($row['Q1']) {
			case 'Very Satisfied': $newVal = "5"; break;
			case 'Somewhat Satisfied': $newVal = "4"; break;
			case 'Neither Satisfied nor Dissatisfied': $newVal = "3"; break;
			case 'Somewhat Dissatisfied': $newVal = "2"; break;
			case 'Very Dissatisfied': $newVal = "1"; break;
			default: $newVal = $row['Q1']; break;
		}
		
		$row['Q1'] = $newVal;

		switch ($row['Q2']) {
			case 'Very Satisfied': $newVal = "5"; break;
			case 'Somewhat Satisfied': $newVal = "4"; break;
			case 'Neither Satisfied nor Dissatisfied': $newVal = "3"; break;
			case 'Somewhat Dissatisfied': $newVal = "2"; break;
			case 'Very Dissatisfied': $newVal = "1"; break;
			default: $newVal = $row['Q2']; break;
		}
		
		$row['Q2'] = $newVal;

		switch ($row['Q3']) {
			case 'Very Satisfied': $newVal = "5"; break;
			case 'Somewhat Satisfied': $newVal = "4"; break;
			case 'Neither Satisfied nor Dissatisfied': $newVal = "3"; break;
			case 'Somewhat Dissatisfied': $newVal = "2"; break;
			case 'Very Dissatisfied': $newVal = "1"; break;
			default: $newVal = $row['Q3']; break;
		}
		
		$row['Q3'] = $newVal;

		switch ($row['Q4']) {
			case 'Very Satisfied': $newVal = "5"; break;
			case 'Somewhat Satisfied': $newVal = "4"; break;
			case 'Neither Satisfied nor Dissatisfied': $newVal = "3"; break;
			case 'Somewhat Dissatisfied': $newVal = "2"; break;
			case 'Very Dissatisfied': $newVal = "1"; break;
			default: $newVal = $row['Q4']; break;
		}
		
		$row['Q4'] = $newVal;


		switch ($row['Q5']) {
			case 'Very Satisfied': $newVal = "5"; break;
			case 'Somewhat Satisfied': $newVal = "4"; break;
			case 'Neither Satisfied nor Dissatisfied': $newVal = "3"; break;
			case 'Somewhat Dissatisfied': $newVal = "2"; break;
			case 'Very Dissatisfied': $newVal = "1"; break;
			default: $newVal = $row['Q5']; break;
		}
		
		$row['Q5'] = $newVal;		

		
		switch ($row['Q7']) {
			case 'Yes': $newVal = "1"; break;
			case 'No': $newVal = "2"; break;
			default: $newVal = $row['Q7']; break;
		}
		
		$row['Q7'] = $newVal;

		switch ($row['Q8']) {
			case 'Yes': $newVal = "1"; break;
			case 'No': $newVal = "2"; break;
			case NULL: $newVal = "2"; break;
			default: $newVal = $row['Q8']; break;
		}
		
		$row['Q8'] = $newVal;

		switch ($row['Q10']) {
			case 'Male': $newVal = "1"; break;
			case 'Female': $newVal = "2"; break;
			default: $newVal = $row['Q10']; break;
		}
		
		$row['Q10'] = $newVal;



		switch ($row['Q11']) {
			case '18-24': $newVal = "5"; break;
			case '25-34': $newVal = "4"; break;
			case '35-44': $newVal = "3"; break;
			case '45-54': $newVal = "2"; break;
			case '55+': $newVal = "1"; break;
			default: $newVal = $row['Q11']; break;
		}
		
		$row['Q11'] = $newVal;		


        $data[] = $row;
    }
    
    echo json_encode($data);     
     
    mysql_close($server);
?>
