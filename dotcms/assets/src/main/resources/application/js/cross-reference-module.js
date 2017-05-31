/**
 * Created by KVijay on 28-11-2016.
 * Version:        1.1
 * Description:    Controller code for the Contact Us page.
 */
const $ = require('jquery');
const select2 = require('select2-browserify');
const LoadingSpinner = require('./loading-spinner.js');

var selectedBrand ='';
var selectedCompetitor ='';
var existingparts = '';
var partnotxt ='';
var byPartText ='';


if($('#crossReferenceContainer').length ){
 // crossReferenceController();

    $('#competitors').select2();
    $('#parts').select2();
    $('#belbrand').select2();
    $('#btnCompetitorSearch').on('click', validatebyCompetitors);
    $('#btnCompetitorSearch-byparts').on('click', validatebyParts);

  $("#byparts-tab").click(function(){
    $("#error-tab-2").hide();
  });

    $("#belbrand").change(function(){
      $('#s2id_competitors .select2-chosen').html("Select Competitor");
      var selectedBrand = $("#competitors").find("option:selected").text();
      var selectedBvalue = $("#competitors").val();
      $('#competitorName').val(selectedBrand);
      //alert("Selected Text: " + selectedText);
      $("#competitors").find('option:not(:first)').remove();
      getCompititor();

    });

    $("#parts").change(function(){
      $("#cross-reference").hide();
      $("#alldata").html("");
      $("#alldata").remove(tblHtml);
      $("#cross-reference").hide();

      });
    $("#competitors").change(function(){
      clearTable();
      $("#cross-reference").hide();
      $("#parts").find('option:not(:first)').remove();
      $('#s2id_parts .select2-chosen').html("Select a part");
      var selectedText = $("#competitors").find("option:selected").text();var selectedText = $("#competitors").find("option:selected").text();
      var selectedValue = $("#competitors").val();
      $('#competitorValue').val(selectedText);
      getParts();

    });

    function validatebyCompetitors(e) {
      var comps, partnos;
      comps = $('#competitors').val();
      partnos = $('#parts').val();
      //var partnos = $("#parts").find("option:selected").text();
      if (!comps || !partnos) {
        $("#error-tab-1").show();
        $("#error-tab-1").html("<b>ERROR:</b> Please select your choice.");
        $("#cross-reference").hide();
      }else{
        $("#error-tab-1").hide();
        //crossRefData();
        getcrossRefParts();
      }

    }
    function validatebyParts(e) {
      var partnum = $('#bypartno').val();
      if (!partnum) {
        $("#error-tab-2").show();
        $("#error-tab-2").html("<b>ERROR:</b> Please enter a partnumber.");
      }else{
        $("#error-tab-2").hide();
        crossRefDataByParts();
      }

    }
    //Get Compititors for selected Brand
    function getCompititor(e){
      var selectedBrand = $("#belbrand").val();
      //alert(compValue);
      LoadingSpinner.show();
      $.ajax({
        type: 'GET',
        data: 'crossrefCompUri=' + selectedBrand,
        url: '/cross-reference/cross-reference-compititors',
        dataType: 'json',
        success: function (data) {
          compititorList(data)
        }
      });
      // document.querySelector;
    }
   //Fill competitor Dropdown values
    function compititorList(data) {
      if (typeof(data["compititorname"]) !== "undefined" && data["compititorname"].length > 0) {
        LoadingSpinner.hide();
        $("#error-tab-1").hide();
        var obj = JSON.parse(JSON.stringify(data));
        for (var i = 0; i < obj.compititorname.length; i++) {
          var compititorName = obj.compititorname[i].name;
          var compititorKey = obj.compititorname[i].key;
          //alert(compititorKey);
         $("#competitors").append('<option value="' + compititorKey + '">' + compititorName + '</option>');
        }
      } else {
        LoadingSpinner.hide();
        $("#cross-reference").hide();
        $("#error-tab-1").show();
        $("#error-tab-1").html("<b>ERROR:</b> No compititor's found.");
      }
    }


      //Get parts for Competitors
    function getParts(e){
      selectedCompetitor = $("#competitors").find("option:selected").text();
      LoadingSpinner.show();
      $.ajax({
        type: 'GET',
        data: 'crossrefCompUri=' + selectedCompetitor,
        url: '/cross-reference/competitors-parts-response',
        dataType: 'json',
        success: function (data) {
          crossList(data)
        }
      });
      // document.querySelector;
    }

    function crossList(data){
      if (typeof(data["competitors"]) !== "undefined" && data["competitors"].length > 0) {
        LoadingSpinner.hide();
        $("#error-tab-1").hide();
        var obj = JSON.parse(JSON.stringify(data));
        for(var i=0; i<obj.competitors.length; i++)
          {
            var addparts = obj.competitors[i].partnumber;
            $("#parts").append('<option value="'+ addparts +'">'+ addparts +'</option>');
          }
      }else{
        LoadingSpinner.hide();
        $("#cross-reference").hide();
        $("#error-tab-1").show();
        $("#error-tab-1").html("<b>ERROR:</b> No compititor's part available.");
        }
    }

    function getcrossRefParts(e){
      var partnum = $('#bypartno').val();
      if (!partnum) {
        $("#error-tab-2").show();
        $("#error-tab-2").html("<b>ERROR:</b> Please enter a partnumber.");
      }else{
        $("#error-tab-2").hide();
        crossRefDataByParts();
      }


     partnotxt = $("#parts").find("option:selected").text();

      LoadingSpinner.show();
      $.ajax({
        type: 'GET',
        data: 'crossrefPartnoUri=' + partnotxt,
        url: '/cross-reference/cross-reference-existing-response',
        dataType: 'json',
        success: function (data) {
          getExistingparts(data)
          //crossRefData();
        }
      });
    }

    function getExistingparts(data){
      if (typeof(data["existingparts"]) !== "undefined" && data["existingparts"].length > 0) {
        LoadingSpinner.hide();
        $("#error-tab-1").hide();
        var obj = JSON.parse(JSON.stringify(data));
        //alert(obj.existingparts.length);
        for(var i=0; i<obj.existingparts.length; i++)
        {
          var existingPart = obj.existingparts[i].existingpartno;
          existingparts = existingPart;
          crossRefData();

        }
      }else{
        LoadingSpinner.hide();
        $("#cross-reference").hide();
        $("#error-tab-1").show();
        $("#error-tab-1").html("<b>ERROR:</b> No cross reference part(s) found.");
      }
    }

    //Display cross reference data for Competitors by search-by-competitors
    function crossRefData(){
      $("#alldata").html("");
      var competitorText = $("#competitors").find("option:selected").text();
      LoadingSpinner.show();
      $.ajax({
        type: 'GET',
        data: 'crossrefUri=' + existingparts,
        url: '/cross-reference/get-cross-reference-response',
        dataType: 'json',
        success: function (data) {
          getCrossReference(data)
        }
      });
      // document.querySelector;
    }

  function getCrossReference(data){
    //alert("in final output");
      if (typeof(data["partgroups"]) !== "undefined" && data["partgroups"].length > 0) {
        LoadingSpinner.hide();
        $("#cross-reference").show();
        var obj = JSON.parse(JSON.stringify(data));
        var tblHTML = '';
        for (var i = 0; i < obj.partgroups.length; i++) {
          var partno = obj.partgroups[i].partnumber;
          var partdes = obj.partgroups[i].description;
          var certification = obj.partgroups[i].certifications;
          if(certification = "null"){
            certification = "";
          }else{
            certification =  "Certification: " + certification ;
          }
          tblHTML +=
            '<tr><td align="center"><span class="color-navy">' + partnotxt + "</span></br>" + selectedCompetitor +
            '</td><td align="left">' + "Part Number:&nbsp;<a class='color-blue' target='_blank' href='/product/part-details?partn=" + partno + "'>" + partno + "</a>" +
            '</br>' + partdes +
            '</br>' + certification +
            '</td><td>' + "<a target='_blank' href='/home/stock-check?search_select=EQUALS&amp;partNum1=" + partno + "' class='btn btn-green'>Stock Check</a>"
            + "&nbsp;&nbsp;<a class='btn btn-blue' target='_blank' href='/product/part-details?partn=" + partno + "'>Part Detail</a>" +
            '</td></tr>';
        }
          $("#alldata").append(tblHTML);
      } else {
        $("#cross-reference").hide();
        LoadingSpinner.hide();
        $("#error-tab-1").show();$("#error-tab-1").show();
        $("#error-tab-1").html("<b>ERROR:</b> No cross reference part(s) found.");
      }
  }

    function clearTable(){
      //$("#alldata tr").html("");
      //$("#alldata").html("");
      //$("#cross-ref-result").html("");
      $("#cross-ref-result-byparts").html("");

    }

    //Display cross reference data for Competitors search-by-partnumbers
    function crossRefDataByParts() {
      $("#all-data").html("");
      byPartText = $("#bypartno").val();
      var byNameText = '';
      $('.cross-ref-checkbox:checked').each(function(){
        var values = $(this).val();
        byNameText += values;
      });
      LoadingSpinner.show();
      $.ajax({
        type: 'GET',
        data: 'crossrefPartno=' + byPartText + "&crossrefName=" + byNameText,
        url: '/cross-reference/get-cross-reference-by-parts',
        dataType: 'json',
        success: function (data) {
          var obj = JSON.parse(JSON.stringify(data));
          getCrossReferenceByParts(data)
        }
      });
    }

    function getCrossReferenceByParts(data) {
      if (typeof(data["bypartresult"]) !== "undefined" && data["bypartresult"].length > 0) {
        LoadingSpinner.hide();
        $("#cross-reference-byparts").show();
        var obj = JSON.parse(JSON.stringify(data));
        var tblHTML = '';
        for (var i = 0; i < obj.bypartresult.length; i++) {

          var compititor = obj.bypartresult[i].comptname;
          var compititorPart = obj.bypartresult[i].comptpart;

          var partno = obj.bypartresult[i].partnumber;
          var partdes = obj.bypartresult[i].description;
          var certification = obj.bypartresult[i].certifications;

          if(certification = "null"){
            certification = "";
          }else{
            certification =  "Certification: " + certification ;
          }
          tblHTML +=
            '<tr><td align="center"><span class="color-navy">' + compititorPart + "</span></br>" + compititor +
            '</td><td align="left">' + "Part Number:&nbsp;<a class='color-blue' target='_blank' href='/product/part-details?partn=" + partno + "'>" + partno + "</a>" +
            '</br>' + partdes +
            '</br>' + certification +
            '</td><td>' + "<a target='_blank' href='/home/stock-check?search_select=EQUALS&amp;partNum1=" + partno + "' class='btn btn-green'>Stock Check</a>"
            + "&nbsp;&nbsp;<a class='btn btn-blue' target='_blank' href='/product/part-details?partn=" + partno + "'>Part Detail</a>" +
            '</td></tr>';

        }
        $("#all-data").append(tblHTML);

      }else{
        LoadingSpinner.hide();
        $("#cross-reference-byparts").hide();
        $("#error-tab-2").show();
        $("#error-tab-2").html("<b>ERROR:</b> No cross reference part(s) found.");
      }
    }


};
