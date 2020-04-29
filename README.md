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
# Returns
```js
{
  message: "successfully registered user",
  user: {
    id:  {user id},
    fullName: {user full name},
    emailAddress: {user email address},
    image: {user image in blob form},
    googleID: {user Google ID},
    facebookID: {user Facebook ID}
  }
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
# Returns
```js
{
  message: "successfully logged in",
  token: {json web token},
  user: {
  	  id:  {user id},
	  fullName: {user full name},
	  emailAddress: {user email address},
	  image: {user image in blob form},
	  googleID: {user Google ID},
	  facebookID: {user Facebook ID}
	}
}
```
### Authentication has been updated from sessions to more secure JSON web tokens. Here is what you need to do to ustilize them
## Set up axioswithauth()
	- create a file called axiosWithAuth
	- within this file, write the following function  
```js
	  const axiosWithAuth = () => {
	  const token = localStorage.getItem("token")
	  	return axios.create({
			baseURL: "https://api.readrr.app/",
			headers: { authorization: token }
		})	
	  }
```

| Method | Endpoint           | Access Control | Description                      |
| ------ | ------------------ | -------------- | -------------------------------- |
| POST | `/api/auth/reset/requestreset/` | all users | Returns a token |

# Required Body
```json
    {
        "email": "user email"
    }
```

# Returns
```json
    {
        message: "Request received, a link has been sent to the requested email",
        "token": "{ user password reset token }"
    }
```

| Method | Endpoint           | Access Control | Description                      |
| ------ | ------------------ | -------------- | -------------------------------- |
| POST | `/api/auth/reset/` | all users | Updates user password with the requested password |

# Body Requires
```json
    {
        "token": "{ user password reset token}",
        "password": "{ user requested password }"
    }
```

# Returns
```json
    {
        "message": "Successfully updated user info"
    }
