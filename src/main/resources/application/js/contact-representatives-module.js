'use strict';

const $ = require('jquery');
const select2 = require('select2-browserify');
const dropdownModule = require('./brand-region-dropdown-module.js');
const contactHelper = require('./contact/contact-helper-module.js')(dropdownModule);
const loadingSpinner = require('./loading-spinner.js');

const urlContactRepresentativesBase = "/home/get-contact-representatives?";

function contactRepresentativesController(undefined) {
  var errorMessage = [];
  let contactTable = require('./contact/contact-table');

  function init() {
    dropdownModule.init();
    $('form').trigger('reset');
    $("#reset-form-link").hide();
    $("#contactUsResults").hide();
    $("#reset-form-link").click(function () {
      contactHelper.resetForm();
      contactTable.resetTable(true);
    });
    $("#editFilters").click(contactHelper.toggleFilters);
    $("#lookupButton").click(function () {
      $('#contactingID').val("");
      contactHelper.lookupContacts(errorMessage, getContactRepresentativesList);
    });
  };

  function getContactRepresentativesList(lookupRegion, lookupBrand, filtersUsed) {
    loadingSpinner.show();
    getContactRepresentatives(lookupRegion, lookupBrand, function (result, status, xhr) {
        loadingSpinner.hide();
        if (result.representatives !== undefined) {
          if (result.representatives.length > 0) {
            updateContactCards(result.representatives);
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

  function getContactRepresentatives(lookupRegion, lookupDistributor, callbackComplete, callbackError) {

    var lookupURL = urlContactRepresentativesBase + "brand=" + lookupDistributor + "&region=" + lookupRegion;

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

  function updateContactCards(representatives) {
    $("#contactUsMessages").hide();
    $("#contactCards").show();
    contactTable.resetTable(true);

    var displayContacts = representatives;
    for (var representative in representatives) {
      (function (cr) {
        var contactToDisplay = representatives[cr];
        contactTable.addRow([
          '<div class="col-xs-4 col-sm-4 col-cards">' +
          '<div class="contact-name">' + contactToDisplay.name + '</div>' +
          '<div class="contact-title">' + contactToDisplay.title + '</div>' +
          '<div>t: +' + contactToDisplay.officePhone + '</div>' +
          '<div>e: ' + contactToDisplay.emailAddress + '</div>' +
          '</div>' +
          '<div class="col-xs-4 col-sm-4 col-cards">' +
          '<div class="contact-address-line1">' + contactToDisplay.addressLine1 + '</div>' +
          '<div class="contact-address-line2">' + contactToDisplay.addressLine2 + '</div>' +
          '<div class="contact-address-line3">' + contactToDisplay.city + ', ' + contactToDisplay.state + ' ' + contactToDisplay.zip + '</div>' +
          '<div class="contact-country">' + contactToDisplay.country + '</div>' +
          '</div>'
        ]);
      })(representative);

    }
  };

  if (document.querySelector('.contact-representatives-template')) {
    init(); // Call init() when we are created.
  }

};
module.exports = contactRepresentativesController;
