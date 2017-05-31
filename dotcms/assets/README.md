# DotCMS Skeleton Project assets #
This sub project is the container for all file assets which are deployed into DotCMS' site structure, as seen under the site browser.
Assets include velocity templates and macros, javascript, css, fonts, and images. The builds for this project are setup to process,
compile, and minify SCSS and Javascript.

## To Build ##
Prerequisites:

1. A VM with a DotCMS instance is up and running.
1. A site has been created in that DotCMS instance. Follow the 'Getting Started' guides in the parent project's README.md if necessary

From the parent project root folder:

1. Edit the file `dotcms/config/settings.yml` and ensure the site name and theme are correct.
1. Install npm modules by running `gradlew dotcms:assets:npmInstall`
1. Send all assets to DotCMS `gradlew dotcms:assets:build-send-everything`

## To Develop ##
For ongoing development, it's easiest to setup a watch. This way all new and updated files are immediately pushed to DotCMS.

* Use this command to watch for changes and send updates to DotCMS: `gradlew dotcms:assets:watch`
* Use this command to first build and send files to DotCMS, then continue watching for changes: `gradlew dotcms:assets:build-send-watch`

## File Conventions ##

### CSS ###
CSS is processed in SASS/SCSS. All SCSS files that are imported into another SCSS file begin with an underscore.
All SCSS files that do not begin with an underscore are given to the SASS/SCSS processor to produce CSS files of the same name that is sent to DotCMS.

Changes to these patterns or conventions can be made in `gulp-tasks/gulpfile-styles.js`

### Javascript ###
Javascript is processed by Browserify. All files named `main.js` are given to the Browserify processor and produce an output file of
the same name that is sent to DotCMS. Any Javascript files to be added to the project must be __required__ by a main.js, or they can
optionally be treated as regular file assets.

Changes to these patterns or conventions can be made in `gulp-tasks/gulpfile-scripts.js`

### Assets ###
All non processed assets, such as images VTLs raw CSS or raw Javascript. These are all of the remaining patterns of files that can be
sent to DotCMS on change.

Changes to these patterns or conventions can be made in `gulp-tasks/gulpfile-assets.js`
