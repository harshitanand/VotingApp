# Dynamic Voting App

## Overview

This app allows users to vote anonomously on polls, login using social credentials, create polls of their own
and manage their polls. The client leverages Chart.js, Angular v1.x while server leverages Loopback, NodeJs, es6, PassportJs & postgreSql.

A demo version of this app is deployed at: [http://ec2-35-174-153-94.compute-1.amazonaws.com:3000/](http://ec2-35-174-153-94.compute-1.amazonaws.com:3000/)

![Home](screenshots/Home.png?raw=true)
![Polls](screenshots/Polls.png?raw=true)
![Code](screenshots/Code.png?raw=true)

Project covers the following user stories:

- As an authenticated user, I can keep my polls and come back later to access them.
- As an authenticated user, I can create a poll with any number of possible items.
- As an authenticated user, I can see the list of polls available/created.
- As an authenticated user, I can see a single poll by clicking on it in the list.
- As an unauthenticated or authenticated user, I can see the results of polls in chart form.
- As an unauthenticated or authenticated user, I can see and vote on respective poll.
- After submitting vote, the result should be updated in the chart.
- As an authenticated user, I can delete polls that I decide I don't want anymore by clicking on remove icon(or delete button) in the list.
- As an authenticated user, If I don't like the options on a poll, I can create a new option(custom).
- As an authenticated user, I can share my polls on twitter.

Additional user stories covered:

- User Auth provided using passportJs oauth.
- Dynamic charts generation for each polls.
- As an authenticated user, If I don't like the options on a poll, I can create a new option(custom) [ Simply Text no dropdown type whatever suits you].

## Prerequisites

Install PostgreSQL (ubuntu)

```
  sudo apt-get update
  sudo apt-get install postgresql postgresql-contrib
```

Install PostgreSQL (Mac)

```
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

  brew update

  brew doctor

  brew install postgresql

  initdb /usr/local/var/postgres -E utf8

  gem install lunchy

  mkdir -p ~/Library/LaunchAgents

  cp /usr/local/Cellar/postgresql/<your_postgres_version>/homebrew.mxcl.postgresql.plist ~/Library/LaunchAgents/

  launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist

  lunchy start postgres
```

Create Database

```
  psql -d template1

  CREATE USER root WITH PASSWORD 'postgre';

  CREATE DATABASE votingapp;

  GRANT ALL PRIVILEGES ON DATABASE votingapp to root;

  CREATE USER readonly_user WITH ENCRYPTED PASSWORD 'postgre';

  \c votingapp

  GRANT CONNECT ON DATABASE votingapp to readonly_user;

  GRANT USAGE ON SCHEMA public to readonly_user;

  GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly_user;

  GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

  \q
```

## Install

Clone this repository and install npm dependencies:

```
git clone https://github.com/harshitanand/VotingApp.git
cd VotingApp
npm install && bower install
```

## Run

Start

```
  node .
```

Navigate to `http://localhost:3000`

## Technology Stack

This package contains:

| Front-End           | Back-End            |
| ------------------- | ------------------- |
| Angular v1.x        | StrongLoop/Loopback |
| AngularCharts       | postrgeSql Database |
| Angular SocialShare | PassportJs          |
| Charts.js           |                     |
| HTML5/CSS           |                     |

| Both       |
| ---------- |
| Javascript |

### License

MIT License

> You can check out the full license [here](https://github.com/harshitanand/VotingApp/blob/master/LICENSE)
> This project is licensed under the terms of the **MIT** license.