```

## Use Local Storage
- hit the sign in endpoint to get a token for the user
- store the token in local storage with localStorage.setItem("token", `${res.data.token}`)

#### Protected Routes

## User Genres

| Method | Endpoint              | Access Control | Description                              |
| ------ | --------------------- | -------------- | ---------------------------------------- |
| POST   | `/api/genre` 	 | all users      | Returns genre info for registered users. |

# Body Required

```js
{
	genre: STRING,
	userId: INTEGER
}
```

# Returned

```js
{
	message: "genre added successfully",
	genre: { genre }
}
```

| Method |           Endpoint           | Access Control |             Description                  |
| ------ | -----------------------------| -------------- | ---------------------------------------- |
|  PUT   | `/api/genre/:userId/:genreId`|    all users   |        Returns updated genre info        |

# Body Required

```js
{
	userId: INTEGER,
	genreName: { genre }
}
```
# Returned
```js
{
    "message": "genre updated successfully",
    updatedGenre: { updatedGenre }
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
| GET    | `/api/:userId/library`           | all users           | Returns all books of user by the requested id                             |
| GET    | `/api/:userId/library/:id`       | all users           | Returns a single book by a requested id                                    |
| GET    | `/api/:userId/library/favorites` | all users           | Returns all favorite books of a user by the requested id                    |



| Method | Endpoint                         | Access Control      | Description                                               |
| ------ | -------------------------------- | ------------------- | --------------------------------------------------------- |
| Patch    | `/api/:userId/library`           | all users           | updates an aspect of a requested user book, returns updated book                                          |
# Body (some optional, must send at least one option besides bookId)
```json
{
  "bookId": "INTEGER Foreign key, from books (required)",
  "readingStatus": "INTEGER optional",
  "favorite": "BOOLEAN optional",
  "dateStarted": "STRING MM/DD/YYYY optional",
  "dateEnded": "STRING MM/DD/YYYY optional",
  "userRating": "DECIMAL optional"
}
```
```
Returns the body of the request with a the primary key (integer) for the book in the table, a userId (integer) and a date added (standard date format). 
```

| Method | Endpoint                         | Access Control      | Description                                               |
| ------ | -------------------------------- | ------------------- | --------------------------------------------------------- |
| DELETE | `/api/:userId/library`           | all users           | Returns No Content                                        |

# Body Required
```js
{
  bookId: "FOREIGN KEY from books"
}
```

| Method | Endpoint                         | Access Control      | Description                                               |
| ------ | -------------------------------- | ------------------- | --------------------------------------------------------- |
| POST   | `/api/:userId/library`           | all users           | Return added book object                                  |

# Body Required
```js
{
  book: { book },
  readingStatus: INTEGER,
  favorite: BOOLEAN
}
```

# Returns
```js
    {
        id: "primary key",
        bookId: "id of the added book",
        userId: "id of the user to whom's library the book was added",
        readingStatus: "reading status of the added book",
        dateStarted: "date the book was started, will always be null immediately after a post",
        dateEnded: "date the book was ended, will always be empty immediately after a post",
        dateAdded: "date the book was added, defaults to the exact time of the post request",
        favorite: "favorite status of the added book",
        userRating: "average user rating of the added book, pulled for the GoogleBooks api",
        googleId: "google id of the added book, pulled from the GoogleBooks api",
        title: "title of the added book",
        authors: "authors of the added book",
        publisher: "publisher of the added book",
        publishedDate: "publish date of the added book",
        description: "description of the added book, pulled from the GoogleBooks api",
        isbn10: "ISBN number of the added book, pulled from the GoogleBooks api",
        isbn13: "another ISBN, pulled from the GoogleBooks api",
        pageCount: "page count of the added book, pulled form the GoogleBooks api",
        categories: "categories for the added book, pulled from the GoogleBooks api",
        thumbnail: "thumbnail for the added book, pulled from the GoogleBooks api",
        smallThumbnail: "small thumbnail of the added book, pulled form the GoogleBooks api",
        language: "language of the added book, pulled from the GoogleBooks api",
        webReaderLink: "web reader link for the added book, pulled from the GoogleBooks api",
        textSnippet: "a snippet fo text from the added book, pulled form the GoogleBooks api",
        isEbook: "boolean reflecting whether the added book is in ebook form, pulled from the GoogleBooks api",
        averageRating: "average rating of the added book, pulled from the GoogleBooks api"
    }
```

# User's shelves

| Method | Endpoint                        | Access Control | Description                                   |
| ------ | ------------------------------- | -------------- | --------------------------------------------- |
| GET    | `/api/shelves/user/:userId`     | all users      | Returns all user's shelves                    |
| GET    | `/api/shelves/:shelfId`         | all users      | Returns a user's selected shelf, containing all of the books on that shelf               |
| DELETE | `/api/shelves/:shelfId`         | all users      | Return deleted shelf id                       |
| POST   | `/api/shelves/user/:userId`     | all users      | Returns an empty shelf                        |
# Body Required for POST

```js
{
  shelfName: STRING,
  isPrivate: BOOLEAN
}
```
| Method | Endpoint                        | Access Control | Description                                   |
| ------ | ------------------------------- | -------------- | --------------------------------------------- |
| PUT    | `/api/shelves/:shelfId`         | all users      | Return changed shelf                          |

# Body Required
```js
{
  shelfName: STRING,
  isPrivate: BOOLEAN
}
```

# User's books on a shelf

| Method | Endpoint                                                      | Access Control | Description                                   |
| ------ | ------------------------------------------------------------- | -------------- | --------------------------------------------- |
| DELETE | `/api/booksonshelf/shelves/:shelfId/:bookId`                          | all users      | Returns deleted book id                                |
| POST   | `/api/booksonshelf/shelves/:shelfId`                          | all users      | Returns shelf object with book object in shelf |
| PUT    | `/api/booksonshelf/shelves/:shelfId`                          | all users      | Returns updated shelf id and the book id newly associated with it |
| GET    | `/api/booksonshelf/shelves/:shelfId`                          | all users      | Returns all books on a requested shelf    |
| GET    | `/api/booksonshelf/user/:userId/shelves/allbooks`             | all users      | Returns all user's shelves with the books     |

# Body Required 

-- DELETE `/api/booksonshelf/shelves/:shelfId`
```js
{
  bookId: FOREIGN KEY from books
}
```

-- POST `/api/booksonshelf/shelves/:shelfId`
```js
{
  book: { book },
  readingStatus: INTEGER,
  favorite: BOOLEAN,
  userRating: DECIMAL
}
```

-- PUT `/api/booksonshelf/shelves/:shelfId`
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

## Recommendations
| Method | Endpoint                                                      | Access Control | Description                                   |
| ------ | ------------------------------------------------------------- | -------------- | --------------------------------------------- |
| GET | `/api/:userId/recommendations` | all users | Returns recommendations based on the requested user's library |

# Returns
```json
    {
        "message": "recommendations retrieved successfully",
        "recommendations": { recommendations }
    }
```
| Method | Endpoint                                                      | Access Control | Description                                   |
| ------ | ------------------------------------------------------------- | -------------- | --------------------------------------------- |
| POST | `/api/:userId/recommendations` | all users | Returns recommendations based on the requested books

## Requires
```json
    {
        "books": [ array of books ]
    }
```
# Returns
```json
    {
        "message": "recommendations retrieved successfully",
        "recommendations": { recommendations }
    }
```

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

`count()` -> Return total number of users

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

`findByUser(id)` -> Returns an array of bookshelves

`returnShelfId(userId)` -> Returns an array of shelf ids 

`add(shelf)` -> Returns a single bookshelf

`update(updatedShelf, shelfId)` -> Returns a single bookshelf

`remove(shelfId)` -> Returns nothing

<br>
<br>
<br>

#### UserBooksOnAShelf

`findBook(shelfId, bookId)` -> Returns books on shelf

`findAllBooks(shelfId)` -> Return all books on shelf

`returnEveryShelfFrom(userId)` -> Returns all books from user's shelves

`findBooksIn(shelfId)` -> Returns books on shelf

`findById(id)` -> Returns shelf with book

`addBooks(book)` -> Returns book

`remove(bookId, shelfId)` -> Returns nothing

`removeAll(bookId, userId)` -> Returns removed shelf id

<br>
<br>
<br>

#### AllUserData

`booksFor(userId)` -> Returns all books for user 

`shelvesFor(userId)` -> Returns all shelves for user

`find(userId)` -> Returns number of books on a shelf

`findBooksIn(shelfId)` -> Returns all books on shelf 

`findBy(userId)` -> Returns everything about user

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
    * DATE_SCIENCE_TOTAL - set in "production"
    
    
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

This is a placeholder edit, in order to merge with master and trigger a coverage test.
