# Welcome to Telecode

The world's most advanced real-time collaborative programming experience.

# Instructions

1. Install the telecode daemon on your local box. Node.js 8 or higher is required.
```bash
npm install -g telecode
```

2. Navigate to the folder on your system that you wish to collaborate on.
Launch the telecode daemon.
```bash
telecode --url="https://nodeist-colony.herokuapp.com" --room="peanut"
```

3. Have your collaborators run their own daemons in empty directories.
```bash
mkdir -p /tmp/peanut
telecode --url="https://nodeist-colony.herokuapp.com" --room="peanut"
```

4. Files will be synced across computers and [into your browser](https://nodeist-colony.herokuapp.com) on every save!
Happy collaborating!

# Usage `telecode --help`
```bash
telecode usage
    -u | --url    SIO server address (default 'https://nodeist-colony.herokuapp.com/')
    -r | --room   The name of the room (default is a random Heroku like name)
    --reset=true  Reset commits on the server
```

# Features

* Run the "telecode daemon" on your local machine, so all your collaborators can sync changes in real-time, all using their favorite editors!
* Runs on Mac and Linux
* Open up the "telecode browser client" to receive push notifications when a collaborator makes a change.
* Browser client has syntax highlighting and autocompletion via Visual Studio's "Monaco"

# Getting set up

1. [Install Node.js 8.9.1 locally](https://nodejs.org/en/download/).
2. [Install the Heroku CLI](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) and log in with your [free account](https://signup.heroku.com/dc).

# Developing locally

First, install dependencies:

```bash
npm install
```

Then, start your app in dev-mode, open [localhost](http://localhost:5000), and edit away:

```bash
npm start
```

# Deploying changes

To deploy updates to your app:

```bash
git commit -am 'something awesome'
git push heroku master
heroku open
```

You might also want to stream your app's logs in the background:

```bash
heroku logs --tail
```
