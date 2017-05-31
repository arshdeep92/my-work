module.exports = {};

var styleGuideRouterExec = function(includes, settings) {

  this.init = function() {

    console.log("styleGuideRouterExec::init(): Completed");
    console.log("");
  };

    this.addResourceFiles = function(resourcesToAdd) {

      for (resourceFile in resourcesToAdd) {
        settings.resourceFiles.push(resourcesToAdd[resourceFile]);
      }

      var result = includes.settingsController.writeSettings(settings);

      return result;
    };

    this.addPageHeadings = function(pageHeadingsToAdd) {

      for (pageHeading in pageHeadingsToAdd) {
        //TODO: Finish
        settings.pageHeadings.push(resourcesToAdd[resourceFile]);
      }

      var result = includes.settingsController.writeSettings(settings);

      return result;
    };

    this.getResourceFiles = function() {
      return settings.resourceFiles;
    };

    this.getPageHeadings = function() {
      return settings.pageHeadings;
    };

    return this;
};

module.exports = styleGuideRouterExec;
