module.exports = (() => {
    "use strict";

//Place Javascript code here

$(document).ready(function(){
// use jquery masonry
	var $container = $('#items');
    $container.masonry({
        itemSelector:'.box',
        isFitWidth:true,
        columnWidth:'.grid-sizer',
        gutter: 10
    });
});
               

$('#myTab a').click(function (e) {
	 e.preventDefault();
	 $(this).tab('show');
});

$(function () {

})

//Gather the information for the search suggestions

var allparts = [];
$.get("/api/content/render/false/type/json/query/+contentType:PartNumber%20+languageId:1%20+deleted:false%20+working:true/orderby/modDate%20desc", function(data){
  $.each(data.contentlets, function (){
      allparts.push(this.partNumber);
  });
},'json');

var allproduceseries = [];
$.get("/api/content/render/false/type/json/query/+contentType:ProductSeries%20+languageId:1%20+deleted:false%20+working:true/orderby/modDate%20desc", function(data){
  $.each(data.contentlets, function (){
      allproduceseries.push(this.name);
  });
},'json');

var allproducttypes = [];
$.get("/api/content/render/false/type/json/query/+contentType:ProductType%20+languageId:1%20+deleted:false%20+working:true/orderby/modDate%20desc", function(data){
  $.each(data.contentlets, function (){
      allproducttypes.push(this.name);
  });
},'json');

var alldocuments = [];
$.get("/api/content/render/false/type/json/query/+contentType:ResourceDocument%20+languageId:1%20+deleted:false%20+working:true/orderby/modDate%20desc", function(data){
  $.each(data.contentlets, function (){
      alldocuments.push(this.resourceTitle);
  });
},'json');

//Once the search sugguestions have been gathered and the page is ready to load
$(document).ready(function(){
//merge them all into one array
var allsuggestions = [];
var allsuggestions =  $.merge($.merge($.merge(allparts, allproduceseries), allproducttypes), alldocuments);
//add them to the typeahead
$('#searchkeywordsid').typeahead({
  source: allsuggestions,
  autoSelect: true
});
$('#search-input').typeahead({
  source: allsuggestions,
  autoSelect: true
});
});
//end javasscript code

})();