define({ "api": [
  {
    "type": "delete",
    "url": "/crowdfunding/:crowdfunding_id",
    "title": "Delete crowdfunding.",
    "name": "DeleteCrowdfunding",
    "group": "Crowdfunding",
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
            "field": "crowdfunding_id",
            "description": "<p>Crowdfunding project id.</p>"
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
            "field": "message",
            "description": "<p>Successfully deleted crowdfunding project.</p>"
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
            "description": "<p>Could't update the crowdfunding project.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "delete",
    "url": "/crowdfunding/:crowdfunding_id/services_offers",
    "title": "Delete crowdfunding service offer.",
    "name": "DeleteServiceOffer",
    "group": "Crowdfunding",
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
            "field": "crowdfunding_id",
            "description": "<p>Crowdfunding id that the service is offered.</p>"
          }
        ],
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "service_id",
            "description": "<p>Service id to remove from the offers.</p>"
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
            "field": "message",
            "description": "<p>Successfully deleted the service offer.</p>"
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
            "field": "BadRequest",
            "description": "<p>Invalid service offer data.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Couldn't delete the service offer.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "delete",
    "url": "/crowdfunding/:crowdfunding_id/services_requested",
    "title": "Delete a service request.",
    "name": "DeleteServiceRequest",
    "group": "Crowdfunding",
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
            "field": "crowdfunding_id",
            "description": "<p>Crowdfunding id associated with the service requests.</p>"
          }
        ],
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "service_id",
            "description": "<p>Service request id.</p>"
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
            "field": "message",
            "description": "<p>Successfully removed the service requested.</p>"
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
            "field": "BadRequest",
            "description": "<p>Invalid service request data.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Couldn't get service requests.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "post",
    "url": "/crowdfunding/:crowdfunding_id/donations",
    "title": "Donate.",
    "name": "Donate",
    "group": "Crowdfunding",
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
            "field": "crowdfunding_id",
            "description": "<p>Crowdfunding id.</p>"
          }
        ],
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "donator_id",
            "description": "<p>Donator user id.</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "amount",
            "description": "<p>Number of mygrant to donate.</p>"
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
            "description": "<p>Successfully donated to crowdfunding.</p>"
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
            "field": "BadRequest",
            "description": "<p>Invalid donation data.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Couldn't donate.</p>"
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
    "url": "/crowdfunding/:crowdfunding_id/services_offers",
    "title": "Get all crowdfunding service offers.",
    "name": "GetAllServiceOffer",
    "group": "Crowdfunding",
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
            "field": "crowdfunding_id",
            "description": "<p>Crowdfunding id that the services are offered.</p>"
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
            "description": "<p>Offered service id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "service_title",
            "description": "<p>Offered service title.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "service_category",
            "description": "<p>Offered service category.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "service_type",
            "description": "<p>Offered service type.</p>"
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
            "description": "<p>Couldn't get service offers.</p>"
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
    "url": "/crowdfunding/:crowdfunding_id/services_requested",
    "title": "Get all service requests.",
    "name": "GetAllServiceRequests",
    "group": "Crowdfunding",
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
            "field": "crowdfunding_id",
            "description": "<p>Crowdfunding id associated with the service requests.</p>"
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
            "field": "title",
            "description": "<p>Service request title.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "mygrant_value",
            "description": "<p>Mygrants amount to transfer.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>Service request category.</p>"
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
            "description": "<p>Couldn't get service requests.</p>"
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
    "url": "/crowdfunding/:crowdfunding_id",
    "title": "Get crowdfunding project.",
    "name": "GetCrowdfunding",
    "group": "Crowdfunding",
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
            "field": "crowdfunding_id",
            "description": "<p>Crowdfunding id.</p>"
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
            "field": "title",
            "description": "<p>Crowdfunding title.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Crowdfunding description.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>Crowdfunding category.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Location where the crowdfunding is going to take place.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "mygrant_target",
            "description": "<p>Number of mygrants needed for the crowdfunding to success.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date_created",
            "description": "<p>Creation date.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date_finished",
            "description": "<p>Close date.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Current crowdfunding status.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "creator_name",
            "description": "<p>Creator user name.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "creator_id",
            "description": "<p>Creator user id.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "average_rating",
            "description": "<p>Average rating given by donators.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "images",
            "description": "<p>Array of images.</p>"
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
            "description": "<p>Could't get the crowdfunding.</p>"
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
    "url": "/crowdfunding/:crowdfunding_id/rating",
    "title": "Get crowdfunding average rating.",
    "name": "GetCrowdfundingAverageRating",
    "group": "Crowdfunding",
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
            "field": "crowdfunding_id",
            "description": "<p>Crowdfunding project id.</p>"
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
            "field": "average_rating",
            "description": "<p>Crowdfunding average rating.</p>"
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
            "description": "<p>Could't update the crowdfunding project.</p>"
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
    "url": "/crowdfunding/",
    "title": "Get all crowdfundings.",
    "name": "GetCrowdfundings",
    "group": "Crowdfunding",
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
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Crowdfunding average rating.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>Crowdfunding average rating.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Crowdfunding average rating.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "mygrant_target",
            "description": "<p>Crowdfunding average rating.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Crowdfunding average rating.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "creator_name",
            "description": "<p>Crowdfunding average rating.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "creator_id",
            "description": "<p>Crowdfunding average rating.</p>"
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
            "description": "<p>Couldn't get crowdfundings.</p>"
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
    "url": "/crowdfunding/:crowdfunding_id/donations",
    "title": "Get donations.",
    "name": "GetDonations",
    "group": "Crowdfunding",
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
            "field": "crowdfunding_id",
            "description": "<p>Crowdfunding id.</p>"
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
            "field": "donator_id",
            "description": "<p>Donator user id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "donator_name",
            "description": "<p>Donator user name.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "amount",
            "description": "<p>Number of mygrants donated.</p>"
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
            "description": "<p>Couldn't get donations.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "post",
    "url": "/crowdfunding/:crowdfunding_id/services_offers",
    "title": "Offer service to crowdfunding.",
    "name": "OfferService",
    "group": "Crowdfunding",
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
            "field": "crowdfunding_id",
            "description": "<p>Crowdfunding id that is offered the service.</p>"
          }
        ],
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "service_id",
            "description": "<p>Service id to offer.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "Integer",
            "optional": false,
            "field": "message",
            "description": "<p>Successfully offered a service to the crowdfunding.</p>"
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
            "field": "BadRequest",
            "description": "<p>Invalid service offer data.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Couldn't offer service.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
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
            "description": "<p>Crowdfunding title.</p>"
          },
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Crowdfunding description.</p>"
          },
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>Crowdfunding category.</p>"
          },
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Location where the crowdfunding is going to take place.</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "mygrant_target",
            "description": "<p>Number of mygrants needed for the crowdfunding to success.</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "time_interval",
            "description": "<p>Number of week to collect donators.</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "creator_id",
            "description": "<p>Creator user id.</p>"
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
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Invalid crowdfunding data.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Couldn't create a crowdfunding.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "put",
    "url": "/crowdfunding/:crowdfunding_id/rate",
    "title": "Rate.",
    "name": "Rate",
    "group": "Crowdfunding",
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
            "field": "crowdfunding_id",
            "description": "<p>Crowdfunding id.</p>"
          }
        ],
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "rating",
            "description": "<p>Donator user rating.</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "donator_id",
            "description": "<p>Donator user id.</p>"
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
            "field": "message",
            "description": "<p>Successfully rated the crowdfunding.</p>"
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
            "field": "BadRequest",
            "description": "<p>Invalid rate data.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Couldn't get donations.</p>"
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
    "url": "/crowdfunding/filter/:from-:to",
    "title": "Search crowdfunding.",
    "name": "SearchCrowdfunding",
    "group": "Crowdfunding",
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "from",
            "description": "<p>Crowdfunding id associated with the service requests.</p>"
          },
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "to",
            "description": "<p>Crowdfunding id associated with the service requests.</p>"
          }
        ],
        "RequestQuery": [
          {
            "group": "RequestQuery",
            "type": "String",
            "allowedValues": [
              "date_created",
              "date_finished",
              "title"
            ],
            "optional": true,
            "field": "sorting_method",
            "description": "<p>Sorting method selected.</p>"
          },
          {
            "group": "RequestQuery",
            "type": "String",
            "optional": true,
            "field": "category",
            "description": "<p>Category to search.</p>"
          },
          {
            "group": "RequestQuery",
            "type": "String",
            "optional": true,
            "field": "location",
            "description": "<p>Location to search.</p>"
          },
          {
            "group": "RequestQuery",
            "type": "String",
            "optional": true,
            "field": "keywords",
            "description": "<p>Keywords to search either in the title or description.</p>"
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
            "field": "crowdfunding_id",
            "description": "<p>Crowdfunding id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Crowdfunding title.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>Crowdfunding category.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Location where the crowdfunding is going to take place.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "mygrant_target",
            "description": "<p>Number of mygrants needed for the crowdfunding to success.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Current crowdfunding status.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "creator_name",
            "description": "<p>Creator user name.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "creator_id",
            "description": "<p>Creator user id.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date_finished",
            "description": "<p>Closing date.</p>"
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
            "field": "BadRequest",
            "description": "<p>Invalid search data.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Couldn't get crowdfundings.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "post",
    "url": "/crowdfunding/:crowdfunding_id/services_requested",
    "title": "Create service request.",
    "name": "ServiceRequest",
    "group": "Crowdfunding",
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
            "field": "crowdfunding_id",
            "description": "<p>Crowdfunding id associated with the service request.</p>"
          }
        ],
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "title",
            "description": "<p>Request service title.</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "description",
            "description": "<p>Request service description.</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "category",
            "description": "<p>Request service category.</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "location",
            "description": "<p>Location for the service to happen.</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "mygrant_value",
            "description": "<p>Mygrants amount to transfer.</p>"
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
            "description": "<p>Successfully created a new service request for the crowdfunding.</p>"
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
            "field": "BadRequest",
            "description": "<p>Invalid service request data.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Couldn't create a service request.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "put",
    "url": "/crowdfunding/:crowdfunding_id",
    "title": "Update crowdfunding.",
    "name": "UpdateCrowdfunding",
    "group": "Crowdfunding",
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
            "field": "crowdfunding_id",
            "description": "<p>Crowdfunding project id.</p>"
          }
        ],
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
            "field": "message",
            "description": "<p>Successfully updated crowdfunding project.</p>"
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
            "field": "BadRequest",
            "description": "<p>Invalid crowdfunding data.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Could't update the crowdfunding project.</p>"
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
            "description": "<p>Couldn't get the messages.</p>"
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
    "url": "/messages/",
    "title": "Get topics for user.",
    "name": "GetTopics",
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
            "description": "<p>User id with a conversation topic.</p>"
          },
          {
            "group": "Success 200",
            "optional": false,
            "field": "other_user_full_name",
            "description": "<p>User name with a conversation topic.</p>"
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
            "description": "<p>Couldn't get message topics.</p>"
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
            "description": "<p>Couldn't send the message.</p>"
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
    "url": "/service_categories/",
    "title": "Get service categories.",
    "name": "GetServiceCategories",
    "group": "Service_Categories",
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "optional": false,
            "field": "service_category",
            "description": "<p>Service category name.</p>"
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
            "description": "<p>Couldn't get the service categories.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/categories.js",
    "groupTitle": "Service_Categories"
  }
] });
