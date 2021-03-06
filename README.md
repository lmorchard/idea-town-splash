# Idea Town

[![Build Status](https://travis-ci.org/mozilla/idea-town.svg?branch=master)](https://travis-ci.org/mozilla/idea-town)

![Idea Town](https://raw.githubusercontent.com/mozilla/idea-town/master/src/images/town%402x.png)

## What is Idea Town?

Idea town is an opt-in platform for Firefox that facilitates controlled tests of new high-visibility products in the general release channel.

Idea town will allow us to make informed & user tested product decisions quickly and without compromising user privacy or experience.

## What Idea Town is not

Idea Town is not a testbed for product/feature concepts that do not have a chance of shipping to all release users.

Idea Town is not intended to replace the trains for the vast majority of features. Rather, it is reserved for those features that require a high degree of fine tuning and user feedback prior to general release.

## What is this repo?

This repo is currently intended to serve as UI/UX skeleton for Idea Town.

Basically a clone of [eb-node-express-signup](https://github.com/awslabs/eb-node-express-signup) so we can get movin fast.

## Installation

```
npm install
gulp // watches files for rebuild, starts an app server in dev mode
```

Don't forget to set your AWS creds in `.ebenvironment/environment.config`

point your browser to localhost:3001

## Deploy

### Manual deploy

You will need to run `gulp bundle` to create the zip in `dist/` and upload it through the
elastic beanstalk dashboard.

### Using `eb` CLI

- make sure `eb` is configured correctly for environments via `eb init`
  - `master` = dev
  - `stage`  = stage
  - `prod`   = production
- change to the appropriate branch (master, stage, production)
- `npm run build` - to build assets into `public/` directory
- `eb deploy` to deploy a new version

## Who is responsible for this?

Just a couple of UX guys, up to no good:
- jgruen@mozilla.com
- bbell@mozilla.com
- djustice@mozilla.com

## FAQ

Q: Is the name Idea Town permanent?

A: Probably not.

## The End...?
