<?php
include "./guard.php"
?>
<!DOCTYPE html>
<html>
  <?php include "./header.php"; ?>
  <body>
    <div class="container-fluid">
      <div class="row">
        <p id="user">
          <label>Username:</label><input type="text" name="name">
          <label>Password:</label><input type="password" name="password">
          <button id="register">Register</button>
          <button id="login">Login</button>
        </p>
        <button id="signOut" class="hidden">Sign out</button>
      </div>
      <div class="row">
        <div class="calendar col-lg-8 col-md-12">
          <button id="prevMonth">&lt;-</button>
          <span id="currentMonth"></span>
          <button id="nextMonth">-&gt;</button>
          <br>
          <span id="tags">
          </span>
          <table id="calendar">
            <tr>
              <?php
              foreach (['Sunday', 'Monday', 'Tuesday', 'Wednesday',
                        'Thursday', 'Friday', 'Saturday'] as $day) {
                echo "<th>$day</th>";
              } ?>
            </tr>
            <tr></tr>
          </table>
        </div>
        
        <div id="createEvent" class="eventForm hidden col-md-4 h-50">
        <div id="createEventheader">Click here to drag</div>
          <label>Day: </label><span id="selectedDate"></span>
          <br>
          <label>Time: </label><input type="time" name="time">
          <br>
          <label>Name: </label><input type="text" name="name">
          <br>
          <label>Tag: </label><input type="text" name="tag">
          <br>
          <input type="hidden" name="token">
          <button id="addEvent">Add</button>
          <button class="cancelEventForm">Cancel</button>
        </div>
        
        <div id="editEventForm" class="eventForm hidden col-md-4 h-50">
          <div id="editEventFormheader">Click here to drag</div>
          <label>Day: </label><span id="selectedDate"></span>
          <br>
          <label>Time: </label><input type="time" name="time">
          <br>
          <label>Name: </label><input type="text" name="name">
          <br>
          <input type="hidden" name="eid">
          <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>">
          <button id="editEventButton">Edit</button>
          <button class="cancelEventForm">Cancel</button>
          <button id="deleteEvent">Delete event</button>
        </div>
      </div>
    </div>
    <script src="./jquery-3.4.1.min.js"></script>
    <script>
     <?php
     if ($user) {
       echo "var loggedIn = true;";
     } else {
       echo "var loggedIn = false;";
     }
     ?>
    </script>
    <script src="./calendar.js"></script>
  </body>
</html>
