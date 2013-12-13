# Project Structure

Ready Set SQL is a side project I started nearly 2 years ago. 
At the time I was teaching myself as I went, and also using it as a platform for learning all the fancy HTML/JS/CSS technologies I had been reading about but never actually done anything with. I changed my mind a lot and tried a lot of different libraries, rewriting things more than once.

Because of that and me (still) learning as I go, there are likely scars and messes you'll come across if you dive in to this thing.

If you *still* want to jump in after all that, here's a brief primer to get your orientation.



## The database

There are 2 sources of data for Ready Set SQL: PostgreSQL and some JSON flatfiles in /data/. Postgres holds the sample pizza-shop database referenced and queried in the lessons. The actual lesson content and configuration is stored in JSON flat files. 

### JSON Lesson/Lesson-list files

I feel kind of icky for using files to store the lessons and lesson-lists, but there are some benefits to this approach:

- Storing application data in JSON allows the ability to add the data to version control. 
- Others can submit fixes, or new lessons, via a pull request. 
- It also bootstraps some data for someone forking the project. 
- One less thing to have to migrate to another database if the lessons are hitting a database in MySQL or SQL Server. 

Reading and writing lesson/lesson-lists should be done via their respective models in the /models/ folder. These modules act as a wrapper for saving and caching these files. When a lesson is gotten, its read from memory. When a lesson is saved, the file is updated and the cache in memory is updated. 

### Postgres Pizza Shop DB

Regarding the Postgres Pizza Shop database: This data and structure is managed in the migration scripts under the migration folder. These migration scripts are run by a postgrator call in app.js. Each time you run app.js, postgrator checks the version of the database and moves it up or down depending on the version and scripts available.



## Application Server part

Its a fairly simple Express.js app, without much abstraction around anything. There isn't any real convention to any of the actual routes. app.js is kind of a mix of stuff, including some configuration variables hardcoded right in.


## /lib/ modules

The lib folder holds application-specific modules. Not sure any are useful outside of this project so they haven't been put on npm.

* **ban-middleware** - route middleware for rickrolling viewers if they try hurting the database
* **get-client-ip** - since I'm running this on Heroku, I used this module to easily get the ip address of a request
* **is-bad-sql** - Heroku Postgres doesn't have any way of limiting a postgres user account. The proper way to handle this would be to revoke CREATE/ALTER/DROP priveledges for the db user that runs the lesson queries... but here I'm using JS to do it *shudder*. 
* **sql-runner** - a thing to run a sql string against postgres. This could easily be adapted to handle MySQL or MS SQL Server instead.




## Front End

Its bootstrap 2. LESS. EJS. jQuery. Codemirror. Scary hand-coded javascript objects that think they're views, models, and controllers all at the same time.

### Views

Templates are EJS. All templates use the header and footer layout, except for the lesson view. It'd be nice to change this down the road.

### Javascripts

Front end javascript is combined and uglified. Most of the front end js is done in my own style of creating all-in-one view-model-controller type objects that act as containers for some sort of behavior that manipulates the dom. 

2 javascript files are created - one for everyone and another for the editor functionality. Most people aren't ever going to use the lesson editor, so they won't ever need this.

Its not in the traditional jQuery way of rendering the data as HTML and then having jQuery look at the document and react accordingly based on the selectors in the document...

In hindsight the traditional jQuery way might be more helpful for others looking at this project.

### Stylesheets

Most of this stuff is bootstrap with some minor changes. LESS is used because bootstrap uses it. Although I can't say I'm using it that effectively. 

I kind of designed as I went along. Things could definitely be cleaned up here. 