# Project Structure

## Application data stored as JSON files (instead of in a database)

Everything other than the data queried during the lessons has been moved to JSON files. There were a couple reasons for doing this:

- Storing application data in JSON allows the ability to add the data to version control. 
- Others can submit fixes, or new lessons, via a pull request. 
- It also bootstraps some data for someone forking/cloning the project. 
- One less thing to have to migrate to another database if the lessons are hitting a database in MySQL or SQL Server. 