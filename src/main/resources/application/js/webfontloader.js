/*
 Created By:     Steven Lawler (slawler@architech.ca)
 Created Date:   14/10/2016
 Updated Date:   14/10/2016
 Version:        1.0
 Description:    Controller code for loading webfonts.

 // */

'use strict';

module.exports = {};
var webFontLoaderController = {};

const webfontLoader = require('webfontloader');

webFontLoaderController = function(WebFontConfig) {

  webFontLoaderController.init = function() {
    webfontLoader.load(WebFontConfig);
  };

  // Run constructor
  webFontLoaderController.init();

};

module.exports = webFontLoaderController;
