🚫 Note: All lines that start with 🚫 are instructions and should be deleted before this is posted to your portfolio. This is intended to be a guideline. Feel free to add your own flare to it.

🚫 The numbers 1️⃣ through 3️⃣ next to each item represent the week that part of the docs needs to be comepleted by. Make sure to delete the numbers by the end of Labs.

🚫 Each student has a required minimum number of meaningful PRs each week per the rubric. Contributing to docs does NOT count as a PR to meet your weekly requirements.

# API Documentation

#### 1️⃣ Backend deployed at

heroku.com <br>
https://coach-me-backend.herokuapp.com/

---

### Backend framework

-   Node.js and Express gives us the flexibility to control the flow of requests to airtable in a controlled and easy to read environment.
-   We are going to need a database that can be seeded with massive amounts of data and control the relationships between the tables.
-   Custom Middleware
-   prebuilt middleware packages

---

## 2️⃣ Endpoints

**Client Routes**

| Method                                                                              | Endpoint                             | Access Control                               | Description                                                                 |
| ----------------------------------------------------------------------------------- | ------------------------------------ | -------------------------------------------- | --------------------------------------------------------------------------- |
| POST                                                                                | `/clientRoute/login`                 | all registered clients                       | Returns token to access client information                                  |
| GET                                                                                 | `/clientRoute/getMetrics`            | client(token required)                       | Access current and past client Metrics                                      |
| GET                                                                                 | `/clientRoute/getIntakeRecords`      | client(token required)                       | Receives formated client Objects                                            |
| POST                                                                                | `/clientRoute/logMetrics`            | client(token required)                       | input new Health Metric to database                                         |
| GET                                                                                 | `/clientRoute/getCoachInfo`          | client(token required)                       | returns current coach object                                                |
| GET                                                                                 | `/clientRoute//paginationGetMetrics` | client(token required)                       | returns full history of Metrics for client                                  |
| GET                                                                                 | `/coachRoute/getPatients`            |                                              | client(token required)                                                      | returns full list of patients |
| GET                                                                                 | `/coachRoute/getClientMetrics/:id`   | requires clientId                            |
| returns full Metrics history of client id passed in dynamic route                   |
| GET                                                                                 | `/coachRoute/getClientGoals/:id`     | requires clientId                            |
| returns full goal history of client id passed in dynamic route                      |
| POST                                                                                | `/twilioRoute/twilio`                |                                              |
| returns a string of the sent message's sid if the post was successful               |
| GET                                                                                 | `/twilioRoute/messagehistory/:phone` | requires client Phone number                 |
| returns two arrays with messages that were from and to the number in the url string |
| POST                                                                                | `/coachRoute/newRegister`            |                                              | returns a personalized message and a jsonwebtoken                           |
| POST                                                                                | `/coachRoute/login`                  |                                              | returns a personalized message and a jsonwebtoken                           |
| GET                                                                                 | `/coachRoute/getLastCheckinTime/:id` |                                              | returns the last checkin date and the corresponding patientId from airtable |
| POST                                                                                | `/twilioRoute/schedule`              | requires client phone number in request body | creates cronjob instance (still needs some work)                            |
| GET                                                                                 | `/twilioRoute/getScheduled/:id`      | requires valid clientId in url body          | returns an array of all scheduled messages for provided patientId           |
| DELETE                                                                              | `/twilioRoute/deleteScheduled/:id`   | requires valid scheduleId                    | returns a message that says the record was deleted from database            |
| PUT                                                                                 | `/twilioRoute/updateScheduled/:id`   | requires valid scheduleId                    | returns a message that says the record was updated in database              |

returns array of clients that logged in health coach is charged with

# Data Model - Clients

### To retrieve token login with non formatted 10 digit phone number

_Example_

```javascript
{
    clientPhone: '1234567899';
}
```

#### THis Will return an object as such:

(token, name and phone number have been altered for security reasons)

_Example_

```javascript
{
  "message": "Welcome back, Joycee!",
  "token": "dlkjdlhlkhdlkaHGFLFlkhLKHGDLKSHLKHGLKHDFLKHDLKhlkHLGKHSLDKhlkh",
  "clientObject": {
    "id": "recIsYAcq6lv1AFJa",
    "fields": {
      "Client Name": "Scarlet",
      "Phone": "(***) ***-1639",
      "Coaching master table": [
        "recZNs8pQo2rSsw0T"
      ],
      "Language": "English",
      "Availability": "Afternoons 4-6",
      "Coach": [
        "recUwfzBrKLTpHdtv"
      ],
      "Conditions": [
        "High blood pressure"
      ],
      "Health goal": "Lose weight, look good",
      "Motivations": "Be sexy, start dating again",
      "Date": "2019-05-15T22:58:00.000Z",
      "Type of Visit": "In person",
      "Physical activity / Healthy eating / Medication": [
        "Physical activity",
        "Healthy eating"
      ]
    },
    "createdTime": "2019-09-17T02:31:20.000Z"
  }
}
```

