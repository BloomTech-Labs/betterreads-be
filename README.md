🚫 Note: All lines that start with 🚫 are instructions and should be deleted before this is posted to your portfolio. This is intended to be a guideline. Feel free to add your own flare to it.

🚫 The numbers 1️⃣ through 3️⃣ next to each item represent the week that part of the docs needs to be completed by.  Make sure to delete the numbers by the end of Labs.

🚫 Each student has a required minimum number of meaningful PRs each week per the rubric.  Contributing to docs does NOT count as a PR to meet your weekly requirements.

# API Documentation

#### 1️⃣ Backend deployed at [🚫name service here](🚫add URL here) <br>

## 1️⃣ Getting started

To get the server running locally:

🚫 adjust these scripts to match your project

- Clone this repo
- **npm install** to install all required dependencies
- **npm server** to start the local server
- **npm test** to start server using testing environment

### Backend framework goes here

🚫 Why did you choose this framework?

-    Point One
-    Point Two
-    Point Three
-    Point Four

## 2️⃣ Endpoints

🚫This is a placeholder, replace the endpoints, access controll, and description to match your project

#### User Authentication Routes

| Method | Endpoint                | Access Control | Description                                  |
| ------ | ----------------------- | -------------- | -------------------------------------------- | 
| POST   | `/api/auth/signup`      | all users      | Returns token and user object.               |
| POST   | `/api/auth/login`       | all users      | Returns token and user object.               |

# Body Required
```js
{
  email: STRING,
  password: STRING
}
```

#### Protected Routes

## Onboarding process

| Method | Endpoint                | Access Control      | Description                                               |
| ------ | ----------------------- | ------------------- | --------------------------------------------------------- |
| POST   | `/api/:userId/genres`   | all users           | Returns genre info for registered users.                  |

# Body Required
```js
{
  genre: [STRING]
}
```

# Search Google Books, Search in our Books Table, and Post to our Books Table

| Method | Endpoint                | Access Control      | Description                                               |
| ------ | ----------------------- | ------------------- | --------------------------------------------------------- |
| GET    | `/api/books`            | all users           | Returns all books that meet query criteria (title, author)|
| GET    | `/api/books/:bookId`    | all users           | Returns a single book object                              |
| POST   | `/api/books`            | all users           | Returns No Content                                        |

# Body Required
```js
{
  googleId: STRING,
  title: STRING,
  authors: [STRING],
  publisher: STRING,
  publishDate: STRING,
  description: STRING,
  isbn10: STRING,
  isbn13: STRING,
  pageCount: INTEGER,
  categories: [STRING],
  thumbnail: STRING,
  smallThumbnail: STRING,
  language: STRING,
  webRenderLink: STRING,
  textSnippet: STRING,
  isEbook: BOOLEAN
}
```

# User Library

| Method | Endpoint                         | Access Control      | Description                                               |
| ------ | -------------------------------- | ------------------- | --------------------------------------------------------- |
| GET    | `/api/:userId/library`           | all users           | Returns all books of the user                             |
| DELETE | `/api/:userId/library/:bookId`   | all users           | Return book id                                            |
| POST   | `/api/:userId/library/:googleId` | all users           | Return book object                                        |

# Body Required
```js
{  
  googleId: STRING,
  userId: INTEGER
}
```

# User's shelves

| Method | Endpoint                        | Access Control      | Description                                               |
| ------ | ------------------------------- | ------------------- | --------------------------------------------------------- |
| POST   | `/api/shelves`                  | all users           | Returns an empty shelf                                    |
| GET    | `/api/:userId/shelves`          | all users           | Returns all user's shelves                                |
| GET    | `/api/shelves/:shelfId`         | all users           | Returns a user's selected shelf                           |
| PUT    | `/api/shelves/:shelfId`         | all users           | Return changed shelf                                      |
| DELETE | `/api/shelves/:shelfId`         | all users           | Return shelf id                                           |
| DELETE | `/api/shelves/:shelfId/:bookId` | all users           | Return book id                                            |
| POST   | `/api/shelves/:shelfId/:bookId` | all users           | Return shelf object with book object in shelf             |
| PUT    | `/api/shelves/:shelfId/`        | all users           | Return books

# Onboarding 

| Method | Endpoint                        | Access Control      | Description                                               |
| ------ | ------------------------------- | ------------------- | --------------------------------------------------------- |
| POST   | `/api/:userId/genre`            | all users           | Returns No Content                                        |
| DELETE | `/api/:userId/genre`            | all users           | Returns Genre id                                          |


# Data Model

#### 2️⃣ USERS

---

```
{
  id: UUID
  email: STRING 
  password: STRING 
}
```

#### 2️⃣ GENRES

---

```
{
  id: UUID
  genre: STRING
}
```

#### 2️⃣ USERGENRE

---

```
{
  id: UUID
  genreName: STRING
  userId: UUID foreign key in USER table
}
```


#### 2️⃣ GOOGLEBOOKS

---
```
{
  id: UUID
  googleId: STRING
  title: STRING
  authors: STRING
  publisher: STRING
  publishDate: STRING
  description: STRING
  isbn10: STRING
  isbn13: STRING
  pageCount: INTEGER
  categories: STRING
  Thumbnail: STRING
  smallThumbnail: STRING
  language: STRING
  webRenderLink: STRING
  textSnipped: STRING
  isEbook: BOOLEAN
}
```

#### 2️⃣ USERBOOKS

---

```
{
  id: UUID
  bookId: UUID foreign key in GOOGLEBOOKS table
  userId: UUID foreign key in USERS table
  readingStatus: INTEGER
  tags: STRING
}
```


#### 2️⃣ USERSHELVES

```
{
  id: UUID
  userId: UUID foreign key in USERS table
  shelfName: STRING
  isPrivate: BOOLEAN
}
```

#### 2️⃣ USERBOOKSONASHELF

```
{
  id: UUID
  bookId: UUID foreign key in BOOKS table
  shelfId: UUID foreign key in USERSHELVES table
}
```


## 2️⃣ Actions

🚫 This is an example, replace this with the actions that pertain to your backend

`getOrgs()` -> Returns all organizations

`getOrg(orgId)` -> Returns a single organization by ID

`addOrg(org)` -> Returns the created org

`updateOrg(orgId)` -> Update an organization by ID

`deleteOrg(orgId)` -> Delete an organization by ID
<br>
<br>
<br>
`getUsers(orgId)` -> if no param all users

`getUser(userId)` -> Returns a single user by user ID

`addUser(user object)` --> Creates a new user and returns that user. Also creates 7 availabilities defaulted to hours of operation for their organization.

`updateUser(userId, changes object)` -> Updates a single user by ID.

`deleteUser(userId)` -> deletes everything dependent on the user

## 3️⃣ Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.

create a .env file that includes the following:

🚫 These are just examples, replace them with the specifics for your app
    
    *  STAGING_DB - optional development db for using functionality not available in SQLite
    *  NODE_ENV - set to "development" until ready for "production"
    *  JWT_SECRET - you can generate this by using a python shell and running import random''.join([random.SystemRandom().choice('abcdefghijklmnopqrstuvwxyz0123456789!@#\$%^&amp;*(-*=+)') for i in range(50)])
    *  SENDGRID_API_KEY - this is generated in your Sendgrid account
    *  stripe_secret - this is generated in the Stripe dashboard
    
## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

 **If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**
 - Check first to see if your issue has already been reported.
 - Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
 - Create a live example of the problem.
 - Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes,  where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See [Frontend Documentation](🚫link to your frontend readme here) for details on the fronend of our project.
🚫 Add DS iOS and/or Andriod links here if applicable.
