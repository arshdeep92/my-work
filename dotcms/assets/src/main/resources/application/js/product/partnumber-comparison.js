
module.exports = (() => {
  'use strict';

  return {
    addPartGroup: addPartGroup
  };

  function addPartGroup(partGroupPanel, partGroup) {
    // Bind Compare button click
    $('.btn-compare', partGroupPanel).click(function(event) {
      event.stopPropagation();
      compareSelectedItems(partGroup);
    });

    $(':input[type="checkbox"].part-number-checkbox', partGroupPanel).change(function(){
      let selectedParts = findAllSelectedPartNumbers(partGroup.partNumbers);
      console.log(selectedParts);
      if (selectedParts.length>1) {
        $('.btn-compare', partGroupPanel).removeClass('hidden');
        $('.part-number-header', partGroupPanel).addClass('hidden');
      } else {
        $('.btn-compare', partGroupPanel).addClass('hidden');
        $('.part-number-header', partGroupPanel).removeClass('hidden');
      }
    });
  }

  function compareSelectedItems(partGroup) {

    var checkedPartNumbers = findAllSelectedPartNumbers(partGroup.partNumbers);

    if (checkedPartNumbers.length > 1) {
      $("#partNumberCount").html(checkedPartNumbers.length);
      $("#productSeriesName").html(partGroup.partGroupName);
      $("#compareTable").html(JSON.stringify(partGroupsAndNumbers));

      $('#comparePartNumbersModal').modal('show');
      //$('.modal-backdrop').appendTo('main');

      resetTable(true, $('#tblCompareProducts'));
      populateTableHeaders($('#tblCompareProducts'), partGroup);
      populateCompareTable($('#tblCompareProducts'), partGroup);
    } else {
      console.log("Please select 2 or more part numbers to compare.");
    }

    // console.log(checkedPartNumbers);

  }

  function findAllSelectedPartNumbers(partNumbers) {
    var tmpPartNumbers = [];

    for (var partNumber in partNumbers) {
      if (partNumbers[partNumber].checkboxState === true) {
        tmpPartNumbers.push(partNumbers[partNumber]);
      }
    }

    return tmpPartNumbers;

  }

  function populateTableHeaders(objTable, partNumbersObject) {

    var tableHeaderColumns = objTable.find("thead");
    var tableHeaderRows =  objTable.find("tr:has(th)");

    if (tableHeaderColumns.length === 0) {
      tableHeaderColumns = jQuery("<thead></thead>").appendTo(objTable);
    }

    var newHeaders = [];

    newHeaders.push("<th>Part Number</th>");

    for (var specKey in partNumbersObject.specKeys) {
      newHeaders.push("<th>" + partNumbersObject.specKeys[specKey] + "</th>");
    }

    tableHeaderRows.remove();

    tableHeaderColumns.append(newHeaders);

  }

  function resetTable(removeHeaders, objTable) {
      var tableRows = objTable.find('tr');
      var rowCount = tableRows.length;

      if (removeHeaders) {
        objTable.find("tr").remove();
        objTable.find("th").remove();
      } else {
        for (var x = rowCount - 1; x > 0; x--) {
          objTable[0].deleteRow(x);
        }
      }
    }

  function addRow(rowArray, rowPosition, objTable) {
    var rowCount = objTable.find('tr').length;

    rowPosition = (!rowPosition ? rowCount : rowPosition); // Add to the end by default
    var newRow = objTable[0].insertRow(rowPosition);

    for (var i = 0; i < rowArray.length; i++) {
      var newCell = newRow.insertCell(i);
      newCell.innerHTML = rowArray[i];
    }
  }


  function populateCompareTable(objTable, partNumbersObject) {

    var partNumbers = partNumbersObject.partNumbers;

    for (var partNumber in partNumbers) {
      if (partNumbers[partNumber].checkboxState === true) {

        // Only add specs that are listed in the part numbers specs object.
        var tmpSpecs = [];
        for (var specifiedSpec in partNumbersObject.specKeys) {
          tmpSpecs.push(partNumbers[partNumber].specs[partNumbersObject.specKeys[specifiedSpec]]);
        }

        var listedColumns = [];

        listedColumns.push(partNumbers[partNumber].partNumber);
        listedColumns = listedColumns.concat(tmpSpecs);

        addRow(listedColumns, null, objTable);
      }

    }
  }
})();
