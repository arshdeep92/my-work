/**
 * Created by smccullough on 2016-08-15.
 */

const $ = require('jquery');

const constants = require('./constants.js');

module.exports = (() => {
  'use strict';

  let $rubicon = 0,
      $breadCrumb = $('#breadcrumb'),
      $data = $('#breadcrumb-data'),
      $megaDropdown = $('.mega-dropdown'),
      $megaDropdownMenu = $('.mega-dropdown-menu');

  if($breadCrumb.length == 0){
    return;
  }
  if($data.length > 0) {
    $('.navbar').html($data);
  }
  $data.removeClass("hidden");

  $('.breadcrumb-button').click(function(){
    setTimeout(function () {
      if ($data.offset().left > $megaDropdownMenu.offset().left) {
        $megaDropdown.css({"position":"static"});
        $megaDropdownMenu.removeClass("pull-right");
      }
      $megaDropdownMenu.css({"opacity":1});

    }, 50);
    if ($(window).outerWidth() < constants.tabletBreakPoint) {
      $(document).on('click', 'li.dropdown .dropdown-menu', function (e) {
        e.stopPropagation();
      });
      breadcrumbOverride();
    }
  });

  $(window).scroll(function(){
    let $scrollTop = $(this).scrollTop();
    if ($scrollTop == 0) {
      $breadCrumb.removeClass('sticky un-stick').addClass('splash');
    } else if ($scrollTop < $rubicon) {
      $breadCrumb.removeClass('splash un-stick').addClass('sticky');
    } else {
      if ($breadCrumb.hasClass('sticky')) {
        $breadCrumb.addClass('un-stick');
      }
    }
    $rubicon = $scrollTop;
  });

  function breadcrumbOverride() {
    $.each($('.breadcrumb-list'), function(ind, ele){
      if (ind != 0) {
        $(this).addClass('collapse');
      } else {
        $(this).addClass('collapse in');
      }
    });

  }
  var mobileWidth;
  $(window).resize(function () {
    mobileWidth = $(window).outerWidth();
    if ($(window).outerWidth() < constants.tabletBreakPoint) {
      breadcrumbOverride();
    } else {
      $('.breadcrumb-list').removeClass('collapse');
    }
  });


})();
