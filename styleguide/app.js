(function(){

  includes = {};

  includes.express = require('express');

  includes.app = includes.express();
  includes.http = require("http").Server(includes.app);
  includes.fs = require("fs");
  includes.path = require("path");
  includes.escape = require('escape-html');

  includes.settingsController = require("./includes/settingscontroller.js");
  includes.htmlFunctions = require("./includes/htmlfunctions.js");
  includes.resourceReader = require("./includes/resourcereader.js");
  includes.styleGuideController = require("./includes/styleguidecontroller.js");
  includes.styleGuideRouterExec = require("./includes/styleguiderouterexec.js");

  var settings = null;

  function init(includes) {

    includes.settingsController = includes.settingsController(includes, settings); //Instantiate settings controller
    includes.settingsController.init();

    settings = includes.settingsController.readSettings("settings.json"); //Load settings from settings file.

    if (!settings) { //Exit if settings are not loaded.
      console.log("Error: Couldn't read settings file. ", e);
      console.log("Exiting... ");
      process.exit(1)
    }

    settingsLoad();

  }

  function settingsLoad() {

    includes.app.set('json spaces', settings.outputs.jsonSpaces);

  }

  function setupDependencies(includes, settings) {
    includes.htmlFunctions = includes.htmlFunctions(includes, settings);
    includes.htmlFunctions.init();

    includes.resourceReader = includes.resourceReader(includes, settings);
    includes.resourceReader.init();

    includes.styleGuideController = includes.styleGuideController(includes, settings);
    includes.styleGuideController.init();

  }

  function setupApp(includes, settings) {

    for (var i = 0; i < settings.serveSubdirectories.length; i++) { // Serve subdirectories for JS, CSS etc files.
      (function(folderIndex) {
        includes.app.use("/" + settings.serveSubdirectories[folderIndex], includes.express.static(settings.serveSubdirectories[folderIndex]));
      })(i);
    }

    includes.app.get('/', function (req, res) {
      includes.styleGuideController.createStylePage(res, settings.serverSettings.loadFilesAsync);
    });

  }

  function startServer(includes, settings) { // This code starts the HTTP listener
    includes.app.listen(settings.serverSettings.listenPort, settings.serverSettings.listenIP, function() {
      console.log("");
      console.log(Math.round(new Date().getTime()/1000).toString(), " | startServer(): Listening on ", settings.serverSettings.listenIP, ":", settings.serverSettings.listenPort);
      console.log("");
      console.log("-----------------");
      console.log("");
    });
  }

  init(includes);
  setupDependencies(includes, settings);
  setupApp(includes, settings);
  startServer(includes, settings);


})();
