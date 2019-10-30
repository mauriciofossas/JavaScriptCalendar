const months = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
              'Thursday', 'Friday', 'Saturday'];

const now = new Date();
var viewedMonth = {
  year: now.getFullYear(),
  month: now.getMonth()
}

function getDateOfViewedMonth() {
  return new Date(viewedMonth.year, viewedMonth.month);
}

function getNumberOfViewedMonthDays() {
  // This works because 0 in a date is the last day of the previous month
  // Weird trick, https://www.w3resource.com/javascript-exercises/javascript-date-exercise-3.php
  return new Date(viewedMonth.year, viewedMonth.month + 1, 0).getDate();
}

const calendar = {
  rows: 1,
  columns: 0
}

function addDay(day) {
  $("#calendar tr").eq(calendar.rows).append(day);
  calendar.columns++;
  if (calendar.columns >= 7) {
    calendar.columns = 0;
    calendar.rows++;
    $("#calendar").append("<tr></tr>");
  }
}

function addBlankDay() {
  const day = $("<td class=blank></td>");
  addDay(day);
}

function showEditEventForm(res){
  $("#createEvent").addClass("hidden");
  $("#editEventForm").removeClass("hidden");
  const day = res.target.parentNode.parentNode.firstChild.innerText;
  const time = res.target.getAttribute("data-time");
  const name = res.target.innerText.split(" - ")[1];
  const eid = res.target.getAttribute("data-eid");
  $("#editEventForm span").text(day);
  $("#editEventForm [name=time]").val(time);
  $("#editEventForm [name=name]").val(name);
  $("#editEventForm [name=eid]").val(eid);
}

function showEventForm(res) {
  $("#editEventForm").addClass("hidden");
  const day = res.target.innerText;
  $("#createEvent")
    .removeClass("hidden");
  $("#createEvent span").text(day);
}

function addNumberedDay(date) {
  const day = $("<td class=numbered></td>")
    .addClass(date.toString())
    .append("<span>" + date.toString() + "</span>")
    .append("<ul></ul>");
  addDay(day);
}

function loadCalendar() {
  // Set the name of the month
  const formattedDate = "" + months[viewedMonth.month] + " " + viewedMonth.year;
  $('span#currentMonth').text(formattedDate);
  // Start to draw days in the month
  // First, pad out extra days
  const firstDay = getDateOfViewedMonth().getDay();
  for (var i = 0; i < firstDay; i++) {
    addBlankDay();
  }
  const numDays = getNumberOfViewedMonthDays();
  for (var i = 1; i <= numDays; i++) {
    addNumberedDay(i);
  }

  if (loggedIn) {
    $('.numbered span').on('click', showEventForm);
    getEvents();
  }
  getHolidays();
}

if (!loggedIn) {
  loadCalendar();
}

function clearCalendar() {
  calendar.rows = 1;
  calendar.columns = 0;
  $("#calendar tr").not(":eq(0)").remove();
  $("#calendar").append("<tr></tr>");
  $("#tags").empty();
  cancelAddEvent();
}

function nextMonth() {
  viewedMonth.month++;
  if (viewedMonth.month >= 12 ){
    viewedMonth.month = 0;
    viewedMonth.year++;
  }
  clearCalendar();
  loadCalendar();
}

$('#nextMonth').on('click', nextMonth);

function prevMonth() {
  viewedMonth.month--;
  if (viewedMonth.month < 0 ){
    viewedMonth.month = 11;
    viewedMonth.year--;
  }
  clearCalendar();
  loadCalendar();
}

$('#prevMonth').on('click', prevMonth);

function setLoggedIn() {
  loggedIn = true;
  $("#user").addClass("hidden");
  $("#signOut")
    .removeClass("hidden");
  clearCalendar();
  loadCalendar();
}

if (loggedIn) {
  setLoggedIn();
}

function register() {
  const username = $("#user input[name=name]").val();
  const password = $("#user input[name=password]").val();
  if(username == ""){
    alert("You may not leave this blank, please try again.");
    return;
  }
  if(password == ""){
    alert("You may not leave this blank, please try again.");
    return;
  }
  $.post("./register.php", {username: username, password: password})
   .done(function() {
     setLoggedIn();
     $.get("./CSRF.php")
    .done(function (res) {
      $("#editEventForm input[name=token]").val(res);
   });
   })
   .fail(function() {
     alert("Username is already in use.")
   })
}

$('#user button#register').on('click', register);

function login() {
  const username = $("#user input[name=name]").val();
  const password = $("#user input[name=password]").val();
  if(username == ""){
    alert("You may not leave this blank, please try again.");
    return;
  }
  if(password == ""){
    alert("You may not leave this blank, please try again.");
    return;
  }
  $.post("./login.php", {username: username, password: password})
   .done(function() {
     setLoggedIn();
     $.get("./CSRF.php")
    .done(function (res) {
      $("#editEventForm input[name=token]").val(res);
    });
   })
   .fail(function() {
     alert("Bad username or password.");
   })
}

