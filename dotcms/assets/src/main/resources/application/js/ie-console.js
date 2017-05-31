/**
 * Created by smccullough on 2016-11-03.
 */

module.exports = (() => {
  "use strict";

  // Avoid `console` errors in browsers that lack a console.
  let method,
      noop = function () {},
      methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
      ],
      length = methods.length,
      console = (global.console = global.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
})();
