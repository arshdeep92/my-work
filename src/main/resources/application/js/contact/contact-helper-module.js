/**
 * Created by David Wahiche on 12/1/2016.
 */

const $ = require('jquery');

function contactHelper(dropdownModule) {

  function resetForm() {
    dropdownModule.reset();
    $('form').trigger('reset');
    $('#contactUsMessages').removeClass('error').show().html("<strong>Your Region</strong> and <strong>Bel Group</strong> are required fields.");
    $('#contactUsResults').hide();
    $("#lookupButton").show();
    $("#reset-form-link").hide();
  }

  function toggleFilters() {
    $("#lookupFormContainer").parent().show();
    $("#lookupButton").show();
    $("#contactUsMessages").removeClass('error');
    $("#contactUsResults").hide();
    $("#filterLabelsContainer").hide();
  }

  function createLabelsFromFilters(filtersUsed) {
    // Section to handle filters changing into labels on mobile.
    var filterLabelsContainer = $("#filterLabelsContainer"),
      filterLabels = $("#filterLabels"),
      editFilters = $("#editFilters");

    //show filter labels
    if ($(window).width() < 720) {
      filterLabelsContainer.attr('style',
        "display: -js-display: flex; " +
        "display: -webkit-box; " +
        "display: -moz-box; " +
        "display: -ms-flexbox; " +
        "display: -webkit-flex;  " +
        "display: flex;"
      )
    }

    //reset values of select options after editing
    if (filterLabels.children().length > 0) {
      filterLabels.children().remove();
    }

    $.each(filtersUsed, function (index, element) {
      filterLabels.append($("<span/>").addClass("label label-default btn btn-bf-hollow-blue").text(element));
    })
  }

  function updateErrorMessage(errorMessage) {
    var outputString = "";
    for (var errorIndex in errorMessage) {
      outputString += errorMessage[errorIndex] + "<br />\n";
    }
    $("#contactUsMessages").show();
    $("#contactUsMessages").html(outputString);
  }

  function lookupContacts(errorMessage, lookupFunction) {
    errorMessage.length = 0;

    var lookupBrand = $("#brands").val();
    var lookupRegion = $("#regions").val();
    var lookupSubBrand = "";
    var restCallBrand;
    let filtersUsed = [];

    if (!lookupBrand || !lookupRegion) {
      errorMessage[1] = "<b>ERROR:</b> Please select <b>Your Country</b> and <b>Bel Group</b>.";
      $("#contactUsMessages").addClass('error').show().html(errorMessage[1]);
    } else {
      restCallBrand = lookupBrand;
      filtersUsed.push($("#regions option:selected").text());
      filtersUsed.push($("#brands option:selected").text());
    }

    if (lookupBrand === "Cinch Connectivity" || lookupBrand === "cinchConnectivity") {
      lookupSubBrand = $("#subbrands").val();
      if (lookupSubBrand === "" || lookupSubBrand === null) {
        $("#contactUsMessages").addClass('error');
        errorMessage[0] = "Please select a subbrand.";
      } else {
        restCallBrand = lookupSubBrand;
        filtersUsed.push($("#subbrands option:selected").text());
      }
    }

    updateErrorMessage(errorMessage);

    if (errorMessage[0] || errorMessage[1] || errorMessage[2] || errorMessage[3]) {
      return;
    }

    document.getElementById('regions').onchange = function () {
      $("#lookupButton").show();
      $("#contactUsMessages").html("");
      $("#contactUsResults").hide();

    };
    document.getElementById('brands').onchange = function () {
      $("#lookupButton").show();
      $("#contactUsMessages").html("");
      $("#contactUsResults").hide();
    };
    document.getElementById('subbrands').onchange = function () {
      $("#lookupButton").show();
      $("#contactUsMessages").html("");
      $("#contactUsResults").hide();
    };

    // dotCMS doesn't seem to like spaces in the search fields.
    lookupRegion = lookupRegion.split(' ').join('');
    restCallBrand = restCallBrand.split(' ').join('');
    $("#reset-form-link").show();
    $('#contactUsResults').show();
    $("#contactUsMessages").hide();

    lookupFunction(lookupRegion, restCallBrand, filtersUsed);
  };
  return {
    resetForm: resetForm,
    toggleFilters: toggleFilters,
    createLabelsFromFilters: createLabelsFromFilters,
    updateErrorMessage: updateErrorMessage,
    lookupContacts: lookupContacts
  }

};

module.exports = contactHelper;
