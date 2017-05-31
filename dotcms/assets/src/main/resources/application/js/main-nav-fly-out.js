const constants = require('./constants.js');

var FlyOutMenu = function () {
  "use strict";
  var mainNav = $("#main-nav");
  var menuItem = $(".nav > li");
  var overlay = $(".bg-overlay");
  var subMenuContainer = $(".fly-out-container");
  var subMenu = $(".sub-menu");
  var siteHeader = $("header");
  var secondaryNav = $("#secondary-nav.secondary-mobile");
  var mobileDropdownMenuBtn = $("#mobileSecondaryNavButton");
  var hamburgerMenu = $(".hamburger-menu");
  var smHeight = 0;
  var breadcrumb = $("#breadcrumb");
  var mobileWidth = $(window).outerWidth();
  var breadcrumbHeight;

  function resizeFunc() {
    breadcrumbHeight = parseInt(breadcrumb.outerHeight());
    if (mobileWidth < constants.tabletBreakPoint) {
      mobileResize();
    } else {
      $("#global-search-open").insertAfter($(".navbar"));
      mainNav.insertAfter($("#bel-logo"));
      secondaryNav.insertAfter(mainNav);
      if (mobileDropdownMenuBtn.css("display") === "block") {
        subMenuContainer.insertBefore(siteHeader);
        $("main").css({
          marginTop: siteHeader.outerHeight() + breadcrumbHeight + "px"
        });
        subMenuContainer.css({
          left: 0,
          top: "-100%"
        });
      } else {
        subMenuContainer.insertBefore(breadcrumb);
        $("main").css({
          marginTop: 0
        });
        subMenuContainer.css({
          left: "-16.2rem",
          top: 0
        });
      }
    }
  }

  function mobileResize() {
    subMenu.hide();
    $("#global-search-open").insertBefore($(".hamburger-menu"));
    subMenuContainer.insertBefore(siteHeader);
    mainNav.prependTo(subMenuContainer);
    secondaryNav.appendTo(subMenuContainer);
    $("main").css({
      marginTop: siteHeader.outerHeight() + breadcrumbHeight + "px"
    });
    subMenuContainer.css({
      top: 0,
      left: "-100%"
    });

  }

  function showSubMenuContainer() {
    smHeight = $(".fly-out-container").outerHeight();
    if (mobileDropdownMenuBtn.css("display") === "none") {
      subMenuContainer.animate({
        left: "7.9rem"
      }, 500);
      $(overlay).fadeIn(250);
    } else {
      subMenuContainer.animate({
        top: siteHeader.outerHeight() + "px"
      }, 250);
      $(overlay).fadeIn(250);
    }
  }

  function hideSubMenuContainer() {
    if (mobileWidth < constants.tabletBreakPoint) {
      hideMobileMenu();
      hamburgerMenu.removeClass("open");
    } else {
      if (mobileDropdownMenuBtn.css("display") === "none") {
        subMenuContainer.animate({
          left: "-16.2rem"
        }, 500);
        $(overlay).fadeOut(250);
        menuItem.find("a").blur();
      } else {
        subMenuContainer.animate({
          top: "-100%"
        }, 500);
        $(overlay).fadeOut(250);
      }
    }
  }

  function showMobileSubMenu(subMenu) {
    subMenu.show();
  }

  function hideMobileSubMenu(subMenu) {
    subMenu.hide();
  }

  function getSubmenu() {
    var self = $(this);
    var itemClassName = self.find("a").attr("class");
    subMenu.appendTo(subMenuContainer);
    subMenu.hide();
    $.each(subMenu, function (i, e) {
      if (self.hasClass("open")) {
        if (mobileWidth < constants.tabletBreakPoint) {
          hideMobileSubMenu($(e));
        } else {
          hideSubMenuContainer();
        }
      } else {
        if (itemClassName === $(e).attr("id")) {
          if (mobileWidth < constants.tabletBreakPoint) {
            $(e).insertAfter(self.find("a"));
            showMobileSubMenu($(e));
          } else {
            showSubMenuContainer();
            $(e).fadeIn(500);
          }
        }
      }
    });
  }

  function showMobileMenu() {
    hamburgerMenu.find(".mobile-menu-open-btn").hide();
    hamburgerMenu.find(".mobile-menu-close-btn").show();
    $(".global-search").hide();
    subMenuContainer.animate({
      left: 0
    }, 500);
    $(overlay).fadeIn(250);
  }

  function hideMobileMenu() {
    hamburgerMenu.find(".mobile-menu-open-btn").show();
    hamburgerMenu.find(".mobile-menu-close-btn").hide();
    hideSubmenus();
    $(".global-search").show();
    subMenuContainer.animate({
      left: "-100%"
    }, 500);
    $(overlay).fadeOut(250);
  }

  setTimeout(function () {
    resizeFunc();
  }, 150);

  function hideSubmenus() {
    menuItem.each(function (index, element) {
      if ($(element).has(".sub-menu")) {
        $(".sub-menu",$(element)).hide()
      }
    })
  }

  //click events
  menuItem.on("click", getSubmenu);

  hamburgerMenu.on("click", function () {
    hamburgerMenu.toggleClass("open");
    if (hamburgerMenu.hasClass("open")) {
      showMobileMenu();
    } else {
      hideMobileMenu();
    }
  });

  overlay.add(mobileDropdownMenuBtn).on("click", hideSubMenuContainer);

  //resize event
  $(window).resize(function () {
    mobileWidth = $(window).outerWidth();
    resizeFunc();
  });

};
module.exports = FlyOutMenu();
