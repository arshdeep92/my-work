<?php

//Initialize settings variables to keep them out of the settings file.
$resourceFiles = array();
$pageHeadings = array();
$contentLayout = array();
$stringLookUps = array();

$filesText = array();

include_once "settings.php";

$codeIndexes = array();

$lastStrPos = 0;

// Get each remote file.
foreach ($resourceFiles as $arrayIndex => $resourceFile) {
  $filesText[$resourceFile] = file_get_contents($resourceFile);
  
  // Create a list of which CodeID is in which file, along with its position, for faster lookups.
  while (($lastStrPos = strpos($filesText[$resourceFile], $stringLookUps["codeID"], $lastStrPos)) !== false) {
    
    $lastStrPos = $lastStrPos + strlen($stringLookUps["codeID"]);
    
    $endOfLinePos = strpos($filesText[$resourceFile], $stringLookUps["codeIDEnd"], $lastStrPos);
    $extractedCodeID = substr($filesText[$resourceFile], $lastStrPos, ($endOfLinePos - $lastStrPos));
    $codeIndexes[$resourceFile][trim((string)$extractedCodeID)] = $lastStrPos;
  }

}

function getCodeLocation($codeID, $codeIndexes, $filesText) {
  
  $codeID = trim((string)$codeID);
  
  foreach ($codeIndexes as $codeFile => $indexedCodeID) {

    if (isset($indexedCodeID[$codeID])) {
      return array($codeFile, $indexedCodeID[$codeID]); //Return both the filename and the location in the file.
    }
  }
  return false;  
}

function getCodeTitle($codeID, $codeIndexes, $filesText, $stringLookUps) {
  
  $codeStartLocation = getCodeLocation($codeID, $codeIndexes, $filesText);
  
  if (!$codeStartLocation) {return "No CodeID found";}
  
  if (isset($filesText[$codeStartLocation[0]])) {
    $titleStartPos = strpos($filesText[$codeStartLocation[0]], $stringLookUps["codeTitle"], $codeStartLocation[1]);
    $titleEndPos = strpos($filesText[$codeStartLocation[0]], $stringLookUps["codeTitleEnd"], $titleStartPos);
    
    $titleStartPos += strlen($stringLookUps["codeTitle"]);
    
    $extractedTitle = substr($filesText[$codeStartLocation[0]], $titleStartPos, ($titleEndPos - $titleStartPos));
    
    return $extractedTitle;
  }
  
  return false;
  
}

function getFileNameExtension($codeID, $codeIndexes, $filesText) {
  
  $codeStartLocation = getCodeLocation($codeID, $codeIndexes, $filesText);
  
  if (!$codeStartLocation) {return "No CodeID found";}
  
  $filenameCut = explode('.', $codeStartLocation[0]);
  $fileExtension = end($filenameCut);
  
  return $fileExtension;
  
}

function getCodeDescription($codeID, $codeIndexes, $filesText, $stringLookUps) {
  
  $codeStartLocation = getCodeLocation($codeID, $codeIndexes, $filesText);
  
  if (!$codeStartLocation) {return "Ensure that your CodeID matches between the settings file and your source file.";}
  
  $descriptionStartPos = strpos($filesText[$codeStartLocation[0]], $stringLookUps["codeDescription"], $codeStartLocation[1]);
  $descriptionEndPos = strpos($filesText[$codeStartLocation[0]], $stringLookUps["codeDescriptionEnd"], $descriptionStartPos);
  
  $descriptionStartPos += strlen($stringLookUps["codeDescription"]);
  
  $extractedDescription = substr($filesText[$codeStartLocation[0]], $descriptionStartPos, ($descriptionEndPos - $descriptionStartPos));
  
  return $extractedDescription;
  
}

