/**
 * Created by smccullough on 2016-06-15.
 */

let Vue = require('vue');
let VueResource = require('vue-resource');

Vue.use(VueResource);

const LoadingSpinner = require('./loading-spinner.js');
const moment = require('moment');
const querystring = require('querystring');

module.exports = (() => {
    'use strict';

var initialized = false,
  pageCount = 1,
  vm = new Vue({
    el: document.querySelector('#news-app'),
    data: {
      searchterm: '',
      articles: [],
      loadmore: true,
      count: 0,
      total: 0,
      page: 1,
      announcementType: 'all',
      brandSelection: [],
      expectedParameters: ['page','search','type','brand']
    },
    beforeCompile: function() {
      getNews();
      this.readUrl();
    },
    methods: {
      getNews: (e) => {
      getNews();
},
displayDate: (date) => {
  return moment(date).format('MMMM DD, YYYY');
},
readUrl: (url) => {
  let href = url ? url : window.location.search.substr(1);

  console.log('query -> ', querystring.stringify(querystring.parse(window.location.search.substr(1))) || 'no query string present');
}
}
});

vm.$watch('announcementType,brandSelection', function (val) {
  let brandQuery = querystring.stringify({brand: val});
  let typeQuery = querystring.stringify({type: this.announcementType});
  //alert(brandQuery+"  "+typeQuery);
  let url;

  if(!brandQuery) {
   url = `/news/news-article-listings?${typeQuery}&page=1`;
  }else if(!typeQuery){
    url = `/news/news-article-listings?${brandQuery}&page=1`;
  }else{
    url = `/news/news-article-listings?${brandQuery}&${typeQuery}&page=1`;
  }

  Vue.http.get(url).then(
    newsResponseHandler,
    (response) => {
    console.log('error ', response);
}
  );
});

$(document).ready(function() {
  var allNewsList = $('article').length;
  var hiddenNews = $('article:hidden').length;
  var items = allNewsList;
  $('article').show();

});

//SUBMIT SEARCH
//function searchSubmit(e){
//  e.preventDefault();
//  setSearchQuery(vm.searchterm);
//}

//ONLY USED FOR SEARCH VIA INPUT TEXT
//function setSearchQuery(term) {
//  if(getQueryString('search') === '' && (getQueryString('search') === null || getQueryString('search') !== term)){
//      let hashArray = getHashQuery().array,
//          hasSearch = false;
//
//      for(let i = 0, hashLen = hashArray.length; i < hashLen; i++){
//        if(hashArray[i].indexOf('search=') > -1){
//          hashArray[i] = `search=${term}`;
//          hasSearch = true;
//        }
//      }
//
//      if(!hasSearch){
//        hashArray.unshift(`search=${term}`);
//      }
//
//      window.location.hash = hashArray.join('&');
//      pageCount = 1;
//      getNews();
//  }
//}

function getQueryString(field, url) {
  let href = url ? url : window.location.href,
    reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i'),
    string = reg.exec(href);

  return string ? string[1] : null;
}

//REFACTOR
function getHashQuery() {
  let hashQueryObj = {
      search  : '',
      page    : 1
    },
    hashQuery = window.location.hash.substring(1).split('?',1);
  hashQuery = hashQuery[0].split('&');

  hashQuery.forEach((hq) => {
    if(hq.indexOf('page=') > -1) {
    hashQueryObj.page = parseInt(hq.split('=')[1].match(/(\d){1,}/g)[0]) || 1;
  } else if(hq.indexOf('search=') > -1){
    hashQueryObj.search = hq.split('=')[1];
  }
});

  hashQueryObj.array = hashQuery;
  return hashQueryObj;
}

function buildUrl(page) {
  if(page){
    pageCount = page;
  } else if(getQueryString('page') !== undefined || getQueryString('page') !== null) {
    pageCount = parseInt(getQueryString('page')) > parseInt(pageCount) ? parseInt(getQueryString('page')) : parseInt(pageCount);
  }

  let initialQuery =  querystring.stringify(querystring.parse(window.location.search.substr(1)));

  //return `/news/news-article-listings?search=${getQueryString('search')}&page=${parseInt(pageCount)}`;
  return `/news/news-article-listings?${initialQuery}`;
}

function setPageHistory() {

  let { articles, page, count, total, loadmore, announcementType } = vm._data,
    stateData = { articles, page, count, total, loadmore, announcementType},
    query = undefined;

  if(getQueryString('search') !== '' && getQueryString('search') !== null){
    query = `?search=${getQueryString('search')}&page=${parseInt(pageCount)}`;
  } else {
    query = `?page=${parseInt(pageCount)}`
  }

  if(window.history.pushState) {
    window.history.pushState(stateData, null, query);
  } else {
    window.location.hash = query;
  }

  pageCount = vm.page + 1;
}

//REFACTOR
function newsResponseHandler(response) {
  renderNews(response);
  //setPageHistory();
}

//REFACTOR
function renderNews(data) {
  var myJSON = JSON.stringify(data);

  //alert(myJSON);
  // updates Vue ViewModel
  // @data:object - response from XHR
  let response;

  //check to see if it is a XHR response or a popstate response
  if(data.articles && data.page){
    response = data;
  } else {
    // response = JSON.parse(data.body);  //commented by Vijay on 1Feb.2017 for bug fix
    response = JSON.parse(JSON.stringify(data.body));
  }

  vm.loadmore = response.loadmore;
  vm.articles = response.articles;
  vm.count = response.count;
  vm.total = response.total;
  vm.page = response.page;
  vm.searchterm = response.searchterm;

  LoadingSpinner.hide();
}

function getNews(page) {
  if(initialized === false){
    initialize();
  }

  LoadingSpinner.show();

  Vue.http.get(buildUrl(page)).then(
    newsResponseHandler,
    (response) => {
    console.log('error ', response);
})

};

function initialize() {
  try{
    initialized = true;

    window.addEventListener('popstate', (event) => {
      if(event.state){
      renderNews(event.state);
      pageCount = event.state.page;
    } else {
      alert("here we r");
      pageCount = vm.count < 1 ? 1 : parseInt(pageCount) - 1;
      window.history.back();
    }
  });

    //document.querySelector('#news-search').addEventListener('submit', searchSubmit, false);
  }catch(e){
    console.error('News template does not exist.');
  }
}
})();
