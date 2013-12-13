# Running your own Ready Set SQL

(Installation Instructions)

## 1. Install Node.js

If you haven't already, go download Node.js. If you haven't experienced Node.js yet, I'm really excited for you and I hope you enjoy it.

## 2. Install PostgreSQL

PostgreSQL is available at [http://www.postgresql.org/download/](http://www.postgresql.org/download/ "http://www.postgresql.org/download/")

## 3. Create a Database

There are a bunch of different ways to create a database in PostgreSQL. [You can use plain SQL to do it or the createdb program from the command line](http://www.postgresql.org/docs/9.1/static/manage-ag-createdb.html). Or you can use the [pgadmin application](http://www.youtube.com/watch?v=1wvDVBjNDys "pgadmin application tutorial") to do it.

## 4. Download/clone this repository. 

Clone this repository or download the zip file of it and extract it somewhere.

## 5. npm install

Go to wherever you put this repository. Open a command window/terminal there. Type "npm install" and watch as Node.js and npm magically install all the node dependencies used in this project

## 6. Install Grunt

While we're in the command line, you'll also want to install grunt, which combines and preprocesses some front end files for us. To type ```npm install grunt -g``` and ```npm install grunt-cli -g``` at the command prompt. 

You only need to do this once. Skip if this is already installed.

## 7. Set environment settings

Before we start our app up, we need to give it some information, like whether we're running a production or development instance, and where the Postgres database is. 

We can do this manually before we start the app, but we could also use a .env file like one might use for Heroku. 

I use a .env file when developing locally. Create a file called .env in the root folder of the project. It should look like this:

```
NODE_ENV=development
DATABASE_URL=tcp://user:password@databaseHost/databaseName
PASSPHRASE=ThePassphraseToGetIntoTheEditorArea
```

If you want to connect to a remote postgres database on heroku, you'll need to set the additional environment variable:

```
PGSSLMODE=require
```

## 8. Start the App

In the command line, run  

```  
node app.js
```  

If everything installed correctly, and you've provided a good environment configuration, you  have a local instance of Ready Set SQL running!

Visit [http://localhost:3000/](http://localhost:3000/) to see it. 

## 9. Editing the Lessons (optional)

Sign in to the application at [http://localhost:3000/signin](http://localhost:3000/signin). 
