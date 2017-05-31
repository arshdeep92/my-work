# DevOps
This folder contains the Ansible plays and related files required to configure servers.
In this project, the servers being configured are just the supporting tools servers.

This subproject/folder is only interesting to you if you need to update or maintain any of the supporting servers
for this project, or you want to test new Jenkins flows/configurations locally.

Some knowledge of [Ansible](https://www.ansible.com/) is beneficial to being able to read the playbook ymls in this folder

## Getting started
In order to start configuring and/or accessing the tools servers, a control machine must be setup first.
**Note: This is called a "control machine" since it executes Ansible commands, and in the Ansible world the machine 
executing commands is called the "control machine"**

### Setting up the Control Machine
1. On your local machine, from the project's root folder, run `vagrant up control`
1. SSH into the control machine once it is up: `vagrant ssh control`
1. Navigate to the folder to execute playbooks from: `cd /vagrant`
1. If you are configuring production servers, you will need to run the following to install necessary private keys: 
`ansible-playbook control.yml -e enable_prod=1 --ask-vault-pass`. You will be prompted for a password as the keys are 
encrypted using [Ansible Vault](http://docs.ansible.com/ansible/playbooks_vault.html). A select few individuals will have this password.

## Accessing the Support Servers
Before you can access the live/production support servers, you will need to have run through all of the steps in 
[Setting up the Control Machine](#setting-up-the-control-machine). Most importantly the last. Also take a look at the
[Prod hosts file](hosts/prod) to match up the server's host or IP address with the username and private key file to use 
(right now this is easy, there's only one IP address and private key file). To access the server:
1. SSH into the control machine: `vagrant ssh control`
1. SSH from the control machine into the support server using the username, ip address, and private key file referenced in
the [Prod hosts file](hosts/prod). Eg, `ssh -i ~/private_keys/digitalocean.key root@162.243.123.130`

Alternatively, you can run remote commands on the Support server using Ansible from the control machine. Eg,
`ansible -i hosts/prod -a "ls -l /" all`.

## Keys
The [keys](keys) folder contains public and private ssh/rsa keys
* gitrepo_deploykey.key : This is the private key that will be used by Jenkins to checkout the project from GitHub
* gitrepo_deploykey.key.pub : The public key counterpart that is managed under the project's deploy keys on GitHub
* digitalocean.key.pub : This is the public key that is associate with the root user on the DigitalOcean VM
* secrets.yml : An [Ansible variables file](http://docs.ansible.com/ansible/include_vars_module.html), encrypted with 
[Ansible Vault](http://docs.ansible.com/ansible/playbooks_vault.html), that is used to populate the private key associated 
with the root user on the control machine. When the control machine is provisioned the private key can be found at 
`/home/vagrant/private_keys/digitalocean.key`

# Nginx
Nginx is a web server similar to Apache. In this project Nginx has two purposes: It acts as the host for the Vagrant 
boxes, and it acts as the reverse proxy for the test netComponents API.

## Setting up nginx
1. SSH into the control machine: `vagrant ssh control`
1. On the control machine run `ansible-playbook -i hosts/prod nginx.yml`

## Nginx files
The most interesting files for Nginx can be found at `/etc/nginx`. Mainly in the `/etc/nginx/sites-available|sites-enabled`
folders where there is a description of the root file system folder being served in `default`, and the netComponents proxy
in `netComponents`

Vagrant boxes can be found at `/usr/share/nginx/html/vagrant_boxes`

# Jenkins
Jenkins is the Continuous Delivery server which deploys the latest changes from the project's development branch.

## Jenkins files
Jenkins files can be found under `/var/lib/jenkins`. It's usually not necessary to need to see this but in a rare occassion you
may want to delete a workspace under the `workspace` sub folder.

## Setting up Jenkins
1. SSH into the control machine: `vagrant ssh control`
1. On the control machine run `ansible-playbook -i hosts/prod jenkins.yml`

### Manual Jenkins Setup
Once Jenkins has been installed, there are manual steps that must be taken to re-create the configurations, credentials, and jobs
1. Goto {jenkins_hostname|ip}:8080
1. Copy the secure key as suggested by the UI
1. Choose to install the recommended plugins
1. Create the admin user.
1. Add Credentials for Git Repo: Goto Credentials -> System -> Global credentials -> Add Credential
    * Kind: `SSH Username with private key`
    * Username: `git`
    * private key: `From file on Jenkins master`
    * file: `/var/lib/jenkins/gitrepo_deploykey.key`
    * passphrase: [blank]
    * ID: `gitRepoCredentials`
    * Description: [blank]
1. Add DotCMS Credentials for Dev environment: Goto Credentials -> System -> Global credentials -> Add Credential
    * Kind: `Username with Password`
    * Scope: `Global`
    * Username: *[fill in username]*
    * Password: *[fill in password]*
    * ID: `dotCMSCredentials`
1. Add Style Guide Deployment Credentials: Goto Credentials -> System -> Global credentials -> Add Credential
    * Kind: `SSH Username with private key`
    * Scope: `Global`
    * Username: *[fill in username]*
    * private key: `From file on Jenkins master` (or enter it in directly)
    * ID: `styleGuideCredentials`
1. Add Plugins:
    1. Goto Manage Jenkins -> Manage Plugins -> Available
    1. Search for the plugin by name, and select it.
    1. Choose `Install without Restart`
        * `Environment Injector Plugin`
        * `Slack Notification Plugin`
        * `HTML Publisher plugin`
        * `CORS support for Jenkins`
        * `SSH Agent Plugin`

#### Setup the Deploy Project in Jenkins

1. Create new project.
1. Choose pipeline, give the project a name and click 'Ok'
1. Check off 'GitHub Project'. This allows Jenkins to manage GitHub Webhooks. Fill in:
    * Project Url: `https://github.com/Bel-Inc/Bel-Fuse-DotCMS`
1. Add Parameters: Check off 'This project is parameterized' then
    1. Add Parameter -> Boolean Parameter
    1. Fill in the following:
        * Name: `cleanWorkSpace`
        * Default Value: [Leave unchecked]
        * Description: `Clean the workspace before beginning build.`
    1. Add Parameter -> Boolean Parameter
    1. Fill in the following:
        * Name: `useCustomBranch`
        * Default Value: [Leave unchecked]
        * Description: `Specify your own branch instead of using the default 'checkout scm'.`
    1. Add Parameter -> String Parameter
    1. Fill in the following:
        * Name: `customBranchName`
        * Default Value: [Leave empty or enter you own branch name]
        * Description: `The branch name you want to checkout`
1. Add Environment Variables: Check off 'Prepare an environment for the run'.
    * Fill in the following. Be sure to substitute in the value for {dotcms_hostname|ip} below:
        * Properties Content:
        ```
        webdav_host={dotcms_hostname|ip}
        webdav_port=8080
        webdav_protocol=http
        STYLE_GUIDE_USER={Jenkings Username | Style guide username}
        STYLE_GUIDE_GROUP={Jenkings Group | Style guide group | root}
        STYLE_GUIDE_HOST={Jenkings Host | Style guide hots | localhost}
        slack_channel=buildstatus
        slack_teamdomain=architechbelfuse
        slack_token=jHxvFWBqcFz5pWRAk1vHUD0V

        ```

        (ensure each entry is on it's own line).
1. Setup pipeline. Under the 'Pipeline' section fill in the following:
    * Definition: `Pipeline script from SCM`
    * SCM: `Git`
    * Repository URL: `git@github.com:Bel-Inc/Bel-Fuse-DotCMS.git`
    * Credentials: `git`
    * Branch specifier: `*/develop` (note: you may want to change this to your current branch if testing locally)
    * Repository browser: `Auto`
    * Script Path: `jenkins/Jenkinsfile`
1. Click 'Save'

### Setup the End to End Test Project in Jenkins

1. Change CORS settings:
    1. Under Jenkins -> Manage Jenkins -> Configure System. Scroll down to 'CORS Filter' (note, this only appears if the 'CORS support for Jenkins' plugin is installed.
    1. Ensure 'Is Enabled' is checked.
    1. For the field 'Access-Control-Allow-Origins' put `*`
    1. Click 'Save'
1. Go back to the main page and click 'New Item'
1. Choose pipeline, give the project a name and click 'Ok'
1. Check off 'GitHub Project'. This allows Jenkins to manage GitHub Webhooks. Fill in:
    * Project Url: `https://github.com/Bel-Inc/Bel-Fuse-DotCMS`
1. Add Parameters: Check off 'This project is parameterized' then
    1. Add Parameter -> Boolean Parameter
    1. Fill in the following:
        * Name: `cleanWorkSpace`
        * Default Value: [Leave unchecked]
        * Description: `Clean the workspace before beginning build.`
    1. Add Parameter -> Boolean Parameter
    1. Fill in the following:
        * Name: `useCustomBranch`
        * Default Value: [Leave unchecked]
        * Description: `Specify your own branch instead of using the default 'checkout scm'.`
    1. Add Parameter -> String Parameter
    1. Fill in the following:
        * Name: `customBranchName`
        * Default Value: [Leave empty or enter you own branch name]
        * Description: `The branch name you want to checkout`
1. Add Environment Variables: Check off 'Prepare an environment for the run'.
    * Fill in the following. Be sure to substitute in the value for {browserstack_username} and {browserstack_accesskey} below:
        * Properties Content:
        ```
            base_url=http://dev.belfuse.dotcmscloud.com
            browserstack_url=https://{browserstack_username}:{browserstack_accesskey}@hub-cloud.browserstack.com/wd/hub
        ```
        
        (ensure each entry is on it's own line).
1. Setup Schedule. Under 'Build Triggers':
    1. Check 'Build Periodically'
    1. Set a value for 'Schedule'. Eg, `H H * * *` Runs once a day, as soon as resources are free.
1. Setup pipeline. Under the 'Pipeline' section fill in the following:
    * Definition: `Pipeline script from SCM`
    * SCM: `Git`
    * Repository URL: `git@github.com:Bel-Inc/Bel-Fuse-DotCMS.git`
    * Credentials: `git`
    * Branch specifier: `*/develop`  (note: you may want to change this to your current branch if testing locally)
    * Repository browser: `Auto`
    * Script Path: `jenkins/Jenkinsfile`
1. Click 'Save'

#### Add/Edit WebHook for Jenkins
A WebHook allows GitHub to notify Jenkins of changes in the git rep. This allow Jenkins to trigger builds when changes are checked in.

1. Login to GitHub and go to the project's repository: https://github.com/Bel-Inc/Bel-Fuse-DotCMS
1. Choose Settings -> Webhooks & services
1. If the service called 'Jenkins (GitHub plugin)' does not appear at the bottom click 'Add Service' -> Jenkins (GitHub plugin). Otherwise edit the existing service.
1. Follow the instructions to fill in the 'Jenkins Hook Url'. You should be able to use the example URL provided and just replace the host:port

#### Setup GitHub OAuth for Jenkins

1. Install the 'GitHub Authentication plugin' plugin in Jenkins
1. Follow instructions [here](https://wiki.jenkins-ci.org/display/JENKINS/GitHub+OAuth+Plugin) to setup.
