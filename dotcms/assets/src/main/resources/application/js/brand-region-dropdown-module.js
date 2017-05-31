'use strict';
const select2 = require('select2-browserify');
const $ = require('jquery');

module.exports = (() => {
  "use strict";

  return {
    init: init,
    validate: validateDropDown,
    error: updateErrorMessage,
    reset: resetDropdown
  };

  function init() {
    $('#brands').select2({placeholder: "--Select or Type--"});
    $('#subbrands').select2({placeholder: "--Select or Type--"});
    $('#regions').select2({placeholder: "--Select or Type--"});

    // Change Events
    $('#brands').change(changeBrands);
    $("#subbrands").change(changeSubBrands);
    $("#regions").change(changeRegions);

    // Click events
    $("#resetFields").click(resetDropdown);

    if ($(window).width() < 720) {
      $('#brands').select2('destroy');
      $('#subbrands').select2('destroy');
      $('#regions').select2('destroy');
    }
  }

  function resetDropdown() {
    if($('#brands')) {
      $('#brands').select2("val", "");
    }
    if($('#regions')) {
      $('#regions').select2("val", "");
    }
    if($('#subbrands')) {
      $('#subbrands').select2("val", "");
    }
    if ($(window).width() < 720) {
      $('form').trigger('reset');
    }
    $('#contactUsMessages').html("");
    $("#subbrandbg").hide();
  }

  function changeRegions() {
    $("#brandbg").removeClass("highlight");
    $("#stext1").value = "y";
    $("#contactUsMessages").html("");
  }

  function changeBrands() {
    $('#subbrands').prop('selectedIndex', 0);
    $('#subbrands').select2("val", "");
    var brandValue = $('#brands option:selected').val();
    if (brandValue === "Cinch Connectivity" || brandValue === "cinchConnectivity") {
      $('.cinchbrand').css("display", "inline-block");
    } else {
      $('.cinchbrand').hide();
    }

    $("#groupbg").removeClass("highlight");
    $("#stext2").value = "y";
    $("#contactUsMessages").html("");
  }

  function changeSubBrands() {
    var subbrandValue = $("#subbrands option:selected").val();

    if (subbrandValue !== '') {
      $("#resetFields").css("display", "block");
    }

    $("#subbrandbg").removeClass("highlight");
    $("#stext3").value = "y";
    $("#resetFields").css("display", "");
    $("#contactUsMessages").html("");
  }

  function getSalesReps() {

  }

  function validateDropDown(){
    var brand, region, subBrand;
    var errorList = [];
    brand = $('#brands').val();
    region = $('#regions').val();
    subBrand = $('#subbrands').val();

    if (brand === "cinchConnectivity") {
      if (subBrand === "") {
        errorList.push("Please select a Sub-Brand");
      }
    }
    if (region === "") {
      errorList.push("Please select a Region");
    }
    if (brand === "") {
      errorList.push("Please select a Brand");
    }

    return errorList;
  }

  function getSalesRep() {

  }

  function lookupSalesReps(lookupRegion, zipcode, lookupBrand, lookupSubBrand) {

  }

  function updateErrorMessage(errorMessages) {
    $("#contactUsMessages").html("");
    for(var i = 0; i < errorMessages.length;i++) {
      $("#contactUsMessages").append(errorMessages[i] + ". ");
    }
  }
})();
