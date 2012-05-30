
function makeRoster() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("new-roster");
  sheet.clear();
  var rosterTopRow = 3;

  var vals = getClientVals();
  courses = parseClientsForRoster(vals);
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

  drawRosterBorders(courses, sheet, rosterTopRow);
}

function parseClientsForRoster(vals) {
  vals.sort(classTimeSort);
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

function drawRosterBorders(courses, sheet, topRow) {
  var currRow = topRow;
  for (var i = 0; i < courses.length; i++) {
    currRow += courses[i].students.length + courses[i].seatsLeft;
    sheet.getRange(currRow, 1, 1, 20).setBorder(true, false, false, false, false, false);
  }
}

// creates 2d array of vals that become the roster
function gridForCourse(course) {
  var grid = [];
  for (var i = 0; i < course.students.length; i++) {
    var s = course.students[i];
    var row = [];
    
    var tuitionPaid = "";
    if (s.totalDue < 1) {tuitionPaid = "yes";}
    var materialsPaid = "";
    if (s.materialsPaidAmt >= s.materialsAmt) {materialsPaid = "yes";}

    row.push("");
    row.push(i + 1);
    row.push(s.last + ", " + s.first);
    row.push(s.partner);
    row.push(tuitionPaid);
    row.push(materialsPaid);
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

