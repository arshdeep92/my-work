module.exports = {};

var htmlFunctions = function(includes, settings) {

  this.init = function() {

    console.log("htmlFunctions::init(): Completed");
    console.log("");
  };

  this.createPageHead = function() {
    var output = `<!DOCTYPE html><html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml">
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

`;

    return output;

  };

  this.createPageFooter = function() {
    var output = `
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
`;

    return output;
  };

  this.createArticleHead = function(articleName) {
    var output = '      <article id="' + articleName + '">' + "\n";

    return output;
  };

  this.createCodeSnippet = function(articleName) {

    // output = '        <aside class="code-snippet" id="' + articleName + '-aside"><pre>' + "\n";
    output = '        <aside class="code-snippet" id="' + articleName + '-aside">' + "\n";

    return output;
  };

  this.createCodeSnippetEnd = function() {

    output = '        </aside>' + "\n";

    return output;
  };

  this.createCodeBlock = function(codeStyle, theCode) {

    codeStyle = (!codeStyle ? "none" : codeStyle);

    if (codeStyle == "none") {
      output = '          <pre><code style="white-space: normal;">' + "\n" + theCode + "\n" + '          </code></pre>' + "\n";
    } else {
      output = '          <pre data-language=' + codeStyle + '><code class="language-' + codeStyle + '">' + "\n" + theCode + "\n" + '          </code></pre>' + "\n";
    }

    return output;
  };

  this.createArticleTitle = function(articleTitle) {
    var output = '    <h2 class="title">' + articleTitle + '</h2>' + "\n"

    return output;
  };

  this.createCodeTitle = function(codeTitle, safeCodeTitle, safeArticleName) {
    var output = '    <section id="' + safeArticleName + '-' + safeCodeTitle + '">' + "\n" + '      <h3 class="title">' + codeTitle + '</h2>' + "\n";

    return output;
  };

  this.createCodeDescription = function(codeDescription) {
    var output = '      <p>' + codeDescription + "\n" + '      </p>' + "\n"

    return output;
  };

  this.createSubheadingTitle = function(subheadingTitle) {
    var output = "      <h4>" + subheadingTitle + "</h4>\n";

    return output;
  };

  this.createSubheadingDescription = function(subheadingDescription) {
    var output = "      <p>" + subheadingDescription + "</p>\n\n"

    return output;
  };

  this.closeCodeDescription = function() {
    var output = '      </section>' + "\n";

    return output;
  };

  this.closeArticleArea = function() {
    var output = '    </article>' + "\n" + '    <hr>' + "\n";

    return output;
  };

  this.makeHTMLSafe = function(inputString) {
    var outputString = inputString.trim();
    outputString = outputString.replace(" ", "-");
    outputString = outputString.replace("&", "_");
    outputString = outputString.toLowerCase();

    return outputString;
  };

  return this;
}

module.exports = htmlFunctions;
