var config = require('./gulpfile-configuration');
var path = require('path');

module.exports = {
    replaceAll: replaceAll,
    endsWith: endsWith,
    cleansePath: cleansePath,
    getFileNameWithoutPath: getFileNameWithoutPath,
    filterPathsByConfiguredSite: filterPathsByConfiguredSite,
    getSiteFromFilePathIfPresent: getSiteFromFilePathIfPresent,
    transformSrcPathsToDestPaths: transformSrcPathsToDestPaths
};

function replaceAll(str, search, replacement) {
    return str.split(search).join(replacement);
}
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
function cleansePath(path) {
    return replaceAll(replaceAll(replaceAll(path, '\\', '/'), '//', '/'), '//', '/');
}
function getFileNameWithoutPath(filename) {
    filename = cleansePath(filename);
    var i = filename.lastIndexOf('/');
    return i === -1 ? filename : filename.substr(i + 1);
}
function filterPathsByConfiguredSite(paths) {
    var siteName = config.filterToSite;
    if (!siteName) return paths;
    return paths.filter(function(path) {
        var site = getSiteFromFilePathIfPresent(path);
        return site === null || site.name.toLowerCase() === siteName.toLowerCase()
    });
}

function getSiteFromFilePathIfPresent(filePath) {
    filePath = cleansePath(filePath.toLowerCase());
    for (var site of config.ALL_SITES) {
        if (filePath.indexOf('/themes/' + site.theme.toLowerCase() + '/') !== -1) {
            return site;
        }
    }
    return null;
}

function transformSrcPathsToDestPaths(pathArray){
    return pathArray.map(function(filePath) {
        return config.BUILD_APP_DIR + path.relative(config.SOURCE_APP_DIR, filePath)
    });
}