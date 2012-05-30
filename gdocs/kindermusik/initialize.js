function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = []
  menuEntries.push({name: "Build Roster", functionName: "makeRoster"});
  menuEntries.push({name: "Generate Money Slips", functionName: "makeSlips"});
  ss.addMenu("Reports", menuEntries);
}
