# **Clips**
This repository contains the source code for a project that allow users to upload and share gaming videos.


## **Table of Contents**
* [Installation guide (Windows/Mac)](#installation-guide)
  - [Installing Node.js and npm](#install-nodejs-npm)
  - [Installing Typescript](#install-typescript)
  - [Installing Angular CLI](#install-Angular-cli)
  - [Install packages](#install-packages)
* [Running the application](#run)
  - [Development server](#deployment-server)
  - [Build](#build)
  - [Code scaffolding](#code-scaffolding)
* [Testing](#testing)
  - [Running unit tests](#run-unit-tests)
  - [Running end-to-end tests](#run-e2e-tests)
* [Further Help](#further-help)

<a name="installation-guide"></a>
## **Installation Guide (Windows/Mac)**

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.3. To run this application we will need Node.js, npm, Typescript and the Angular CLI. In this session, we will install them one by one. We assume that the repository is pulled to a local storage at this point.

<a name="install-nodejs-npm"></a>
### <u>Installing Node.js and npm</u>

In the terminal, check if we have installed node.js by running:

`node -v`

and 

`npm -v`

to check the versions. If any of these are not installed, download and install Node.js from [here](https://nodejs.org/en/download/). When we are installing node.js, make sure we include the npm package manager in the installation list.

After the installation, run `node -v` and `npm -v` again, the version of node.js and npm should be displayed.

<a name="install-typescript"></a>
### <u>Installing Typescript</u>

We can check if we have Typescript installed by running:

`tsc -v`

to check the typescript compiler version. If it is not installed, we can install it using npm by running:

On Windows:

`npm install typescript --save-dev`

On Mac:

`brew install typescript`

After installing, the command `tsc-v` should return the version of typescript. For more information, please visit [Typescript's download website](https://www.typescriptlang.org/download).

<a name="install-Angular-cli"></a>
### <u>Installing Angular CLI</u>

We install the Angular CLI using npm package manager by running the following command in the terminal:

`npm install -g @angular/cli`

On Windows client computers, the execution of PowerShell scripts is disabled by default. To allow the execution of PowerShell scripts, which is needed for npm global binaries, you must set the following execution policy:

`Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

Carefully read the message displayed after executing the command and follow the instructions. Make sure you understand the implications of setting an execution policy.

We can check if Angular CLI is successfully installed by running:

`ng version`

The version of Angular CLI will be displayed. For more inforamtion, please visit [Angular's setup guide for local workspace](https://angular.io/guide/setup-local).


<a name="install-packages"></a>
### <u>Install packages</u>

Run `npm install` to install packages specified in package.json.

<a name="run"></a>
## **Running the application**

<a name="deployment-server"></a>
### <u>Development server</u>

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

<a name="build"></a>
### <u>Build</u>

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.


<a name="code-scaffolding"></a>
### <u>Code scaffolding</u>

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

<a name="testing"></a>
## **Testing**

<a name="run-unit-tests"></a>
### <u>Running unit tests</u>

This project use Karma and Jasmine. Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

<a name="run-e2e-tests"></a>
### <u>Running end-to-end tests</u>

This project use Cypress for End-2-End tests Run `npm run e2e` to execute the end-to-end tests via Cypress. To use this command, you need to first add a package that implements end-to-end testing capabilities.

<a name="further-help"></a>
## **Further help**

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
