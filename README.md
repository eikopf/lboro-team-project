# CS & Maths Team Project - Web Development
> A simple group project, primarily done in XHTML and other decades-old web standards.

## Server Configuration
The actual servers used in this project (both the personal and group ones) are ultimately just headless CentOS installations that run `httpd -d ~/web`, and serve the resulting page to a fixed address in the university's internal network. Configuration of the `httpd` daemon is managed via a `.htaccess` file in the document root (though amusingly, Apache's docs explicitly say that allowing this kind of configuration is basically never a good idea).

While the default pages stored on these servers use `standard_index.html` as their document root, this is _terrible_ for compatibility; we have instead moved these files to `index.html`, which the servers will still happily accept as a valid document root. This could potentially cause issues when copying files directly to the servers, since it seems likely that they're configured to search for `standard_index.html` _before_ looking for the usual `index.html`.

## Development Server Configuration
> This is primarily angled towards a MacOS/Linux user, but _should_ be relatively applicable for Windows.

Because logging into the servers to make changes is annoying, it's generally preferable to run a so-called _dev server_ on your local machine. This section will discuss how to do this, with a particular focus on avoiding changes that might break the code when it's loaded onto the servers.

Very roughly, the process is as follows:
1. Clone this repository into a preferred location;
2. Install `httpd` using `brew` (on Windows, install it from Apache's website directly);
3. Edit the global `httpd.conf` file to import some additional functionality;
4. Symlink the preferred location to the global document root;
5. Run the server with `httpd -X` and navigate to `localhost:8080/<symlink-name>`.

> You should read directory locations like `var/www` or `etc/httpd` as being relative to the _installation prefix_ – for Homebrew, this will be `/opt/homebrew`, so you would read `/var/www` as `/opt/homebrew/var/www`. Windows doesn't mimic this directory structure, since it isn't descended from Unix; you'll have to do some detective work to track down where it puts the equivalent files and folders. Also, if you're using a different package manager, then its installation prefix will be different (but probably still under `/opt`).

Assuming you've cloned the repository and installed `httpd`, you'll want to open the file `/opt/homebrew/etc/httpd/httpd.conf` in an editor. This is the primary file that `httpd` reads from whenever it runs, and dictates its capabilities. We need to make the following changes:
1. In the section of `LoadModule` directives (beginning around line 65), remove the leading `#` in the line `#LoadModule userdir_module lib/httpd/modules/mod_userdir.so` (by default, this is line 179).
2. In the section of `Include` directives (at the bottom of the file, starting around line 480), remove the leading `#` from the lines `#Include /opt/homebrew/etc/httpd/extra/httpd-autoindex.conf`, `#Include /opt/homebrew/etc/httpd/extra/httpd-userdir.conf`, and `#Include /opt/homebrew/etc/httpd/extra/httpd-default.conf` (by default, lines 494, 500, and 515).

The first `Include` directive enables the dev server to show directories when folders don't have an `index.html`, and the other changes allow `httpd` to behave more like a dev server (rather than an actual production server). At this point, you could run `httpd -X` and go to `localhost:8080`, but you'd only see some stub (on MacOS it will just say "It Works!"). This is because the server will use `/opt/homebrew/var/www` as its document root by default, and the default `index.html` file in that directory is just a stub.

We're explicitly _not_ going to mess with the files in this directory – messing around with files in your package manager's installation subdirectories is generally a terrible idea. Instead, we'll create a link to the directory containing a clone of this repository, and just navigate to that subfolder while running the dev server.

The command to do this is as follows:
```sh
# you could choose another name for the link than team-project, but it *must* have no spaces
ln -s /absolute/path/to/cloned/repo /opt/homebrew/var/www/team-project
```

> On Windows, you'll instead want to use the [`mklink`](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/mklink) command. The symlink flag is `/d`, and the target and linkname are swapped in comparison to `ln` (the absolute path to the document root will also be different).

And we're done! At this point, running `httpd -X` and navigating to `localhost:8080/team-project` should just render the root page in this repository. It's worth briefly noting that this _could_ have been done more quickly with a command like `php -t . -s localhost:8080`, but it wouldn't necessarily be compatible with the server environment – things that work on the `php` server have no guarantee of working on the `httpd` server, and vice versa.

Keep in mind that `httpd` is intended to run as a daemon, and will reflect changes to your local files whenever you reload a page. To use this functionality properly, run `apachectl start` to keep the server running in the background.

## Running the MySQL Server Locally
To get a better development experience, you'll also want to have a MySQL server running on your local machine. This requires a few steps:
1. Install a version of `mysql` (either MySQL itself via `brew install mysql`, or MariaDB via `brew install mariadb`);
2. Start the `mysql` server with a command like `brew services start mysql`;
3. Login to the `mysql` server with `mysql -u root`;
4. Run `status` to check your configuration is normal.

Assuming you have everything setup properly, you can first run the command `create database team_project;` to instantiate a development database, followed by `use team_project;` to make it your default for the current session. At this point, all you have to do is run `source ./sql/tables.sql;` from the root of this repository to create the necessary tables in this database.

## Resources
- [The PHP 8.3 Manual](https://www.php.net/manual/en/)
- [Apache Web Server Docs](https://httpd.apache.org/docs/2.4/)
- [MySQL 8.3 Docs](https://dev.mysql.com/doc/refman/8.3/en/)
