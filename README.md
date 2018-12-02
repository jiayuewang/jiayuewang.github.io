# Trade Master Instructions for Mac

### Set up on your local machine:
1. Download XAMPP from: https://sourceforge.net/projects/xampp/files/XAMPP%20Mac%20OS%20X/5.5.38/xampp-osx-5.5.38-3-installer.dmg/download
1. Open your "manager-osx" app that you installed along with XAMPP in the first step, switch to "Manage Servers" tab. Start "MySQL Database" and "Apache Web Server"
1. In Terminal, navigate to your Applications/XAMPP/htdocs folder `$ cd /Applications/XAMPP/htdocs`
1. Clone this repository `$ git clone https://github.com/JasonCHCI/trademaster.git` (If you have permission issue with git command, first own your htdocs directory: `$ sudo chown <your_username> .`)
1. Create a new database called "Trademaster" and import the sql file into the database (Skip this for now)
1. Our website can be accessed at:  http://localhost/trademaster (Be sure you have XAMPP running in step 2)
1. phpmyadmin can be accessed at: http://localhost/phpmyadmin/

### How to contribute:
1. Navigate to root of repository 
*`$ cd /Applications/XAMPP/htdocs/trademaster`
1. Update your local master branch 
* `$ git checkout master`
* `$ git pull`
1. Create and switch to your own branch (Please do not work on master branch directly as it is very likely to mess up the repo and cause merge conflicts)
* `$ git checkout -b <your branch name>`
* e.g. If I am creating branch, `$ git checkout -b Jue`
1. Implement and update code on your branch
1. Create pull request
  1. Add changed files
	* `$ git add ChangedFile1 ChangedFile2 ...`
  1. Commit changes to local branch
	* `$ git commit -m "<your branch name>:<your message>"`
	* e.g. If I am committing, `$ git commit -m "Jue: Asynchronous Data interchange implemented"`
  1. Push changes to remote branch
	* `$ git push origin <your branch name>`
  1. GitHub: create pull request for your branch into Master
	* https://github.com/JasonCHCI/trademaster/compare?expand=1
      1. Select base branch: master
      1. Select compare branch: Your Branch
      1. Enter some meaningful comments
      1. Click create pull request
    * NOTE: Please carefully review all changes before you merge a pull request, if you are not sure, let somebody else review your pull request. Test throughly on your local machine before you push.

### Project framework
1. Put your view files(HTML files) under view folder
1. Modify siteController.php and/or stockController.php and .htacess to link your view files and the way you want to access it.
1. Please put all database related class files under model folder.

### Helpful links:
1. Basic Git: http://rogerdudler.github.io/git-guide/
1. In-depth Git: https://git-scm.com/book/en/v2
1. Pull request: https://help.github.com/articles/about-pull-requests/
1. SourceTree: https://www.sourcetreeapp.com/
1. Bootstrap: https://v4-alpha.getbootstrap.com/getting-started/introduction/
1. PHP: https://www.w3schools.com/php/
1. JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript
