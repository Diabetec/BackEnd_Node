define({ "api": [
  {
    "type": "get",
    "url": "/food/:foodName",
    "title": "Retrieve food info",
    "name": "GetFoodInfo",
    "group": "Food",
    "examples": [
      {
        "title": "Example usage:",
        "content": "localhost:3000/food/enchiladas suizas",
        "type": "json"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "foodName",
            "description": "<p>Name of the searched food</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "foodID",
            "description": "<p>food id in the remote DB</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "foodName",
            "description": "<p>food label name</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "calories",
            "description": "<p>calories of the food</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "carbs",
            "description": "<p>carbs in the food</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "proteins",
            "description": "<p>proteins in the food</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "fats",
            "description": "<p>fats in the food</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP 200 OK\n[\n\t{\n\t\t\"foodID\":\"food_bvxig6ybaomi9kbcp2gtea34kp1j\",\n\t\t\"foodName\":\"Enchiladas Suizas\",\n\t\t\"calories\":166.02316602316603,\n\t\t\"carbs\":16.602316602316602,\n\t\t\"proteins\":5.019305019305019,\n\t\t\"fats\":8.880308880308881\n\t}\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 404 Not Found\n{\n  \"error\": \"cannot connect to food-database\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/routes/food.js",
    "groupTitle": "Food"
  },
  {
    "type": "post",
    "url": "/user/signup",
    "title": "Create new User",
    "name": "PostNewUser",
    "group": "User",
    "examples": [
      {
        "title": "Example usage:",
        "content": "localhost:3000/user/signup\nHeaders: Content-Type application/json\nBody\n{\n\t\"email\" : \"email@gmail.com\",\n\t\"password\" : \"secret\",\n\t\"name\" : \"Liz\",\n\t\"age\" : 22,\n\t\"height\" : 1.76,\n\t\"weight\" : 69.8\n}",
        "type": "JSON"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Client email - must be unique</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Client password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Client's name</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "age",
            "description": "<p>Client's age</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "height",
            "description": "<p>Client's height</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "weight",
            "description": "<p>Client's weight</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>return new user id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Client's name (if exists)</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": true,
            "field": "age",
            "description": "<p>Client's age (if exists)</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": true,
            "field": "height",
            "description": "<p>Client's height (if exists)</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": true,
            "field": "weight",
            "description": "<p>Client's weight (if exists)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Client's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>encrypted password</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP 201 Created\n{\n\t\"createdUser\": \n\t{\n        \"_id\": \"5bc91d49b6245617546eeaf7\",\n        \"name\": \"Liz\",\n        \"age\": 22,\n        \"height\": 1.76,\n        \"weight\": 69.8,\n        \"email\": \"email3@gmail.com\",\n        \"password\": \"$2a$08$/8Wv2PV/CRcVWzNdsiKxwulclz4vOo8mAhKB3Biaa6P9dU1cHsi/.\",\n        \"__v\": 0\n\t}\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP 500 Internal Server Error\n{\n\t\"error\": \n\t{\n\t\t\"driver\": true,\n\t\t\"name\": \"MongoError\",\n\t\t\"index\": 0,\n\t\t\"code\": 11000,\n\t\t\"errmsg\": \"E11000 duplicate key error collection: test.users index: email_1 dup key: { : \\\"email@gmail.com\\\" }\"\n\t}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/routes/user.js",
    "groupTitle": "User"
  },
  {
    "type": "delete",
    "url": "/user/:userID",
    "title": "Delete User",
    "name": "deleteUser",
    "group": "User",
    "examples": [
      {
        "title": "Example usage:",
        "content": "localhost:3000/user/5bc91d49b6245617546eeaf7",
        "type": "JSON"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>user ID in DB</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP 200 OK\n{\n    \"n\": 1,\n    \"opTime\": {\n        \"ts\": \"6613896211571146755\",\n        \"t\": 2\n    },\n    \"electionId\": \"7fffffff0000000000000002\",\n    \"ok\": 1,\n    \"operationTime\": \"6613896211571146755\",\n    \"$clusterTime\": {\n        \"clusterTime\": \"6613896211571146755\",\n        \"signature\": {\n            \"hash\": \"8oB2tdST5YSYN2ooQkgPibOy+GY=\",\n            \"keyId\": \"6602994794299916289\"\n        }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Server Error:",
          "content": "HTTP 500 Internal Server Error\n{\n\t\"error\": \n\t{\n\t\t\"driver\": true,\n\t\t\"name\": \"MongoError\",\n\t\t\"index\": 0,\n\t\t\"code\": 8000,\n\t\t\"errmsg\": \"AtlasError\" }\"\n\t}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/routes/user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user/:userID",
    "title": "Retrieve User information",
    "name": "getUserInfo",
    "group": "User",
    "examples": [
      {
        "title": "Example usage:",
        "content": "localhost:3000/user/5bc91d49b6245617546eeaf7",
        "type": "JSON"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>user ID in DB</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>return new user id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Client's name (if exists)</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": true,
            "field": "age",
            "description": "<p>Client's age (if exists)</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": true,
            "field": "height",
            "description": "<p>Client's height (if exists)</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": true,
            "field": "weight",
            "description": "<p>Client's weight (if exists)</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Client's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>encrypted password</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP 201 Created\n{\n\t\"_id\": \"5bc91d49b6245617546eeaf7\",\n\t\"name\": \"Liz\",\n\t\"age\": 22,\n\t\"height\": 1.76,\n\t\"weight\": 69.8,\n\t\"email\": \"email3@gmail.com\",\n\t\"password\": \"$2a$08$/8Wv2PV/CRcVWzNdsiKxwulclz4vOo8mAhKB3Biaa6P9dU1cHsi/.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Not Found Error:",
          "content": "HTTP 404 Not Found\n{\n\t\"message\": \"No valid entry found for provided ID\"\n}",
          "type": "json"
        },
        {
          "title": "Server Error:",
          "content": "HTTP 500 Internal Server Error\n{\n\t\"error\": \n\t{\n\t\t\"driver\": true,\n\t\t\"name\": \"MongoError\",\n\t\t\"index\": 0,\n\t\t\"code\": 8000,\n\t\t\"errmsg\": \"AtlasError\" }\"\n\t}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/routes/user.js",
    "groupTitle": "User"
  },
  {
    "type": "patch",
    "url": "/user/:userID",
    "title": "Modify User information",
    "name": "patchUser",
    "group": "User",
    "examples": [
      {
        "title": "Example usage:",
        "content": "localhost:3000/user/5bc91d49b6245617546eeaf7\nHeaders: Content-Type application/json\nBody\n[\n\t{ \"propName\" : \"name\", \"value\" : \"Lizzie\" },\n\t{ \"propName\" : \"age\", \"value\" : \"21\" }\n]",
        "type": "JSON"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>user ID in DB</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Client's name change</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "age",
            "description": "<p>Client's age update</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "height",
            "description": "<p>Client's height update</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "weight",
            "description": "<p>Client's weight update</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>Client's new email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": "<p>new password</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP 200 OK\n{\n    \"n\": 1,\n    \"nModified\": 2,\n    \"opTime\": {\n        \"ts\": \"6613896211571146755\",\n        \"t\": 2\n    },\n    \"electionId\": \"7fffffff0000000000000002\",\n    \"ok\": 1,\n    \"operationTime\": \"6613896211571146755\",\n    \"$clusterTime\": {\n        \"clusterTime\": \"6613896211571146755\",\n        \"signature\": {\n            \"hash\": \"8oB2tdST5YSYN2ooQkgPibOy+GY=\",\n            \"keyId\": \"6602994794299916289\"\n        }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Not Found Error:",
          "content": "HTTP 404 Not Found\n{\n\t\"message\": \"No valid entry found for provided ID\"\n}",
          "type": "json"
        },
        {
          "title": "Server Error:",
          "content": "HTTP 500 Internal Server Error\n{\n\t\"error\": \n\t{\n\t\t\"driver\": true,\n\t\t\"name\": \"MongoError\",\n\t\t\"index\": 0,\n\t\t\"code\": 8000,\n\t\t\"errmsg\": \"AtlasError\" }\"\n\t}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/routes/user.js",
    "groupTitle": "User"
  }
] });