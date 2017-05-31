/**
 * Created by Asingh on 5/30/2017.
 * version : 1.0
 * description : Code to disable right click for image download
 */

 $(document).ready(function(){
// this part disables the right click
    $('img').on('contextmenu', function(e) {
      return false;
    });
//this part disables dragging of image
    $('img').on('dragstart', function(e) {
      return false;
    });

  });