function getCodeLanguage($codeID, $codeIndexes, $filesText, $stringLookUps) {
  
  $codeStartLocation = getCodeLocation($codeID, $codeIndexes, $filesText);
  
  if (!$codeStartLocation) {return "Ensure that your CodeID matches between the settings file and your source file.";}
  
  $languageStartPos = strpos($filesText[$codeStartLocation[0]], $stringLookUps["codeLanguage"], $codeStartLocation[1]);
  $languageEndPos = strpos($filesText[$codeStartLocation[0]], $stringLookUps["codeLanguageEnd"], $languageStartPos);
  $codeBegins = strpos($filesText[$codeStartLocation[0]], $stringLookUps["codeCode"], $codeStartLocation[1]);
  
  if ($languageStartPos > $codeBegins || !$languageStartPos) { return "none"; }
  
  $languageStartPos += strlen($stringLookUps["codeLanguage"]);
  
  $extractedLanguage = substr($filesText[$codeStartLocation[0]], $languageStartPos, ($languageEndPos - $languageStartPos));
  
  $extractedLanguage = trim(strtolower($extractedLanguage));
  
  return $extractedLanguage;
  
}

function getCodeCode($codeID, $codeIndexes, $filesText, $stringLookUps) {
  
  $codeStartLocation = getCodeLocation($codeID, $codeIndexes, $filesText);
  
  if (!$codeStartLocation) {return "No CodeID found";}
  
  $codeStartPos = strpos($filesText[$codeStartLocation[0]], $stringLookUps["codeCode"], $codeStartLocation[1]);
  $codeEndPos = strpos($filesText[$codeStartLocation[0]], $stringLookUps["codeCodeEnds"], $codeStartPos);
  
  $codeStartPos += strlen($stringLookUps["codeCode"]);
  
  $extractedCode = substr($filesText[$codeStartLocation[0]], $codeStartPos, ($codeEndPos - $codeStartPos));
  
  return $extractedCode;
  
}

function getCodeSubheadingList($codeID, $codeIndexes, $filesText, $stringLookUps) {
  
  $codeStartLocation = getCodeLocation($codeID, $codeIndexes, $filesText);
  
  $nextCodeBegins = strpos($filesText[$codeStartLocation[0]], $stringLookUps["codeCode"], $codeStartLocation[1]);
  
  $nextSubheadingBlockStartPos = strpos($filesText[$codeStartLocation[0]], $stringLookUps["blockSubheadings"], $codeStartLocation[1]);
  
  if (($nextSubheadingBlockStartPos > $nextCodeBegins) || (!$nextSubheadingBlockStartPos) || (!$nextCodeBegins)) {
    return false; //There are no subheadings in this section.
  }
  
  $subheadingEndPos = strpos($filesText[$codeStartLocation[0]], $stringLookUps["blockSubheadingsEnd"], $nextSubheadingBlockStartPos);
  
  $nextSubheadingBlockStartPos += strlen($stringLookUps["blockSubheadings"]);
  
  $extractedSubHeadingBlock = substr($filesText[$codeStartLocation[0]], $nextSubheadingBlockStartPos, ($subheadingEndPos - $nextSubheadingBlockStartPos));
  
  return $extractedSubHeadingBlock;
  
}

function getSubheadingTitleList($subheadingBlock, $subheadingBlockLength, $stringLookUps) {
  
  $subheadingTitleList = array();
  
  $lastSubheadingStrPos = 0;

  while (($lastSubheadingStrPos = strpos($subheadingBlock, $stringLookUps["codeSubheadings"], $lastSubheadingStrPos)) !== false) {
    
    $lastSubheadingStrPos = $lastSubheadingStrPos + strlen($stringLookUps["codeSubheadings"]);
    
    $endOfSubheadingPos = strpos($subheadingBlock, $stringLookUps["codeSubheadingsEnd"], $lastSubheadingStrPos);
    $extractedSubheading = substr($subheadingBlock, $lastSubheadingStrPos, ($endOfSubheadingPos - $lastSubheadingStrPos));
    $subheadingTitleList[] = trim((string)$extractedSubheading);
    
    if ($lastSubheadingStrPos > $subheadingBlockLength) { break; }
    
  }

  return $subheadingTitleList;
  
}

function getSubheadingDescriptionList($subheadingBlock, $subheadingBlockLength, $stringLookUps) {
  
  $subheadingDescriptionList = array();
  
  $lastSubheadingStrPos = 0;

  while (($lastSubheadingStrPos = strpos($subheadingBlock, $stringLookUps["codeSubheadingsDescription"], $lastSubheadingStrPos)) !== false) {
    
    $lastSubheadingStrPos = $lastSubheadingStrPos + strlen($stringLookUps["codeSubheadingsDescription"]);
    
    $endOfSubheadingPos = strpos($subheadingBlock, $stringLookUps["codeSubheadingsDescriptionEnd"], $lastSubheadingStrPos);
    $extractedSubheadingDescription = substr($subheadingBlock, $lastSubheadingStrPos, ($endOfSubheadingPos - $lastSubheadingStrPos));
    $subheadingDescriptionList[] = trim((string)$extractedSubheadingDescription);
    
    if ($lastSubheadingStrPos > $subheadingBlockLength) { break; }
    
  }

  return $subheadingDescriptionList;
  
}

