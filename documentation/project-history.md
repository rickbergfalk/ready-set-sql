# Project History

Ready Set SQL is a side project I started nearly 2 years ago. 
At the time I was teaching myself as I went, and also using it as a platform for learning 
all the fancy HTML/JS/CSS technologies I had been reading about but never actually done anything with.

## Architecture Indecision

Because of this I experimented with a lot of things. I started with a traditional Express.js app, 
with a mix of server-side rendering with jQuery/javascript running the interactive front end stuff. 
Then I got the bug to make it a purely client-side app, and tried a little Knockout. And then Backbone.

Shortly after doing that, I read posts about people migrating away from that. 
These posts brought up experiences of it over-complicating things for some use cases and search-engine-optimization issues.
It involved a big chunk of javascript to be sent up front. Pushstate with hashtag url fallbacks. Duplication of clientside/serverside code.

I related to a lot of it, and because this app isn't *that* dynamic and interactive, I decided I'd rewrite a bunch of it again. 

The next round was a combo static-html thing with some server side stuff. It was cool but the work flow got kind of clunky.

In the end I went back to what I knew and what I had started with: a traditional Express.js app with jQuery and javascript. (Full disclosure - I probably do a lot of bad practices, like in-lining scripts here and there :( ... just wanted to warn you.) 

## Vision Indecision

The architecture wasn't the only thing I flip-flopped on either. 
The vision I had for this application was greatly scaled back too. 

When I started this thing, there were user accounts, and progress meters for each lesson. 
The app would remember which lessons a user completed. Eventually people could pay for this I thought.

But then that meant commitment. Availability and user data security would become a big deal, 
especially if people were going to pay for it. My progress began to slow - I was losing interest in the project and with it motivation to work on it.
The thought of doing all that payment user stuff started to feel like a lot of work for something I wasn't that sure about.

A fun little side project quickly felt like a chore. I kept re-architecting it and not making any real progress. Something had to change. I finally decided to scale things back and make it a simple, interactive website. Viewers can jump in and try it out, and keep track of their own progress if they are that interested.

I also decided to make it free and open source. I've learned *a lot* from the internet. Most of what I used to build this app are other open source libraries, and the only reason I was even able to put all this together was because of the various tutorials, articles, and examples online.

## The Future

