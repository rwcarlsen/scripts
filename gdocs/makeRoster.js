function makeRoster() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("new-roster");
  sheet.clear();
  var rosterTopRow = 3;

  var vals = getClientVals();
  courses = parseClients(vals);
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

function getClientVals() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var zone = ss.getSpreadsheetTimeZone();
  var clientRange = ss.getRangeByName("all_clients");
  return clientRange.getValues();
}

function parseClients(vals) {
  vals.sort(rosterSort);
  var creator = courseCreator();
  var courses = [];
  var course;

  var prevCourse = "";
  var currCourse = "";
  for (var i = 0; i < vals.length; i++) {
    if (vals[i][0] + vals[i][1] + vals[i][2] == "") {
      break;
    }
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

function drawBorders(courses, sheet, topRow) {

  var currRow = topRow;

  for (var i = 0; i < courses.length; i++) {
    currRow += courses[i].students.length + courses[i].seatsLeft;
    sheet.getRange(currRow, 1, 1, 20).setBorder(true, false, false, false, false, false);
  }
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

function courseDesc(val) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var zone = ss.getSpreadsheetTimeZone();
  var time = Utilities.formatDate(new Date(val[6]), zone, "h:m");
  return val[3] + "\n" + val[5] + "\n" + time;
}

function courseName(val) {
  return val[3] + " " + val[4];
}

function rosterSort(a, b) {
  var dayOfWeekCol = 27;
  var timeCol = 6;
  var dayComp = a[dayOfWeekCol] - b[dayOfWeekCol];
  if (dayComp != 0) {return dayComp;}
  return a[timeCol] - b[timeCol];
}

function gridForCourse(course) {
  var grid = [];
  for (var i = 0; i < course.students.length; i++) {
    var s = course.students[i];
    var row = [];

    row.push("");
    row.push(i + 1);
    row.push(s.last + ", " + s.first);
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var zone = ss.getSpreadsheetTimeZone();

  var matPaidAmt = val[18];
  if (matPaidAmt == "") {
    matPaidAmt = 0;
  } else {
    matPaidAmt = matPaidAmt;
  }
  var materialsDue = val[12] - matPaidAmt;
  var materialsPaid = "";
  if (Math.abs(materialsDue) < 1) {
    materialsPaid = "yes";
  }

  var totalDue = val[19];
  var tuitionPaid = "";
  if (Math.abs(totalDue - materialsDue) < 1) {
    tuitionPaid = "yes";
  }

  var bday = Utilities.formatDate(new Date(val[22]), zone, "M/d/y");
  if (val[22] == "") {
    bday = ""
  }

  var student = new Object();
  student.last = val[0];
  student.first = val[1];
  student.partner = val[2];

  student.tuitionPaid = tuitionPaid;
  student.materialsPaid = materialsPaid;
  student.materialsReceived = val[21];
  student.bday = bday;

  student.email = val[24];
  return student;
}
