'use strict';

const $ = require('jquery');
const select2 = require('select2-browserify');
const dropdownModule = require('./brand-region-dropdown-module.js');
const contactHelper = require('./contact/contact-helper-module.js')(dropdownModule);
const loadingSpinner = require('./loading-spinner.js');

const urlContactGroupBase = "/home/contact-group-listing?detailed=true&";

function contactUsController(undefined) {

  var checkboxValues = {
    "1": "chkTechnicalHelp",
    "2": "chkHelp",
    "4": "chkSampleRequest",
    "8": "chkOther"
  };
  var latestResults = {};
  var errorMessage = [];
  let contactTable = require('./contact/contact-table.js');

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
      contactHelper.lookupContacts(errorMessage, getContactGroupsList);
    });
    $("#frmContactUs").submit(function (f) {
      if (!formSubmitCheck()) {
        f.preventDefault();
      }
    });
  };

  function getContactGroupsList(lookupRegion, lookupBrand, filtersUsed) {
    loadingSpinner.show();
    var contactGroupIDs = [];
    getContactGroups(lookupRegion, lookupBrand, function (result, status, xhr) {
        loadingSpinner.hide();
        if (result.contactGroups !== undefined) {
          if (result.contactGroups.length > 0) {
            contactGroupIDs = result.contactGroups;
            latestResults = contactGroupIDs;
            updateContactCards(result.contactGroups);
            $('#contactUsResults').show();
            if ($(window).width() < 720) {
              $("#lookupFormContainer").parent().hide();
            }
            $("#lookupButton").hide();
            $('#contactUsMessages').hide();
            contactHelper.createLabelsFromFilters(filtersUsed);
          } else {
            errorMessage[3] = "<b>ERROR:</b> There are no contacts for this <b>Region</b> and <b>Brand</b>.";
            $("#contactUsMessages").addClass("error").show();
            $('#contactUsResults').hide();
            contactHelper.updateErrorMessage(errorMessage);
            console.log("[contactUsController.getContactGroups()]: No contentlets returned: ", result, "Data: '", lookupRegion, ":", lookupBrand, "'  xhr: ", xhr);
          }
        } else {
          errorMessage[4] = "<b>ERROR:</b> There was an error retrieving this contact representative from the server.";
          contactHelper.updateErrorMessage(errorMessage);
          console.log("[contactUsController.getContactGroups()]: Error understanding the JSON object returned: ", result, "Data: '", lookupRegion, ":", lookupBrand, "'  xhr: ", xhr);
        }
      },
      function (xhr, status, error) {
        console.log("[contactUsController.getContactGroups()]: AJAX Error: ", xhr, status, error);
        errorMessage[5] = "<b>ERROR:</b> There was an error retrieving this contact group from the server.";
        contactHelper.updateErrorMessage(errorMessage);
      });
  };

  function getContactGroups(lookupRegion, lookupDistributor, callbackComplete, callbackError) {

    var lookupURL = urlContactGroupBase + "brand=" + lookupDistributor + "&region=" + lookupRegion;

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

  function updateContactCards(contactGroups) {
    contactTable.resetTable(false);
    for (var contactGroup in contactGroups) {
      (function (cg) {
        var displayContacts = contactGroups[cg].displayContacts;
        for (var displayContact in displayContacts) {
          (function (dc) {
            //updated by vijay for removing title,zip etc
            contactTable.addRow([
              '<div class="contact-name">' + displayContacts[dc].title + '</div>' +
              '<div class="contact-address-line1">' + displayContacts[dc].addressLine1 + '</div>' +
              '<div class="contact-address-line2">' + displayContacts[dc].addressLine2 + '</div>' +
              '<div class="contact-address-line3">' + displayContacts[dc].city + ',' + displayContacts[dc].country + displayContact[dc].zip + '</div>' +
              '<div class="contact-phone">t:' + displayContacts[dc].officePhone + '</div>' +
              '<div class="border-dashed">&nbsp;</div>'
            ]);
          })(displayContact);
        }
      })(contactGroup);
    }
  }

  function appendContactingIDField(additionalValue) {
    if ($('#contactingID').val().length > 1) {
      $('#contactingID').val($('#contactingID').val() + "," + additionalValue);
    } else {
      $('#contactingID').val($('#contactingID').val() + additionalValue);
    }
  };

  let validate = {
    "validateName": function (inputName) {
      var nameRegex = /^[a-z ,.'-]+$/i;
      return nameRegex.test(inputName);
    },
    "validatePhoneNumber": function (inputNumber) {
      var phoneRegex = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
      return phoneRegex.test(inputNumber);
    },
    "validateHelp": function (helpCheckboxes) {
      var valid = false;

      for (var i = 0; i < helpCheckboxes.length; i++) {
        if (helpCheckboxes[i].checked) {
          valid = true;
        }
      }

      return valid;
    },
    "validateComments": function (inputComments) {
      if (inputComments.length > 5) {
        return true;
      }
      return false;
    },
    "validateEmail": function (inputEmail) {
      var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegex.test(inputEmail);
    }

  };

  function formSubmitCheck() {

    var contactFormErrorMessage = [];

    if (!validate.validateName($('#firstName').val())) {
      contactFormErrorMessage[0] = "Please enter your first name.";
    }

    if (!validate.validateEmail($('#email').val())) {
      contactFormErrorMessage[3] = "Please enter a valid email.";
    }

    if (!validate.validateHelp($("[name='msgType']"))) {
      contactFormErrorMessage[6] = "Please select at least one option for help.";
    }

    var outputString = "";
    var hasError;

    for (var errorIndex in contactFormErrorMessage) {
      outputString += contactFormErrorMessage[errorIndex] + "<br />\n";
      hasError = true;
    }

    $("#formMsg").html(outputString);

    if (hasError) {
      return false;
    }

    var contactIDs = [];

    // Check the selected groups.
    for (var contactGroupIndex in latestResults) {
      (function (cgi) {
        for (var selectedValue in latestResults[cgi].groupType.selectedValues) {

          if ($("#" + checkboxValues[latestResults[cgi].groupType.selectedValues[selectedValue]]).is(':checked')) {
            contactIDs.push(latestResults[cgi].identifier);
          }
        }
      })(contactGroupIndex);
    }

    // Check for an "Other" group if none found.
    if (contactIDs.length < 1) {
      for (var contactGroupIndex in latestResults) {
        (function (cgi) {
          for (var selectedValue in latestResults[cgi].groupType.selectedValues) {
            console.log("[contactUsController.formSubmitCheck()]: Warning: No contact group found for the selected options. Defaulting to 'Other'."); // This error is sent to console.
            if (latestResults[cgi].groupType.selectedValues[selectedValue] === "8") {
              contactIDs.push(latestResults[cgi].identifier);
            }
          }
        })(contactGroupIndex);
      }
    }

    // Email all contact groups for this region/brand if no "Other" group found.
    if (contactIDs.length < 1) {
      console.log("[formSubmitCheck()]: Warning: No contact group found for the selected options. Adding all known Contact Identifiers."); // This error is sent to console.
      contactFormErrorMessage[7] = "Warning: No contact group found for the selected help options. Will email all contacts in contact group."; // This error will never be shown since the DOM is updated before here and the page will already be changing.
      for (var contactGroupIndex in latestResults) {
        contactIDs.push(latestResults[contactGroupIndex].identifier);
      }
    }

    contactIDs = $.unique(contactIDs);

    for (var contactID in contactIDs) {
      appendContactingIDField(contactIDs[contactID]);
    }


    if ($('#partNumber').val() !== "") {
      $('#extra').val("Part Number: " + $('#partNumber').val() + "<br />\n<br />\n");
    }

    var helpCheckboxes = $("[name='msgType']");

    if (helpCheckboxes.length > 0) {
      $('#extra').val($('#extra').val() + "\n\n The user has requested help with the following issues:\n");
    }

    var checkCounter = 1;

    for (var i = 0; i < helpCheckboxes.length; i++) {
      if (helpCheckboxes[i].checked) {
        $('#selectedCheckboxes').val($('#selectedCheckboxes').val() + checkCounter);
        $('#extra').val($('#extra').val() + $(helpCheckboxes[i]).attr("text") + "\n");
      }
    }

    if (checkCounter === 1) {
      checkCounter++;
    } else {
      checkCounter *= checkCounter;
    }

    if (checkCounter < 1) {
      return false; // User must select at least one checkbox.
    }

    return true;


  };

  if (document.querySelector('.contact-us-template')) {
    init(); // Call init() when we are created.
  }

};
module.exports = contactUsController;
