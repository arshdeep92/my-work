/**
 * Created by smccullough on 2016-09-29.
 */

const bootstrap = require('bootstrap');

module.exports = (() => {
  "use strict";

  $('.bf-carousel.carousel').carousel(
    {
      interval: 6000, //default
      pause: 'hover', //default
      wrap: true, //default
      keyboard: false
    }
  );
})();
