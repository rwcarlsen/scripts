
function getClientVals() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var zone = ss.getSpreadsheetTimeZone();
  var clientRange = ss.getRangeByName("all_clients");
  return clientRange.getValues();
}

function dateString(time, form) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var zone = ss.getSpreadsheetTimeZone();
  return Utilities.formatDate(new Date(time), zone, form);
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

function classTimeSort(a, b) {
  var dayOfWeekCol = 27;
  var timeCol = 6;
  var dayComp = a[dayOfWeekCol] - b[dayOfWeekCol];
  if (dayComp != 0) {return dayComp;}
  return a[timeCol] - b[timeCol];
}

// takes a row from clients sheet and returns a course object for that client's course
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

// maps data from the clients sheet rows into a student object
function studentFor(val) {
  var bday = dateString(val[22], "M/d/y");
  if (val[22] == "") {
    bday = ""
  }

  var earlyDiscAmt = val[13];
  var sibDiscAmt = val[14];
  var otherDiscAmt = val[15];
  var totalPaidAmt = val[17];
  if (sibDiscAmt == "") {sibDiscAmt = 0;}
  if (earlyDiscAmt == "") {earlyDiscAmt = 0;}
  if (otherDiscAmt == "") {otherDiscAmt = 0;}
  if (totalPaidAmt == "") {totalPaidAmt = 0;}
  
  var student = new Object();
  student.first = val[0];
  student.last = val[1];
  student.partner = val[2];
  student.className = val[3];
  student.section = val[4];
  student.day = val[5];
  student.classTime = dateString(val[6], "h:m");
  student.materialsReceived = val[21];
  student.bday = bday;
  student.email = val[24];
  
  student.materialsAmt = val[12];
  student.tuitionAmt = val[11];
  
  student.earlyDiscAmt = earlyDiscAmt;
  student.sibDiscAmt = sibDiscAmt;
  student.otherDiscAmt = otherDiscAmt;
  
  student.fullBill = val[16];
  student.totalPaidAmt = totalPaidAmt;
  student.materialsPaidAmt = val[18];
  student.totalDue = val[19];
  
  return student;
}


