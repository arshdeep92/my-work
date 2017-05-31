module.exports = {};

var resourceReader = function(includes, settings) {

  this.init = function() {

    console.log("resourceReader::init(): Completed");
    console.log("");
  };

  this.getRemoteFiles = function(fileList, completedCallback) {
    fileList = (!fileList ? settings.resourceFiles : fileList);

    var filesText = [];

    if (!completedCallback) {
      for (fileName in fileList) {
        filesText[fileList[fileName]] = includes.fs.readFileSync(fileList[fileName]).toString();
      }
      return filesText;
    } else {
      var loadedFilesCount = 0;
      for (fileName in fileList) {
        (function(fn){
          filesText[fileList[fn]] = includes.fs.readFile(fileList[fn], function(error, buffer) {
            (function(l, f, b) {
              filesText[l[f]] = b;
              loadedFilesCount++;
              if (loadedFilesCount === l.length) {
                completedCallback(filesText);
              }
            })(fileList, fn, buffer.toString());
          });
        })(fileName);

      }
    }
  }

  this.createCodeIDIndex = function(fileList) {

    var codeIndexes = {};

    for (fileName in fileList) {
      var lastStrPos = 0;
      var currentPos = 0;

      while (currentPos !== -1) {

        currentPos = fileList[fileName].indexOf(settings.stringLookUps["codeID"], lastStrPos);

        lastStrPos = currentPos + settings.stringLookUps["codeID"].length;

        var endOfLinePos = fileList[fileName].indexOf(settings.stringLookUps["codeIDEnd"], lastStrPos);
        var extractedCodeID = fileList[fileName].substring(lastStrPos, endOfLinePos).toString();
        (function(fn, ecid, lp){
          if (!codeIndexes[fn]) {
            codeIndexes[fn] = {};
          }
          if (!codeIndexes[fn][ecid]) {
            codeIndexes[fn][ecid] = [];
          }
          codeIndexes[fn][ecid].push(lp);
        })(fileName, extractedCodeID.trim(), lastStrPos);
      }

    }

    return codeIndexes;

  };

  this.getCodeTitle = function(codeID, codeIndexes, filesText) {

    var codeStartLocation = includes.resourceReader.getCodeLocation(codeID, codeIndexes, filesText);

    if (!codeStartLocation) { return "Ensure that your CodeID matches between the settings file and your source file. CodeID: " + codeID; }

    if (filesText[codeStartLocation[0]]) {
      for (codeStartLocationsList in codeStartLocation[1]) {
        var titleStartPos = filesText[codeStartLocation[0]].indexOf(settings.stringLookUps["codeTitle"], codeStartLocation[1][codeStartLocationsList]);
        var titleEndPos = filesText[codeStartLocation[0]].indexOf(settings.stringLookUps["codeTitleEnd"], titleStartPos);
        var codeBegins = filesText[codeStartLocation[0]].indexOf(settings.stringLookUps["codeCode"], codeStartLocation[1][codeStartLocationsList]);

        if (titleStartPos > codeBegins || titleStartPos === -1) { continue; }

        titleStartPos += settings.stringLookUps["codeTitle"].length;

        var extractedTitle = filesText[codeStartLocation[0]].substring(titleStartPos, titleEndPos);

        return extractedTitle.trim();
      }
    }

    return "none";

  };

  this.getCodeArrayBlocks = function(codeIndexes, filesText) {

    var languageToCodeBlock = {};

    for (fileName in codeIndexes) {
      (function(fn) {
        for (codeID in codeIndexes[fn]) {
          (function(cid){

            if (!languageToCodeBlock[cid]) {
              languageToCodeBlock[cid] = [];
            }

            var codeCode = includes.resourceReader.getCodeCode(cid, codeIndexes, filesText);
            var codeLanguage = includes.resourceReader.getCodeLanguage(cid, codeIndexes, filesText);

            var tmpObj = {};
            tmpObj[codeLanguage] = codeCode;

            if (codeLanguage === "none" || codeLanguage == undefined) {
              var tmpObj = {};
              tmpObj["none"] = codeCode[0];
              languageToCodeBlock[cid].push(tmpObj);
            } else {

              for (var i = 0; i < codeCode.length; i++) {
                (function(index){
                  var tmpObj = {};

                  if (codeLanguage[index]) {
                    tmpObj[codeLanguage[index]] = codeCode[index];
                    languageToCodeBlock[cid].push(tmpObj);
                  } else {
                    tmpObj["text-" + index] = codeCode[index];
                    languageToCodeBlock[cid].push(tmpObj);
                  }

                })(i);
              }
            }
          })(codeID);
        }
      })(fileName);
    }

    return languageToCodeBlock;

  }

  this.getCodeCode = function(codeID, codeIndexes, filesText) {

    var codeStartLocation = includes.resourceReader.getCodeLocation(codeID, codeIndexes, filesText);

    var codeBlocks = [];

    if (!codeStartLocation) { return "Ensure that your CodeID matches between the settings file and your source file. CodeID: " + codeID; }

    if (filesText[codeStartLocation[0]]) {
      for (codeStartLocationsList in codeStartLocation[1]) {
        var codeStartPos = filesText[codeStartLocation[0]].indexOf(settings.stringLookUps["codeCode"], codeStartLocation[1][codeStartLocationsList]);
        var codeEndPos = filesText[codeStartLocation[0]].indexOf(settings.stringLookUps["codeCodeEnds"], codeStartPos);

        codeStartPos += settings.stringLookUps["codeCode"].length;

        var extractedCode = filesText[codeStartLocation[0]].substring(codeStartPos, codeEndPos);

        codeBlocks.push(extractedCode.trim());
      }

      return codeBlocks;

    }

    return "none";

  };

  this.getCodeLanguage = function(codeID, codeIndexes, filesText) {

    var codeStartLocation = includes.resourceReader.getCodeLocation(codeID, codeIndexes, filesText);

    var codeLanguages = [];

    if (!codeStartLocation) { return "Ensure that your CodeID matches between the settings file and your source file. CodeID: " + codeID; }

    if (filesText[codeStartLocation[0]]) {
      for (codeStartLocationsList in codeStartLocation[1]) {
        var languageStartPos = filesText[codeStartLocation[0]].indexOf(settings.stringLookUps["codeLanguage"], codeStartLocation[1][codeStartLocationsList]);
        var languageEndPos = filesText[codeStartLocation[0]].indexOf(settings.stringLookUps["codeLanguageEnd"], languageStartPos);
        var codeBegins = filesText[codeStartLocation[0]].indexOf(settings.stringLookUps["codeCode"], codeStartLocation[1][codeStartLocationsList]);

        if (languageStartPos > codeBegins || languageStartPos === -1) { codeLanguages.push("none"); continue; }

        languageStartPos += settings.stringLookUps["codeLanguage"].length;

        var extractedLanguage = filesText[codeStartLocation[0]].substring(languageStartPos, languageEndPos);

        codeLanguages.push(extractedLanguage.trim());

      }
      if (codeLanguages.length === 0) { return ["none"]; }
      return codeLanguages;
    }

    return ["none"];

  };

  this.getCodeDescription = function(codeID, codeIndexes, filesText) {

    var codeStartLocation = includes.resourceReader.getCodeLocation(codeID, codeIndexes, filesText);

    if (!codeStartLocation) { return "Ensure that your CodeID matches between the settings file and your source file. CodeID: " + codeID; }

    if (filesText[codeStartLocation[0]]) {
      for (codeStartLocationsList in codeStartLocation[1]) {
        var descriptionStartPos = filesText[codeStartLocation[0]].indexOf(settings.stringLookUps["codeDescription"], codeStartLocation[1][codeStartLocationsList]);
        var descriptionEndPos = filesText[codeStartLocation[0]].indexOf(settings.stringLookUps["codeDescriptionEnd"], descriptionStartPos);
        var codeBegins = filesText[codeStartLocation[0]].indexOf(settings.stringLookUps["codeCode"], codeStartLocation[1][codeStartLocationsList]);

        if (descriptionStartPos > codeBegins || descriptionStartPos === -1) { continue; }

        descriptionStartPos += settings.stringLookUps["codeDescription"].length;

        var extractedDescription = filesText[codeStartLocation[0]].substring(descriptionStartPos, descriptionEndPos);

        return extractedDescription.trim();
      }
    }

    return "none";

  };

  this.getCodeSubheadingList = function(codeID, codeIndexes, filesText) {

    var codeStartLocation = includes.resourceReader.getCodeLocation(codeID, codeIndexes, filesText);
    if (filesText[codeStartLocation[0]]) {
      for (codeStartLocationsListIndex in codeStartLocation[1]) {
        var nextCodeBegins = filesText[codeStartLocation[0]].indexOf(settings.stringLookUps["codeCode"], codeStartLocation[1][codeStartLocationsListIndex]);
        var nextSubheadingBlockStartPos = filesText[codeStartLocation[0]].indexOf(settings.stringLookUps["blockSubheadings"], codeStartLocation[1][codeStartLocationsListIndex]);

        if ((nextSubheadingBlockStartPos > nextCodeBegins) || (nextSubheadingBlockStartPos === -1) || (nextCodeBegins === -1)) {
          continue;
        }

        var subheadingEndPos = filesText[codeStartLocation[0]].indexOf(settings.stringLookUps["blockSubheadingsEnd"], nextSubheadingBlockStartPos);

        nextSubheadingBlockStartPos += settings.stringLookUps["blockSubheadings"].length;

        var extractedSubHeadingBlock = filesText[codeStartLocation[0]].substring(nextSubheadingBlockStartPos, subheadingEndPos);

        return extractedSubHeadingBlock;
      }
    }

    return false;

  };

  this.getCodeLocation = function(codeID, codeIndexes, filesText) {

    codeID = String(codeID).trim();

    for (codeFile in codeIndexes) {
      if (codeIndexes[codeFile][codeID]) {
        return [codeFile, codeIndexes[codeFile][codeID]]; //Return both the filename and the location(s) in the file.
      }
    }

    return false;
  };

  this.getSubheadingTitleList = function(subheadingBlock, subheadingBlockLength) {

    var subheadingTitleList = [];
    var lastSubheadingStrPos = 0;
    var currentPos = 0;

    while (currentPos !== -1) {

      currentPos = subheadingBlock.indexOf(settings.stringLookUps["codeSubheadings"], lastSubheadingStrPos);

      lastSubheadingStrPos = currentPos + settings.stringLookUps["codeSubheadings"].length;

      var endOfSubheadingPos = subheadingBlock.indexOf(settings.stringLookUps["codeSubheadingsEnd"], lastSubheadingStrPos);
      var extractedSubheading = subheadingBlock.substring(lastSubheadingStrPos, endOfSubheadingPos);

      if (currentPos !== -1) {
        (function(esh){
          subheadingTitleList.push(esh);

        })(extractedSubheading.trim());
      }

      if (lastSubheadingStrPos > subheadingBlockLength) { break; }

    }

    return subheadingTitleList;
  };

  this.getSubheadingDescriptionList = function(subheadingBlock, subheadingBlockLength) {

    var subheadingDescriptionList = [];
    var lastSubheadingStrPos = 0;
    var currentPos = 0;

    while (currentPos !== -1) {

      currentPos = subheadingBlock.indexOf(settings.stringLookUps["codeSubheadingsDescription"], lastSubheadingStrPos);

      lastSubheadingStrPos = currentPos + settings.stringLookUps["codeSubheadingsDescription"].length;

      var endOfSubheadingPos = subheadingBlock.indexOf(settings.stringLookUps["codeSubheadingsDescriptionEnd"], lastSubheadingStrPos);
      var extractedSubheadingDescription = subheadingBlock.substring(lastSubheadingStrPos, endOfSubheadingPos);

      if (currentPos !== -1) {
        (function(ehd){
          subheadingDescriptionList.push(ehd);
        })(extractedSubheadingDescription.trim());
      }

      if (lastSubheadingStrPos > subheadingBlockLength) { break; }
    }

    return subheadingDescriptionList;
  };

  return this;
}

module.exports = resourceReader;
