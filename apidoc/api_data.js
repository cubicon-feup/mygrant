define({ "api": [
  {
    "type": "post",
    "url": "/crowdfunding/",
    "title": "Creates a new crowdfunding project.",
    "name": "PostCrowdfunding",
    "group": "Crowdfunding",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "parameter": {
      "fields": {
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": ""
          },
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": ""
          },
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": ""
          },
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Sucessfully created a crowdfunding project.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "get",
    "url": "/messages/",
    "title": "Get conversations.",
    "name": "GetConversations",
    "group": "Messages",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "other_user_id",
            "description": "<p>Other user unique id.</p>"
          },
          {
            "group": "Success 200",
            "optional": false,
            "field": "other_user_full_name",
            "description": "<p>Other user name.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Internal Server Error</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/messages.js",
    "groupTitle": "Messages"
  },
  {
    "type": "get",
    "url": "/messages/:other_user",
    "title": "Get messages between users.",
    "name": "GetMessages",
    "group": "Messages",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "parameter": {
      "fields": {
        "RequestParams": [
          {
            "group": "RequestParams",
            "type": "Integer",
            "optional": false,
            "field": "other_user",
            "description": "<p>Other user unique id.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "sender_id",
            "description": "<p>User that sent a message.</p>"
          },
          {
            "group": "Success 200",
            "optional": false,
            "field": "content",
            "description": "<p>Message content.</p>"
          },
          {
            "group": "Success 200",
            "optional": false,
            "field": "date_sent",
            "description": "<p>Date the message was sent.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Internal Server Error</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/messages.js",
    "groupTitle": "Messages"
  },
  {
    "type": "post",
    "url": "/messages/",
    "title": "Send a new message.",
    "name": "SendMessage",
    "group": "Messages",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "parameter": {
      "fields": {
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "sender_id",
            "description": "<p>Sender's unique id.</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "receiver_id",
            "description": "<p>Receiver's unique id.</p>"
          },
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>Message to send.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "optional": false,
            "field": "message",
            "description": "<p>Successfully sent a message.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Internal Server Error</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/messages.js",
    "groupTitle": "Messages"
  },
  {
    "type": "post",
    "url": "/:id/offers/accept",
    "title": "Accept Service Offer",
    "name": "AcceptServiceOffer",
    "group": "Service",
    "permission": [
      {
        "name": "service creator"
      }
    ],
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the service to offer to accept (service can't have deleted=true)</p>"
          }
        ],
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "partner_id",
            "description": "<p>ID of the user that made the offer (XOR crowdfunding_id)</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "crowdfunding_id",
            "description": "<p>ID of the crowdfunding that made the offer (XOR partner_id)</p>"
          },
          {
            "group": "RequestBody",
            "type": "Date",
            "optional": false,
            "field": "date_scheduled",
            "description": "<p>Date the service is goind to be provided</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "OK",
            "description": ""
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadRequestError",
            "description": "<p>Invalid URL Parameters</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "put",
    "url": "/",
    "title": "Create Service",
    "name": "CreateService",
    "group": "Service",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "parameter": {
      "fields": {
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the service</p>"
          },
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the service (Optional)</p>"
          },
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>Category of the service [BUSINESS, ARTS, ...]</p>"
          },
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Geographic coordinated of the service (Optional)</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "acceptable_radius",
            "description": "<p>Maximum distance from location where the service can be done (Optional)</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "mygrant_value",
            "description": "<p>Number of hours the service will take</p>"
          },
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "service_type",
            "description": "<p>Type of the service [PROVIDE, REQUEST]</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "creator_id",
            "description": "<p>ID of the creator if created by a user (XOR crowdfunding_id)</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "crowdfunding_id",
            "description": "<p>ID of the crowdfunding if created by a crowdfunding (XOR creator_id)</p>"
          },
          {
            "group": "RequestBody",
            "type": "Boolean",
            "optional": false,
            "field": "repeatable",
            "description": "<p>If the service can be done more than one time</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "OK",
            "description": ""
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadRequestError",
            "description": "<p>Invalid URL Parameters</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "put",
    "url": "/:id/images",
    "title": "Create Service Image",
    "name": "CreateServiceImage",
    "group": "Service",
    "permission": [
      {
        "name": "service creator"
      }
    ],
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the service to get images of</p>"
          }
        ],
        "RequestFiles": [
          {
            "group": "RequestFiles",
            "type": "File",
            "optional": false,
            "field": "file",
            "description": "<p>Image file of the image</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "OK",
            "description": ""
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadRequestError",
            "description": "<p>Invalid URL Parameters</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "post",
    "url": "/:id/offers/decline",
    "title": "Decline Service Offer",
    "name": "DeclineServiceOffer",
    "group": "Service",
    "permission": [
      {
        "name": "service creator"
      }
    ],
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the service to offer to accept</p>"
          }
        ],
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "partner_id",
            "description": "<p>ID of the user that made the offer (XOR crowdfunding_id)</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "crowdfunding_id",
            "description": "<p>ID of the crowdfunding that made the offer (XOR partner_id)</p>"
          },
          {
            "group": "RequestBody",
            "type": "Date",
            "optional": false,
            "field": "date_scheduled",
            "description": "<p>Date the service is goind to be provided</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "OK",
            "description": ""
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadRequestError",
            "description": "<p>Invalid URL Parameters</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "delete",
    "url": "/:id",
    "title": "Delete Service",
    "name": "DeleteService",
    "group": "Service",
    "permission": [
      {
        "name": "service creator"
      }
    ],
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the service to delete</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "OK",
            "description": ""
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadRequestError",
            "description": "<p>Invalid URL Parameters</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "delete",
    "url": "/:id/images/:image",
    "title": "Delete Service Image",
    "name": "DeleteServiceImage",
    "group": "Service",
    "permission": [
      {
        "name": "service creator"
      }
    ],
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the service to get images of</p>"
          },
          {
            "group": "RequestParam",
            "type": "String",
            "optional": false,
            "field": "image",
            "description": "<p>URL of the image to delete</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "OK",
            "description": ""
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadRequestError",
            "description": "<p>Invalid URL Parameters</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "put",
    "url": "/:id",
    "title": "Edit Service",
    "name": "EditService",
    "group": "Service",
    "permission": [
      {
        "name": "service creator"
      }
    ],
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the service to update</p>"
          }
        ],
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the service (Optional)</p>"
          },
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the service (Optional)</p>"
          },
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>Category of the service [BUSINESS, ARTS, ...] (Optional)</p>"
          },
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Geographic coordinated of the service (Optional)</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "acceptable_radius",
            "description": "<p>Maximum distance from location where the service can be done (Optional)</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "mygrant_value",
            "description": "<p>Number of hours the service will take (Optional)</p>"
          },
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "service_type",
            "description": "<p>Type of the service [PROVIDE, REQUEST] (Optional)</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "creator_id",
            "description": "<p>ID of the creator if created by a user (XOR crowdfunding_id)</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "crowdfunding_id",
            "description": "<p>ID of the crowdfunding if created by a crowdfunding (XOR creator_id)</p>"
          },
          {
            "group": "RequestBody",
            "type": "Boolean",
            "optional": false,
            "field": "repeatable",
            "description": "<p>If the service can be done more than one time (Optional)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "OK",
            "description": ""
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadRequestError",
            "description": "<p>Invalid URL Parameters</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "get",
    "url": "/services/:id",
    "title": "Get service info by ID",
    "name": "GetServiceByID",
    "group": "Service",
    "permission": [
      {
        "name": "visitor"
      }
    ],
    "parameter": {
      "fields": {
        "RequestParams": [
          {
            "group": "RequestParams",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the service</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "service_id",
            "description": "<p>ID of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>Category of the service [BUSINESS, ARTS, ...]</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Geographic coordinated of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "acceptable_radius",
            "description": "<p>Maximum distance from location where the service can be done</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "mygrant_value",
            "description": "<p>Number of hours the service will take</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date_created",
            "description": "<p>Date the service was created</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "service_type",
            "description": "<p>Type of the service [PROVIDE, REQUEST]</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "creator_id",
            "description": "<p>ID of the creator if created by a user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "provider_name",
            "description": "<p>Name of the creator if created by a user</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "crowdfunding_id",
            "description": "<p>ID of the crowdfunding if created by a crowdfunding</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "crowdfunding_title",
            "description": "<p>Title of the crowdfunding if created by a crowdfunding</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadRequestError",
            "description": "<p>Invalid URL Parameters</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "get",
    "url": "/:id/images",
    "title": "Get Service Images",
    "name": "GetServiceImages",
    "group": "Service",
    "permission": [
      {
        "name": "visitor"
      }
    ],
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the service to get images of</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "images",
            "description": "<p>List of images of the service {service_id, image_url}</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadRequestError",
            "description": "<p>Invalid URL Parameters</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "get",
    "url": "/:id/offers",
    "title": "Get Service Offers",
    "name": "GetServiceOffers",
    "group": "Service",
    "permission": [
      {
        "name": "service creator"
      }
    ],
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the service to get offers of</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "requesters",
            "description": "<p>List of the users making the offers {type, requester_id, requester_name}</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadRequestError",
            "description": "<p>Invalid URL Parameters</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "get",
    "url": "/:id/offers/:type/:candidate",
    "title": "Get Service Specific Offer",
    "name": "GetServiceSpecificOffer",
    "group": "Service",
    "permission": [
      {
        "name": "service creator"
      }
    ],
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the service of the offer</p>"
          },
          {
            "group": "RequestParam",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Depends if the offer was made by a crowdfunding or by a user ('crowdfunding, 'user')</p>"
          },
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "candidate",
            "description": "<p>ID of the candidate that made the offer</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "requester",
            "description": "<p>Users making the offers {requester_id, requester_name}</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadRequestError",
            "description": "<p>Invalid URL Parameters</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "get",
    "url": "/services/",
    "title": "Get every active service",
    "name": "GetServices",
    "group": "Service",
    "permission": [
      {
        "name": "visitor"
      }
    ],
    "parameter": {
      "fields": {
        "RequestQueryParams": [
          {
            "group": "RequestQueryParams",
            "type": "Integer",
            "optional": false,
            "field": "page",
            "description": "<p>page number to return (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Integer",
            "optional": false,
            "field": "items",
            "description": "<p>number of items per page default/max: 50 (Optional)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>Category of the service [BUSINESS, ARTS, ...]</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Geographic coordinated of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "acceptable_radius",
            "description": "<p>Maximum distance from location where the service can be done</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "mygrant_value",
            "description": "<p>Number of hours the service will take</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date_created",
            "description": "<p>Date the service was created</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "service_type",
            "description": "<p>Type of the service [PROVIDE, REQUEST]</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "creator_id",
            "description": "<p>ID of the creator if created by a user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "provider_name",
            "description": "<p>Name of the creator if created by a user</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "crowdfunding_id",
            "description": "<p>ID of the crowdfunding if created by a crowdfunding</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "crowdfunding_title",
            "description": "<p>Title of the crowdfunding if created by a crowdfunding</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadRequestError",
            "description": "<p>Invalid URL Parameters</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "get",
    "url": "/services/num-pages",
    "title": "Get number of pages of active service list",
    "name": "GetServicesNumPages",
    "group": "Service",
    "permission": [
      {
        "name": "visitor"
      }
    ],
    "parameter": {
      "fields": {
        "RequestQueryParams": [
          {
            "group": "RequestQueryParams",
            "type": "Integer",
            "optional": false,
            "field": "Items",
            "description": "<p>number of items per page default/max: 50 (Optional)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "n",
            "description": "<p>Returns only the integer of the number of pages (No JSON key: value)</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadRequestError",
            "description": "<p>Invalid URL Parameters</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "post",
    "url": "/:id/offers",
    "title": "Make Service Offer",
    "name": "MakeServiceOffer",
    "group": "Service",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the service to make offer to (service can't have deleted=true)</p>"
          }
        ],
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "crowdfunding_id",
            "description": "<p>ID of the crowdfunding making the offer (Optional)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "OK",
            "description": ""
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadRequestError",
            "description": "<p>Invalid URL Parameters</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "get",
    "url": "/services/search",
    "title": "Search among active services' titles and descriptions using the given query text",
    "name": "SearchService",
    "group": "Service",
    "permission": [
      {
        "name": "visitor"
      }
    ],
    "parameter": {
      "fields": {
        "RequestQueryParams": [
          {
            "group": "RequestQueryParams",
            "type": "String",
            "optional": false,
            "field": "q",
            "description": "<p>Search query (Required)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Integer",
            "optional": false,
            "field": "limit",
            "description": "<p>Maximum number of results default: 50 (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "String",
            "optional": false,
            "field": "lang",
            "description": "<p>Language of the query ['portuguese', 'english', ...] default: 'english' (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "String",
            "optional": false,
            "field": "desc",
            "description": "<p>Searches in description ['yes', 'no'] default: 'yes' (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "String",
            "optional": false,
            "field": "cat",
            "description": "<p>Category of the service [BUSINESS, ARTS, ...] (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of the service [PROVIDE, REQUEST] (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Integer",
            "optional": false,
            "field": "mygmax",
            "description": "<p>Max bound for mygrant_value (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Integer",
            "optional": false,
            "field": "mygmin",
            "description": "<p>Min bound for mygrant_value (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Date",
            "optional": false,
            "field": "datemax",
            "description": "<p>Max bound for created_date (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Date",
            "optional": false,
            "field": "datemin",
            "description": "<p>Min bound for created_date (Optional)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "service_id",
            "description": "<p>ID of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>Category of the service [BUSINESS, ARTS, ...]</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Geographic coordinated of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "acceptable_radius",
            "description": "<p>Maximum distance from location where the service can be done</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "mygrant_value",
            "description": "<p>Number of hours the service will take</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date_created",
            "description": "<p>Date the service was created</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "service_type",
            "description": "<p>Type of the service [PROVIDE, REQUEST]</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "creator_id",
            "description": "<p>ID of the creator if created by a user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "provider_name",
            "description": "<p>Name of the creator if created by a user</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "crowdfunding_id",
            "description": "<p>ID of the crowdfunding if created by a crowdfunding</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "crowdfunding_title",
            "description": "<p>Title of the crowdfunding if created by a crowdfunding</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadRequestError",
            "description": "<p>Invalid URL Parameters</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/services.js",
    "groupTitle": "Service"
  }
] });
