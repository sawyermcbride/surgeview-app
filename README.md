# SurgeView Marketing

Welcome to SurgeView Marketing! SurgeView is a platform designed to boost YouTube channel visibility by automating ad campaigns. This README provides an overview of the project, installation instructions, and usage guidelines.

## Overview

SurgeView helps YouTube creators and marketers promote their videos through automated ad campaigns. The platform provides an intuitive dashboard to track performance and manage campaigns efficiently.

## Features

- **Automated Ad Campaigns**: Effortlessly create and manage ad campaigns to increase video views and subscribers.
- **Customizable Plans**: Select from various plans, all including a 7-day free trial.
- **Dashboard**: Monitor campaign performance and statistics from a user-friendly interface.

## Installation

1. **Clone the repository**
```bash
git pull https://github.com/sawyermcbride/surgeview-app.git
```
2. **Navigate to the project**
```bash
cd surgeview-app
```
3. **Start the application**
```bash
npm start
```

## Overview 
This is the main application that involves the primary backend and client application. There is essentially two applications within this, each with a seperate package.json
the root directory holds everything for the server. 
---
Inside the `./view-sv` folder is the client application built in React and using the Vite build system. 
We have an additional application in Java/Spring boot that holds our core ads service.

##Server 
Contains **models**, **services**, **routes**

### Root file is `index.ts` 
See the package.json under `scripts` for how we start the project with the client and server at once. 
See `./docs` for api documentation