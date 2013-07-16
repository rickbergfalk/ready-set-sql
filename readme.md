#Learn Some SQL

Learn Some SQL is a nodejs webapp providing a platform for learning SQL. In particular PostgreSQL. 

This is the Heroku/Postgres-compatible, non-client-MVC, and simplified version of my previous attempt at this. As such, the code probably has lots of artifacts from the learning process and the many rewrites due to me changing my mind.  
Take this into consideration if you attempt to explore the inner-workings of this application, or extend it for your own uses.


## Left to do before launch

* Lesson Viewer pro-tips
	* ctrl-e to run sql
	* ctrl+n to go to next slide
	* etc.
	
* Lesson Viewer table map

* More SQL Resources should be in footer, not main nav

* Make Real Lessons

* Code cleanup
	* server errors should respond in a proper http code, not report "success:false"
	* more formal lesson/lessonlist objects? keep going round and round on how best to handle this
	* remove backbone? I don't think I need it anymore except for the models.

* Clean HTML/CSS - its pretty ugly
	
	
## Quick guide to git 
(in case I take a large break again and forget)

  * Add a remote to the project:
    git remote add myremotename 'git@remote.com:/remote/url'
	
  * Add files to the repository:
    git add -A
	
  * Commit them
    git commit -m 'added new files and changes'
	
  * Push the commit to the remote
    git push myremotename master
	
More references for git
  
  * [Github.com](http://help.github.com)
  * [Pro Git](http://http://progit.org/book/)
