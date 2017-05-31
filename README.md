# Bel Fuse DotCMS Project
This is the development project for the new Bel Fuse site. The Bel Fuse site is developed on DotCMS (3.5 at the time of writing).

This readme describes:
1. [Getting Started](#getting-started-developing-belfusecom)
1. [Development Workflow](#development-workflow)
1. [Application Bundle](#application-bundle)
1. [Coding Conventions](#coding-conventions)
1. [Testing](#testing)
1. [Support Servers and Services](#support-servers-and-services)
1. [External Services](#external-services)
1. [Vagrant Box Maintenance](#vagrant-box-maintenance)

If you are interested in a guide that describes how the variouse content types are used take a look at the [User Guide](/USER_GUIDE.md)

## Prerequisites
- [VirtualBox](https://www.virtualbox.org/)
- [Vagrant](https://www.vagrantup.com/)
- Java 8 SDK: [Oracle](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) or [OpenJDK](http://openjdk.java.net/install/)
- [Node.js](https://nodejs.org/)/[npm](https://www.npmjs.com/) This is optional, as gradle will download NodeJS.

## Getting Started developing Belfuse.com
Follow these instructions for an ongoing/existing DotCMS project. These instructions assume that the user has a DotCMS bundle representing
the application, complete with Templates, Containers, Widgets, Content Types, etc. from the development environments.
 See [Application Bundle](#application-bundle).

1. Run `vagrant up` after cloning the repo, and make sure dotCMS starts successfully.
    1. Log into the dotCMS admin console (http://localhost:8080/admin)
    1. Through the Site Browser -> Publishing Queue -> Bundles, upload your application bundle.
1. Install Dynamic Plugins:
    * `./gradlew dotcms:dynamic-plugins:deployOverHTTP`
1. Install NPM packages:
    * `./gradlew dotcms:assets:npmInstall`
1. Build all dotcms assets, i.e. theme code and supporting VTL, deploy to dotCMS, and watch for changes to these files:
    * `./gradlew dotcms:assets:build-send-watch` or the shortened alias `./gradlew dotcms:assets:bsw`

See [Assets Readme](/dotcms/assets/README.md) and [Dynamic Plugins Readme](/dotcms/dynamic-plugins/README.md) for more details

## Getting Started on a new Project
Follow these instructions from a brand new DotCMS project.

1. Run `vagrant up` after cloning the repo, and make sure dotCMS starts successfully.
    1. Log into the dotCMS admin console (http://localhost:8080/admin)
    1. Create your site in dotCMS, E.g. *foobar.someclient.com*
    1. From the sitebrowser, create an empty folder called `/application` in the root of your site.
1. Edit `dotcms/config/settings.yml` and change *first.dotcms.com* to the website for your project, E.g. *foobar.someclient.com*
    * The site name must match the site created in dotCMS.
1. Install Dynamic Plugins:
    * `./gradlew dotcms:dynamic-plugins:deployOverHTTP`
1. Install NPM packages:
    * `./gradlew dotcms:assets:npmInstall`
1. Build all dotcms assets, i.e. theme code and supporting VTL, deploy to dotCMS, and watch for changes to these files:
    * `./gradlew dotcms:assets:build-send-watch`

# Development Workflow
This section outlines the workflow of a developer creating a new feature in this project.
These guidelines suggest following a git workflow that promotes feature branches. See [Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

1. Assuming you have previously worked on and finished a different feature, destroy your current VM to start fresh. Run `vagrant destroy`
1. Pull the latest code from the 'develop' branch of git.
1. Create and checkout a new branch from 'develop' called 'feature/{myfeaturename}'
1. Bring up a fresh VM: `vagrant up`
1. Go to http://dev.belfuse.dotcmscloud.com/admin, prepare your Application Bundle (see [Application Bundle](#application-bundle) below), and download it.
1. While in http://dev.belfuse.dotcmscloud.com/admin bundle up any [small] amount of content needed to support testing your feature.
1. Upload your application and content bundles into your local VM.
1. Ensure you have the latest javascript packages. Run: `./gradlew dotcms:assets:npmInstall`
1. Develop your feature. Check in to the feature branch often as you go (be sure to include descriptive comments for each commit).
1. Once the feature is complete:
    1. Be sure to merge the latest from the origin's 'develop' branch into your current branch (It's recommended this
     also be done a few times throughout development of the feature). Alternatively you can rebase your current branch on top of develop.
    1. Add any top level Files, Folders, ContentTypes, Categories, etc. To the [Application Bundle](#application-bundle) definition below.
    1. Create a Pull request to merge your feature branch into 'develop'. Be sure to add a reviewer to the Pull request.
    1. Apply any manual changes to http://dev.belfuse.dotcmscloud.com/admin, such as creating new ContentTypes, relationships, categories, etc.
1. When the pull request has been approved, the feature is complete. Pick a new feature/story. Repeat from step 1.

**Notes:**

* It's not always necessary to destroy the VM at the beginning of a new feature but it should be done regularly as a housekeeping measure.
* A new feature branch would usually be created for each JIRA story. Subtask should not warrant their own feature branch.


# Application Bundle
The application bundle is a DotCMS bundle that contains everything which defines a site: files, folders, content types, categories, etc.
But without unnecessary or unwanted content.

The application bundle has two purposes:
* To enable developers to acquire all of the recent development changes that are not versionable in source control.
* To separately group functionality changes to the site which should be deployed up the environment change (authoring then production) 
via Push Publish, without the worry of publishing unfinished or unwanted content.

Add folders to the application bundle through DotCMS' Site Browser by right-clicking on each file and folder listed below.
 You can download the bundle by clicking on Publishing Queue under the Site Browser menu and clicking on "Bundles". 

The Application bundle is put together by hand on the shared development instance of DotCMS.
It is created by adding the following to the bundle (Note, this list must be maintained throughout the project):

#### Files ####
* file: /index
* file: /robots.txt

#### Folders ####
* folder: /application
* folder: /home
* folder: /nav
* folder: /news
* folder: /product
* folder: /resource-center

#### Content Types ####
* content type: Announcement
* content type: Bel-Group
* content type: Bel-Locations
* content type: Brand Quick Link
* content type: Call to Action
* content type: Certifications
* content type: Configuration
* content type: Contact
* content type: Contact Email
* content type: Contact Group
* content type: Custom Category Display
* content type: Distributor
* content type: Featured Item
* content type: Landing Group Header
* content type: Landing Header - Short
* content type: Part Group
* content type: Part Number
* content type: Product Series
* content type: Product Type
* content type: Product Type Display
* content type: Request a Quote
* content type: Sales Representative
* content type: Standard Slide
* content type: Application Landing Page
* content type: Product Landing Page
* content type: Resource Center Landing Links
* content type: Competitor Part Number

#### Categories ####
* category: Brand
* category: Certification
* category: Contact Type
* category: Product Type
* category: Region

#### Content ####
* Configuration: {All}

#### Plugins ####
* Dynamic Plugin: email-form-*.jar
* Dynamic Plugin: stock-check-*.jar
* Dynamic Plugin: utils-*.jar

#### Languages ####
* English (US)

<!--- TODO: Add Templates and Containers for pages
-->

# Coding Conventions

## File Naming Conventions
This mainly applies to file assets which reside in the dotcms/assets subproject and end up in a DotCMS instance:

* javascript, vtl, vm, and folders: Use kebab-case. All lower case, hyphen between words. Eg, 'custom-fields'
* scss files: Use kebab-case. Files called from @import should start with an underscore. Eg, _buttons.scss
* Other assets: Should strive to follow kebab-case.

## VTL and VM File Placement in Folder Structure

VTL or VM files will go under the directory: `/application/vtl/{type}/{section}`
Where {type} could be one of :
* `widgets`
* `macros` (for *.vm files)
* `containers`
* `templates`
* `custom-fields`

Where {section}, if applicable, denotes the high level area of the application the widget belongs to. For example 'news', or 'contact-us'.

So for example, if we develop a widget to display product details on the product-details page, the code for the widget
 would go in: /application/vtl/widgets/product/product-details.vtl

## Velocity Code Conventions
Similar conventions which apply to the Java language apply to velocity. Conventions such as:
* camelCase method names (this applies to macro names, since they are analogous to methods)
* camelCase variable names
* UPPERCASE constants
* PascalCase type names

## DotCMS

### Content Types
Content Types should be named in Title Case, meaning each word is capitalized and separated by a space.
There should be no non-word characters used and only Letters if necessary numbers. A Content type name should not start with a number.

### Fields
Similar rules as Content Types apply.

# Testing

## Ngrok
When testing your local environment with a service such as Browserstack, or Saucelabs, it helps to make your local DotCMS instance publicly available.
This can be accomplished with a tool like [ngrok](https://ngrok.com/). For simplicity, if you have npm, you can install ngrok by running `npm install -g ngrok`.

With your development VM running, you can start ngrok: `ngrok http 8080`. On the line that says 'Forwarding' you will
 see the public host name for your local DotCMS instance. Eg, `http://12345678.ngrok.io`. Copy and paste it into your
 browser to test it out, you should see your local DotCMS instance running.
 
## Vagrant Share
Vagrant share is a convenient alternative to ngrok since it comes with vagrant out of the box. [Vagrant Share](https://www.vagrantup.com/docs/share/)
It also has the added benefit of being able to share more ports than just your HTTP port.

## Manual Testing with Browser Stack
Browser Stack has a feature called 'Live' testing. This let's you interact with a remote browser, such as an iPhone Safari, through the website.
This is handy when you don't have those devices or browsers available to you.

When you sign into https://www.browserstack.com you are presented with a dashboard. Select your OS and Browser. Once the
 browser has started up paste in your ngrok public host name and start testing.

## Automated End to End Testing
The sub project for automated end to end, or "functional", testing is under dotcms/end-to-end-tests. These tests will
 open a browser and begin interacting with your site. This project relies on Serenity BDD. Most configurations are
 specified in the [User Guide](http://www.thucydides.info/docs/serenity/)

### With Local Browsers
An automated test can be executed on your desktop using one of your local browsers. The steps to execute are:

1. `./gradlew dotcms:e2e-tests:clean` (this step isn't always necessary but good to do occasionally)
1. `./gradlew dotcms:e2e-tests:test` (by default this will startup Chrome)
1. `./gradlew dotcms:e2e-tests:aggregate`

You can view the resulting report at `dotcms/end-to-end-tests/target/site/serenity/index.html`

If you would like to change any configuration, such as the browser, you can pass in arguments as Java system properties.
For example use `./gradlew dotcms:e2e-tests:test -Dwebdriver.driver=firefox -Dserenity.browser.width=1600` to run in firefox at a width of 1600.
See the [User Guide](http://www.thucydides.info/docs/serenity/) for more details.

**Note:** Unless you are running [batches](http://www.thucydides.info/docs/serenity/#_running_serenity_tests_in_parallel_batches)
 each call to `test` should be followed up with a call to `aggregate`.  You cannot aggregate results from multiple tests.

### With BrowserStack
An automated test can be executed against a browserstack browser by providing the necessary system properties to the `test` task.
Eg, to test against the iPhone 4S:

1. `./gradlew dotcms:e2e-tests:clean`
1. `./gradlew dotcms:e2e-tests:test -Dbrowserstack.device="iPhone 4S" -Dwebdriver.base.url={ngrok_host_name}
 -Dbrowserstack.url=https://{browserstack_username}:{browserstack_accesskey}@hub-cloud.browserstack.com/wd/hub`
1. `./gradlew dotcms:e2e-tests:aggregate`

You can view the resulting report at `dotcms/end-to-end-tests/target/site/serenity/index.html`

**Note:** Be sure to substitute in your ngrok host name for ${ngrok_host_name}, and your browserstack user and access
 key for {browserstack_username} and {browserstack_accesskey} respectively.
The browserstack access key can be found in Browserstack [Settings](https://www.browserstack.com/accounts/settings)

# Support Servers and Services
This project employs support servers for running services for different purposes (at the time of writing it's actually
 just one server). More details about the services, how they're configured, and how to access them can be found by reading
 the [Devops Readme](/devops/README.md) as well as reading through the [Ansible](https://www.ansible.com/) playbooks in
 the [devops folder](/devops).
 
The supporting services are:
### Jenkins 2
This service is used to automatically deploy any code from Git's `develop` branch into DotCMS at dev.belfuse.dotcmscloud.com.
This includes VTL,VM,JS,CSS files from the `dotcms/assets` project, as well as dynamic plugins.

### Nginx for Hosting Vagrant Boxes
Nginx is hosting vagrant boxes over port 80. This where a Vagrant/VirtualBox machine is downloaded from when a user first
runs their `vagrant up` command.

### Nginx as a Reverse Proxy for netComponents Test API
netComponents requires a consistent and registered IP address for accessing it's services. This is not ideal for testing 
locally as IP addresses will differ depending on the developer, so we instead access netComponents from a reverse proxy
with a fixed IP address.

# External Services
External services that are leveraged in this project are:

## netComponents 
netComponents is used for Stock Check. They have two hosts for their service: A sandbox/test host which is usefully mainly
as a pre-cutover server used for testing and local environments and a production host.

## AddThis
Provides the share links on the News/Events/Announcements pages. There should be a separate testing and production accounts 
with this service.

## SendGrid
Used as a simple free SMTP service for testing emails from local development environments. It's not required otherwise as
DotCMS has SMTP servers configured for DotCMS instances in DotCMS cloud.

## Typekit
Supplies the sites fonts (Acumin Pro and Avante-Gard)

# Vagrant Box Maintenance
There are times where changes need to be made to the base Vagrant box for the project. That change might entail something
as simple as enabling the `debug` flag for DotCMS on startup by default. It may be a change of licence, or it may be more
 involved like a DotCMS upgrade. This section is a short guide to applying changes to a base box that can be distributed
 to the team:
 
1. Start with a clean box: Run `vagrant destroy` then `vagrant up`
1. Apply changes the vagrant box (if ssh needed: `vagrant ssh`)
1. Once changes are complete. Halt the box: `vagrant halt`
1. Package the box: `vagrant package --output ubuntu_dotcms_{details}.box`. Be sure to supply your own value for the 
{details}. Look at the [vagrant manifest](/ubuntu_dotcms_3_5.json) for an example of the convention to follow.
1. Upload the box file to the server hosting vagrant boxes (see [Support Servers and Services](/support-servers-and-services)) 
1. Create an sha1 checksum on the box: `openssl sha1 ubuntu_dotcms_{details}.box`. **Note: OpenSSL is not the only option here.
 Other tools exist such as sha1sum.** **Note2: md5 and sha256 are also checksum options**
1. Edit the [vagrant manifest](/ubuntu_dotcms_3_5.json) JSON file. In the `versions` array, add a new entry for your new box
 with the following filled in:
    * versions: "3.5.0.{next}"  (At the time of writing the last version was 3.5.0.4, so a new version would be 3.5.0.5. 
    The first two digits account for the DotCMS version, so if it was updated then those would change to match.)
    * name: "virtualbox"
    * checksum_type: "sha1" (or md5 or sha256)
    * checksum: The value the checksum tool returned from the step above.
    * url: The full URL to the box file that was uploaded to the vagrant box host
1. Checkin your manifest file
 
After this, your team mates will need to upgrade their boxes locally. This usually does not happen automatically so 
they will need to do the following:
1. Destroy their current VM: `vagrant destroy`
2. Checkout the latest code that has the updated [vagrant manifest](/ubuntu_dotcms_3_5.json) file.
3. Update their box: `vagrant box update`
4. Run their new VM: `vagrant up`
