# Dev Test Implementation

## How to run
First of all you want to install all the dependencies through:

- npm install

You will need 2 terminals running in order to execute this implementation. First navigate to the root of the project with both terminals, each one has to execute one of the following commands:

- npm run start
- npm run start-server

## Deliverables
As you provided the initial test with a client and api folder for each of those, I've kept those and you can find the entire server implementation under ./api/server/server.

I broke down the frontend into .client/components and .client/styles.

## Bundler & project config
I used Weback for bundling on this project. It's a manual configuration to support Typescript using Babel.

The template and dist folders are resources for these webpack configs. The src folder hosts the entry point for the app. The tests folder is self-explanatory, I'm using Jest for testing. 

The project is written with ReactJS, using client side rendering, using JWT for authentication tokens and HTTP-only cookies to store them. 
The server is running on express.

The directory seems a bit messy, mainly to keep the client and api folders you sent initially free of clutter, so feel free to disregard anything outside of those (unless you want to check the store config, reducers, etc...)

I added authentication middleware so that if anyone tries to access any route without having the necessary cookie for it, they will not be able to access anyone's information. 

## Testing
I implemented unit tests for the API using Jest. 
The tests are running with Axios, I created just a few basic tests as proof of concept to check the functionality of each of the endpoints of the API.

In order to run the tests you have to run the server first:

npm run start-server

Then on another terminal:

npm run test

A test user was added to the DB in order not to touch the real users as if it was a prod environment, and the test cases handle cleaning up the temporary JWT tokens created and added to the DB to avoid cluttering it up. 

## Data validation, sanitization, etc...
Given the time constrain due to mother's day a couple days ago, I didn't have time to add visual errors that indicate you can't submit the forms with empty / non-valid information, but the validation is still happening. There's front-end validation preventing form submission, for now the errors are being logged to the console. 