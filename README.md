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

| Method | Endpoint                        | Access Control         | Description                                |
| ------ | ------------------------------- | ---------------------- | ------------------------------------------ |
| POST   | `/clientRoute/login`            | all registered clients | Returns token to access client information |
| GET    | `/clientRoute/getMetrics`       | client(token required) | Access current and past client Metrics     |
| GET    | `/clientRoute/getIntakeRecords` | client(token required) | Receives formated client Objects           |
| POST   | `/clientRoute/logMetrics`       | client(token required) | input new Health Metric to database        |

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

GET `/clientRoute/getMetrics` will return objects like so:

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

POST `/clientRoute/logMetrics` will post an object to outcomes form like so:
_(needs min of one metric)_
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

## 2️⃣ Actions

`findPatientByPhone(filter)` -> finds the clientPhone and references against the phoneNumber in the 'patient-login' DB

`updateLoginTime(filter, changes)` -> updates the LoginTime associated with the phone number that was used to Log in

#### 2️⃣ ORGANIZATIONS

---

```
{
  id: UUID
  name: STRING
  industry: STRING
  paid: BOOLEAN
  customer_id: STRING
  subscription_id: STRING
}
```

#### USERS

---

```
{
  id: UUID
  organization_id: UUID foreign key in ORGANIZATIONS table
  first_name: STRING
  last_name: STRING
  role: STRING [ 'owner', 'supervisor', 'employee' ]
  email: STRING
  phone: STRING
  cal_visit: BOOLEAN
  emp_visit: BOOLEAN
  emailpref: BOOLEAN
  phonepref: BOOLEAN
}
```

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
