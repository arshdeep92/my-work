//Created by KVijay on 27-04-2017.
//Assembly instructions JS

'use strict';
const $ = require('jquery');
const loadingSpinner = require('./loading-spinner.js');
const urlAsmblyInstBase = "get-assembly-inst-response?";
const VueJS = require('vue');

if ($('.assembly-inst-container').length) {
     assemblyInstructionController();
}

function assemblyInstructionController() {

  var allpartnumbers = [];
  var allAsmbInst = [];

  let vm;
  var asmblyInstr;
  var searchbytxt = '';
  var searchtxt ='';
  var partn = '';

  $('#asmblySearch').focusin(function () {
    if ($(this).val() == '') {
      $('#btnasmblySearch').attr('disabled','disabled');
    } else {
      $('#btnasmblySearch').removeAttr('disabled');
    }
  });

  $('#btnasmblySearch').attr('disabled','disabled');
  $('#asmblySearch').keyup(function() {
    if ($(this).val() == '') {
      $('#btnasmblySearch').attr('disabled','disabled');
    } else {
    $('#btnasmblySearch').removeAttr('disabled');
  }
  });

  $("#bypartasmbly").click(function () {

    $('#asmblySearch').attr("placeholder", "Part Number");
    $('#asmblySearch').val('');
    $('#btnasmblySearch').attr('disabled','disabled');
    $('#error-msg').html('');

    $('#asmblySearch').typeahead('destroy');
    $.get("get-assembly-inst-response?bypartnotxtauto=", function(data){
      $.each(data.autofillparts, function (){
        allpartnumbers.push(this.partno);
      });
    },'json');
    $('#asmblySearch').typeahead({
      source: allpartnumbers,
      limit: 20
    });

  });
  $("#byasmbly").click(function () {
    $('#asmblySearch').attr("placeholder", "Assembly Instruction");
    $('#asmblySearch').val('');
    $('#btnasmblySearch').attr('disabled','disabled');
    $('#error-msg').html('');

    $('#asmblySearch').typeahead('destroy');
    $.get("get-assembly-inst-response?byasmblyname=", function(data){
      $.each(data.asmblyresult, function (){
        allAsmbInst.push(this.filename);
      });
    },'json');

    $('#asmblySearch').typeahead({
      source: allAsmbInst,
      limit: 20
    });

  });
    $("#btnasmblySearch").click(function () {
      $("#asmblySearch").val(($("#asmblySearch").val()).toUpperCase());
      searchtxt = $('#asmblySearch').val();
      searchbytxt = $('.assembly-radio:checked').val();
      if (searchbytxt == "bypartnotxt") {
        searchtxt.trim();
        searchbytxt =  searchbytxt + "=" + searchtxt;
        $('#asm-part-hed').show();
      } else {
        searchbytxt =  searchbytxt + "=" + searchtxt;
      }
      if (!$('.assembly-radio:checked').val()) {
        $("#error-msg").html("<b>ERROR:</b> Please choose Part Number or Assembly Instructions first.");
        return false;
      }else{
        getAssemblyInstructions(asmblyInstr);
      }
    });
  vm = new VueJS({
    el: document.querySelector('#asmblyInstResults'),
    data: {asmblydata: []}
  });

  $(document).keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
      $('#btnasmblySearch').click();
    }
  });

  function getAssemblyInstructions(asmblyInstr) {
    //var partn = '';
    var assemblyfile = '';
    loadingSpinner.show();
    getAssemblyInstData(asmblyInstr, function (result, status, xhr) {
        loadingSpinner.hide();
        if (result.asmblyresult !== undefined) {
          if (result.asmblyresult.length > 0) {
            // alert(JSON.stringify(result));
           //alert("length2 : "+result.asmblyresult.length);
            for (var i = 0; i < result.asmblyresult.length; i++) {
              partn = result.asmblyresult[i].partno;
              assemblyfile = result.asmblyresult[i].filename;
            }
            if(partn === null || assemblyfile === null){
              loadingSpinner.hide();
              $("#error-msg").html("<b>ERROR:</b> No assembly instructions found for your search.");
              return false;
            }else{
             $('#asmblyInstResults').show();
             $('#error-msg').html('');
              updateAsmblyresult(result.asmblyresult);
          }
          } else {
            loadingSpinner.hide();
            $("#error-msg").html("<b>ERROR:</b> No assembly instructions found for your search.");
            $("#error-msg").addClass("error").show();
            $('#asmblyInstResults').hide();
            console.log("[assemblyInstructionController.getAssemblyInstData()]: No contentlets returned: ", result, "Data: '", lookupRegion, ":", lookupBrand, "'  xhr: ", xhr);
          }
        } else {
          loadingSpinner.hide();
          $("#error-msg").html("<b>ERROR:</b>There was an error retrieving data from the server.");
          contactHelper.updateErrorMessage(errorMessage);
          console.log("[assemblyInstructionController.getAssemblyInstData()]: Error understanding the JSON object returned: ", result, "Data: '", lookupRegion, ":", lookupBrand, "'  xhr: ", xhr);
        }
      },
      function (xhr, status, error) {
        loadingSpinner.hide();
        $('#asmblyInstResults').hide();
        console.log("[assemblyInstructionController.getAssemblyInstData()]: AJAX Error: ", xhr, status, error);
        $("#error-msg").html("<b>ERROR:</b> No assembly instructions found for your search.");
      });
  };


  function getAssemblyInstData(asmblyInstr, callbackComplete, callbackError) {
    var lookupURL = urlAsmblyInstBase + searchbytxt;
    $.getJSON({
      url: lookupURL,
      success: function (result, status, xhr) {
        //alert(JSON.stringify(result));
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

  function updateAsmblyresult(instdata) {
    if (instdata !== undefined && instdata.length > 0) {
      loadingSpinner.hide();
      vm.asmblydata = instdata;
    } else {
      loadingSpinner.hide();
      $("#error-msg").show();
      $("#error-msg").html("<b>ERROR:</b> No assembly instructions found for your search.");
      $("#asmblyInstResults").hide();
    }
  }

};
module.exports = assemblyInstructionController;
