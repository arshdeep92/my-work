<?php

$resourceFiles[] = "ex/test.txt";
$resourceFiles[] = "ex/anothertext.css";
// $resourceFiles[] = "anotherfile.ext";

// Specify which code IDs go under which articles.
$pageHeadings["Introduction"][] = "c4a75718-c021-4067-9793-e4676b0ce9b3";
$pageHeadings["Introduction"][] = "myID";
$pageHeadings["Introduction"][] = "22e7e0a4-4335-4666-b0ec-f446074ce822";
$pageHeadings["Introduction"][] = "61d6269e-c74e-4868-84da-a61ed52c6792";
$pageHeadings["Introduction"][] = "eca5dcb7-8bb5-45eb-be23-2f07106d8362";
$pageHeadings["Frameworks"][] = "83454b03-62ff-42ec-8daa-737280675614";
$pageHeadings["Frameworks"][] = "9aa26161-a111-4f94-9dd2-50762be137ae";
$pageHeadings["Frameworks"][] = "546df527-f129-4686-aa08-4d55b355a1de";
$pageHeadings["Frameworks"][] = "6acfc8f4-04f3-4f74-9197-786ce9b0ae1b";
$pageHeadings["Frameworks"][] = "98feceb6-7b9c-4736-a86f-b6143879bf9b";
$pageHeadings["Frameworks"][] = "c9c19f9a-22dd-4346-a092-2efaa328123d";
$pageHeadings["Frameworks"][] = "487f16c4-a705-4576-8160-d0784bfb91c2";


// Top level menu. You can force the order of menus here.
$pageArticleHeadings["Introduction"] = array(
  "title" => "Introduction", 
  "description" => "The purpose of this styleguide is too enable better collaboration between designers and developers working on the Bel's website. Treat this document as a user interface specification / documentation / development guide. Good knowledge of user interface design as well as front-end development tools, methods and best practices is beneficial when reading this document.</p>\n<p>This is a living document and will evolve as time goes on. If you are working on Bel's website please check back often.",
  "code" => "This sidebar contains snippets of code to help developers implement the user interface design. Developers can toggle between HTML, CSS/SASS & JavaScript code snippets to see relevant code in each language."
);
  
$pageArticleHeadings["Frameworks"] = array(
  "title" => "Frameworks",
  "description" => "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "code" => ""
);

$pageArticleHeadings["Global Elements"] = array(
  "title" => "Global Elements",
  "description" => "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "code" => ""
);



//Comments area lookup leys
$stringLookUps["codeID"] = "CodeID:";
$stringLookUps["codeIDEnd"] = "\n";

$stringLookUps["codeTitle"] = "Title:";
$stringLookUps["codeTitleEnd"] = "\n";

$stringLookUps["codeDescription"] = "Description:";
$stringLookUps["codeDescriptionEnd"] = "EndCodeDescription";

$stringLookUps["codeCode"] = "CodeBegings: */";
$stringLookUps["codeCodeEnds"] = "/* Code Ends */";

$stringLookUps["codeLanguage"] = "Language:";
$stringLookUps["codeLanguageEnd"] = "\n";

$stringLookUps["codeSubheadings"] = "Subheading:";
$stringLookUps["codeSubheadingsEnd"] = "\n";
$stringLookUps["codeSubheadingsDescription"] = "SubDescription:";
$stringLookUps["codeSubheadingsDescriptionEnd"] = "EndSubheadingDescription";
$stringLookUps["blockSubheadings"] = "SubheadingsBlockStart";
$stringLookUps["blockSubheadingsEnd"] = "SubheadingsBlockEnd";

















