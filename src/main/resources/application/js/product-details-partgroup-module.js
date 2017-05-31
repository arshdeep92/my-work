let Vue = require('vue');

let VueResource = require('vue-resource');

Vue.use(VueResource);

const LoadingSpinner = require('./loading-spinner.js');

var ProductDetailsPartGroupModule = function (undefined) {
  'use strict';
  //This is the Javascript code
  //Check if we need to load this stuff for this page
  if ($('.product-details-template').length === 0) {
    return;
  }

  //Arsh's Code
  //I wasn't able to get it working correctly.
  //When I run this code in my console after my table loads with data it does work. It must be that this gets executed before the vue stuff is finished.
  //  $(document).ready(function() {
  //    $('#myTabling').DataTable( {
  //      "pagingType": "full_numbers",
  //      "searching": false,
  //      "lengthChange": false
  //    });
  //  });
  //End Arsh's Code


  console.log("Loading Vue");
  // register the grid component
  Vue.component('demo-grid', {
    template: '#grid-template',
    props: {
      data: Array,
      columns: Array,
      speccolumns: Array,
      filterKey: String
    },
    data: function () {
      var sortOrders = {}
      this.columns.forEach(function (key) {
        sortOrders[key] = 1
      })
      return {
        sortKey: '',
        sortOrders: sortOrders
      }
    },
    computed: {
      filteredData: function () {
        var sortKey = this.sortKey
        var filterKey = this.filterKey && this.filterKey.toLowerCase()
        var order = this.sortOrders[sortKey] || 1
        var data = this.data
        if (filterKey) {
          data = data.filter(function (row) {
            return Object.keys(row).some(function (key) {
              return String(row[key]).toLowerCase().indexOf(filterKey) > -1
            })
          })
        }
        if (sortKey) {
          data = data.slice().sort(function (a, b) {
            a = a[sortKey]
            b = b[sortKey]
            return (a === b ? 0 : a > b ? 1 : -1) * order
          })
        }
        return data
      }
    },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
    },
methods: {
  sortBy: function (key) {
    this.sortKey = key
    this.sortOrders[key] = this.sortOrders[key] * -1
  }
}
  })

// bootstrap the demo
var demo = new Vue({
  el: '#partgrouptable',
  data: {
    searchQuery: '',
    gridColumns: null,
    speccolumns: null,
    gridData: null
  },
  created: function () {
    //LoadingSpinner.show();
    console.log("Fetching Data");
    this.fetchData();
    //LoadingSpinner.hide();
  },
  methods: {
    fetchData: function () {
      var self = this;
      var anObject = [];
      var columns = [];
      //Turns out we can just use the static column names here
      //self.gridColumns = ["partnumber", "defaultSortOrder", "Data Sheet", "Drawing"];
      self.gridColumns = ["partnumber", "defaultSortOrder", "Data Sheet", "Drawing"];

      //We will call the function to get the data and set the datat to the self object
      getTheData(function (data) {
        self.gridData = data;
        anObject = data;
        anObject = anObject[0];
        //An Example array
        //var array = ["Inductance (uH)", "Current (A)", "Saturation (A)", "DC Resistance (Ω)", "Test Frequency", "Max Height (mm)", "Shielding"];
        //We will get the spec columns and store them in an array named columns
        $.each(anObject, function (k, v) {
          if (k != "inode" && k != "partnumber" && k != "defaultSortOrder" && k != "Data Sheet" && k != "Drawing") {
            columns.push(k);
          }
        });
        //Set the value of self.speccolumns to use our new array
        self.speccolumns = columns;
      });
      //Function That Gets the Data from the API
      function getTheData(callback) {
        $.ajax({
          url: apiURL,
          type: 'get',
          dataType: 'json',
          async: true,
          success: function (jsondata) {
            //Send the JSON data back as a result
            //return does not work here
            callback(jsondata.data);
          }
        }); //End ajax line
      } //end getTheData Function

    }
  }
});

};
module.exports = ProductDetailsPartGroupModule();
