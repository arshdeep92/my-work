/**
 * Created by David Wahiche on 12/5/2016.
 */
// This object and child functions is a place holder to populate the table until the contact-us page design has been completed.
module.exports = {
  "resetTable": function (removeHeaders) {
    var htmlTable = document.getElementById('contactCards');
    var tableRows = htmlTable.getElementsByTagName('tr');
    var rowCount = tableRows.length;

    if (removeHeaders) {
      $("#contactCards tr").remove();
    } else {
      for (var x = rowCount - 1; x > 0; x--) {
        htmlTable.deleteRow(x);
      }
    }

  },
  "addRow": function (dataName, rowPosition) {
    var htmlTable = document.getElementById('contactCards');
    var rowCount = htmlTable.getElementsByTagName('tr').length;

    rowPosition = (!rowPosition ? rowCount : rowPosition); // Add to the end by default

    var newRow = htmlTable.insertRow(rowPosition);
    var newCellName = newRow.insertCell(0);

    newCellName.innerHTML = dataName;
  }
};