---

#### Restricted Routes (need token for access)

---

GET `/clientRoute/getMetrics` and `/clientRoute/paginationGetMetrics` will return objects like so:
<br>
`/paginationGetMetrics` returns the full client history using pagination

_Example_

```javascript
{
  "message": "it worked!!!",
  "clientRecords": [
    {
      "id": "rec0gkAMkknlJLb8p",
      "fields": {
        "Record Number": 102,
        "Client_Name": [
          "rec8DkcsKev4Q8EvF"
        ],
        "Blood_sugar": 12,
        "Weight": 120,
        "Blood_pressure_over": 14,
        "Blood_pressure_under": 12
      },
      "createdTime": "2019-10-21T16:26:03.000Z"
    },

```

---

GET `/clientRoute/getIntakeRecords` will return objects like so:

_Example_

```javascript
{
  "data": [
    {
      "phoneNumber": "(650) 293-1740",
      "loginTime": 0,
      "clientId": "reck4WW8RRKy9ftQL"
    },
    {
      "phoneNumber": "(650) 281-7582",
      "loginTime": 0,
      "clientId": "rec1CpLM0RxgOfXfx"
    }
  ]
}

```

---

GET `/clientRoute/getCoachInfo` will return an object like so:

_Example_

```javascript
{
    "coachObject": {
        "coachName": "Karin Underwood",
        "coachUrl": "https://dl.airtable.com/.attachments/2964a7624923f374610c1b583a7edc24/3b8b5096/Karin_bitmoji.jpeg"
    }
}

```

---

POST `/clientRoute/logMetrics` will post an object to outcomes form like so:<br>
_(needs min of one metric)_<br>
_(if over or under metric, both must be used)_

_Example_

```javascript
{
  "records": [

    {

      "fields": {
        "Client_Name": [
          "rec43ppgrbQld6xPJ"
        ],
        "Date_time": 1000,
        "Blood_sugar":10000,
        "Blood_pressure_over":14,
        "Blood_pressure_under":12,
        "Weight":12

      }
    }

  ]

}

```

---

POST `/coachRoute/newRegister` and `/coachRoute/login`
<br>
`/coachRoute/newRegister` returns a message that is personalized for the registering coach and a jsonwebtoken.

_Example_(query)

```javascript
{
	"password": "hello there!!!",
	"email": "(589) 728-4080",
	"name": "Karin Underwood"
}

```

_Example_(returned object)

```javascript
{
    "message": "Coach Karin Underwood has been register in database.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2FjaElkIjoicmVjWXdEOWVuTUc0bjJ4cUQiLCJjb2FjaE5hbWUiOiJLYXJpbiBVbmRlcndvb2QiLCJpYXQiOjE1NzI2MzUwMzgsImV4cCI6MTU3MjcyMTQzOH0.-rKCBr22T9PUBMPW1ebi-1VaWkuFu1Iaq8EgILz5Ihc"
}

```

`/coachRoute/login` returns a message that is personalized for the registering coach and a jsonwebtoken.

_Example_(query)

```javascript
{
	"password": "hello there!!!",
	"email": "(589) 728-4080"
}

```

_Example_(returned object)

```javascript
{
    "message": "Welcome back!!!! Karin Underwood",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2FjaElkIjoicmVjWXdEOWVuTUc0bjJ4cUQiLCJjb2FjaE5hbWUiOiJLYXJpbiBVbmRlcndvb2QiLCJpYXQiOjE1NzI2MzUzMTQsImV4cCI6MTU3MjcyMTcxNH0.dV7NQxMoDxkTlYwr4NLESGIBRge2lE52PJb4mvZ6MeA"
}
```

---

GET `/coachRoute/getLastCheckinTime/:id` returns the last checkin date and patient airtable Id.
<br>
`/coachRoute/getLastCheckinTime/:id` returns the last checkin date and patient airtable Id.

_Example_

