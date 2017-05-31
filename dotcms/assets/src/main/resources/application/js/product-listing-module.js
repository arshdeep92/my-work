let Vue = require('vue');

let VueResource = require('vue-resource');

Vue.use(VueResource);

const querystring = require('querystring');

const LoadingSpinner = require('./loading-spinner.js');

const dotcacheParam = "dotcache";

const reservedParameters = ["toPage", "navCategory", "debug", dotcacheParam];


var ProductListingModule = function(undefined) {
  'use strict';

  if ($('.product-listing-template').length === 0) {
    return;
  }

  let queryParams = getQueryParamsObject();

  console.log("Loading Vue");
  var vm = new Vue({
      el: document.querySelector('#product-series-search-app'),

      beforeCompile: function() {
        console.log("Getting ready to retrieve Product Series");
        replaceState(this);
        getProductSeries(this);
      },

      methods: {
        getKeysAsArray: function(obj) {
          return Object.keys(obj);
        },


        updateFilterAndChange: function(specKey, newValue) {
          if (newValue.target) {
            this.selectedFilters[specKey] = newValue.target.value;
          } else {
            this.selectedFilters[specKey] = newValue;
          }
          updateStateAndRetrieveProductSeries(this);
        },

        selectedFilterFor: function(specFilterKey) {
          console.log(specFilterKey, this.selectedFilters[specFilterKey]);
          return this.selectedFilters[specFilterKey];
        },

        removeFilter: function(specFilterKey) {
          this.selectedFilters[specFilterKey] = '';
          updateStateAndRetrieveProductSeries(this);
        },

        removeAllFilters: function() {
          // vm.selectedFilters = {};
          let thisvm = this;
          Object.keys(this.selectedFilters).forEach(function(fieldKey) {
            thisvm.selectedFilters[fieldKey] = '';
          });
          updateStateAndRetrieveProductSeries(this);
        },

        loadMore: function() {
          this.pagination.toPage++;
          updateStateAndRetrieveProductSeries(this);
        },

        scaleImage: function(imageIdentifier, width, height) {
          let scaleAxis = (width >= height) ? 'scale_w' : 'scale_h';
          return `/contentAsset/image/${imageIdentifier}/fileAsset/filter/Scale/${scaleAxis}/110`;
        }
      },
      data: {
        total: 0,
        count: 0,
        pagination: {
          pageSize : 20,
          toPage : getToPageParameter(queryParams, 1),
        },
        results: [],
        specFilters: [],
        specFiltersOrder: [],
        selectedFilters: getSelectedFilters(queryParams),

        // This could be a VueJS computed property for simplicity but this approach is more efficient
        filterParams: stringifySelectedFilters(getSelectedFilters(queryParams))
      }
  });

  console.log("Vue Application loaded");

  function getQueryParamsObject() {
    let searchParams = window.location.search;

    // Remove leading '?' since querystring doesn't seem to be handling this right.
    if (searchParams.charAt(0)==='?') {
      searchParams = searchParams.substr(1);
    }

    return querystring.parse(searchParams);
  }

  function getToPageParameter(queryParams, defaultValue=1) {
    if (queryParams.toPage!==undefined && !isNaN(queryParams.toPage)) {
      return parseInt(queryParams.toPage);
    } else {
      return defaultValue;
    }
  }

  function getSelectedFilters(queryParams) {
    let newSelectedFilters = {};
    Object.keys(queryParams).forEach(function(fieldKey) {
      if (reservedParameters.indexOf(fieldKey) < 0) {
        newSelectedFilters[fieldKey] = queryParams[fieldKey];
      }
    });

    return newSelectedFilters;
  }

  function updateStateAndRetrieveProductSeries(vueObj) {
    replaceState(vueObj);
    getProductSeries(vueObj);
  }

  function pushState(vueObj) {
    history.pushState(createStateObject(vueObj), null, createStateUrl(vueObj));
  }

  function replaceState(vueObj) {
    history.replaceState(createStateObject(vueObj), null, createStateUrl(vueObj))
  }

  function createStateUrl(vueObj) {
    let queryParams = {};
    Object.keys(window.initialParams).forEach(function(fieldKey) {
      queryParams[fieldKey] = window.initialParams[fieldKey];
    });
    queryParams.toPage = vueObj.pagination.toPage;
    Object.keys(vueObj.selectedFilters).forEach(function(fieldKey) {
      if (reservedParameters.indexOf(fieldKey) < 0 && vueObj.selectedFilters[fieldKey] !== '') {
        queryParams[fieldKey] = vueObj.selectedFilters[fieldKey];
      }
    });
    let toReturn = '?' + querystring.stringify(queryParams);
    console.log("State URL", toReturn);
    return toReturn;
  }

  function createStateObject(vueObj) {
    return {pagination: vueObj.pagination, selectedFilters: vueObj.selectedFilters};
  }

  function getProductSeries(vueObj) {
    console.log("Getting Product Series");

    LoadingSpinner.show();

    let filterParams = stringifySelectedFilters(vueObj.selectedFilters);

    let paginationParams = '&' + querystring.stringify(vueObj.pagination);

    let dotCMSCache = "";
    if (window.initialParams[dotcacheParam] != undefined) {
      dotCMSCache = `&${dotcacheParam}=${window.initialParams[dotcacheParam]}`;
    }

    Vue.http.get(window.navBaseURL + filterParams + paginationParams + dotCMSCache)
      .then(productSeriesResponseHandler, (response) => {console.error(response)});
  }

  function stringifySelectedFilters(selectedFilters) {
    let filterParams = '';
    if (Object.keys(selectedFilters).length > 0) {
      filterParams = '&' + querystring.stringify(selectedFilters);
    }

    return filterParams;
  }

  function productSeriesResponseHandler(response) {
    renderProductSeries(response);
  }

  function renderProductSeries(data) {

    let response;

    //check to see if it is a XHR response or a popstate response
    if(data.results && data.total){
      response = data;
    } else {
      response = JSON.parse(data.body);
    }

    vm.results = response.results;
    if (response.specFilters !== undefined) {
      //vm.specFilters = sortAllSpecFilters(response.specFilters);
      vm.specFilters = response.specFilters;
      vm.specFiltersOrder = response.specFiltersOrder;
    } else {
      vm.specFilters = [];
      vm.specFiltersOrder = [];
    }

    vm.total = response.total;
    vm.count = response.count;

    // This forces VueJS to rebind and reevaluate the selectedFilters properties
    let currentSelectedFilters = vm.selectedFilters;
    vm.selectedFilters = [];
    Object.keys(currentSelectedFilters).forEach(function(key) {
      vm.selectedFilters[key] = currentSelectedFilters[key];
    });
    vm.filterParams = stringifySelectedFilters(vm.selectedFilters);

    LoadingSpinner.hide();

  }

  function addPopStateListener(vueObj) {
    window.addEventListener('popstate', function(event) {
      if (event.state) {

        if (event.state.pagination !== undefined) {
          vueObj.pagination = event.state.pagination;
        }
        if (event.state.selectedFilters !== undefined) {
          vueObj.selectedFilters = event.state.selectedFilters;
        }
      }
      getProductSeries(vueObj);
    });
  }
  // Click Events for mobile filters
  $('.icon-filter').on('click', function (e) {
    if ($('.product-specifications-filters').hasClass('slideInRight')) {
      $('.product-specifications-filters').removeClass('slideInRight').addClass('slideOutRight');
    } else {
      $('.product-specifications-filters').removeClass('slideOutRight').addClass('slideInRight');
    }
    $('.close-icon').on('click', function (e) {
      $('.product-specifications-filters').removeClass('slideInRight').addClass('slideOutRight');
    });
  });
};
module.exports = ProductListingModule();
