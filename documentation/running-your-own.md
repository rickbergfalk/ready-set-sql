# Running your own Ready Set SQL

(Installation Instructions)

## 1. Install Node.js

If you haven't already, go download Node.js. If you haven't experienced Node.js yet, I'm really excited for you and I hope you enjoy it.

## 2. Install PostgreSQL

I'm gonna refer to a link for this.

## 3. Create a Database

Again, I have no idea.

## 4. Download/clone this repository. 

Easiest way is to just download the zip file?

## 5. npm install

Go to wherever you put this repository. Open a command window/terminal there. Type "npm install" and watch as Node.js and npm magically install all the node dependencies used in this project

## 6. Install Grunt

While we're in the command line, you'll also want to install grunt, which combines and preprocesses some front end files for us. To type ```npm install grunt -g``` and ```npm install grunt-cli -g``` at the command prompt. 

You only need to do this once. Skip if this is already installed.

## 7. Set environment settings

Before we start our app up, we need to give it some information, like whether we're running a production or development instance, and where the Postgres database is. 

We can do this manually before we start the app, but we could also use a .env file like one might use for Heroku. 

## 8. Start the App

In the command line, run  

```  
node app.js
```  

If everything installed correctly, and you've provided a good environment configuration, you  have a local instance of Ready Set SQL running!