```javascript
{
    "lastCheckin": "2019-10-10T01:18:50.000Z",
    "clientId": "rec3NQI2MqXCQNQX1"
}
```

---

GET `/coachRoute/getPatients` `/coachRoute/getClientGoals/:id` and `/coachRoute/getClientMetrics/:id` will return objects like so:
<br>
`/coachRoute/getPatients` returns the full list of client names and client ids that are under the coach's supervision using pagination

_Example_

```javascript
"patientList": [
        {
            "clientName": "Joycee",
            "clientId": "rec3NQI2MqXCQNQX1"
        }, ...
]

```

`/coachRoute/getClientGoals/:id` returns the full list of client ids, current goals, start date, goal details, and whether they met the goal. (make sure to pass a valid clientId to the dynamic route)

_Example_

```javascript
"patientGoals": [
        {
            "clientId": "rec3NQI2MqXCQNQX1",
            "goal": "Eating breakfast\nDo squats",
            "goalDetails": "Going on more walks; no details on stew\n\nNumbers not what she expectedDidn't get to exercise more than 2xs a week; high calorie tiramisu for birthday\nGetting back on track - skipping a lot of things - don't miss it\nClothes fitting better",
            "startDate": "2019-10-10T01:02:00.000Z",
            "metGoal": "Yes"
        }, ...
]
}

```

`/coachRoute/getClientMetrics/:id` returns the full list of client ids, blood pressure over, blood pressure under, blood glucose, and weight. (make sure to pass a valid clientId to the dynamic route)

_Example_

```javascript
{
    "patientMetrics": [
        {
            "clientId": "rec3NQI2MqXCQNQX1",
            "date": "2019-10-10T01:02:00.000Z",
            "Blood_pressure_over": 154,
            "Blood_pressure_under": 96,
            "Weight": 212
        }, ...
    ]
}

```

POST `/twilioRoute/twilio` returns the string of the twilio message's sid if successful:
<br>
`/twilioRoute/twilio` returns the string of the twilio message's sid if successful. Expects an object with `message` and `Phone`.

_Example_: request

```javascript
{
  "Phone": "(306) 701-1679",
  "message": "Hello there!!!!"
}

```

GET `/twilioRoute/messagehistory/:phone` will return two arrays like so:
<br>
`/twilioRoute/messagehistory/:phone` returns two arrays (toMessages and fromMessages) that contain objects that are from the twilio api. The objects in each array are filtered according to the passed phone number in the url string.

_Example_

```javascript

"toMessages": [
        {
            "accountSid": "AC6d95bb53a84635a8d81ad5293692fbc2",
            "apiVersion": "2010-04-01",
            "body": "Sent from your Twilio trial account - The Robots are coming! Head for the hills!",
            "dateCreated": "2019-10-31T17:42:47.000Z",
            "dateUpdated": "2019-10-31T17:42:48.000Z",
            "dateSent": "2019-10-31T17:42:47.000Z",
            "direction": "outbound-reply",
            "errorCode": null,
            "errorMessage": null,
            "from": "+12513877822",
            "messagingServiceSid": null,
            "numMedia": "0",
            "numSegments": "1",
            "price": "-0.00750",
            "priceUnit": "USD",
            "sid": "SMf222f84d27d95af44370bf8273c90736",
            "status": "delivered",
            "subresourceUris": {
                "media": "/2010-04-01/Accounts/AC6d95bb53a84635a8d81ad5293692fbc2/Messages/SMf222f84d27d95af44370bf8273c90736/Media.json",
                "feedback": "/2010-04-01/Accounts/AC6d95bb53a84635a8d81ad5293692fbc2/Messages/SMf222f84d27d95af44370bf8273c90736/Feedback.json"
            },
            "to": "+15097204080",
            "uri": "/2010-04-01/Accounts/AC6d95bb53a84635a8d81ad5293692fbc2/Messages/SMf222f84d27d95af44370bf8273c90736.json"
        }, ...
  ],
  "fromMessages": [
        {
            "accountSid": "AC6d95bb53a84635a8d81ad5293692fbc2",
            "apiVersion": "2010-04-01",
            "body": "Hello there!!! New message!!!",
            "dateCreated": "2019-10-31T18:01:54.000Z",
            "dateUpdated": "2019-10-31T18:01:54.000Z",
            "dateSent": "2019-10-31T18:01:54.000Z",
            "direction": "inbound",
            "errorCode": null,
            "errorMessage": null,
            "from": "+15097204080",
            "messagingServiceSid": null,
            "numMedia": "0",
            "numSegments": "1",
            "price": "-0.00750",
            "priceUnit": "USD",
            "sid": "SM39f4e8f16a22ced9d8faeb5f8df5885a",
            "status": "received",
            "subresourceUris": {
                "media": "/2010-04-01/Accounts/AC6d95bb53a84635a8d81ad5293692fbc2/Messages/SM39f4e8f16a22ced9d8faeb5f8df5885a/Media.json",
                "feedback": "/2010-04-01/Accounts/AC6d95bb53a84635a8d81ad5293692fbc2/Messages/SM39f4e8f16a22ced9d8faeb5f8df5885a/Feedback.json"
            },
            "to": "+12513877822",
            "uri": "/2010-04-01/Accounts/AC6d95bb53a84635a8d81ad5293692fbc2/Messages/SM39f4e8f16a22ced9d8faeb5f8df5885a.json"
        },...
  ]

```

