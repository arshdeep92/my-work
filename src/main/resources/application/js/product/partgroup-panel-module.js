var dataTable = require('datatables.net')();

var partNumberCompare = require('./partnumber-comparison.js');

var escapeStringRegexp = require('escape-string-regexp');

module.exports = ((undefined) => {
  "use strict";

  return {
    setupPartGroupPanel: setupPartGroupPanel,
    setFilterHeight: setFilterHeight
  };
//Set Default Sort Options for the Part Numbers Tables on the Product Series Page
  function setupPartGroupPanel(i, partGroupPanel, partGroupsAndNumbers) {
    let partGroup = partGroupsAndNumbers[$(partGroupPanel).data("partGroupId")];
    var table = $('#GroupPart' + (i + 1),partGroupPanel).DataTable({
      "pagingType": "numbers",
      "ordering": true,
      "order": [[ 0, "desc" ], [ 1, 'asc' ]],
      "info": true,
      "dom":'rt<"paging-info"pi><"clear">',
      "language": {
        "lengthMenu": "Display _MENU_ records per page",
        "zeroRecords": "Nothing found - sorry",
        "info": "Displaying <strong>_START_</strong> to <strong>_END_</strong> of <strong>_TOTAL_</strong>",
        "infoEmpty": "No records available",
        "infoFiltered": "(filtered from _MAX_ total records)"
      },
      "lengthMenu": [[10, 25, 50], [10, 25, 50]],
      "drawCallback": function( settings ) {
        var api = this.api();
        $(':checkbox').change(function(obj) {
          updateCheckboxState(obj.target.id, obj.target.checked, partGroup.partNumbers);
        })
      }
    });
    $(this).val(i);

    setupFilterArea(partGroupPanel, table);

    partNumberCompare.addPartGroup(partGroupPanel, partGroup);

  }

  function triggerFilterChanges(filterForm) {

    $.each($(filterForm).find(':input[type!="radio"], :input[type="radio"]:checked'), function() {
      $(this).trigger('change');
    });

  }

  function setupFilterArea(partGroupPanel, table) {

    var filterArea = $('.product-specifications-filters',partGroupPanel);
    table.columns('.specification').every(function() {
      var that = this;

      var headerName = $(this.header()).data('specification-name');
      var filterInput = $('[name="' + headerName + '"]',filterArea);

      // Add event handler to filter the datatable on field changes
      if (filterInput.length > 0) {
        filterInput.on('change', function() {
          if (this.value === "") {
              that.search(this.value).draw();
              return;
          }

          if (headerName === "Application") {
            that.search(this.value).draw();
            return;
          }

          let searchRegex = createRegexWithLiteral(this.value);

          if (that.search() !== searchRegex) {
            that.search(searchRegex, true, false).draw();
          }

        })
      }
    });

    var filterForm = $('form', filterArea);

    // Add clear all functionality
    var clearAllButton = $('[name="clearAll"]', filterArea);
    clearAllButton.click(function(event) {
      event.preventDefault();
      filterForm.find(':radio').removeAttr('checked');
      filterForm.find(":radio[id^='allOptions']").prop("checked", true);
      filterForm.find('select').val('');
      triggerFilterChanges(filterForm);
      return false;
    });
    // Click Events for mobile filters
    $('.icon-filter', partGroupPanel).on('click', function(e){
      if ($('.product-specifications-filters', partGroupPanel).hasClass('slideInRight')) {
        $('.product-specifications-filters', partGroupPanel).removeClass('slideInRight').addClass('slideOutRight');
      } else {
        $('.product-specifications-filters', partGroupPanel).removeClass('slideOutRight').addClass('slideInRight');
      }
    });
    $('.close-icon', partGroupPanel).on('click', function (e) {
      //e.stopPropagation();
      $('.product-specifications-filters', partGroupPanel).removeClass('slideInRight').addClass('slideOutRight');
    });
    setFilterHeight(partGroupPanel);

    triggerFilterChanges(filterForm);
  }

  function createRegexWithLiteral(literal) {
     var inputValue = literal.trim();
    let escapedLiteral = escapeStringRegexp(inputValue);
    return "^\\s*" + escapedLiteral + "\\s*$";
  }

  function setFilterHeight(partGroupPanel) {
    $('.product-specifications-filters', partGroupPanel).css({
      height: $(' > div', partGroupPanel).outerHeight() + 'px'
    });
  }

  function findCheckboxPartNumber (checkboxToFind, partNumbers) {
    for (var partNumber in partNumbers) {
      if (partNumbers[partNumber].checkboxID === checkboxToFind) {
        return partNumber;
      }
    }

    return -1;
  }

  function updateCheckboxState(targetCheckbox, newState, partNumbers) {

    var partNumber = partNumbers[findCheckboxPartNumber(targetCheckbox, partNumbers)];

    if (partNumber == undefined || partNumber == null) {
      console.log("Error selecting item: ", targetCheckbox, " Part Number: ", partNumber);
      return false;
    } else {
      partNumber.checkboxState = newState;
      return true;
    }
  }
})();
