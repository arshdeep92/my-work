/**
 * Created by smccullough on 2016-06-21.
 */

module.exports = (() => {
    "use strict";

let parents = document.querySelectorAll('html, body'),
  loaderVisibility = false;

return {
  show: showLoader,
  hide: hideLoader,
  isLoaderVisible: isVisible
};

function getLoaderEl() {
  return document.querySelector('#loading-spinner');
}

function showLoader() {
  loaderVisibility = true;
  getLoaderEl().style.display = 'block';
  //loaderDisplay('initial');
  return loaderVisibility;
}

function hideLoader() {
  loaderVisibility = false;
  getLoaderEl().style.display = 'none';
  //loaderDisplay('initial');
  return loaderVisibility;
}

function loaderDisplay(displayType) {
  for(let i = 0, parentLen = parents.length; i < parentLen; i++){
    parents[i].style.overflow = displayType;
  }
}

function isVisible() {
  return loaderVisibility;
}
})();