function makeSafe($inputString) {
  $inputString = trim($inputString);
  $inputString = str_replace(" ", "-", $inputString);
  $inputString = str_replace("&", "_", $inputString);
  $inputString = strtolower($inputString);
  
  return $inputString;
  
}

/* 

Page rendering functions start here

// */

function createPageHead() {
  ?>
<!DOCTYPE html><html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head prefix="og: http://ogp.me/ns#">
	<style type="text/css" media="screen">body {opacity: 0}</style>
	<noscript><style type="text/css" media="screen">body {opacity: 1}</style></noscript>
	<script type="text/javascript" src="js/fontsmoothie.min.js"></script>
	<!--[if lt IE 9]><script type="text/javascript">document.createElement('header');document.createElement('nav');document.createElement('section');document.createElement('article');document.createElement('aside');document.createElement('footer');document.createElement('hgroup');</script><![endif]-->
	
	<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
	<meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0,user-scalable=yes">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="robots" content="index,no-follow"> <!-- Take out when you go live -->
	<title>Bel Styleguide & UI Kit</title>
	<meta name="author" content="Architech">
</head>

<body id="home"> 
<div class="wrapper" id="wrapper"><header class="splash">
		<a href="/index.php" id="logo">BEL: Power | Protect | Connect</a>
		<h1>Bel Styleguide & UI Kit</h1>
		<form id="search-form">
			<div class="fieldrow textrow">
				<label for="search-site">Search</label>
				<input type="text" id="search-site" name="search-site">
				<button><span>&#xE8B6;</span></button>
			</div>
		</form>
	</header>
  
<?php
}

