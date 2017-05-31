module.exports = (() => {
    "use strict";

$(document).ready(function() {

  $("#accordion").find('.panel-collapse:first').addClass("in");
  //$("#accordion").find('.glyphicon:first').toggleClass('glyphicon-chevron-down'); Commented by vijay on 14March
});

$('#about-us-accordian a').click(function() {
  $("#accordion").find('.glyphicon').removeClass("glyphicon-chevron-down");
  $(this).parent().find('.glyphicon').toggleClass('glyphicon-chevron-down');

});
})();
