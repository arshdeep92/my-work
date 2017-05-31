var fs = require('fs');
var _ = require('lodash-compat');
var url = require('url');
var argv = require('yargs').argv;
var YAML = require('yamljs');
require('colors');


var settings = YAML.load('../config/settings.yml');

var configType = argv.webdavconfigtype || 'dev';
var selectedSite = argv.site;

var allSites = settings.sites;

var config = {
    SOURCE_DIR: 'src/main/resources/',
    BUILD_DIR: 'target/classes/',
    TEST_APP_DIR: 'src/test/resources/application/',
    SOURCE_APP_DIR: 'src/main/resources/application/',
    BUILD_APP_DIR: 'target/classes/application/',
    SITES: getFilteredSites(),
    DISTINCT_SITES: getDistinctSites(),
    ALL_SITES: allSites,
    vmInfo: readConfig(),
    filterToSite: argv.site,
    webdavConfigType: configType,
    watcherIsRunning: false
};

function readConfig() {
    var envConfig = settings.env[configType];

    var webDavUrl = {
        protocol: envConfig.webdav.protocol || 'http',
        hostname: argv.webdav_host || envConfig.host,
        port: argv.webdav_port || envConfig.webdav.port || '80',
        pathname: envConfig.webdav.webdavRootPath || '/webdav/live/1/'
    };

    var config = {
        url: url.format(webDavUrl),
        host: argv.webdav_host || envConfig.host,
        username: argv.webdav_user || envConfig.webdav.user || 'admin@dotcms.com',
        password: argv.webdav_password || envConfig.webdav.password || 'admin',
        protocol: argv.webdav_protocol || envConfig.webdav.protocol || 'http',
        pathname: envConfig.webdav.webdavRootPath || '/webdav/live/1/',
        port: argv.webdav_port || envConfig.webdav.port || '80'
    };



    if (!endsWith(config.url, '/')) {
        config.url += '/';
    }

    return config;
}

function getFilteredSites() {
    return _.isUndefined(selectedSite) ?
            allSites :
            allSites.filter(function(site) { return site.name.toLowerCase() === selectedSite.toLowerCase(); });
}

function getDistinctSites(sites) {
    sites = _.isUndefined(sites) ? getFilteredSites() : sites;
    var tmpSet = new Set();
    return sites.filter(function(site){
        if(tmpSet.has(site.name)){
            return false;
        }else {
            tmpSet.add(site.name);
            return true;
        }
    });
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

module.exports = config;