function createPageFooter() {
?>

</div><!-- END header END #wrapper -->

<!-- - - - - - - - - FOOTER STARTS - - - - - - - - -->

<footer>
	<div>
		<p>&copy; <?php echo date('Y'); ?>. <span class="source-org vcard copyright">Designed & develop by <a href="http://www.architech.ca" target="_blank">Architech</a></span></p>
		<ul class="inline foot-nav">
			<li><a href="mailto:dsobolev@architech.ca">Contact</a></li>
			<li><a href="https://github.com" target="_blank">GitHub</a></li>
		</ul>
	</div>
</footer><!-- END footer -->

<link rel="stylesheet" href="css/style.css" type="text/css" media="screen">
<script type="text/javascript" src="js/jquery.min.js"></script>
<!-- Web Fonts -->
<script>function fadeIn() {var x=document.getElementsByTagName("body"), x=x[0]; x.style.opacity = 0; var tick = function() {x.style.opacity = +x.style.opacity + 0.10; if (+x.style.opacity < 1) { (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 11) }}; tick();} WebFontConfig = {typekit:{id:'xup5czy'},google:{families:['Material Icons','Droid Sans Mono']},custom:{families:['avant-garde-std'],urls:['css/fonts.css']},active: function() {fadeIn();},inactive: function() {fadeIn();},timeout: 500};(function(d){var wf = d.createElement('script'), s = d.scripts[0];wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js';s.parentNode.insertBefore(wf, s);})(document);</script>
<script type="text/javascript" src="js/prism.js"></script>
<script type="text/javascript" src="js/script.js"></script>

<!--[if lte IE 9]>
	<link rel="stylesheet" type="text/css" media="screen" href="css/ie9.css" />
	<script type="text/javascript" src="js/ie9.js"></script>
<![endif]-->
<!--[if gte IE 10]>
	<link rel="stylesheet" type="text/css" media="screen" href="css/ie10.css" />
	<script type="text/javascript" src="js/ie10.js"></script>
<![endif]-->
</body>
</html>

<?php
}

function createArticleHead($articleName) {
  
  $output = sprintf('      <article id="%s">' . "\n", $articleName);
  
  return $output;
  
}

function createCodeSnippet($articleName, $theCode, $codeStyle = "none") {

  if ($codeStyle == "none") {
    $output = sprintf('        <aside class="code-snippet" id="%s-aside">' . "\n" . '          <pre><code>' . "\n" . '%s' . "\n" . '          </code></pre>' . "\n" . '        </aside>' . "\n", $articleName, $theCode);
  } else {
    $output = sprintf('        <aside class="code-snippet" id="%s-aside">' . "\n" . '          <pre><code class="language-%s">' . "\n" . '%s' . "\n" . '          </code></pre>' . "\n" . '        </aside>' . "\n", $articleName, $codeStyle, $theCode);
  }
  
  
  return $output;
  
}

function createArticleTitle($articleTitle) {
  
  $output = sprintf('    <h2 class="title">%s</h2>' . "\n", $articleTitle);
  
  return $output;
  
}

function createCodeTitle($codeTitle, $safeCodeTitle, $safeArticleName) {
  
  $output = sprintf('    <section id="%s-%s">' . "\n" . '      <h3 class="title">%s</h2>' . "\n", $safeArticleName, $safeCodeTitle, $codeTitle);
  
  return $output;
  
}

function createCodeDescription($codeDescription) {

  $output = sprintf('      <p>%s' . "\n" . '      </p>' . "\n", $codeDescription);
  
  return $output;
  
}

function createSubheadingTitle($subheadingTitle) {

  $output = sprintf("      <h4>%s</h4>\n", $subheadingTitle);
  
  return $output;
  
}

function createSubheadingDescription($subheadingDescription) {

  $output = sprintf("      <p>%s</p>\n\n", $subheadingDescription);
  
  return $output;
  
}

function closeCodeDescription() {

  $output = sprintf('      </section>' . "\n");
  
  return $output;
  
}

function closeArticleArea() {

  $output = sprintf('    </article>' . "\n" . '    <hr>' . "\n");
  
  return $output;
  
}



// Page rendering code starts here

createPageHead();

foreach ($pageArticleHeadings as $articleName => $articleData) {
  
  foreach ($pageHeadings as $headingTitle => $headingValue) {
    
    if ($headingTitle == $articleName) {

      $safeArticleName = makeSafe($articleName);
      echo createArticleHead($safeArticleName);
      echo createCodeSnippet($safeArticleName, $articleData["code"]);
      echo createArticleTitle($articleName);
      echo createCodeDescription($articleData["description"]);
      
      foreach($headingValue as $codeID) {

        $codeTitle = getCodeTitle($codeID, $codeIndexes, $filesText, $stringLookUps);
        $articleCode = getCodeCode($codeID, $codeIndexes, $filesText, $stringLookUps);
        $codeDescription = getCodeDescription($codeID, $codeIndexes, $filesText, $stringLookUps);
        $codeType = getCodeLanguage($codeID, $codeIndexes, $filesText, $stringLookUps);
        
        $safeCodeTitle = makeSafe($codeTitle);
        
        echo createCodeSnippet($safeCodeTitle, $articleCode, $codeType);
        echo createCodeTitle($codeTitle, $safeCodeTitle, $safeArticleName);
        echo createCodeDescription($codeDescription);
        echo closeCodeDescription();
        
        $subheadingBlock = getCodeSubheadingList($codeID, $codeIndexes, $filesText, $stringLookUps);

        if ($subheadingBlock !== false) {
          $subheadingTitles = getSubheadingTitleList($subheadingBlock, strlen($subheadingBlock), $stringLookUps);
          $subheadingDescriptions = getSubheadingDescriptionList($subheadingBlock, strlen($subheadingBlock), $stringLookUps);

          if (count($subheadingTitles) !== count($subheadingDescriptions)) {
            echo createSubheadingTitle("Subheading title and description miscount");
            echo createSubheadingDescription("Check that you have a title and desription for each subheading in your comments.");
          } else {
            for ($i = 0; $i < count($subheadingTitles); $i++) {
              echo createSubheadingTitle($subheadingTitles[$i]);
              echo createSubheadingDescription($subheadingDescriptions[$i]);
            }
          }
          

        }

      }
      
      echo closeArticleArea();
      
    };
  }
}

createPageFooter();











