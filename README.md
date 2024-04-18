# CS & Maths Team Project - Web Development
> A simple group project, primarily done in XHTML and other decades-old web standards.

## Server Configuration
The actual servers used in this project (both the personal and group ones) are ultimately just headless CentOS installations that run `httpd -d ~/web`, and serve the resulting page to a fixed address in the university's internal network. Configuration of the `httpd` daemon is managed via a `.htaccess` file in the document root (though amusingly, Apache's docs explicitly say that allowing this kind of configuration is basically never a good idea).

While the default pages stored on these servers use `standard_index.html` as their document root, this is _terrible_ for compatibility; we have instead moved these files to `index.html`, which the servers will still happily accept as a valid document root. This could potentially cause issues when copying files directly to the servers, since it seems likely that they're configured to search for `standard_index.html` _before_ looking for the usual `index.html`.

## Resources
- [The PHP 8.3 Manual](https://www.php.net/manual/en/)
- [Apache Web Server Docs](https://httpd.apache.org/docs/2.4/)
