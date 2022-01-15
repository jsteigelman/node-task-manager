# Task Manager REST API

## Description
This is a task manager REST API that allows users to perform CRUD operations.

## Live Site URL
This app is deployed to Heroku: 
[https://steigelman-task-manager.herokuapp.com/](https://steigelman-task-manager.herokuapp.com/)

The URL can be accessed from Postman using the endpoints listed below.

## Endpoints

In the below examples, :id serves as a placeholder for the ID of the user or task to fetch.

### Create
* ```POST /users``` creates a user. Required data: name, email, password.
* ```POST /users/login``` logs in a user. Required data: email, password.
* ```POST /users/logout``` logs out the current user.
* ```POST /users/logoutAll``` logs out the current user across all devices.
* ```POST /users/me/avatar``` uploads a profile picture to user. The key must be named "avatar".
* ```POST /tasks``` creates a task. The user must already be logged in. Required data: description.

### Read
* ``` GET /users/me``` returns user profile.
* ``` GET /tasks/:id``` returns the specified task. 
* ``` GET /tasks``` returns all tasks associated to logged in user.

### Update
* ``` PATCH /users/me``` updates the user profile. Data that can be updated: name, age, email, password.
* ``` PATCH /tasks/:id``` updates a task. Data that can be updated: description, completed.

### Delete
* ``` DELETE /users/me``` deletes the user's profile and all associated tasks.
* ``` DELETE /tasks/:id``` deletes the specified task.
* ``` DELETE /users/me/avatar``` deletes the user's avatar.

## Built With
* [Node.js](https://nodejs.org/en/) - JavaScript runtime environment
* [Express](https://expressjs.com/) - web application framework
* [@sendgrid/mail](https://www.npmjs.com/package/@sendgrid/mail) - dedicated service for interaction with the mail endpoint of the SendGrid v3 API
* [bcryptjs](https://www.npmjs.com/package/bcryptjs) - library for password hashing
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - implementation of JSON Web Tokens
* [mongodb](https://www.npmjs.com/package/mongodb) - driver to connect to a MongoDB database from a Node.js application
* [mongoose](https://www.npmjs.com/package/mongoose) - Object Data Modeling library for MongoDB
* [multer](https://www.npmjs.com/package/multer) - middleware for handling multipart/form-data when users upload files
* [sharp](https://www.npmjs.com/package/sharp) - module for image processing / resizing
* [validator](https://www.npmjs.com/package/validator/v/0.2.1) - library of string validation, filtering and sanitization methods

