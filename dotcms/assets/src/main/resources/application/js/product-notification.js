/**
 * Created by smccullough on 2016-11-28.
 */

const $ = require('jquery');
const dt      = require('datatables.net')();
const buttons = require('datatables.net-buttons')();

module.exports = (() => {
  "use strict";

  let table = $('#product-notifications-table').DataTable({
    dom: '<"table-controls row" <"col-lg-12 col-md-8 col-sm-5 col-xs-5"fB>>rtip',
    buttons: {
      dom: {
        container: {
          className: 'btn-group belfuse-btn-group'
        },
        button: {
          className: 'btn btn-primary',
          tag: 'button'
        },
        buttonLiner: {
          tag: null
        }
      },
      buttons: [
        {
          text: 'View All',
          value: '',
          action: function (e, dt, node, config) {
            filterClick.apply(this, arguments);
          }
        },
        {
          text: 'PCN\'s only',
          value: 'PCN',
          action: function (e, dt, node, config) {
            filterClick.apply(this, arguments);
          }
        },
        {
          text: 'EOL\'s Only',
          value: 'EOL',
          action:  function (e, dt, node, config) {
            filterClick.apply(this, arguments);
          }
        }
      ]
    },
    paging: false,
    info: false,
    columnDefs: [
      {
        targets: [0],
        visible: false,
        searchable: true
      },
      {
        targets: [4],
        searchable: false
      }
    ],
    language: {
      search:' Search',
      searchPlaceholder: 'Type in PCN/EOL or product name',
      zeroRecords: 'Nothing found - sorry',
      infoEmpty: 'No records available'
    }
  });

  table.button(0).active(true);

  return {
    filterResults: filterBy
  };

  function filterBy(notificationType) {
    return table.column([0]).search(notificationType).draw();
  }

  function filterClick() {
    arguments[1].buttons().active(false);
    filterBy(arguments[3].value);
    this.active(true);
  }

})();
