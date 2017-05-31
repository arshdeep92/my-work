#User Guide
This guide is geared towards Content Authors and Site Administrators. The goal is to explain the purpose and use of the 
Content Types and pages available in the site.

*Contents*
* [Configuration](#configuration)
* [Stock Check](#stock-check-configuration)
* [Sales Representatives](#sales-representatives)

## Configuration
This configuration content type is used to carry configurations that may change from environment to environment, or just
should not be hardcoded. Each time a page is requested in DotCMS, an instance of configuration is looked up by matching
the HTTP request's 'host' header and matching it against any configuration instance with the same value in its domain field.
If there is no matching configuration object, then the one named 'default' is used.

### Configuration Fields
* Name: Has no functional purpose. This is just used to easily identify the configuration
* Domain: As described above, this is used to match up against the incoming 'host' HTTP Header.
* Configs: This is a key-value field of various configurations. The current supported configurations are:
    * SendThis-pubid: The API key to the AddThis account (Yes, this needs to be renamed)
    * WebFontConfig-typekit-id: The key to allow access to download the typekit fonts used by the site
    * netComponents-dilp-username: Username to the netComponents DILP API for Stock Check.
    * netComponents-dilp-password: Password to the netComponents DILP API.
    * netComponents-dilp-url: Base URL to the DILP API. Should be {Host}/api/DILP/
    * netComponents-dilp-clientIP: The IP address of the server calling the DILP API. This should be the DotCMS server's
     IP Address.
     
     
## Stock Check Configuration
Stock Check operates on the following configurations:
* The Configuration content type described in [Configuration](#configuration) for netComponents API access.
* The Brand sub categories. Most Brand categories have a `Keywords` field populated with a comma delimited list of codes.
eg `CINC,AIM,SEMF` etc. These codes match the codes returned on part numbers from the netComponents DILP API. They allow
The stock check page to filter part numbers from netComponents by Brand.

## Sales Representative
Sales representative information found on the 'Find a Sales Representative' page.

Notable Fields:
* [Brand](#brand): The Brand of the Sales Representative. Multiple brands could be assigned to a Sales Rep. Note: In order to populate
results for 'Cinch Connectivity' -> 'I don't know' option, there should be Sales Reps with the Cinch Connectivity brand.
* [Region](#region): The region of the Sales Rep. This can be broad like 'North America' or specific like 'United States'. If there
is a Sales Rep for 'North America' and a user searches by 'Canada' then the 'North America' sales rep will return if there
are no 'Canada' sales reps.
* Latitude, Longitude Coordinates: Meant for a future feature of performing geo distance queries.

## Distributors
Distributor information found on the 'Find a Distributor' page.

Notable Fields:
* [Brand](#brand): The Brand of the distributor. Multiple brands could be assigned to a distributor. Note: In order to populate
results for 'Cinch Connectivity' -> 'I don't know' option, there should be distributor with the Cinch Connectivity brand.
* [Region](#region): The region of the distributor. This can be broad like 'North America' or specific like 'United States'. If there
is a distributor for 'North America' and a user searches by 'Canada' then the 'North America' distributor will return if there
are no 'Canada' distributor.
* Latitude, Longitude Coordinates: Meant for a future feature of performing geo distance queries.

## Contact Groups
Contact Groups are leveraged for a few purposes on the 'Contact Us' (or 'Find a Customer Service Representative')  page.
Contact Groups matching the user's criteria are searched on the 'Contact Us' page by 'Brand' and 'Region' similar to
[Distributors](#distributors). The key difference of the Contact Group is it's relationships:
* displayContactt-contactGroup: The Contact related to the Contact group through this relationship is what appears to the 
user on the page in the "Look up" results.
* emailContact-contactGroup: This Contact is the one who is emailed directly when the user submits their email form.
* ContactGroup-ccContacts: These contacts are in the CC list of the email.

One extra notable field is the 'Group Type'. Only Contact Groups who have matching 'Group Type' values to those selected by
the user in the email form (one of 'Help', 'Technical Help', 'Sample Request', or 'Other') are emailed when the form is
submitted.

## Site Search Jobs
The Site Search jobs create and maintain the index that powers the site's global search. These jobs should be run regularly.

To do this we will need to
1. Create the site search index
1. Schedule the Nightly index
1. Schedule the incremental index

### Create the site search index
First the Site Search requires and index named 'SearchResults'. To set this up:
1. Go to System -> Site Search -> Indices
1. If 'SearchResults' index does not already exist, click 'Create SiteSearch Index'.
1. In the dialog that pops up, give it an Alias of 'SearchResults'. Use the default Shards of 2.
1. Click 'Create SiteSearch Index'.

### Schedule the Nightly Index
The nightly index is a full re-index. To set this up:
1. Go to System -> Site Search -> Job Scheduler
1. Fill in the following:
    * Name: nightly index
    * Sites to index: belfuse.com
    * Alias Name: 'SearchResults'
    * Language: United States English
    * Paths: Include: /product-detail/*,/news-detail/*,/resources/*,/resource-center/*
    * Cron Expression: 0 0 1 * * ?
1. Click 'Schedule'

### Schedule the Incremental Index
The incremental index is a regular re-indexing of recent changes in the site. To set this up:
1. Go to System -> Site Search -> Job Scheduler
1. Fill in the following:
    * Name: incremental index
    * Sites to index: belfuse.com
    * Alias Name: 'SearchResults'
    * Incremental: Check this box
    * Language: United States English
    * Paths: Include: /product-detail/*,/news-detail/*,/resources/*,/resource-center/*
    * Cron Expression: 0 0/30 * * * ?
1. Click 'Schedule'

## Products
This section will describe all of the related content types surrounding Product Series', their purpose and how they work.

### Product Series
The Product Series is the main content type that is the bucket that houses several related [Part Numbers](#part-number). 
There may be cases where a product series does not have any Part Numbers at all.
 
### Part Group

### Part Number

#### Specifications

### Product Type (category)
There is a Category tree in the Categories section of the DotCMS admin console called 'Product Type'. This category tree
serves two purposes:
* It's two sub subcategories Application, and Products drive the navigation hierarchy in the Product Listing/Parametric Search
and the Product Series details page (note the crumb trails on those pages match the hierarchy in this category).
* Descendant categories of Application serve as a filter for Part Numbers in the Parts Explorer areas of the Product Series
details page.

### Product Type (Content Type)
The Product Type content type serves the purpose of providing an image, and a description to a given position in the 
[Product Type](#product-type-category) navigation hierarchy on Product Listing page.

## Brand

## Region
