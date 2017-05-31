require('browsernizr/test/dom/classlist');
require('browsernizr');

//resolves issue with IE9 where 'console' is not defined until IE Dev tools is opened
require('./ie-console.js');
require('classlist-polyfill');


//flex shim
require('flexibility');


let VueJS = require('vue');
    //VueJS.config.devtools = false;

//jquery
global.$ = global.jQuery = require('jquery');
//Modernizr
global.Modernizr = require('browsernizr');

// Load web fonts before any other custom module can possibly break it
global.webfontloader = require('./webfontloader.js')(window.WebFontConfig);


//global scope modules
global.NewsModule = require('./news-module.js');
global.StockCheckModule = require('./stock-check-module.js')();
global.BootstrapTypeahead = require('./bootstrap3-typeahead.js');
global.SiteSearchModule = require('./site-search-module.js')();
//global.contactUsModule = require('./contact-us-module.js')();
//global.contactRepresentativesModule = require('./contact-representatives-module.js')();
//global.DistributorModule = require('./distributor-module.js')();
global.ProductListingModule = require('./product-listing-module.js');
global.ProductDetailsModule = require('./product/product-details-module.js')(window.partGroupsAndNumbers);
global.BreadcrumbNav = require('./breadcrumb-nav.js');
global.Carousel = require('./bf-carousel.js');
global.HomePageTab = require('./bf-tab.js');
global.FlyOut = require('./main-nav-fly-out.js');
global.AboutUsAccordian = require('./about-us-accordian.js');
global.productNotification = require('./product-notification.js');
global.crossReference = require('./cross-reference-module.js');
global.techHelp = require('./tech-help.js');
global.SearchBelfuse = require('./search-bel-fuse.js');
global.ContactBelfuse = require('./contact-bel-fuse.js');
global.assemblyInstructions = require('./assembly-instructions-module.js');
global.contentDisable = require('./content-download-disable.js');


if(!Modernizr.classlist){
  console.log('classList shim added');
  require('classlist.js');
}
