module.exports = {};

var styleGuideController = function(includes, settings) {

  this.init = function() {

    console.log("styleGuideController::init(): Completed");
    console.log("");
  };

  this.testFunctions = function() {

    this.getCodeLocation = function() {
      return includes.resourceReader.getCodeLocation();
    }

    return this;
  };

  this.createStylePage = function(res, async) {

    if (async) {
      var filesList = null;
      includes.resourceReader.getRemoteFiles(settings.resourceFiles, function(results) {
        var codeIndex = includes.styleGuideController.prePageGeneration(results);

        var pageOutput = includes.styleGuideController.mainGenerator(results, codeIndex);

        res.send(pageOutput);

      });
    } else {

      var fileResults = includes.resourceReader.getRemoteFiles(settings.resourceFiles)
      var codeIndex = includes.styleGuideController.prePageGeneration(fileResults);
      var pageOutput = includes.styleGuideController.mainGenerator(fileResults, codeIndex);

      res.send(pageOutput);

    }

  };

  this.prePageGeneration = function(fileListContents) {
    var codeIndex = includes.resourceReader.createCodeIDIndex(fileListContents);
    return codeIndex;
  };

  this.mainGenerator = function(filesText, codeIndexes) {

    var webpageBuffer = "";

    webpageBuffer += includes.htmlFunctions.createPageHead();

    var languageAndBlocks = includes.resourceReader.getCodeArrayBlocks(codeIndexes, filesText);

    for (articleName in settings.pageArticleHeadings) {
      (function(an) {
        for (headingTitle in settings.pageHeadings) {
          if (headingTitle.toString() === an.toString() ) {

            var safeArticleHead = includes.htmlFunctions.makeHTMLSafe(an);

            webpageBuffer += includes.htmlFunctions.createArticleHead(safeArticleHead);
            webpageBuffer += includes.htmlFunctions.createCodeSnippet(safeArticleHead);
            webpageBuffer += includes.htmlFunctions.createCodeBlock(safeCodeTitle, settings.pageArticleHeadings[an].code);
            webpageBuffer += includes.htmlFunctions.createCodeSnippetEnd();
            webpageBuffer += includes.htmlFunctions.createArticleTitle(an);
            webpageBuffer += includes.htmlFunctions.createCodeDescription(settings.pageArticleHeadings[an].description);

            for (codeID in settings.pageHeadings[articleName]) {

              var codeTitle = "";
              var codeDescription = "";
              var subheadingBlock = "";

              for (var i = 0; i < settings.pageHeadings[articleName][codeID].length; i++) {
                var tmpCodeTitle = includes.resourceReader.getCodeTitle(settings.pageHeadings[articleName][codeID], codeIndexes, filesText);
                var tmpCodeDescription = includes.resourceReader.getCodeDescription(settings.pageHeadings[articleName][codeID], codeIndexes, filesText);

                if (tmpCodeTitle !== "none" && tmpCodeTitle !== "") {
                  codeTitle = tmpCodeTitle;
                }

                if (tmpCodeDescription !== "none" && tmpCodeDescription !== "") {
                  codeDescription = tmpCodeDescription;
                }

                if (codeDescription !== "none" && codeDescription !== "" && codeTitle !== "none" && codeTitle !== "") {
                  break;
                }

              }

              codeTitle = tmpCodeTitle;
              codeDescription = tmpCodeDescription;

              var safeCodeTitle = includes.htmlFunctions.makeHTMLSafe(codeTitle);

              webpageBuffer += includes.htmlFunctions.createCodeSnippet(safeCodeTitle);

              for (languageCodeID in languageAndBlocks) {
                if (languageCodeID === settings.pageHeadings[articleName][codeID]) {
                  for (var j = 0; j < languageAndBlocks[languageCodeID].length; j++) {
                    for (languageName in languageAndBlocks[languageCodeID][j]) {
                      webpageBuffer += includes.htmlFunctions.createCodeBlock(languageName.toLowerCase(), includes.escape(languageAndBlocks[languageCodeID][j][languageName]));
                    }
                  }
                }
              }

              webpageBuffer += includes.htmlFunctions.createCodeSnippetEnd();

              webpageBuffer += includes.htmlFunctions.createCodeTitle(codeTitle, safeCodeTitle, safeArticleHead);
              webpageBuffer += includes.htmlFunctions.createCodeDescription(codeDescription);
              webpageBuffer += includes.htmlFunctions.closeCodeDescription();

              for (var i = 0; i < settings.pageHeadings[articleName][codeID].length; i++) {
                var tmpSubheadingBlock = includes.resourceReader.getCodeSubheadingList(settings.pageHeadings[articleName][codeID], codeIndexes, filesText);

                if (tmpSubheadingBlock !== false && tmpSubheadingBlock !== "") {
                  subheadingBlock = tmpSubheadingBlock;
                }

                if (subheadingBlock !== "") {
                  break;
                }

              }

              if (subheadingBlock !== false && subheadingBlock !== -1) {

                subheadingTitles = includes.resourceReader.getSubheadingTitleList(subheadingBlock, subheadingBlock.length);
                subheadingDescriptions = includes.resourceReader.getSubheadingDescriptionList(subheadingBlock, subheadingBlock.length);

                if (subheadingTitles.length !== subheadingDescriptions.length) {
                  webpageBuffer += includes.htmlFunctions.createSubheadingTitle("Subheading title and description miscount");
                  webpageBuffer += includes.htmlFunctions.createSubheadingDescription("Check that you have a title and desription for each subheading in your comments.");
                } else {
                  for (var i = 0; i < subheadingTitles.length; i++) {

                    webpageBuffer += includes.htmlFunctions.createSubheadingTitle(subheadingTitles[i]);
                    webpageBuffer += includes.htmlFunctions.createSubheadingDescription(subheadingDescriptions[i]);
                  }
                }
              }

            }

          }

        }
        webpageBuffer += includes.htmlFunctions.closeArticleArea();
      })(articleName);

    }

    webpageBuffer += includes.htmlFunctions.createPageFooter();

    return webpageBuffer
  };

  return this;
}

module.exports = styleGuideController;
