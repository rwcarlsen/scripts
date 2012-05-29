function getClientVals() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var zone = ss.getSpreadsheetTimeZone()
    var clientRange = ss.getRangeByName("all_clients");

  var vals = [];
  for (var i = 1; i <= clientRange.getNumRows(); i++) {
    var firstName = clientRange.getCell(i, 1).getValue();
    var lastName = clientRange.getCell(i, 2).getValue();
    var partnerName = clientRange.getCell(i, 3).getValue();
    var className = clientRange.getCell(i, 4).getValue();
    var day = clientRange.getCell(i, 6).getValue();
    var time = clientRange.getCell(i, 7).getValue();
    var totalDue = clientRange.getCell(i, 20).getValue();
    var dayOfWeek = clientRange.getCell(i, 28).getValue();
    var birthday = clientRange.getCell(i, 23).getValue();
    var materialsReceived = clientRange.getCell(i, 22).getValue();
    var email = clientRange.getCell(i, 25).getValue();
    var section = clientRange.getCell(i, 5).getValue();


    var matPaidAmt = clientRange.getCell(i, 19).getValue();
    if (matPaidAmt == "") {
      matPaidAmt = 0;
    } else {
      matPaidAmt = parseFloat(matPaidAmt);
    }
    var materialsDue = parseFloat(clientRange.getCell(i, 13).getValue()) - matPaidAmt;

    if (Math.abs(materialsDue) < 1) {
      var materialsPaid = "yes";
    } else {
      var materialsPaid = "";
    }

    if (Math.abs(totalDue - materialsDue) < 1) {
      var tuitionPaid = "yes";
    } else {
      var tuitionPaid = "";
    }

    time = Utilities.formatDate(new Date(time), zone, "HH:mm");

    bday = Utilities.formatDate(new Date(birthday), zone, "M/d/y");
    if (birthday == "") {
      bday = ""
    }

    var val = [];

    val.push(lastName + ", " + firstName);
    val.push(partnerName);
    val.push(className);
    val.push(day);
    val.push(time);
    val.push(dayOfWeek);
    val.push(tuitionPaid);
    val.push(materialsPaid);
    val.push(materialsReceived);
    val.push(bday);
    val.push(email);
    val.push(section);

    vals.push(val);

    if (i >= 10) {break;}
  }
  return vals;
}

function drawBorders(courses, sheet, topRow) {

  var currRow = topRow;

  for (var i = 0; i < courses.length; i++) {
    currRow += courses[i].students.length + courses[i].seatsLeft;
    sheet.getRange(currRow, 1, 1, 20).setBorder(true, false, false, false, false, false);
  }
  //sheet.getRange(1, 1, 1, currRow).setBorder(true, false, false, true, false, false);
}

function makeRoster() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("new-roster");
  sheet.clear();
  var rosterTopRow = 3;

  var vals = getClientVals();
  courses = splitCourses(vals);
  var grid = [];
  for (var i = 0; i < courses.length; i++) {
    grid = grid.concat(gridForCourse(courses[i]));
  }

  var header = [];
  var weights = [];

  header.push("");
  header.push("Student Name");
  header.push("Partner name");
  header.push("Tuition Paid");
  header.push("Materials Paid");
  header.push("Materials Received");
  header.push("birthday");
  header.push("email");

  var headerRange = sheet.getRange(rosterTopRow-1, 2, 1, header.length);
  headerRange.setValues([header]);
  headerRange.setBorder(false, false, true, false, false, false);

  var writeRange = sheet.getRange(rosterTopRow, 1, grid.length, grid[0].length);
  writeRange.setValues(grid);

  drawBorders(courses, sheet, rosterTopRow);
}

function seatCounter() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sectionRange = ss.getRangeByName("sections");
  var seatsLeftRow = 9;
  var seatsLeft = new Object();
  for (var i = 1; i <= sectionRange.getNumRows(); i++) {
    var sectionName = sectionRange.getCell(i, 2).getValue() + " " + sectionRange.getCell(i, 3).getValue();
    var seatCount = sectionRange.getCell(i, seatsLeftRow).getValue();
    seatsLeft[sectionName] = parseInt(seatCount);
  }
  return seatsLeft;
}

function rosterSort(a, b) {
  dayComp = a[5] - b[5];
  if (dayComp != 0) {return dayComp;}
  return a[4] - b[4];
}

function courseCreator() {
  var numSeats = seatCounter();
  return function(val) {
    var course = new Object();
    course.students = [];
    course.name = courseName(val);
    course.desc = courseDesc(val);
    course.seatsLeft = numSeats[course.name];
    return course;
  }
}

function courseDesc(val) {
  return val[2] + "\n" + val[3] + "\n" + val[4];
}

function courseName(val) {
  return val[2] + " " + val[11];
}

function splitCourses(vals) {
  vals.sort(rosterSort);
  var creator = courseCreator();
  var courses = [];
  var course;

  var prevCourse = "";
  var currCourse = "";
  for (var i = 0; i < vals.length; i++) {
    currCourse = courseName(vals[i]);
    if (currCourse != prevCourse || (i == vals.length-1)) {
      course = creator(vals[i]);
      courses.push(course);
      prevCourse = currCourse;
    }
    course.students.push(studentFor(vals[i]));
  }
  return courses
}

function gridForCourse(course) {
  var grid = [];
  for (var i = 0; i < course.students.length; i++) {
    var s = course.students[i];
    var row = [];

    row.push("");
    row.push(i + 1);
    row.push(s.name);
    row.push(s.partner);
    row.push(s.tuitionPaid);
    row.push(s.materialsPaid);
    row.push(s.materialsReceived);
    row.push(s.bday);
    row.push(s.email);

    grid.push(row);
  }

  for (var i = 0; i < course.seatsLeft; i++) {
    var blankRow = ["", "", "", "", "", "", "", "", ""];
    blankRow[1] = i + 1 + course.students.length;
    grid.push(blankRow);
  }

  grid[0][0] = course.desc;
  return grid;
}

function studentFor(val) {
  var student = new Object();
  student.name = val[0];
  student.partner = val[1];
  student.tuitionPaid = val[6];
  student.materialsPaid = val[7];
  student.materialsReceived = val[8];
  student.bday = val[9];
  student.email = val[10];
  return student;
}
