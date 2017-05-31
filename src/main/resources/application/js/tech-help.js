/**
 * Created by KVijay on 01-15-2017.
 * Version:        1.1
 * Description:    Controller code for the Tech Help floating form.
 */
if($("#tech-help-form").length > 0){
  var _scroll = true,
    _timer = false,
    _floatbox = $("#tech-help-form"),
    _floatbox_opener = $(".contact-opener") ;
  var isChrome = !!window.chrome;
  var isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);
  var screen_width = document.documentElement.clientWidth;
  var scrmob = window.matchMedia("screen and (max-width:414px)");
  var scrtab = window.matchMedia("screen and (max-width:768px)");

  if(isChrome){
    _floatbox.css("right", "-270px"); //initial contact form position
  }else if(isIE){
    _floatbox.css("right", "-286px"); //initial contact form position
  }else if(screen.width <= 500){
    _floatbox.css("right", "-284px"); //initial contact form position
  }else if(screen.width <= 800){
    _floatbox.css("right", "-284px"); //initial contact form position
  }else{
    _floatbox.css("right", "-298px"); //initial contact form position
  }

  //Contact form Opener button
  _floatbox_opener.click(function(){
    if (_floatbox.hasClass('visiable')){
      if(isChrome){
        _floatbox.animate({"right":"-270px"}, {duration: 300}).removeClass('visiable');
      }else if(isIE){
        _floatbox.animate({"right":"-286px"}, {duration: 300}).removeClass('visiable');
      }else{
        _floatbox.animate({"right":"-298px"}, {duration: 300}).removeClass('visiable');
      }
    }else{
      _floatbox.animate({"right":"0px"},  {duration: 300}).addClass('visiable');
    }
  });

  //Effect on Scroll
  $(window).scroll(function(){
    if(_scroll){
      _floatbox.animate({"top": "316px"},{duration: 300});
      _scroll = false;
    }
    if(_timer !== false){ clearTimeout(_timer); }
    _timer = setTimeout(function(){_scroll = true;
      _floatbox.animate({"top": "316px"},{easing: "linear"}, {duration: 500});}, 400);
  });
  //Ajax form submit
  $("#submit_btn").click(function() {
    var proceed = true;
    //simple validation at client's end
    //loop through each field and we simply change border color to red for invalid fields
    $("#tech-help-form input[required=true], #tech-help-form textarea[required=true]").each(function(){
      $(this).css('border-color','');
      if(!$.trim($(this).val())){ //if this field is empty
        $(this).css('border-color','red'); //change border color to red
        proceed = false; //set do not proceed flag
      }
      //check invalid email
      var email_reg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      if($(this).attr("type")=="email" && !email_reg.test($.trim($(this).val()))){
        $(this).css('border-color','red'); //change border color to red
        proceed = false; //set do not proceed flag
      }
    });

    if(proceed) //everything looks good! proceed...
    {
      //get input field values data to be sent to server
      post_data = {
        'user_name'     : $('input[name=name]').val(),
        'user_email'    : $('input[name=email]').val(),
        'country_code'  : $('input[name=phone1]').val(),
        'phone_number'  : $('input[name=phone2]').val(),
        'subject'       : $('select[name=subject]').val(),
        'msg'           : $('textarea[name=message]').val()
      };

      //Ajax post data to server
      $.post('floating-techhelp-form', post_data, function(response){
        if(response.type == 'error'){ //load json data from server and output message
          output = '<div class="error">'+response.text+'</div>';
        }else{
          output = '<div class="success">'+response.text+'</div>';
          //reset values in all input fields
          $("#tech-help-form  input[required=true], #tech-help-form textarea[required=true]").val('');
        }
        $("#tech-help-form #contact_results").hide().html(output).slideDown();
      }, 'json');
    }
  });


  //reset previously set border colors and hide all message on .keyup()
  $("#tech-help-form  input[required=true], #tech-help-form textarea[required=true]").keyup(function() {
    $(this).css('border-color','');
    //$("#result").slideUp();
  });

  $("#tech-help-form").mouseleave(function() {
    if(isChrome){
      _floatbox.animate({"right":"-270px"}, {duration: 300}).removeClass('visiable');
    }else if(isIE){
      _floatbox.animate({"right":"-286px"}, {duration: 300}).removeClass('visiable');
    }else{
      _floatbox.animate({"right":"-298px"}, {duration: 300}).removeClass('visiable');
    }

  });
};

/*
 * JQuery functions for slideout feedback form
 *
 * Sets up a sliding form on click of a feedback button
 * On submit button will send the data to a php script
 *
 */
if($("#tech-help-form-mobile").length > 0){
  $("#feedback_button").click(function(){
    $('.tech-help-form-mobile').slideToggle();
  });
  (function ($j) {
    feedback_button = {
      onReady: function () {
        this.feedback_button_click();
        this.send_feedback();
      },
      //feedback_button_click: function(){
       // $("#feedback_button").click(function(){
          //$('.tech-help-form-mobile').slideToggle();
       // });
      //},

      send_feedback: function(){
        $('#submit_form').click(function(){
          if($('#feedback_text').val() != ""){

            $('.status').text("");

            $.ajax({
              type: "POST",
              url: "./process_email.vtl",
              data: 'feedback=' + $('#feedback_text').val(),
              success: function(result,status) {
                //email sent successfully displays a success message
                if(result == 'Message Sent'){
                  $('.status').text("Feedback Sent");
                } else {
                  $('.status').text("Feedback Failed to Send");
                }
              },
              error: function(result,status){
                $('.status').text("Feedback Failed to Send");
              }
            });
          }
        });
      },


    };

    $j().ready(function () {
      feedback_button.onReady();
    });

    $("#tech-help-form-mobile").mouseleave(function() {
    $('.tech-help-form-mobile').slideToggle();
    });

  })(jQuery);
};