$('#user button#login').on('click', login);

function cancelAddEvent() {
  $('#createEvent input').val("");
  $('#createEvent').addClass("hidden");
  $('#editEventForm').addClass('hidden');
}

$('.cancelEventForm').on('click', cancelAddEvent);

function postEvent() {
  const data = {
    month: viewedMonth.month + 1,
    year: viewedMonth.year,
    date: $("#createEvent span").text(),
    time: $("#createEvent input[name=time]").val(),
    name: $("#createEvent input[name=name]").val(),
    tag: $("#createEvent input[name=tag]").val(),
    token: $("#editEventForm input[name=token]").val()
  }
  $.post("./addEvent.php", data)
   .done(function() {
     clearCalendar();
     loadCalendar();
   }) 
}

$('#addEvent').on('click', postEvent);

function updateEvent() {
  const data = {
    month: viewedMonth.month + 1,
    year: viewedMonth.year,
    date: $("#editEventForm span").text(),
    time: $("#editEventForm input[name=time]").val(),
    name: $("#editEventForm input[name=name]").val(),
    eid: $("#editEventForm input[name=eid]").val(),
    token: $("#editEventForm input[name=token]").val()
  }
  $.post("./editEvent.php", data)
   .done(function() {
     clearCalendar();
     loadCalendar();
   }) 
}

$("#editEventButton").on('click', updateEvent);

function deleteEvent() {
  const data = {
    eid: $("#editEventForm input[name=eid]").val(),
    token: $("#editEventForm input[name=token]").val()
  }
  $.post("./deleteEvent.php", data)
   .done(function() {
     clearCalendar();
     loadCalendar();
   });
}

$("#deleteEvent").on('click', deleteEvent);

function get12HourTime(time) {
  if (time.minute.toString().length==1){
    time.minute = "0" + time.minute;
  }
  if (time.hour == 0) {
    return "12:" + time.minute + " AM";
  } else if (time.hour < 12) {
    return time.hour + ":" + time.minute + " AM";
  }
  else if (time.hour == 12) {
    return "12:" + time.minute + " PM";
  } else {
    return time.hour - 12 + ":" + time.minute + " PM";
  }
}

function getEvents() {
  const data = {
    month: viewedMonth.month + 1,
    year: viewedMonth.year
  }
  $.get("./getEvents.php", data)
   .done(function (res) {
     const result = JSON.parse(res);
     addTags(result.tags);
     result.events.forEach(addEvent);
     $('li').on('click', showEditEventForm);
   });
}

function getHolidays() {
  const data = {
    month: viewedMonth.month,
    year: viewedMonth.year
  }
  $.get("./getHolidays.php", data)
   .done(function (res) {
     const result = JSON.parse(res);
     result.forEach(addHoliday);
   });
}

function addHoliday(holiday) {
  const el = $("<div></div>")
    .addClass('holiday')
    .text(holiday.holiday);
  $('.numbered.' + holiday.day).append(el);
}

function addTags(tags) {
  const allButton = $("<button>All</button>").on("click", function(){setTag('__all__');});
  $("#tags").append(allButton);
  tags.forEach(function (tag) {
    const button = $("<button></button>").text(tag).on("click", function(){setTag(tag);});
    $("#tags").append(button); 
  });
}

function setTag(tag) {
  if (tag == '__all__') {
    $("li").removeClass("hidden");
  } else {
    $("li[data-tag=\"" + tag +"\"]").removeClass("hidden");
    $("li:not([data-tag=\"" + tag +"\"])").addClass("hidden");
  }
}

function addEvent(event) {
  if (event.hour < 10){
    event.hour = "0" + event.hour;
  }
  const eventEl = $("<li>" + get12HourTime(event) + " - " + event.name + "</li>")
    .addClass('editEvent')
    .attr("data-eid", event.id)
    .attr("data-tag", event.tag)
    .attr("data-time", event.hour + ":" + event.minute);
  $("#calendar ." + event.date +" ul").append(eventEl);
}

function signOut(){
  const SignOut = "SignOut";
  $("#user input[name=name]").val("");
  $("#user input[name=password]").val("");
  loggedIn=false;
  clearCalendar();
  $("#user").removeClass("hidden");
  $("#signOut").addClass("hidden");
  loadCalendar();
  $.get("./logout.php");
  $("#editEventForm input[name=token]").val(null);
}

$('#signOut').on('click', signOut);


//The following code (dragElement) was taken from w3schools at: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_draggable
dragElement(document.getElementById("editEventForm"));
dragElement(document.getElementById("createEvent"));
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
//Code taken from w3school ends here.
