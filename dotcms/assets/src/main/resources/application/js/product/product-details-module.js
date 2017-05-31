
'use strict';

const constants = require('../constants.js');
const partGroupPanelModule = require("./partgroup-panel-module.js");

require('jquery-expander')(jQuery);
const select2 = require('select2-browserify');
const dropdownModule = require('../brand-region-dropdown-module.js');


var ProductDetailsModule = function(partGroupsAndNumbers) {
  $('#email-region').select2({placeholder: "--Select or Type--"});
  $('#email-region-mobile').select2({placeholder: "--Select or Type--"});
  $('#email-state').select2({placeholder: "--Select or Type--"});
  $('#email-country-mobile').select2({placeholder: "--Select or Type--"});
  $('#rfq-country').select2({placeholder: "--Select or Type--"});
  $('#rfq-state').select2({placeholder: "--Select or Type--"});
  $('#rfq-country-mobile').select2({placeholder: "--Select or Type--"});
  $('#rfq-state-mobile').select2({placeholder: "--Select or Type--"});

  // Quick exit if we're not on the product details page.
  if (!$('.product-details-template').length) {
    return;
  }

  let productDetailsTitle = $('.product-details-title');

  $('.expander-truncate').expander({
    slicePoint: 450,
    expandText: 'Read More +',
    userCollapseText: 'Read Less -',
    expandSpeed: 0,
    collapseSpeed: 0
  });

  $('.part-group-panel').each(function(i, partGroupPanel) {
    partGroupPanelModule.setupPartGroupPanel(i, partGroupPanel, partGroupsAndNumbers)
  });

  function productTitlePositioning(){
    if ($(window).width() < constants.tabletBreakPoint)
    {
      productDetailsTitle.prependTo('.product-details-container');
    }
    else
    {
      productDetailsTitle.prependTo('.product-details-info');
    }
  }
  productTitlePositioning();


  var mobileWidth;
  $(window).resize(function () {
    mobileWidth = $(window).outerWidth();
    productTitlePositioning();
    $('.part-group-panel').each(function (i, partGroupPanel) {
      partGroupPanelModule.setFilterHeight(partGroupPanel);
      });
  });
};

module.exports = ProductDetailsModule;
