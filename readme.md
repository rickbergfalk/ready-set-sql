#Learn Some SQL (working title)

Learn Some SQL is a nodejs webapp providing a platform for learning SQL. In particular PostgreSQL. 

This is the Heroku/Postgres-compatible, non-client-MVC, and simplified version of my previous attempt at this. As such, the code probably has lots of artifacts from the learning process and the many rewrites due to me changing my mind and experimenting. Take this into consideration if you attempt to explore the inner-workings of this application, or extend it for your own uses.


## Project Structure

### Application data stored as JSON files (instead of in a database)

Everything other than the data queried during the lessons has been moved to JSON files. There were a couple reasons for doing this. 

Storing application data in JSON allows the ability to add the data to version control. Others can submit fixes, or new lessons, via a pull request. It also bootstraps some data for someone forking/cloning the project. 

The move to JSON also provides one less thing to have to migrate to another database if the lessons are hitting a database in MySQL or SQL Server. 

Side-bonus: Because we read all the data, we can just cache the lesson data in memory assuming we never run this in more than one process (only 1 dyno in heroku)


## Left to do before launch

* Lesson Viewer pro-tips
	* ctrl-e to run sql
	* ctrl+n to go to next slide
	* etc.
* Finish Lessons
* Get a new name (Learn Some SQL has been taken)