POST `/twilioRoute/schedule` returns a success message when cronjob is running:
<br>
`/twilioRoute/schedule` returns a success message when cronjob is running.

_Example_: request

```javascript
{
	"numbers": "(509) 720-4080",
	"sec": "",
	"min": "45",
	"hour": "9",
	"dom": "",
	"month": "",
	"weekday": "",
	"msg": "hello mason from the past!!!"
}

```

DELETE `/twilioRoute/deleteScheduled/:id` returns a message saying the scheduleId in the url string has been deleted from the database:
<br>
`/twilioRoute/deleteSchedule/:id` returns a message saying the scheduleId in the url string has been deleted from the database.

_Example_: request

```javascript
{
    message: `scheduled message scheduleId 333d1d89-1e82-4743-b987-97974cfe0586 has been deleted.`;
}
```

PUT `/twilioRoute/updateScheduled/:id` returns a message saying the scheduleId in the url string has been updated in the database:
<br>
`/twilioRoute/deleteSchedule/:id` returns a message saying the scheduleId in the url string has been updated in the database.

_Example_: request

```javascript
{
    message: `scheduleId 333d1d89-1e82-4743-b987-97974cfe0586 has been updated.`;
}
```

POST `/twilioRoute/getScheduled/:id` returns an array of all scheduled messages written for a particular patientId:
<br>
`/twilioRoute/getScheduled/:id`

_Example_:

```javascript
data: [
  {
    "numbers": "(509) 720-4080",
    "sec": "",
    "min": "45",
    "hour": "9",
    "dom": "",
    "month": "",
    "weekday": "",
    "msg": "hello mason from the past!!!"
  }, ...
]
```

## 2️⃣ Actions

`findPatientByPhone(filter)` -> finds the clientPhone and references against the phoneNumber in the 'patient-login' DB

`updateLoginTime(filter, changes)` -> updates the LoginTime associated with the phone number that was used to Log in

`insertNewClient(filter)` -> adds new client id, loginTime and phone number to database

#### Coach Routes (these are examples to be updated and do not exist yet)

| Method | Endpoint                | Access Control      | Description                                        |
| ------ | ----------------------- | ------------------- | -------------------------------------------------- |
| GET    | `/users/current`        | all users           | Returns info for the logged in user.               |
| GET    | `/users/org/:userId`    | owners, supervisors | Returns all users for an organization.             |
| GET    | `/users/:userId`        | owners, supervisors | Returns info for a single user.                    |
| POST   | `/users/register/owner` | none                | Creates a new user as owner of a new organization. |
| PUT    | `/users/:userId`        | owners, supervisors |                                                    |
| DELETE | `/users/:userId`        | owners, supervisors |

## 3️⃣ Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.

create a .env file that includes the following:

-   PORT
-   AIRTABLE\*KEY
-   JWT_SECRET

🚫 These are just examples, replace them with the specifics for your app
_ STAGING_DB - optional development db for using functionality not available in SQLite
_ NODE\*ENV - set to "development" until ready for "production"

-   JWT*SECRET - you can generate this by using a python shell and running import random''.join([random.SystemRandom().choice('abcdefghijklmnopqrstuvwxyz0123456789!@#\$%^&amp;*(-_=+)') for i in range(50)])
    _ SENDGRID_API_KEY - this is generated in your Sendgrid account \* stripe_secret - this is generated in the Stripe dashboard

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

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

See [Frontend Documentation](🚫link to your frontend readme here) for details on the fronend of our project.
🚫 Add DS iOS and/or Andriod links here if applicable.
