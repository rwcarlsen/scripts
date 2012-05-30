function makeSlips() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var leftSide = true;
  var leftRowCount = 3;
  var rightRowCount = 3;
  var leftCol = 1;
  var rightCol = 4;
  
  var sheet = ss.getSheetByName("money-slips");
  sheet.clear();
  sheet.getRange("A:A").setHorizontalAlignment("right");
  sheet.getRange("B:B").setHorizontalAlignment("left");
  sheet.getRange("D:D").setHorizontalAlignment("right");
  sheet.getRange("E:E").setHorizontalAlignment("left");
  
  var numFields = 12;
  
  var vals = getClientVals();
  vals.sort(classTimeSort);
  
  for (var i = 1; i <= vals.length; i++) {
    var s = studentFor(vals[i]);
        
    if (Math.abs(s.totalDue) < 1) {
      continue;
    }

    var slips = [];
    
    slips.push(["Name:  ", s.last + ", " + s.first]);
    slips.push(["Partner:  ", s.partner]);
    slips.push(["Class:  ", s.className + " " + s.day + " " + s.classTime]);
    slips.push(["Tuition:  ", "$" + s.tuitionAmt]);
    slips.push(["Materials:  ", "$" + s.materialsAmt]);
    slips.push(["Early-bird Discount:  ", "-$" + s.earlyDiscAmt]);
    slips.push(["Sibling Discount:  ", "-$" + s.sibDiscAmt]);
    slips.push(["Other Discounts:  ", "-$" + s.otherDiscAmt]);
    slips.push(["Full Bill:  ", "$" + s.fullBill]);
    slips.push(["Materials Paid:  ", "$" + s.materialsPaidAmt]);
    slips.push(["Tuition Paid:  ", "$" + s.totalPaidAmt - s.materialsPaidAmt]);
    
    if (s.totalDue < -0.01) {
      slips.push(["Total Credit:  ", "$" + (-1 * s.totalDue)]);
    } else {
      slips.push(["Total Due:  ", "$" + s.totalDue]);
    }
    
    if (leftSide) {
      col = leftCol;
      rowCount = leftRowCount;
    } else {
      col = rightCol;
      rowCount = rightRowCount;
    }
    
    var writeRange = sheet.getRange(rowCount, col, numFields, 2);
    writeRange.setBorder(true, true, true, true, false, false);
    writeRange.setFontSizes([[12,12],[12,12],[12,12],[12,12],[12,12],[12,12],[12,12],[12,12],[12,12],[12,12],[12,12],[16,16]]);
    writeRange.setValues(slips);
    
    totalDueCells = writeRange.offset(numFields - 1, 0, 1, 2);
    totalDueCells.setBorder(true, true, true, true, false, false);
    totalDueCells.setFontWeights([["bold", "normal"]]);
    totalDueCells.setNumberFormats([["*", "$#.00"]]);
    
    rowCount += numFields + 2;
    
    if (leftSide) {
      leftRowCount = rowCount;
    } else {
      rightRowCount = rowCount
    }
    
    leftSide = !leftSide;
    
    if (i > 20) { break; }
  }
}


