# API Documentation

![Node](https://img.shields.io/node/v/express/latest)
[![Maintainability](https://api.codeclimate.com/v1/badges/f872e79c70879e95bb7f/maintainability)](https://codeclimate.com/github/Lambda-School-Labs/betterreads-be/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f872e79c70879e95bb7f/test_coverage)](https://codeclimate.com/github/Lambda-School-Labs/betterreads-be/test_coverage)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)

betterReads is a social media platform that allows users to connect with other readers alike, search its database of books, browse recommendations, and manage their own library.


#### 1️⃣ Backend deployed at [AWS_ELASTIC_BEANSTALK](https://api.readrr.app/) <br>


## 1️⃣ Getting started

To get the server running locally:

- Clone this repo
- **npm install** to install all required dependencies
- **npm run server** to start the local server
- **npm start** only for production
- **npm run test** to start server using testing environment

### Seeding for tests

- seed data is in database/seeds/ (seeds have been removed)

1.  knex migrate:up --env=testing
2.  knex migrate:up --env=testing
3.  knex migrate:up --env=testing
4.  knex seed:run --env=testing --specific=001-users.js
5.  knex seed:run --env=testing --specific=001-books.js
6.  knex migrate:up --env=testing
7.  knex seed:run --env=testing --specific=002-user-books.js
8.  knex migrate:up --env=testing
9.  knex seed:run --env=testing --specific=002-user-shelves.js
10.  knex migrate:up --env=testing
11. knex seed:run --env=testing --specific=003-user-books-on-a-shelf.js

### Express

-    Simple routing
-    Event driven features
-    Uses Javascript, an omnipresent language in web development
-    Large Community Support

## 2️⃣ Endpoints

🚫This is a placeholder, replace the endpoints, access control, and description to match your project

#### User Authentication Routes

| Method | Endpoint           | Access Control | Description                      |
| ------ | ------------------ | -------------- | -------------------------------- |
| POST   | `/api/auth/signup` | all users      | Returns message and user object. |

# Body Required

```js
{ 
  fullName: STRING, 
  emailAddress: STRING, 
  password: STRING 
}
```

| Method | Endpoint           | Access Control | Description                      |
| ------ | ------------------ | -------------- | -------------------------------- |
| POST   | `/api/auth/signin` | all users      | Returns message and user object. |

# Body Required

```js
{
  emailAddress: STRING,
  password: STRING
}
```

#### Protected Routes

## Onboarding process

| Method | Endpoint              | Access Control | Description                              |
| ------ | --------------------- | -------------- | ---------------------------------------- |
| POST   | `/api/:userId/genres` | all users      | Returns genre info for registered users. |

# Body Required

```js
{
	genre: STRING;
}
```

# Search Google Books, Search in our Books Table, and Post to our Books Table

| Method | Endpoint             | Access Control | Description                                                |
| ------ | -------------------- | -------------- | ---------------------------------------------------------- |
| GET    | `/api/books`         | all users      | Returns all books that meet query criteria (title, author) |
| GET    | `/api/books/:bookId` | all users      | Returns a single book object                               |
| POST   | `/api/books`         | all users      | Returns No Content                                         |

# Body Required

```js
{
  googleId: STRING,
  title: STRING,
  authors: STRING,
  publisher: STRING,
  publishedDate: STRING,
  description: STRING,
  isbn10: STRING,
  isbn13: STRING,
  pageCount: INTEGER,
  categories: STRING,
  thumbnail: STRING,
  smallThumbnail: STRING,
  language: STRING,
  webReaderLink: STRING,
  textSnippet: STRING,
  isEbook: BOOLEAN,
  averageRating: DECIMAL
}
```

# User Library

| Method | Endpoint                         | Access Control      | Description                                               |
| ------ | -------------------------------- | ------------------- | --------------------------------------------------------- |
| GET    | `/api/:userId/library`           | all users           | Returns all books of the user                             |
| GET    | `/api/:userId/library/:id`       | all users           | Returns a single book                                     |
| GET    | `/api/:userId/library/favorites` | all users           | Returns all favorite books of the user                    |
| PUT    | `/api/:userId/library`           | all users           | Returns updated                                           |
| DELETE | `/api/:userId/library`           | all users           | Returns No Content                                        |
| POST   | `/api/:userId/library`           | all users           | Return added book object                                  |

# Body Required 

-- PUT `/api/:userId/library`
```js
{
  bookId: FOREIGN KEY from books,
  readingStatus: INTEGER,
  favorite: BOOLEAN,
  dateStarted: STRING, (YYYY-MM-DD)
  dateEnded: STRING, (YYYY-MM-DD)
}
```

-- DELETE `/api/:userId/library`
```js
{
  bookId: FOREIGN KEY from books
}
```

-- POST `/api/:userId/library`
```js
{
  book: OBJECT,
  readingStatus: INTEGER,
  favorite: BOOLEAN
}
```


# User's shelves

| Method | Endpoint                        | Access Control | Description                                   |
| ------ | ------------------------------- | -------------- | --------------------------------------------- |
| POST   | `/api/shelves/user/:userId`     | all users      | Returns an empty shelf                        |
| GET    | `/api/shelves/user/:userId`     | all users      | Returns all user's shelves                    |
| GET    | `/api/shelves/:shelfId`         | all users      | Returns a user's selected shelf               |
| PUT    | `/api/shelves/:shelfId`         | all users      | Return changed shelf                          |
| DELETE | `/api/shelves/:shelfId`         | all users      | Return shelf id                               |

# Body Required 

-- POST `/api/shelves/user/:userId`
```js
{
  shelfName: STRING,
  isPrivate: BOOLEAN
}
```

-- GET `/api/shelves/:shelfId`
```js
{
  bookId: FOREIGN KEY from books
}
```

-- PUT `/api/shelves/:shelfId`
```js
{
  shelfName: STRING,
  isPrivate: BOOLEAN
}
```

# User's book on a shelf

| Method | Endpoint                                     | Access Control | Description                                   |
| ------ | -------------------------------------------- | -------------- | --------------------------------------------- |
| DELETE | `/api/booksonshelf/shelves/:shelfId`         | all users      | Return book id                                |
| POST   | `/api/booksonshelf/shelves/:shelfId`         | all users      | Return shelf object with book object in shelf |
| PUT    | `/api/booksonshelf/shelves/:shelfId`         | all users      | Return shelf object with book object in shelf |
| GET    | `/api/booksonshelf/shelves/allbooks/:shelfId`| all users      | Returns all books on user shelf               |
| GET    | `/api/booksonshelf/shelves/:shelfId`         | all users      | Return book                                   |               |

# Body Required 

-- DELETE `/api/shelves/:shelfId`
```js
{
  bookId: FOREIGN KEY from books
}
```

-- POST `/api/shelves/:shelfId`
```js
{
  book: OBJECT,
  readingStatus: INTEGER,
  favorite: BOOLEAN
}
```

-- PUT `/api/shelves/:shelfId`
```js
{
  bookId: FOREIGN KEY from books,
  newShelfId: ShelfID from updated shelf
}
```

-- GET `/api/booksonshelf/shelves/:shelfId`
```js
{
  bookId: FOREIGN KEY from books
}
```


# Onboarding

| Method | Endpoint             | Access Control | Description        |
| ------ | -------------------- | -------------- | ------------------ |
| GET    | `/api/genre/:userId` | all users      | Returns No Content |
| POST   | `/api/genre`         | all users      | Returns Genre id   |
| PUT    | `/api/genre`         | all users      | Returns No Content |
| DELETE | `/api/genre/:userId` | all users      | Returns Genre id   |

# Data Model

#### 2️⃣ USERS

---

```
{
  id: UUID
  emailAddress: STRING
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

#### 2️⃣ BOOKS

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
  averageRating: DECIMAL
}
```

#### 2️⃣ USERBOOKS

---

```
{
  id: UUID
  bookId: UUID foreign key in GOOGLEBOOKS table
  userId: UUID foreign key in USERS table
  readingStatus: INTEGER (NULLABLE)
  dateStarted: DATETIME (NULLABLE)
  dateEnded: DATETIME (NULLABLE)
  dateAdded: DATETIME (AUTOMATICALLY GENERATED)
  favorite: BOOLEAN (NULLABLE)
}
```

#### 2️⃣ USERSHELVES

```
{
  id: UUID
  userId: UUID foreign key in USERS table
  shelfName: STRING
  isPrivate: BOOLEAN (NULLABLE)
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

#### Users

`add(user object)` -> Returns the created user

`findBy(filter)` -> Return all users matching filter

<br>
<br>
<br>

#### Books

`findBy(filter)` -> returns an array of books associated to filter

`getAll()` -> Returns all books

`add(book object)` -> Returns a single book

`findById(id)` -> Returns a single book

<br>
<br>
<br>

#### UserBooks

`findBy(filter)` -> Returns an array book from user's library

`add(book)` -> Returns a single book

`findById(bookId)` -> Finds book by bookId

`findFavorites(userId)` -> Returns array of favorite books

`isBookInUserBooks(userId, googleId)` -> Checks if book is already in user's library

`findByUserId(userId)` -> Return all books in user's library

`findDetailByUserId(userId, bookId)` -> Return a single book with full details

`find(userId, bookId)` -> Return a single book with no details

`update(userId, bookId, update)` -> Return a single book with full details

`remove(userId, bookId)` -> Returns nothing 

<br>
<br>
<br>

#### UserShelves

`findBy(filter)` -> Returns an array of bookshelves

`add(shelf)` -> Returns a single bookshelf

`update(updatedShelf, shelfId)` -> Returns a single bookshelf

`remove(shelfId)` -> Returns nothing

<br>
<br>
<br>

#### UserBooksOnAShelf

`findBook(shelfId, bookId)` -> Returns books on shelf

`findAllBooks(shelfId)` -> Return all books on shelf

`addBooks(book)` -> Returns book

`remove(bookId, shelfId)` -> Returns nothing

`removeAll(bookId, userId)` -> Returns removed shelf id

<br>
<br>
<br>

#### AllUserData

`booksFor(userId)` -> Returns all books for user 

`findBy(userId)` -> Returns everything about user

`shelvesFor(userId)` -> Returns all shelves for user

`find(userId)` -> Returns number of books on a shelf

`findBooksIn(shelfId)` -> Returns all books on shelf 

<br>
<br>
<br>

## 3️⃣ Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.

create a .env file that includes the following:
    
    * DB_ENV - set to "development" until ready for "production"
    * HOST - set to host (i.e., localhost)
    * DB_USER - set to username on your postgres server
    * PASSWORD - set to password for user on your postgres server
    * DB - set to database name for your postgres server
    * TEST_DB - set to test database name for your postgres testing server

    * SESSION_NAME - ...
    * SESSION_SECRET - ...
    * GOOGLE_CLIENT_ID - this is generated in your google account
    * GOOGLE_CLIENT_SECRET - this is generated in your google account
    * FACEBOOK_CLIENT_ID - this is generated in your facebook account
    * FACEBOOK_CLIENT_SECRET - this is generated in your facebook account

    * BASE_URL - set in "production" for elastic beanstock
    * FAIL_URL - set in "production" for elastic beanstock
    * SUCCESS_URL - set in "production" for elastic beanstock
    * GOOGLE_CALLBACK - set in "production" for elastic beanstock
    * FACEBOOK_CALLBACK - set in "production" for elastic beanstock

    * NODE_ENV - set to "development" until ready for "production"
    * RDS_HOSTNAME - set in "production"
    * DATA_SCIENCE - set in "production"
    
    
## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### 👾 Issue/Bug Request 👾

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

-   Check first to see if your issue has already been reported.
-   Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
-   Create a live example of the problem.
-   Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

-   Ensure any install or build dependencies are removed before the end of the layer when doing a build.
-   Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
-   Ensure that your code conforms to our existing code conventions and test coverage.
-   Include the relevant issue number, if applicable.
-   You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See 📱💻🖱[Frontend Documentation](https://github.com/Lambda-School-Labs/betterreads-frontend) for details on the frontend of our project.
See 🔬⚗️🧪[Data Science Documentation](https://github.com/Lambda-School-Labs/betterreads-ds) for details on the data science of our project.
