<?php

$subject = 'Elan Paradise - New Enquiry';
$emailadd = 'query@aadharhomes.com';
$url = 'index.html';
$req = '1';

$text = "Results from form:\n\n";
$space = ' ';
$line = '
';

$servername = "82.180.175.102";
$username = "u766024435_website_enq";
$password = "Anshu@#5566";
$database = "u766024435_projects_db";

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Check if required fields exist in $_POST
    $required_fields = ['name', 'email', 'mobile', 'project'];
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field])) {
            $errors[] = "$field is missing in the request.";
        }
    }

    // If there are missing fields, return an error response
    if (!empty($errors)) {
        echo "<script>
            alert('Error: " . implode("\\n", $errors) . "');
            window.history.back();
        </script>";
        exit; // Stop further execution
    }

    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $mobile = htmlspecialchars($_POST['mobile']);
    $project = htmlspecialchars($_POST['project']);

    // Validation rules
    if (empty($name)) {
        $errors[] = 'Name is required';
    }

    if (empty($email)) {
        $errors[] = 'Email is required';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email format';
    }

    if (empty($mobile)) {
        $errors[] = 'Mobile number is required';
    } elseif (!preg_match('/^[0-9]{10}$/', $mobile)) {
        $errors[] = 'Mobile number must be 10 digits';
    }

    if (empty($project)) {
        $errors[] = 'Project selection is required';
    }

    if (empty($errors)) {

        $connect_db = mysqli_connect($servername, $username, $password, $database);
        if (!$connect_db) {
            die("Sorry we failed to connect: " . mysqli_connect_error());
        }

        $sql = "INSERT INTO project_enq (name, email,mobile,project) VALUES ('$name', '$email','$mobile','$project')";
        $result = mysqli_query($connect_db, $sql);
        if ($result) {
            echo "The record has been inserted successfully successfully!<br>";
        } else {
            error_log("Database error: " . mysqli_error($connect_db)); // Log the error
            die("An error occurred. Please try again later."); // Show a generic message
        }

        foreach ($_POST as $key => $value) {
            if ($req == '1') {
                if ($value == '') {
                    echo "$key is empty";
                    die;
                }
            }
            $j = strlen($key);
            if ($j >= 20) {
                echo "Name of form element $key cannot be longer than 20 characters";
                die;
            }
            $j = 20 - $j;
            for ($i = 1; $i <= $j; $i++) {
                $space .= ' ';
            }
            $value = str_replace('\n', "$line", $value);
            $conc = "{$key}:$space{$value}$line";
            $text .= $conc;
            $space = ' ';
        }
        mail($emailadd, $subject, $text, 'From: ' . $emailadd . '');

        //Thanking
        echo "<script language=\"javascript\" type=\"text/javascript\">
        alert('Thank You!  Details Have Been Sent. We will get in touch with you at the earliest.');
        window.location = \"http://$_SERVER[HTTP_HOST]\";
        </script>
        ";
    } else {
        $string_version = implode(',', $errors);
        echo "<script>
        alert('Error: Kindly details such as Phone number','$string_version');
        window.history.back();
    </script>";
    }
}
?>