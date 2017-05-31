class Constants {
  constructor() {

  }

  // Breakpoints which correspond to the breakpoints defined in _variables.scss
  get tinyBreakPoint() {
    return 320;
  }

  get mobileBreakPoint() {
    return 360;
  }

  get tabletBreakPoint() {
    return 720;
  }

  get desktopBreakPoint() {
    return 1024;
  }

  get largeBreakPoint() {
    return 1280;
  }
}

module.exports = new Constants();
