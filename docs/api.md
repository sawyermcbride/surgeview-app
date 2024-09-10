# Introduction
This api involves includes many different resources for our client application to interact with. 
---
These include Campaigns, Customers, Statistics, and YouTube service. 

## Authentication

### POST /login
- **Description**: logs in the user with email and password 
- **Request**: 
  - **Body**  
  ```json
  {
    "email": "name@site.com",
    "password": "password"
  }
  ```
- **Response**
  - **Success (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbWNicmlkZTExQGdtYWlsLmNvbSIsImlhdCI6MTcyNTk1NzY2OSwiZXhwIjoxNzI1OTc5MjY5fQ.h4otF6-n-eVO3x7gJk_N8d4f9Juc3TjDoOfz4Mlf-hk",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbWNicmlkZTExQGdtYWlsLmNvbSIsImlhdCI6MTcyNTk1NzY2OSwiZXhwIjoxNzI2NTYyNDY5fQ.3SilPF8J3e4fkwYPA94qx3v4q_y-KN6Q69uNrRuUjos"
  }
  ```
  - **Error (401 Unauthorized)**
  See `type: "user"` for no user with that email
  ```json
  {
    "message": "No user exists with that email",
    "type": "user"
  }
  ```
  See `type: "password"` for invalid password
  ```json
  {
    "message": "Password invalid",
    "type": "password"
  }
  ```
---

### POST /signup
- **Description**: Creates user and returns tokens
- **Request**: 
  - **Body**  
  ```json
  {
    "email": "name@site.com",
    "password": "password"
  }
  ```
- **Response**
  - **Success (201 Created)**:
  ```json
  {
    "message": "User registered succesfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cHBvcnRAZXhvaWRkZXZlbG9wbWVudC5jb20iLCJpYXQiOjE3MjU5NTk5NzUsImV4cCI6MTcyNTk4MTU3NX0.4jcZug5wc7g4m37-Gwnh8fatLrqtHW4Ix0UNxl7r_pM",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cHBvcnRAZXhvaWRkZXZlbG9wbWVudC5jb20iLCJpYXQiOjE3MjU5NTk5NzUsImV4cCI6MTcyNjU2NDc3NX0.GzlocT_z2crsRp-7-ffv3O3xhp1l6JhorTCwP-f0XfA"
  }
  ```
  - **Error (409 Conflict)**
  ```json
  {
    "message": "Email already in use."
  }
  ```
  ---
  
### POST /signup

- **Description**: Creates user and returns tokens
- **Request**: 
  - **Body**  
  ```json
  {
    "email": "name@site.com",
    "password": "password"
  }
  ```
- **Response**
  - **Success (201 Created)**:
  ```json
  {
    "message": "User registered succesfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cHBvcnRAZXhvaWRkZXZlbG9wbWVudC5jb20iLCJpYXQiOjE3MjU5NTk5NzUsImV4cCI6MTcyNTk4MTU3NX0.4jcZug5wc7g4m37-Gwnh8fatLrqtHW4Ix0UNxl7r_pM",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cHBvcnRAZXhvaWRkZXZlbG9wbWVudC5jb20iLCJpYXQiOjE3MjU5NTk5NzUsImV4cCI6MTcyNjU2NDc3NX0.GzlocT_z2crsRp-7-ffv3O3xhp1l6JhorTCwP-f0XfA"
  }
  ```
  - **Error (409 Conflict)**: Customer record already exists with that email
  ```json
  {
    "message": "Email already in use."
  }
  ```
  ---
  