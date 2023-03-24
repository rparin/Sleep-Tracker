<div align="center">

# Sleep Tracker

[![License][license.io]][license-url]

<p align="left">
This is a sleep tracker app that allows users to monitor their sleep patterns and track their progress towards better sleep. With this app, users can record their sleep duration, and quality.
</p>

[About](#about) •
[Setup](#setup) •
[Running the App](#running-the-app) •
[Technologies](#technologies) •
[Credits](#credits) •
[License](#license)

</div>

## About

<div align="center">

<img width=60% alt="demo of Sleep Tracker App" src="https://raw.githubusercontent.com/rparin/Sleep-Tracker/main/preview/Demo.gif">

</div>

### Features

- Log overnight sleep
- Log tiredness during the day
- View logged data
- Data stored and updated in realtime

## Setup

### Overview

To get started, simply clone the repository and follow the instructions in the [Installation](#installation) section below. The app requires a Firebase account for database storage, so you will need to [set up a Firebase project](#setting-up-firebase) and configure the app accordingly.

### Installation

1. Clone the repository to your machine using `git clone`.
2. Navigate to the `sleeptracker` folder in your terminal
3. Install dependencies by running the command

```
npm install
```

4. You should see a `node_modules` folder once all dependencies have been installed

### Setting up Firebase

5. Create a [Firebase Project][firebase-setup-url] with `Firestore Database`
   - Get started > Add project > 'projectName'
   - On the left there is a navigation tab select 'All Products'
     - Cloud Firestore > Create database > Start in test mode > 'yourSelectedLocation' > Enable
6. Add a firebase `webapp` to your recently created Project
   - On the left there is a navigation tab, on the right of Project Overview select the gear icon
     - Gear icon > Project settings
   - Scroll to the bottom, in the 'Your apps' section select the icon '</>' to create a web app
7. Copy the Firebase configuration code `const firebaseConfig = { .. }`
8. Paste this config into the file `sleeptracker/src/environments.ts`

## Running the App

**Note:** Before you are able to run the app ensure you have installed all required dependencies by following the [Installation](#installation) section above

1. To run the app navigate to the `sleeptracker` folder in your terminal
2. Enter the command

```
ionic lab
```

## Technologies

<div align="center">

[![Angular][angular.io]][angular-url]
&nbsp;&nbsp;
[![Firebase][firebase.io]][firebase-url]
&nbsp;&nbsp;
[![Ionic][ionic.io]][ionic-url]

</div>

## Credits

I made this program as a learning exercise with my friend, [Yen][yen-url].

## License

This project is licensed under the MIT License - see the [LICENSE][git-license-url] file for details.

<!-- MARKDOWN LINKS & IMAGES -->

[license.io]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://opensource.org/licenses/MIT
[git-license-url]: https://github.com/rparin/Sleep-Tracker/blob/main/LICENSE
[angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[angular-url]: https://angular.io/
[yen-url]: https://github.com/yen-lei
[firebase.io]: https://img.shields.io/badge/Firebase-039BE6?style=for-the-badge&logo=firebase
[firebase-url]: https://firebase.google.com/
[ionic.io]: https://img.shields.io/badge/Ionic-FFFFFF?style=for-the-badge&logo=ionic
[ionic-url]: https://ionicframework.com/
[firebase-setup-url]: https://firebase.google.com/
