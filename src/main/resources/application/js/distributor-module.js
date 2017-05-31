'use strict';

const $ = require('jquery');
const select2 = require('select2-browserify');
const dropdownModule = require('./brand-region-dropdown-module.js');
const contactHelper = require('./contact/contact-helper-module.js')(dropdownModule);
const loadingSpinner = require('./loading-spinner.js');
const VueJS = require('vue');

const urlContactDistributorBase = "/home/distributor-list-response?";

var distributorModule = function (undefined) {
  var errorMessage = [];
  let vm;

  function init() {
    dropdownModule.init();
    $('form').trigger('reset');
    $("#reset-form-link").hide();
    $("#contactUsResults").hide();
    $("#reset-form-link").click(function () {
      contactHelper.resetForm();
    });
    $("#editFilters").click(contactHelper.toggleFilters);
    $("#lookupButton").click(function () {
      $('#contactingID').val("");
      contactHelper.lookupContacts(errorMessage, getContactDistributorList);
    });
    $("#frmContactUs").submit(function (f) {
      if (!formSubmitCheck()) {
        f.preventDefault();
      }
    });

    vm = new VueJS({
      el: document.querySelector('#contactUsResults'),
      data: {distributors: []}
    });
  };

  function getContactDistributorList(lookupRegion, lookupBrand, filtersUsed) {
    loadingSpinner.show();
    getContactDistributors(lookupRegion, lookupBrand, function (result, status, xhr) {
        loadingSpinner.hide();
        if (result.distributors != undefined) {
          if (result.distributors.length > 0) {
            updateContactCards(result.distributors);
            $('#contactUsResults').show();
            if ($(window).width() < 720) {
              $("#lookupFormContainer").parent().hide();
            }
            $("#lookupButton").hide();
            $('#contactUsMessages').hide();
            contactHelper.createLabelsFromFilters(filtersUsed);
          } else {
            errorMessage[3] = "<b>ERROR:</b> There are no contacts for this <b>Region</b> and <b>Brand</b>.";
            $("#contactUsMessages").addClass('error').show();
            $('#contactUsResults').hide();
            contactHelper.updateErrorMessage(errorMessage)
            console.log("[contactRepresentativesController.getContactRepresentatives()]: No contentlets returned: ", result, "Data: '", lookupRegion, ":", lookupBrand, "'  xhr: ", xhr);
          }
        } else {
          errorMessage[4] = "<b>ERROR:</b> There was an error retrieving this contact representative from the server.";
          contactHelper.updateErrorMessage(errorMessage)
          console.log("[contactRepresentativesController.getContactRepresentatives()]: Error understanding the JSON object returned: ", result, "Data: '", lookupRegion, ":", lookupBrand, "'  xhr: ", xhr);
        }
      },
      function (xhr, status, error) {
        loadingSpinner.hide();
        console.log("[contactRepresentativesController.getContactRepresentatives()]: AJAX Error: ", xhr, status, error);
        errorMessage[5] = "<b>ERROR:</b> There was an error retrieving this contact representative from the server.";
        contactHelper.updateErrorMessage(errorMessage)
      });
  };

  function getContactDistributors(lookupRegion, lookupDistributor, callbackComplete, callbackError) {

    var lookupURL = urlContactDistributorBase + "brand=" + lookupDistributor + "&region=" + lookupRegion;

    $.getJSON({
      url: lookupURL,
      success: function (result, status, xhr) {

        if (callbackComplete) {
          callbackComplete(result, status, xhr);

        }
      },
      error: function (xhr, status, error) {
        if (callbackError) {
          callbackError(xhr, status, error);
        }
      }
    });
  };

  function updateContactCards(distributors) {

    if (distributors !== undefined && distributors.length > 0) {
      loadingSpinner.hide();
      $('#contactUsResults').show();
      vm.distributors = distributors;
    } else {
      loadingSpinner.hide();
      $("#msg").show();
      $("#msg").html("<b>ERROR:</b> There are no contacts for this <b>Region</b> and <b>Brand</b>.");
      $("#contactUsResults").hide();
    }
  }

  if (document.querySelector('.contact-us-distributors-template')) {
    init(); // Call init() when we are created.
  }
};
module.exports = distributorModule;
