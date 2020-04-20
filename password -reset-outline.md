1. Frontend makes a post request with user email
2. Backend creates and sends a token back with that email, sends password reset link in an email to the poseted e.mail
3. Frontend sets token to localstorage
4. Link in email routes to Frontend page that gets token from local storage and sends in a useeffect post to Backend
5. link sends user to a password reset page that Frontend builds
6. Frontend sends in  a useeffect post of the token in localstorage
7. Backend authorizes and redirects to Frontend password reset page
8. password reset page sends in post token and requested password reset 