# Introduction
This api includes many different resources for our client application to interact with. 
---
These include Campaigns, Customers, Statistics, and YouTube service. 

## Authentication

### POST /login
- **Description**: logs in the user with email and password 
- **Request**: 
  - **Body**  
  - application/x-www-form-urlencoded
  ```json
  {
    "email": "name@site.com",
    "password": "password"
  }
  ```
- **Response**
  - **Success (200 OK)**:
    - JSON
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
  = application/x-www-form-urlencoded
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
  ## Dealing with Tokens

  ### POST /auth/validate-token
- **Description**: Validates a token and returns the associated email 
- **Request**: 
  - **Body**  
  - application/x-www-form-urlencoded
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
      "valid": true,
      "email": "samcbride11@gmail.com"
  }
  ```
   ### POST /auth/refresh-token
- **Description**: Accepts a refresh token and returns a new access token
- **Request**: 
  - **Body**  
  - application/x-www-form-urlencoded
  ```json
  {
    "refreshToken": "  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbWNicmlkZTExQGdtYWlsLmNvbSIsImlhdCI6MTcyNjAxODMxOSwiZXhwIjoxNzI2MDM5OTE5fQ.HiRFm_yyUYuNYmpwRDsG-kLAqmrjkKyKMoPTMLq8iYE",
  }
  ```
- **Response**
  - **Success (200 OK)**:
  ```json
    {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbWNicmlkZTExQGdtYWlsLmNvbSIsImlhdCI6MTcyNjAxODczMiwiZXhwIjoxNzI2MDI1OTMyfQ.UX0irvonf113QTEJV5Kv4M29PXKQ58Ke6fsS2h4X1IQ"
    }
  ```
  - **Invalid token (403 Forbidden)**:
  ```json
  {
      "message": "Invalid refresh token"
  }
  ```
  ---

  ##Interacting with Campaigns 
   ### GET /campaign/request
- **Description**: Gets all the campaigns associated with the user through the provided access token
- **Request**: 
  - **Body**  
  - application/x-www-form-urlencoded
  - Header: 
  ```json
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbWNicmlkZTExQGdtYWlsLmNvbSIsImlhdCI6MTcyNjAxODMxOSwiZXhwIjoxNzI2MDM5OTE5fQ.HiRFm_yyUYuNYmpwRDsG-kLAqmrjkKyKMoPTMLq8iYE",
  }
  ```
- **Response**
  - **Success (200 OK)**:
  ```json
  [
    {
        "campaign_id": 102,
        "video_link": "https://www.youtube.com/watch?v=IrKXSTk9Sq4",
        "price": "199.00",
        "plan_name": "Pro",
        "status": "stopped",
        "video_title": "The First Kennedy-Nixon Debate of 1960",
        "channel_title": "Richard Nixon Foundation",
        "payment_status": "succeeded"
    },
    {
        "campaign_id": 39,
        "video_link": "https://www.youtube.com/watch?v=7m_o3Cp8UIY",
        "price": "399.00",
        "plan_name": "Standard",
        "status": "active",
        "video_title": "4 Days of Training Like a Marine",
        "channel_title": "Mav",
        "payment_status": null
    },
    {
        "campaign_id": 104,
        "video_link": "https://www.youtube.com/watch?v=UczALD7ZZDU",
        "price": "199.00",
        "plan_name": "Premium",
        "status": "setup",
        "video_title": null,
        "channel_title": "CNBC",
        "payment_status": "not_attempted"
    },
    {
        "campaign_id": 105,
        "video_link": "https://www.youtube.com/watch?v=UczALD7ZZDU",
        "price": "199.00",
        "plan_name": "Premium",
        "status": "setup",
        "video_title": null,
        "channel_title": "CNBC",
        "payment_status": "not_attempted"
    },
    {
        "campaign_id": 106,
        "video_link": "https://www.youtube.com/watch?v=UczALD7ZZDU",
        "price": "199.00",
        "plan_name": "Premium",
        "status": "setup",
        "video_title": "How Data Centers Became Hot Real Estate Investments",
        "channel_title": "CNBC",
        "payment_status": "not_attempted"
    },
  ]

  ```
  - **Invalid token (401 Unauthorized)**:
  ```json
  {
    "error": "Unauthorized",
    "message": "invalid token"
  }
  ```
  ---
   ### POST /campaign/add
- **Description**: Creates a campaign with a provided link and selected plan
- **Request**: 
  - **Body**  
  - application/x-www-form-urlencoded
  - Header: 
  ```json
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbWNicmlkZTExQGdtYWlsLmNvbSIsImlhdCI6MTcyNjAxODMxOSwiZXhwIjoxNzI2MDM5OTE5fQ.HiRFm_yyUYuNYmpwRDsG-kLAqmrjkKyKMoPTMLq8iYE",
  }
  ```
  - application/x-www-form-urlencoded
  - Body:
    - videoLink: if not a valid link the api will return an error, see below. 
    - plan: for now must be "Standard", "Premium" or "Pro" with capital first letter, 
      see below for incorrect plan response
  ```json
  {
    "videoLink": "https://www.youtube.com/watch?v=UczALD7ZZDU",
    "plan": "Standard"
  }
  ``` 
- **Response**
  - **Success (201 Created)**:
  ```json
  {
    "campaignId": 109,
    "message": "Campaign added"
  }

  ```
  - **Invalid token (401 Unauthorized)**:
  ```json
  {
    "error": "Unauthorized",
    "message": "invalid token"
  }
  ```
  - **Invalid YouTube URL (400 Bad Request)**: Given if the youtube url is invalid, such as does not link to a video
  ```json
  {
      "error": "Invalid YouTube URL"
  }
  ```
  - **Wrong fields or missing fields (400 Bad Request)**: Given if you miss a required field or provide a plan out of the outlines ones
  ```json
  {
      "error": "Missing required fields"
  }
  ```
  ---

     ### PUT /campaign/update/:id
- **Description**: Updates a campaign
- **Request**: 
  - **Body**  
  - application/x-www-form-urlencoded
  - Header: 
  ```json
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbWNicmlkZTExQGdtYWlsLmNvbSIsImlhdCI6MTcyNjAxODMxOSwiZXhwIjoxNzI2MDM5OTE5fQ.HiRFm_yyUYuNYmpwRDsG-kLAqmrjkKyKMoPTMLq8iYE",
  }
  ```
  - application/x-www-form-urlencoded
  - Body:
    - Should have either plan_name or video_link to update
    - plan_name (optional): must be "Premium", "Standard" or "Pro"
    - video_link (optional): YouTube url, if invalid the resposne will provide this information
  ```json
  {
    "video_link": "https://www.youtube.com/watch?v=UczALD7ZZDU",
    "plan_name": "Standard"
  }
  ``` 
- **Response**
  - **Success (201 Created)**:
  ```json
  {
      "complete": true,
      "message": "Campaign updated"
  }

  ```
  - **Invalid token (401 Unauthorized)**:
  ```json
  {
    "error": "Unauthorized",
    "message": "invalid token"
  }
  ```
  - **Invalid YouTube URL (400 Bad Request)**: Given if the youtube url is invalid, such as does not link to a video
  ```json
  {
      "error": "Invalid YouTube URL"
  }
  ```
  - **Invalid plan (400 Bad Request)**: Given if the requested plan to update does not exist
  ```json
  {
    "error": "Missing required fields"
  } 
  ```
  - **User not allowed to update campaign or campaign does not exist (500 Internal Server Error)**: 
    **if the authenticated user does not own the campaign or the campaign does not exist**
  ```json
  {
      "message": "Unable to update campaign, user does not own the campaign or the campaign does not exist"
  }
  ```
  ---

  ### DELETE /campaign/delete/:id
- **Description**: Sets campaign to stopped
- **Request**: 
  - **Body**  
  - application/x-www-form-urlencoded
  - Header: 
  ```json
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbWNicmlkZTExQGdtYWlsLmNvbSIsImlhdCI6MTcyNjAxODMxOSwiZXhwIjoxNzI2MDM5OTE5fQ.HiRFm_yyUYuNYmpwRDsG-kLAqmrjkKyKMoPTMLq8iYE",
  }
  ```
- **Response**
  - **Success (200 Created)**:
  ```json
  {
      "message": "Campaign set to stopped"
  }

  ```
  - **Invalid token (401 Unauthorized)**:
  ```json
  {
    "error": "Unauthorized",
    "message": "invalid token"
  }
  ```
  - **User unable to delete campaign (400 Bad Request)**: Given if the user does not own the campaign or it does not exist
  ```json
  {
    "message": "Unable to update, error: Unable to update campaign, user does not own the campaign or the campaign does not exist"
  }
  ```
  ---
  