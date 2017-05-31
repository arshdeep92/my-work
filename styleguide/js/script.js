'use strict';

var $j = jQuery.noConflict(), rotoRooterApp = rotoRooterApp || {},
	$fontSize = $j('body').css('font-size'), $fontSize = parseInt($fontSize),
	$winHeight = $j(window).height(), // this will come in handy later
	$docHeight = null, // this will come in handy later
	$rubicon = null, // this will come in handy later
	$mainNavArray = [], // this will come in handy later
	$mainNavActive = true, // this will come in handy later
	$subNavArray = [], // this will come in handy later
	$subNavActive = true; // this will come in handy later

rotoRooterApp.styleguide = {
	imgWidthCentre: function () {
		var $images = $j('.img-centre img, .img-centre-w img');
		for(var i=0;i<$images.length;i++){
			var $width = ($j($images[i]).width())/2;
				$width = '-' + $width + 'px';
			$j(this).css({
				"margin-left" : $width
			});
		}
	},
	imgHeightCentre: function() {
		var $images = $j('.img-centre img, .img-centre-h img');
		for(var i=0;i<$images.length;i++){
			var $height = ($j($images[i]).height())/2;
				$height = '-' + $height + 'px';
			$j(this).css({
				"margin-top" : $height
			});
		}
	},
	createCodeSnippets: function() {
		var $codeSnippet = $j('.code-snippet'); // store all aside.code-snippet’s in a variable
		for(var i=0;i<$codeSnippet.length;i++){ // for each $codeSnippet
			var $thisSnippet = $codeSnippet[i],
				$allPre = $j($thisSnippet).find('pre'); // find all pre’s in it
			if ($allPre.length > 1) { // determine if there’s more then one pre, if there is…
				$j($thisSnippet).addClass('tabs'); // …add .tabs to $thisSnippet
				var $tabController = $j('<ul class="tab-controller">'); // create an empty ul.tab-controller
				$allPre.each(function(index) { // for each pre…
					// var $this = $j(this), $thisText = $this.data('language'), $thisId = $thisSnippet.id+'-'+$thisText;
					var $this = $j(this), $thisText = ($this.data('language')?$this.data('language'):"TEXT"), $thisId = $thisSnippet.id+'-'+$thisText;
						$this.attr('id', $thisId);
					var $newItem = $j('<a>').html($thisText.toUpperCase()).attr('href', '#'+$thisId); // create an anchor with the right info
					if (index == 0) { // wrap th new ancho in an li and .visible to the first one created
						$newItem = $j('<li class="visible">').append($newItem);
					} else {
						$newItem = $j('<li>').append($newItem);
					}
					$newItem.appendTo($tabController); // add it to $tabController;
				}).first().addClass('visible'); // add .visible to the first pre
				$j($thisSnippet).prepend($tabController); // add $tabController to $thisSnippet
			}
			$allPre = null; $thisSnippet = null;
		}
	},
	createFigures: function() {
		var $figures = $j('figure');
		for(var i=0;i<$figures.length;i++){
			var $thisFigure = $figures[i],
				$breakpoints = $j($thisFigure).find('.breakpoint');

			if ($breakpoints.length > 1) {
				var $tabController = '<ul class="tab-controller">';

				for(var v=0;v<$breakpoints.length;v++){
					var $breakpoint = $j($breakpoints[v]),
						$breakpointType = $breakpoint.data('layout'),
						$breakpointId = $thisFigure.id+'-'+$breakpointType;
					$breakpoint.attr('id', $breakpointId);
					if ($breakpointType == 'mobile') {
						$breakpoint.addClass('visible');
						$tabController += '<li class="mobile visible"><a href="#'+$breakpointId+'"><svg id="icon_mobile" data-name="Mobile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35"><path d="M21,8H14a2,2,0,0,0-2,2V25a2,2,0,0,0,2,2h7a2,2,0,0,0,2-2V10A2,2,0,0,0,21,8Zm1,16H13V11h9V24Z"/></svg></a></li>';
					} else if ($breakpointType == 'tablet') {
						$tabController += '<li class="tablet"><a href="#'+$breakpointId+'"><svg id="icon_tablet" data-name="Tablet" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35"><path d="M23,6H12a2,2,0,0,0-2,2V27a2,2,0,0,0,2,2H23a2,2,0,0,0,2-2V8A2,2,0,0,0,23,6ZM17.5,28a1,1,0,1,1,1-1A1,1,0,0,1,17.5,28ZM24,25H11V9H24V25Z"/></svg></a></li>';
					} else if ($breakpointType == 'desktop') {
						$tabController += '<li class="desktop"><a href="#'+$breakpointId+'"><svg id="icon_desktop" data-name="Desktop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35"><path d="M27,25a3,3,0,0,0,3-3V9a2,2,0,0,0-2-2H7A2,2,0,0,0,5,9V22a3,3,0,0,0,3,3H3a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2H27ZM7,23V9H28V23H7Z"/></svg></a></li>';
					}
				}
				$tabController += '</ul>';

				$j($thisFigure).addClass('responsive').children('figcaption').before($tabController);
			}
		}
	},
	createMainNav: function (articles) {
		var $newMainNav = '<nav id="main-nav" class="initial">', // create empty nav element
			$newDropDown = '<ul id="nav-drop-down">';

		for (var i=0; i < articles.length; i++) { // iterate over articles and for each article…
			var $thisArticle = articles[i],
				$thisArticleID = $thisArticle.id,
				$thisArticleTitle = $j($thisArticle).children('.title').html(),
				$thisArticleSecs = $j($thisArticle).find('section'); // …see if there are any sections inside the article

			$newMainNav += '<a href="#' + $thisArticleID + '" data-section="' + $thisArticleID + '" class="first-level">' + $thisArticleTitle + '<span class="expand-nav">Expland</span></a>'; // …create a first-level link with the articles id as the href / data-section and text from .title as link text…
			$newDropDown += '<li><a href="#' + $thisArticleID + '" data-section="' + $thisArticleID + '">' + $thisArticleTitle + '</a></li>';

			if ($thisArticleSecs.length >= 1) { // if there are sections…
				$newMainNav += '<nav class="subnav">'; // …add nav.subnav element…

				for (var v=0; v < $thisArticleSecs.length; v++) { // …iterate over the sections and for each section…
					var $thisSection = $thisArticleSecs[v],
						$thisSectionID = $thisSection.id,
						$thisSectionTitle = $j($thisSection).children('.title').html();

					$newMainNav += '<a href="#' + $thisSectionID + '" data-section="' + $thisSectionID + '">' + $thisSectionTitle + '</a>'; // …create a second-level link with the section id as the href / data-section and text from .title as link text…
				}

				$newMainNav += '</nav>';
			}
		}

		$newDropDown += '</ul>';
		$newMainNav += $newDropDown + '</nav>';

		$j('header').append($newMainNav); // append nav#main-nav to header

		setTimeout(function() { // nice CSS transition to fade-in
			$j('#main-nav').removeClass('initial');
		}, 200);
	},
	mainNav: function (winHeight, scrollTop, docHeight, rubicon, mainNavArray, subNavArray) {
		if (scrollTop < rubicon) {
			if (!$j('header').hasClass('splash')) {
				$j('header').removeClass('sticky').addClass('splash');
			}
        } else {
			if ($j('header').hasClass('splash')) {
				$j('header').removeClass('splash').addClass('sticky');
			}
        }

		for (var i=0; i < mainNavArray.length; i++) {
			var $articleID = mainNavArray[i],
				$articlePos = $j($articleID).offset().top, // get the offset of the div from the top of page
				$articleHeight = $j($articleID).height(), // get the height of the div in question
				$navLink = $j('a[href="' + $articleID + '"]');

			if (i==0) {
				$articlePos = $articlePos - (2.5 * $fontSize);
				$articleHeight = $articleHeight + (4.25 * $fontSize);
			} else {
				$articlePos = $articlePos - (4.25 * $fontSize);
				$articleHeight = $articleHeight + (6.75 * $fontSize);
			}

			if (scrollTop >= $articlePos && scrollTop < ($articlePos + $articleHeight)) {
				if ($mainNavActive) {
					$navLink.addClass('current');
				}
				$mainNavActive = false;
			} else if ($navLink.hasClass('current')) {
				$navLink.removeClass('current');
				$mainNavActive = true;
			}
		}

		for (var i=0; i < subNavArray.length; i++) {
			var $sectionID = subNavArray[i],
				$sectionPos = $j($sectionID).offset().top - 4, // get the offset of the div from the top of page
				$sectionHeight = $j($sectionID).height(), // get the height of the div in question
				$subNavLink = $j('a[href="' + $sectionID + '"]');

			if (scrollTop >= $sectionPos && scrollTop < ($sectionPos + $sectionHeight)) {
				$subNavLink.addClass('current');
			} else if ($subNavLink.hasClass('current')) {
				$subNavLink.removeClass('current');
			}
		}

		if(scrollTop + winHeight == docHeight) {
			var $lastMainLink = $j('.first-level', '#main-nav').last();
			if (!$lastMainLink.hasClass('nav-active')) {
				$j('#main-nav').filter('.current').removeClass('current');
				$lastMainLink.addClass('current');
			}
		}
	},

/* =========================================================
   DOCUMENT READY
   ========================================================= */

	docInit: function () {

		/* Is JS active?
		-------------------------------------------------------------- */

		$j('html').addClass('js-active');

		/* Form labels that dissappear
		-------------------------------------------------------------- */

		$j.each($j('input, textarea'), function() {
			if ($j(this).val() != '') {
				$j(this).addClass('active');
			}
		});

		$j('input, textarea').focus(function() {
			$j(this).addClass('active');
		}).blur(function() {
			if ($j(this).val() == '') {
				$j(this).removeClass('active');
			}
		});

		/* Image Centre
		-------------------------------------------------------------- */

		this.imgWidthCentre();
		this.imgHeightCentre();

	},

/* =========================================================
   WINDOW IS READY
   ========================================================= */

	winInit: function () {

		/* Code Snippets
		-------------------------------------------------------------- */

		this.createCodeSnippets();
		$j('.code-snippet').on('click', '.tab-controller a', function(e) { // on click of ul.tab-controller>li>a …
			e.preventDefault(); // …prevent default behaviour
			var $this = $j(this), $parentClass = $this.parent().attr('class');
			if ($parentClass != 'visible') { // if parent does not have .visible…
				var $thisAside = $this.parents('.code-snippet'),
					$controllers = $thisAside.find('.tab-controller li').removeClass('visible'), // remove .visible from all li’s…
					$pres = $thisAside.children('pre').removeClass('visible'); //…and all pre’s
				$this.parent().addClass('visible'); // add .visible to parent li…
				$pres.filter(this.hash).addClass('visible'); //…and to pre who’s data-language attribute matches the hash
			}
		});

		/* Figures
		-------------------------------------------------------------- */

		this.createFigures();
		$j('figure').on('click', '.tab-controller a', function(e) { // on click of ul.tab-controller>li>a …
			e.preventDefault();
			var $this = $j(this), $parentClass = $this.parent().attr('class');
			if ($parentClass != 'visible') { // if parent does not have .visible…
				var $thisFigure = $this.parents('figure'),
					$controllers = $thisFigure.find('.tab-controller li').removeClass('visible'), // remove .visible from all li’s…
					$breakpoints = $thisFigure.children('.breakpoint').removeClass('visible'); //…and all pre’s
				$this.parent().addClass('visible'); // add .visible to parent li…
				$breakpoints.filter(this.hash).addClass('visible'); //…and to pre who’s data-language attribute matches the hash
			}
		});

		/* Navigation
		-------------------------------------------------------------- */

		var $allArticles = $j('article'); // get all articles
		this.createMainNav($allArticles); // create navigation

		var $mainNav = $j('#main-nav'), // get main navigation
			$mainNavLinks = $mainNav.children('.first-level'),  // find first level links
			$subNavLinks = $mainNav.find('.subnav > a'), // find subnav links
			$scrollTop = $j(window).scrollTop();

		$rubicon = $j('article').first().offset().top; $rubicon = $rubicon - (2.5 * $fontSize); // update global $rubicon (top of the first article)
		$docHeight = $j(document).height(); // update global document height variable

		for (var i=0; i < $mainNavLinks.length; i++) { // update the global empty array with href attributes
			var $href = $j($mainNavLinks[i]).attr('href');
			$mainNavArray.push($href);
		}

		for (var v=0; v < $subNavLinks.length; v++) { // update the global empty array with href attributes
			var $href = $j($subNavLinks[v]).attr('href');
			$subNavArray.push($href);
		}

		this.mainNav($winHeight, $scrollTop, $docHeight, $rubicon, $mainNavArray, $subNavArray); // run the main nav function when window loads

		var $isExpanded = false, $canCollapse = false, $collapseTimer;

		$j('header').on('click', '.expand-nav', function(e) {
			e.preventDefault();
			e.stopPropagation();
			var $thisParent = $j(this).parent(),
				$navDropDown = $thisParent.siblings("#nav-drop-down");
			if ($isExpanded == true) {
				$isExpanded = false;
				$canCollapse = false;
				$thisParent.removeClass('expanded');
				$navDropDown.fadeOut(200);
				clearTimeout($collapseTimer);
			} else {
				$isExpanded = true;
				$canCollapse = false;
				$navDropDown.fadeIn(200);
				$thisParent.addClass('expanded');
			}
		});

		$j('header').on('click', 'nav a', function(e) {
			e.preventDefault();
			var $hash = this.hash;
			$j('html, body').animate({
				scrollTop: $j($hash).offset().top
			}, 100);
			if ($isExpanded == true) {
				$isExpanded = false;
				$canCollapse = false;
				$j(this).parents('#main-nav').find('.expanded').removeClass('expanded').siblings("#nav-drop-down").fadeOut(200);
				clearTimeout($collapseTimer);
			}
		});

		$j('header').on({
			mouseleave: function(){
				if ($isExpanded == true) {
					$canCollapse = true;
					$collapseTimer = setTimeout(function(){
						$isExpanded = false;
						$canCollapse = false;
						$j('a.expanded','#main-nav').removeClass('expanded').siblings("#nav-drop-down").fadeOut(200);
						clearTimeout($collapseTimer);
					}, 5000);
				}
			},
			mouseenter: function(){
				clearTimeout($collapseTimer);
				$canCollapse = false;
			}
		}, '#nav-drop-down, a.first-level.current');

		$j('body').on('click', function(e) {
			if ($canCollapse == true) {
				$isExpanded = false;
				$canCollapse = false;
				$j('a.expanded','#main-nav').removeClass('expanded').siblings("#nav-drop-down").fadeOut(200);
				clearTimeout($collapseTimer);
			}
		});
	}
};

$j(document).ready(function() { rotoRooterApp.styleguide.docInit() });
window.onload = function() { rotoRooterApp.styleguide.winInit() };

$j(window).scroll(function(){
	var $scrollTop = $j(window).scrollTop();
	rotoRooterApp.styleguide.mainNav($winHeight, $scrollTop, $docHeight, $rubicon, $mainNavArray, $subNavArray); // run the main nav function every time window is scrolled
});
