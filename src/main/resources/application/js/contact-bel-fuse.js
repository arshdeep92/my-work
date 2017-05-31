const $ = require('jquery');

module.exports = (() => {
    "use strict";
//This code is for Contact-bel
//When the Contact-Bel Page Loads, Hide the Cinch Brand Select Picker
$(document).ready(function() {
      //For every Page Hide the Cinch Brands
      if ($('#sel_cinch_brand').length > 0) {
      var picked_company = $('#sel_company').find(":selected").val(); //this = window
        if (picked_company == "cinchConnectivitySolutions16"){
          $('#sel_cinch_brand').selectpicker('show');
          if ($('#Cinch_Brand').length > 0) {
          $('#Cinch_Brand').show();
          }
        }
        else {
          $('#sel_cinch_brand').selectpicker('hide');
          $('#Cinch_Brand').hide();
        }

      //Listen for which company is selected
      $('#sel_company').on('change', function(){
            var picked_company = $('#sel_company').find(":selected").val(); //this = window
              if (picked_company == "cinchConnectivitySolutions16"){
                $('#sel_cinch_brand').selectpicker('show');
                $('#Cinch_Brand').show();
              }
              else {
                $('#sel_cinch_brand').selectpicker('hide');
                $('#Cinch_Brand').hide();
              }
      });
      //End of the code for the listener

      }

      //For the Reps Page Hide the State Feild
      var picked_region = $('#sel_region').find(":selected").val(); //this = window
      if ($('#sel_state').length > 0){
        if (picked_region == "unitedStates"){
          $('#sel_state').selectpicker('show');
        }
        else {
          $('#sel_state').selectpicker('hide');
        }
      }

      //Listen for if the unitied state is selected
      $('#sel_region').on('change', function(){
            var picked_region = $('#sel_region').find(":selected").val(); //this = window
            if ($('#sel_state').length > 0){
              if (picked_region == "unitedStates"){
                $('#sel_state').selectpicker('show');
              }
              else {
                $('#sel_state').selectpicker('hide');
              }
            }
      });
      //End the code for Contact Bel Representatives

//This code is to allow the drop downs to work on mobile devices  
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    $('.selectpicker').selectpicker('mobile');
}
//This net section is needed to allow the drop downs to work in very small windows
$(window).on('resize', function(){
      var win = $(this); //this = window
      if (win.width() <= 768) { 
        $('.selectpicker').selectpicker('mobile');
       }
});

//End the document ready listner
});
//

//End of module
  })();
