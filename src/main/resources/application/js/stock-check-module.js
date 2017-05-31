/*
 *    Created by fguanlao
 */
const LoadingSpinner = require('./loading-spinner.js');
const dropdownModule = require('./brand-region-dropdown-module.js');

var stockCheckModule = function() {
  'use strict';
  $('#search').on('click', validateParts);

  if (document.querySelector('#checkStockForm')){
    $('#brands').select2({placeholder: "--Select or Type--"});
    $('.part-div').each(function (i) {
      var newID = 'results' + (i+1);
      $(this).attr('id', newID);
      $(this).val(i);
    });
    $('#reset').on('click', resetFields);
    if(document.querySelector('#result-link1')) {
      document.querySelector('#result-link1').addEventListener('click', function () {
        displayResults("result1");
      });
    }
    if(document.querySelector('#result-link2')) {
      document.querySelector('#result-link2').addEventListener('click', function () {
        displayResults("result2");
      });
    }
    if(document.querySelector('#result-link3')) {
      document.querySelector('#result-link3').addEventListener('click', function () {
        displayResults("result3");
      });
    }
    $('.distributorButton').on('click', displayDistributorInfo);
  }

  function displayResults(tableId){
    LoadingSpinner.show();
    var i, part_results, result_links;
    part_results = document.getElementsByClassName("part-div");
    result_links = document.getElementsByClassName("result-links");
    for (i = 0; i < part_results.length; i++) {
      if(tableId === ("result" + (i + 1))) {
        part_results[i].className = part_results[i].className.replace(" hidden", "");
        result_links[i].className += " active";
      }else {
        if(part_results[i].className.indexOf(" hidden") === -1) {
          part_results[i].className += " hidden";
        }
        result_links[i].className = result_links[i].className.replace(" active", "");
      }
    }
    LoadingSpinner.hide();
  };

  function displayDistributorInfo(e){
    e.preventDefault();

    var result = document.getElementById("stockCheckResult");
    var distributorResult = document.getElementById("distributorResult");

    if(result.className.indexOf(" hidden") === -1) {
      result.className += " hidden";
    }

    LoadingSpinner.show();
    $.ajax({
      type: 'GET',
      data: "distUri=" + e.target.value,
      url: '/home/stock-check-distributor',
      dataType: 'html',
      success: function(data){
        $('#distributorTable').html(data);
        LoadingSpinner.hide();
      }
    });

    distributorResult.className = distributorResult.className.replace("hidden","");
    document.querySelector("#distributorBack").addEventListener('click', displayPartTable);
  }

  function resetFields(){
    $("#AMERICAS").prop("checked", true);
    $("#BEGINS").prop("checked", true);
    $('#partNumSearch1').val("");
    $('#partNumSearch2').val("");
    $('#partNumSearch3').val("");
    dropdownModule.reset();
  }

  function displayPartTable(){
    var result = document.getElementById("stockCheckResult");
    var distributorResult = document.getElementById("distributorResult");
    if(distributorResult.className.indexOf("hidden") === -1) {
      distributorResult.className += "hidden";
    }
    result.className = result.className.replace("hidden","")
    $('#distributorTable').empty();
  }
  function validateParts() {
    var pn1 = document.forms["checkStockForm"]["partNum1"].value;
    var pn2 = document.forms["checkStockForm"]["partNum2"].value;
    var pn3 = document.forms["checkStockForm"]["partNum3"].value;
    if (!pn1 && !pn2 && !pn3){
      $('.error-msg').show();
      return false;
    }else{
      return true;
    }

  }
};
module.exports = stockCheckModule;
