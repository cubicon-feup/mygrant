define({ "api": [
  {
    "type": "get",
    "url": "/associations/:id",
    "title": "Get association",
    "name": "getAssociation",
    "group": "Associations",
    "parameter": {
      "fields": {
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>Association id.</p>"
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
            "field": "association_id",
            "description": "<p>Association id.</p>"
          },
          {
            "group": "Success 200",
            "type": "Text",
            "optional": false,
            "field": "association_name",
            "description": "<p>Association name.</p>"
          },
          {
            "group": "Success 200",
            "type": "Text",
            "optional": false,
            "field": "association_description",
            "description": "<p>Association description.</p>"
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
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/associations.js",
    "groupTitle": "Associations"
  },
  {
    "type": "put",
    "url": "/comments/",
    "title": "Create comment",
    "name": "CreateComment",
    "group": "CommentStandard",
    "permission": [
      {
        "name": "CommentStandard creator"
      }
    ],
    "parameter": {
      "fields": {
        "RequestBody": [
          {
            "group": "RequestBody",
            "optional": true,
            "field": "Integer",
            "description": "<p>crowdfunding_id Crowdfunding id that the comment belongs (XOR service_id).</p>"
          },
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message to serve as comment.</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "in_reply_to",
            "description": "<p>CommentStandard id that this new comment is replying to (can be null).</p>"
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
            "field": "Created",
            "description": ""
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
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/comments.js",
    "groupTitle": "CommentStandard"
  },
  {
    "type": "delete",
    "url": "/comments/:comment_id",
    "title": "Delete comment",
    "name": "DeleteComment",
    "group": "CommentStandard",
    "permission": [
      {
        "name": "CommentStandard creator"
      }
    ],
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "comment_id",
            "description": "<p>CommentStandard id to delete.</p>"
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
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/comments.js",
    "groupTitle": "CommentStandard"
  },
  {
    "type": "get",
    "url": "/comments/:comment_id/nested_comments",
    "title": "Get nested comments",
    "name": "GetNestedComments",
    "group": "CommentStandard",
    "permission": [
      {
        "name": "CommentStandard creator"
      }
    ],
    "parameter": {
      "fields": {
        "RequestParams": [
          {
            "group": "RequestParams",
            "type": "Integer",
            "optional": false,
            "field": "comment_di",
            "description": "<p>Comment id to get the nested comments from.</p>"
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
            "field": "user_id",
            "description": "<p>User id that the comment belongs.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "user_name",
            "description": "<p>User name that the comment belongs.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "comment_id",
            "description": "<p>Comment id.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "comment_message",
            "description": "<p>Message that the comment holds.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "date_posted",
            "description": "<p>Date the coment was posted.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "in_reply_to",
            "description": "<p>Comment id that the comment is replying (can be null).</p>"
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
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/comments.js",
    "groupTitle": "CommentStandard"
  },
  {
    "type": "get",
    "url": "/comments/top_comments",
    "title": "Get top comments (those that are not a reply)",
    "name": "GetTopComments",
    "group": "CommentStandard",
    "parameter": {
      "fields": {
        "RequestQuery": [
          {
            "group": "RequestQuery",
            "optional": true,
            "field": "Integer",
            "description": "<p>crowdfunding_id Crowdfunding id that the comment belongs (XOR service_id).</p>"
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
            "field": "user_id",
            "description": "<p>User id that the comment belongs.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "user_name",
            "description": "<p>User name that the comment belongs.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "comment_id",
            "description": "<p>Comment id.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "comment_message",
            "description": "<p>Message that the comment holds.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "date_posted",
            "description": "<p>Date the coment was posted.</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "in_reply_to",
            "description": "<p>Comment id that the comment is replying (can be null).</p>"
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
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/comments.js",
    "groupTitle": "CommentStandard"
  },
  {
    "type": "put",
    "url": "/comments/:comment_id",
    "title": "Update comment",
    "name": "UpdateComment",
    "group": "CommentStandard",
    "permission": [
      {
        "name": "CommentStandard creator"
      }
    ],
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "comment_id",
            "description": "<p>CommentStandard id to update.</p>"
          }
        ],
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Updated message to serve as comment.</p>"
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
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Couldn't get pages number.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/comments.js",
    "groupTitle": "CommentStandard"
  },
  {
    "type": "post",
    "url": "/crowdfundings/:crowdfunding_id/:service_requested_id",
    "title": "Assigns a candidate to a requested service.",
    "name": "AssignServiceRequestCandidate",
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
          },
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "service_requested_id",
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
            "optional": false,
            "field": "Created",
            "description": ""
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
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "post",
    "url": "/crowdfundings/",
    "title": "Create crowdfunding",
    "name": "CreateCrowdfunding",
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
            "field": "id",
            "description": "<p>Newly created crowdfunding id.</p>"
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
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "post",
    "url": "/crowdfundings/:crowdfunding_id/donations",
    "title": "Create donation.",
    "name": "CreateDonation",
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
            "description": "<p>Crowdfunding id that gets the donation.</p>"
          }
        ],
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "amount",
            "description": "<p>Number of mygrants to donate.</p>"
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
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "put",
    "url": "/crowdfundings/:crowdfunding_id/rating",
    "title": "Create rate",
    "name": "CreateRate",
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
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "post",
    "url": "/crowdfundings/:crowdfunding_id/services",
    "title": "Create service accorded",
    "name": "CreateServiceAccorded",
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
            "description": "<p>Crowdfunding id that the service is going to be applied to.</p>"
          }
        ],
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "service_id",
            "description": "<p>Service id that is going to be applied.</p>"
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
            "description": "<p>Successfully agreed with a service.</p>"
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
            "description": "<p>Invalid service accorded data.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>Couldn't save the agreed service.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "post",
    "url": "/crowdfundings/:crowdfunding_id/services_offers",
    "title": "Create service offer.",
    "name": "CreateServiceOffer",
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
            "description": "<p>Crowdfunding id that the service is being offered.</p>"
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
        "Error 403": [
          {
            "group": "Error 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>You do not have permission to offer the specified service.</p>"
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
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "post",
    "url": "/crowdfundings/:crowdfunding_id/services_requested",
    "title": "Create service request",
    "name": "CreateServiceRequest",
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
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "delete",
    "url": "/crowdfundings/:crowdfunding_id",
    "title": "Delete crowdfunding",
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
            "description": "<p>Could't delete the crowdfunding project.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "delete",
    "url": "/crowdfundings/:crowdfunding_id/services/requested",
    "title": "Delete service accorded",
    "name": "DeleteServiceAccorded",
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
            "field": "service_id",
            "description": "<p>Service id to remove.</p>"
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
            "description": "<p>Successfully deleted the service instance.</p>"
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
            "description": "<p>Couldn't delete the accorded service.'</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "delete",
    "url": "/crowdfundings/:crowdfunding_id/services_offers",
    "title": "Delete service offer.",
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
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "delete",
    "url": "/crowdfundings/:crowdfunding_id/services_requested",
    "title": "Delete service request",
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
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "get",
    "url": "/crowdfundings/",
    "title": "Get all crowdfundings",
    "name": "GetAllCrowdfundings",
    "group": "Crowdfunding",
    "deprecated": {
      "content": "use now (#Crowdfunding:SearchCrowdfunding)."
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
            "description": "<p>Couldn't get crowdfunding projects.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "get",
    "url": "/crowdfundings/:crowdfunding_id",
    "title": "Get crowdfunding",
    "name": "GetCrowdfunding",
    "group": "Crowdfunding",
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
            "description": "<p>Could't get the crowdfunding project.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "get",
    "url": "/crowdfundings/:crowdfunding_id/rating",
    "title": "Get crowdfunding average rating",
    "name": "GetCrowdfundingAverageRating",
    "group": "Crowdfunding",
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
            "description": "<p>Couldn't get the rating.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "get",
    "url": "/crowdfundings/search-count",
    "title": "- Get number of results and pages of a crowdfundings search",
    "name": "GetCrowdfundingsSearchCount",
    "group": "Crowdfunding",
    "permission": [
      {
        "name": "visitor"
      }
    ],
    "description": "<p>Returns the number of pages of a crowdfundings search</p>",
    "parameter": {
      "fields": {
        "RequestQueryParams": [
          {
            "group": "RequestQueryParams",
            "type": "String",
            "optional": false,
            "field": "q",
            "description": "<p>Search query; seraches among titles and descriptions (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Integer",
            "optional": false,
            "field": "items",
            "description": "<p>Number of items per page default/max: 50 (Optional)</p>"
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
            "description": "<p>Category of the crowdfunding [BUSINESS, ARTS, ...] (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Number",
            "optional": false,
            "field": "balancemax",
            "description": "<p>Max bound for mygrant_balance (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Number",
            "optional": false,
            "field": "balancemin",
            "description": "<p>Max bound for mygrant_balance (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Number",
            "optional": false,
            "field": "targetmax",
            "description": "<p>Max bound for mygrant_target (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Number",
            "optional": false,
            "field": "targetmin",
            "description": "<p>Max bound for mygrant_target (Optional)</p>"
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
          },
          {
            "group": "RequestQueryParams",
            "type": "Number",
            "optional": false,
            "field": "distmax",
            "description": "<p>Max bound for user's distance to crowdfunding (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Status of the crowdfunding [COLLECTING, REQUESTING, FINISHED] (Optional)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "GET: /api/crowdfundings/search-count?q=<QUERY>",
        "type": "json"
      },
      {
        "title": "Example 1",
        "content": "GET: /api/crowdfundings/search-count?q=adaptative+and+extranet",
        "type": "json"
      },
      {
        "title": "Example 2",
        "content": "GET: /api/crowdfundings/search-count?desc=no",
        "type": "json"
      },
      {
        "title": "Example 3",
        "content": "GET: /api/crowdfundings/search-count?q=adaptative paradigms&lang=english&limit=10&cat=fun",
        "type": "json"
      },
      {
        "title": "Example 4",
        "content": "GET: /api/crowdfundings/search-count?q=adaptative paradigms&lang=english&limit=100&balancemax=50&balancemin=30&datemin=2018-01-01",
        "type": "json"
      },
      {
        "title": "Example 5",
        "content": "GET: /api/crowdfundings/search-count?q=adaptative&order=distance&asc=false",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "results",
            "description": "<p>Number of individual results</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "pages",
            "description": "<p>Number of pages</p>"
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
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "get",
    "url": "/crowdfundings/:crowdfunding_id/donations",
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
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "get",
    "url": "/crowdfundings/:crowdfunding_id/services/offered",
    "title": "Get services accorded offered",
    "name": "GetSearvicesAccordedOffered",
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
            "field": "service_id",
            "description": "<p>Accorded service id.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date_agreed",
            "description": "<p>Data the service was agreed users.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date_scheduled",
            "description": "<p>Schedule data for the service.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "service_title",
            "description": "<p>Service title.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "service_description",
            "description": "<p>Service description.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "creator_name",
            "description": "<p>Service creator name.</p>"
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
            "description": "<p>Couldn't get the services accorded offered.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "get",
    "url": "/crowdfundings/:crowdfunding_id/services/requested",
    "title": "Get services accorded requested",
    "name": "GetSearvicesAccordedRequested",
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
            "field": "service_id",
            "description": "<p>Accorded service id.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date_agreed",
            "description": "<p>Data the service was agreed users.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date_scheduled",
            "description": "<p>Schedule data for the service.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "service_title",
            "description": "<p>Service title.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "service_description",
            "description": "<p>Service description.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "creator_name",
            "description": "<p>Service provider name.</p>"
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
            "description": "<p>Couldn't get the services accorded requested.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "get",
    "url": "/crowdfundings/:crowdfunding_id/services_offers",
    "title": "Get crowdfunding service offers.",
    "name": "GetServiceOffers",
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
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "get",
    "url": "/crowdfundings/:crowdfunding_id/services_requested",
    "title": "Get service requests",
    "name": "GetServiceRequests",
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
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "get",
    "url": "/crowdfundings",
    "title": "- Get crowdfunding's list",
    "name": "SearchCrowdfundings",
    "group": "Crowdfunding",
    "permission": [
      {
        "name": "visitor"
      }
    ],
    "description": "<p>Search for and filters listing of active crowdfundings according to parameters given</p>",
    "parameter": {
      "fields": {
        "RequestQueryParams": [
          {
            "group": "RequestQueryParams",
            "type": "String",
            "optional": false,
            "field": "q",
            "description": "<p>Search query; seraches among titles and descriptions (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Integer",
            "optional": false,
            "field": "page",
            "description": "<p>Page number to return (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Integer",
            "optional": false,
            "field": "items",
            "description": "<p>Number of items per page default/max: 50 (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "String",
            "optional": false,
            "field": "order",
            "description": "<p>The field to be ordered by (defaults to search_score) (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Boolean",
            "optional": false,
            "field": "asc",
            "description": "<p>Display in ascesding order (defaults to true) (Optional)</p>"
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
            "description": "<p>Category of the crowdfunding [BUSINESS, ARTS, ...] (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Number",
            "optional": false,
            "field": "balancemax",
            "description": "<p>Max bound for mygrant_balance (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Number",
            "optional": false,
            "field": "balancemin",
            "description": "<p>Max bound for mygrant_balance (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Number",
            "optional": false,
            "field": "targetmax",
            "description": "<p>Max bound for mygrant_target (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Number",
            "optional": false,
            "field": "targetmin",
            "description": "<p>Max bound for mygrant_target (Optional)</p>"
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
          },
          {
            "group": "RequestQueryParams",
            "type": "Number",
            "optional": false,
            "field": "distmax",
            "description": "<p>Max bound for user's distance to crowdfunding (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Status of the crowdfunding [COLLECTING, REQUESTING, FINISHED] (Optional)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "GET: /api/crowdfundings/?q=<QUERY>",
        "type": "json"
      },
      {
        "title": "Example 1",
        "content": "GET: /api/crowdfundings/?q=adaptative+and+extranet",
        "type": "json"
      },
      {
        "title": "Example 2",
        "content": "GET: /api/crowdfundings?desc=no",
        "type": "json"
      },
      {
        "title": "Example 3",
        "content": "GET: /api/crowdfundings/?q=adaptative paradigms&lang=english&limit=10&cat=fun",
        "type": "json"
      },
      {
        "title": "Example 4",
        "content": "GET: /api/crowdfundings/?q=adaptative paradigms&lang=english&limit=100&balancemax=50&balancemin=30&datemin=2018-01-01",
        "type": "json"
      },
      {
        "title": "Example 5",
        "content": "GET: /api/crowdfundings/?q=adaptative&order=distance&asc=false",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "crowdfunding_id",
            "description": "<p>ID of the crowdfunding</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "rating",
            "description": "<p>Rating for the crowdfunding's creator</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the crowdfunding</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the crowdfunding</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>Category of the crowdfunding [BUSINESS, ARTS, ...]</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Geographic coordinated of the crowdfunding</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "acceptable_radius",
            "description": "<p>Maximum distance from location where the crowdfunding can be done</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "mygrant_value",
            "description": "<p>Number of hours the crowdfunding will take</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date_created",
            "description": "<p>Date the crowdfunding was created</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "crowdfunding_type",
            "description": "<p>Type of the crowdfunding [PROVIDE, REQUEST]</p>"
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
            "type": "String",
            "optional": false,
            "field": "crowdfunding_title",
            "description": "<p>Title of the crowdfunding if created by a crowdfunding</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "distance",
            "description": "<p>Current user's distance to the crowdfunding's coordinates</p>"
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
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "put",
    "url": "/crowdfundings/:crowdfunding_id",
    "title": "Update crowdfunding",
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
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "Crowdfunding"
  },
  {
    "type": "get",
    "url": "/images/:type/:image",
    "title": "Get image",
    "name": "GetImage",
    "group": "Images",
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
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of image (crowdfundings | services).</p>"
          },
          {
            "group": "RequestParam",
            "type": "String",
            "optional": false,
            "field": "image",
            "description": "<p>Filename of the image to retrieve.</p>"
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
    "filename": "../t1g1/routes/images.js",
    "groupTitle": "Images"
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
          },
          {
            "group": "RequestParams",
            "type": "Integer",
            "optional": false,
            "field": "page",
            "description": "<p>current page.</p>"
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
    "filename": "../t1g1/routes/messages.js",
    "groupTitle": "Messages"
  },
  {
    "type": "get",
    "url": "/messages/ Get topics for user. Returns an array of users that the logged user has conversations with, the last message sent between them, as well as the",
    "title": "other user's id, name and picture",
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
    "filename": "../t1g1/routes/messages.js",
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
    "filename": "../t1g1/routes/messages.js",
    "groupTitle": "Messages"
  },
  {
    "type": "post",
    "url": "/newsfeed",
    "title": "03 - Create post",
    "name": "CreatePost",
    "group": "Newsfeed",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "description": "<p>Create a microblogging post</p>",
    "parameter": {
      "fields": {
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Content of the post</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "in_reply_to",
            "description": "<p>ID of the message this one is replying to (Optional)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "POST: /api/newsfeed",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "POST: /api/newsfeed\nbody: {\n     message: 'A new post',\n     in_reply_to: 5\n}",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/newsfeed.js",
    "groupTitle": "Newsfeed"
  },
  {
    "type": "delete",
    "url": "/newsfeed/:id",
    "title": "06 - Delete post",
    "name": "DeletePost",
    "group": "Newsfeed",
    "permission": [
      {
        "name": "post creator"
      }
    ],
    "description": "<p>Deletes a microblogging</p>",
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the post to delete</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "DELETE: /api/newsfeed/<ID>",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "DELETE: /api/newsfeed/1",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/newsfeed.js",
    "groupTitle": "Newsfeed"
  },
  {
    "type": "put",
    "url": "/newsfeed/:id",
    "title": "05 - Edit post",
    "name": "EditPost",
    "group": "Newsfeed",
    "permission": [
      {
        "name": "post creator"
      }
    ],
    "description": "<p>Edits the content of a microblogging post</p>",
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the post to edit</p>"
          }
        ],
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Content of the post</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "PUT: /api/newsfeed/<ID>",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "PUT: /api/newsfeed/1\nbody: {\n     message: 'This is an edit'\n}",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/newsfeed.js",
    "groupTitle": "Newsfeed"
  },
  {
    "type": "get",
    "url": "/newsfeed/",
    "title": "01 - Get newsfeed",
    "name": "GetNewsfeed",
    "group": "Newsfeed",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "description": "<p>Returns a list of posts made by friends of the logged in user</p>",
    "examples": [
      {
        "title": "Syntax",
        "content": "GET: /api/newsfeed",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_id",
            "description": "<p>ID of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "post_message",
            "description": "<p>Content of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "post_date_posted",
            "description": "<p>Date a post was created</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_in_reply_to",
            "description": "<p>ID of the post this is replying to</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_n_likes",
            "description": "<p>Number of likes on the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_n_replies",
            "description": "<p>Number of replies on the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_n_images",
            "description": "<p>Number of images on the post</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "post_image",
            "description": "<p>URL of the first image of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_n_edits",
            "description": "<p>Number of edits on the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "sender_id",
            "description": "<p>ID of the creator of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "sender_full_name",
            "description": "<p>Name of the creator of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "sender_image_url",
            "description": "<p>URL of the image of the creator of the post</p>"
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
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/newsfeed.js",
    "groupTitle": "Newsfeed"
  },
  {
    "type": "get",
    "url": "/newsfeed/:id",
    "title": "04 - Get post",
    "name": "GetPost",
    "group": "Newsfeed",
    "permission": [
      {
        "name": "visitor"
      }
    ],
    "description": "<p>Returns a microblogging post</p>",
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the desired post</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "GET: /api/newsfeed/<ID>",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "GET: /api/newsfeed/5",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_id",
            "description": "<p>ID of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "post_message",
            "description": "<p>Content of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "post_date_posted",
            "description": "<p>Date a post was created</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_in_reply_to",
            "description": "<p>ID of the post this is replying to</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_n_likes",
            "description": "<p>Number of likes on the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_n_replies",
            "description": "<p>Number of replies on the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_n_images",
            "description": "<p>Number of images on the post</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "post_image",
            "description": "<p>URL of the first image of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_n_edits",
            "description": "<p>Number of edits on the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "sender_id",
            "description": "<p>ID of the creator of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "sender_full_name",
            "description": "<p>Name of the creator of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "sender_image_url",
            "description": "<p>URL of the image of the creator of the post</p>"
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
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/newsfeed.js",
    "groupTitle": "Newsfeed"
  },
  {
    "type": "get",
    "url": "/newsfeed/user/:id",
    "title": "02 - Get userfeed",
    "name": "GetUserfeed",
    "group": "Newsfeed",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "description": "<p>Returns a list of posts made by a user</p>",
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the user to see feed of</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "GET: /api/newsfeed/user/<ID>",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "GET: /api/newsfeed/user/5",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_id",
            "description": "<p>ID of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "post_message",
            "description": "<p>Content of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "post_date_posted",
            "description": "<p>Date a post was created</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_in_reply_to",
            "description": "<p>ID of the post this is replying to</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_n_likes",
            "description": "<p>Number of likes on the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_n_replies",
            "description": "<p>Number of replies on the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_n_images",
            "description": "<p>Number of images on the post</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "post_image",
            "description": "<p>URL of the first image of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "post_n_edits",
            "description": "<p>Number of edits on the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "sender_id",
            "description": "<p>ID of the creator of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "sender_full_name",
            "description": "<p>Name of the creator of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "sender_image_url",
            "description": "<p>URL of the image of the creator of the post</p>"
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
            "description": "<p>Database Query Failed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/newsfeed.js",
    "groupTitle": "Newsfeed"
  },
  {
    "type": "post",
    "url": "/newsfeed/:id/like",
    "title": "07 - Like post",
    "name": "LikePost",
    "group": "Newsfeed",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "description": "<p>Likes a microblogging post</p>",
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the post to like</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "POST: /api/newsfeed/<ID>/like",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "POST: /api/newsfeed/1/like",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/newsfeed.js",
    "groupTitle": "Newsfeed"
  },
  {
    "type": "delete",
    "url": "/newsfeed/:id/like",
    "title": "08 - Unlike post",
    "name": "UnlikePost",
    "group": "Newsfeed",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "description": "<p>Unlikes a microblogging post</p>",
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the post to unlike</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "DELETE: /api/newsfeed/<ID>/like",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "DELETE: /api/newsfeed/1/like",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/newsfeed.js",
    "groupTitle": "Newsfeed"
  },
  {
    "type": "post",
    "url": "/posts/:id/delete",
    "title": "delete a post",
    "name": "DeletePost",
    "group": "Post",
    "success": {
      "fields": {
        "Success 204": [
          {
            "group": "Success 204",
            "optional": false,
            "field": "delete",
            "description": "<p>post</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/posts.js",
    "groupTitle": "Post"
  },
  {
    "type": "post",
    "url": "/posts/:id/edit",
    "title": "edit a post",
    "name": "EditPost",
    "group": "Post",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "post",
            "description": "<p>post edit</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/posts.js",
    "groupTitle": "Post"
  },
  {
    "type": "post",
    "url": "/posts/:id/like",
    "title": "like a post",
    "name": "LikePost",
    "group": "Post",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "post",
            "description": "<p>post like</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/posts.js",
    "groupTitle": "Post"
  },
  {
    "type": "post",
    "url": "/posts/:id/comment",
    "title": "post a new post",
    "name": "PostComment",
    "group": "Post",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "post",
            "description": "<p>post comment</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/posts.js",
    "groupTitle": "Post"
  },
  {
    "type": "delete",
    "url": "/posts/:id/like",
    "title": "unlike a post",
    "name": "UnlikePost",
    "group": "Post",
    "success": {
      "fields": {
        "Success 204": [
          {
            "group": "Success 204",
            "optional": false,
            "field": "delete",
            "description": "<p>post like</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/posts.js",
    "groupTitle": "Post"
  },
  {
    "type": "get",
    "url": "/posts/:id/comments",
    "title": "get the posts made in reply to this post",
    "name": "getComments",
    "group": "Post",
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "optional": false,
            "field": "get",
            "description": "<p>post comments.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/posts.js",
    "groupTitle": "Post"
  },
  {
    "type": "get",
    "url": "/posts/:id",
    "title": "get this post's info",
    "name": "getPost",
    "group": "Post",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "get",
            "description": "<p>post</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/posts.js",
    "groupTitle": "Post"
  },
  {
    "type": "post",
    "url": "/services/:id/offers/accept",
    "title": "- Accept service offer",
    "name": "AcceptServiceOffer",
    "group": "Service",
    "permission": [
      {
        "name": "service creator"
      }
    ],
    "description": "<p>Accept service offer</p>",
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
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "POST: /api/services/<ID>/offers/accept",
        "type": "json"
      },
      {
        "title": "Example 1",
        "content": "[When the offer was made by a user]\nPOST: /api/services/5/offers/accept\nbody: {\n     partner_id: 10,\n}",
        "type": "json"
      },
      {
        "title": "Example 2",
        "content": "[When the offer was made by a crowdfunding]\nPOST: /api/services/5/offers/accept\nbody: {\n     crowdfunding_id: 10,\n}",
        "type": "json"
      }
    ],
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
        "Error 403": [
          {
            "group": "Error 403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>You do not have permission to offer the specified service.</p>"
          }
        ],
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
    "filename": "../t1g1/routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "put",
    "url": "/services/",
    "title": "- Create service",
    "name": "CreateService",
    "group": "Service",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "description": "<p>Create a new service</p>",
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
            "type": "Double",
            "optional": false,
            "field": "latitude",
            "description": "<p>Latitude coordinates of the service (Optional)</p>"
          },
          {
            "group": "RequestBody",
            "type": "Double",
            "optional": false,
            "field": "longitude",
            "description": "<p>Longitude- coordinates of the service (Optional)</p>"
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
            "description": "<p>If the service can be done more than one time (Optional)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "PUT: /api/services",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "PUT: /api/services\nbody: {\n     title: 'A new title',\n     description: 'A new description',\n     category: 'FUN',\n     location: '353 st',\n     acceptable_radius: '2540',\n     mygrant_value: '50',\n     service_type: 'REQUEST',\n     creator_id: '4'\n}",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "put",
    "url": "/services/:id/images",
    "title": "- Create service image",
    "name": "CreateServiceImage",
    "group": "Service",
    "permission": [
      {
        "name": "service creator"
      }
    ],
    "description": "<p>Upload image and add it to the service's images</p>",
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
            "field": "image",
            "description": "<p>Image file to upload</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "PUT: /api/services/<ID>/images",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "PUT: /api/services/5/images\nfiles.image?",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "delete",
    "url": "/services/:id/offers/decline",
    "title": "- Decline service offer",
    "name": "DeclineServiceOffer",
    "group": "Service",
    "permission": [
      {
        "name": "service creator"
      }
    ],
    "description": "<p>Removes service offer</p>",
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
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "POST: /api/services/<ID>/offers/decline",
        "type": "json"
      },
      {
        "title": "Example 1",
        "content": "[When the offer was made by a user]\nPOST: /api/services/5/offers/decline\nbody: {\n     partner_id: 10,\n}",
        "type": "json"
      },
      {
        "title": "Example 2",
        "content": "[When the offer was made by a crowdfunding]\nPOST: /api/services/5/offers/decline\nbody: {\n     crowdfunding_id: 10,\n}",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "delete",
    "url": "/services/:id",
    "title": "- Delete service",
    "name": "DeleteService",
    "group": "Service",
    "permission": [
      {
        "name": "service creator"
      }
    ],
    "description": "<p>Delete a service by its ID</p>",
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
    "examples": [
      {
        "title": "Syntax",
        "content": "DELETE: /api/services/<ID>",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "DELETE: /api/services/5",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "delete",
    "url": "/services/:id/images/:image",
    "title": "- Delete service image",
    "name": "DeleteServiceImage",
    "group": "Service",
    "permission": [
      {
        "name": "service creator"
      }
    ],
    "description": "<p>Delete image of a service by its URL</p>",
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
    "examples": [
      {
        "title": "Syntax",
        "content": "DELETE: /api/services/<ID>/images/<IMAGE_URL>",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "DELETE: /api/services/5/images/http://dummyimage.com/965x531.png/dddddd/000000",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "put",
    "url": "/services/:id",
    "title": "- Edit service",
    "name": "EditService",
    "group": "Service",
    "permission": [
      {
        "name": "service creator"
      }
    ],
    "description": "<p>Edit a service by its ID</p>",
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
    "examples": [
      {
        "title": "Syntax",
        "content": "PUT: /api/services/<ID>",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "PUT: /api/services/5\nbody: {\n     title: 'An edited title',\n     description: 'An edit description',\n}",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "get",
    "url": "/services/:id",
    "title": "- Get service by ID",
    "name": "GetServiceByID",
    "group": "Service",
    "permission": [
      {
        "name": "visitor"
      }
    ],
    "description": "<p>Get service info by ID</p>",
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
    "examples": [
      {
        "title": "Syntax",
        "content": "GET: /api/services/<ID>",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "GET: /api/services/5",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "get",
    "url": "/services/:id/images",
    "title": "- Get service images' urls",
    "name": "GetServiceImages",
    "group": "Service",
    "permission": [
      {
        "name": "visitor"
      }
    ],
    "description": "<p>Get images of a service</p>",
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
    "examples": [
      {
        "title": "Syntax",
        "content": "GET: /api/services/<ID>/images",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "GET: /api/services/5/images",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "get",
    "url": "/services/instance/:id",
    "title": "Get the service instance requester",
    "name": "GetServiceInstanceRequester",
    "group": "Service",
    "permission": [
      {
        "name": "service creator"
      }
    ],
    "version": "0.0.0",
    "filename": "../t1g1/routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "get",
    "url": "/services/:id/offers",
    "title": "- Get service offers",
    "name": "GetServiceOffers",
    "group": "Service",
    "permission": [
      {
        "name": "service creator"
      }
    ],
    "description": "<p>Get list of offers made to a service by a user or crowdfunding</p>",
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
    "examples": [
      {
        "title": "Syntax",
        "content": "GET: /api/services/<ID>/offers",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "GET: /api/services/5/offers",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "requesters",
            "description": "<p>List of the users making the offers {type, requester_id, requester_name, date_proposed}</p>"
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
    "filename": "../t1g1/routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "get",
    "url": "/services/:id/offers/:type/:candidate",
    "title": "- Get specific offer",
    "name": "GetServiceSpecificOffer",
    "group": "Service",
    "permission": [
      {
        "name": "service creator"
      }
    ],
    "description": "<p>Get offer made to a service by a user or crowdfunding</p>",
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
    "examples": [
      {
        "title": "Syntax",
        "content": "GET: /api/services/<ID>/offers/<TYPE>/<CANDIDATE>",
        "type": "json"
      },
      {
        "title": "Example 1",
        "content": "GET: /api/services/5/offers/user/10",
        "type": "json"
      },
      {
        "title": "Example 2",
        "content": "GET: /api/services/5/offers/crowdfunding/10",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "get",
    "url": "/services/search-count",
    "title": "- Get number of results and pages of a services search",
    "name": "GetServicesSearchCount",
    "group": "Service",
    "permission": [
      {
        "name": "visitor"
      }
    ],
    "description": "<p>Returns the number of pages of a services search</p>",
    "parameter": {
      "fields": {
        "RequestQueryParams": [
          {
            "group": "RequestQueryParams",
            "type": "String",
            "optional": false,
            "field": "q",
            "description": "<p>Search query; seraches among titles and descriptions (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Integer",
            "optional": false,
            "field": "items",
            "description": "<p>Number of items per page default/max: 50 (Optional)</p>"
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
            "type": "Number",
            "optional": false,
            "field": "mygmax",
            "description": "<p>Max bound for mygrant_value (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Number",
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
          },
          {
            "group": "RequestQueryParams",
            "type": "Number",
            "optional": false,
            "field": "distmax",
            "description": "<p>Max bound for user's distance to service (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Number",
            "optional": false,
            "field": "ratingmin",
            "description": "<p>Min bound for rating (Optional)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "GET: /api/services/search-count?q=<QUERY>",
        "type": "json"
      },
      {
        "title": "Example 1",
        "content": "GET: /api/services/search-count?q=support+tangible+extranet",
        "type": "json"
      },
      {
        "title": "Example 2",
        "content": "GET: /api/services/search-count?q=tangible services&desc=no",
        "type": "json"
      },
      {
        "title": "Example 3",
        "content": "GET: /api/services/search-count?q=support paradigms&lang=english&limit=10&cat=fun&type=request",
        "type": "json"
      },
      {
        "title": "Example 4",
        "content": "GET: /api/services/search-count?q=support paradigms&lang=english&limit=100&mygmax=50&mygmin=30&datemin=2018-01-01",
        "type": "json"
      },
      {
        "title": "Example 5",
        "content": "GET: /api/services/search-count?q=service&order=distance&asc=false",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "results",
            "description": "<p>Number of individual results</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "pages",
            "description": "<p>Number of pages</p>"
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
    "filename": "../t1g1/routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "post",
    "url": "/services/:id/offers",
    "title": "- Make service offer",
    "name": "MakeServiceOffer",
    "group": "Service",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "description": "<p>Create offer to a service</p>",
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
            "description": "<p>ID of the crowdfunding making the offer (crowdfunding must be RECRUTING) (XOR partner_id)</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "partner_id",
            "description": "<p>ID of the user making the offer (XOR crowdfunding_id)</p>"
          },
          {
            "group": "RequestBody",
            "type": "Timestamp",
            "optional": false,
            "field": "date_propsosed",
            "description": "<p>Proposed date for the service (Optional)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "POST: /api/services/<ID>/offers",
        "type": "json"
      },
      {
        "title": "Example 1",
        "content": "[When the offer is being made in the name of a the logged in user]\nPOST: /api/services/5/offers",
        "type": "json"
      },
      {
        "title": "Example 2",
        "content": "[When the offer is being made in the name of a crowdfunding]\nPOST: /api/services/5/offers\nbody: {\n partner_id: 10,\n data_proposed: \"2018-10-10 03:03:03+01\"\n}",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "put",
    "url": "/services/instance/:id",
    "title": "- Rate a service",
    "name": "ReviewServiceInstance",
    "group": "Service",
    "permission": [
      {
        "name": "service creator/partner"
      }
    ],
    "description": "<p>Adds rating given by participant to a service instance</p>",
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the service instance to review</p>"
          }
        ],
        "RequestBody": [
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "rating",
            "description": "<p>Rating to be given to the service instance</p>"
          },
          {
            "group": "RequestBody",
            "type": "Integer",
            "optional": false,
            "field": "crowdfunding_id",
            "description": "<p>ID of the crowdfunding reviewing a service (Only applicable to services provided to a crowdfunding)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "POST: /api/services/instance/<ID>",
        "type": "json"
      },
      {
        "title": "Example 1",
        "content": "[When the participant doing the rating is a user]\nPOST: /api/services/instance/<ID>\nbody: {\n     rating: 2\n}",
        "type": "json"
      },
      {
        "title": "Example 2",
        "content": "[When the participant doing the rating is a crowdfunding]\nPOST: /api/services/instance/<ID>\nbody: {\n     crowdfunding_id: 10,\n     rating: 2\n}",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/services.js",
    "groupTitle": "Service"
  },
  {
    "type": "get",
    "url": "/services",
    "title": "- Get service's list",
    "name": "SearchService",
    "group": "Service",
    "permission": [
      {
        "name": "visitor"
      }
    ],
    "description": "<p>Search for and filters listing of active services according to parameters given</p>",
    "parameter": {
      "fields": {
        "RequestQueryParams": [
          {
            "group": "RequestQueryParams",
            "type": "String",
            "optional": false,
            "field": "q",
            "description": "<p>Search query; seraches among titles and descriptions (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Integer",
            "optional": false,
            "field": "page",
            "description": "<p>Page number to return (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Integer",
            "optional": false,
            "field": "items",
            "description": "<p>Number of items per page default/max: 50 (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "String",
            "optional": false,
            "field": "order",
            "description": "<p>The field to be ordered by (defaults to search_score) (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Boolean",
            "optional": false,
            "field": "asc",
            "description": "<p>Display in ascesding order (defaults to true) (Optional)</p>"
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
            "type": "Number",
            "optional": false,
            "field": "mygmax",
            "description": "<p>Max bound for mygrant_value (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Number",
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
          },
          {
            "group": "RequestQueryParams",
            "type": "Number",
            "optional": false,
            "field": "distmax",
            "description": "<p>Max bound for user's distance to service (Optional)</p>"
          },
          {
            "group": "RequestQueryParams",
            "type": "Number",
            "optional": false,
            "field": "ratingmin",
            "description": "<p>Min bound for rating (Optional)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "GET: /api/services/?q=<QUERY>",
        "type": "json"
      },
      {
        "title": "Example 1",
        "content": "GET: /api/services/?q=support+tangible+extranet",
        "type": "json"
      },
      {
        "title": "Example 2",
        "content": "GET: /api/services/?q=tangible services&desc=no",
        "type": "json"
      },
      {
        "title": "Example 3",
        "content": "GET: /api/services/?q=support paradigms&lang=english&limit=10&cat=fun&type=request",
        "type": "json"
      },
      {
        "title": "Example 4",
        "content": "GET: /api/services/?q=support paradigms&lang=english&limit=100&mygmax=50&mygmin=30&datemin=2018-01-01",
        "type": "json"
      },
      {
        "title": "Example 5",
        "content": "GET: /api/services/?q=service&order=distance&asc=false",
        "type": "json"
      }
    ],
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
            "type": "Number",
            "optional": false,
            "field": "rating",
            "description": "<p>Rating for the service's creator</p>"
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
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "distance",
            "description": "<p>Current user's distance to the service's coordinates</p>"
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
    "filename": "../t1g1/routes/services.js",
    "groupTitle": "Service"
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
            "type": "String[]",
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
    "filename": "../t1g1/routes/categories.js",
    "groupTitle": "Service_Categories"
  },
  {
    "type": "get",
    "url": "/users/mygrant_balalnce",
    "title": "Get mygrant balance",
    "name": "GetMygrantBalance",
    "group": "User",
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
            "type": "Integer",
            "optional": false,
            "field": "mygrant_balance",
            "description": "<p>Current amount of mygrants owned by the user.</p>"
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
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/comments.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/mygrant_balalnce",
    "title": "Get mygrant balance",
    "name": "GetMygrantBalance",
    "group": "User",
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
            "type": "Integer",
            "optional": false,
            "field": "mygrant_balance",
            "description": "<p>Current amount of mygrants owned by the user.</p>"
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
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/crowdfundings",
    "title": "Get user's crowdfundings.",
    "name": "GetUserCrowdfundings",
    "group": "User",
    "permission": [
      {
        "name": "authenticated user"
      }
    ],
    "error": {
      "fields": {
        "Sucess 200": [
          {
            "group": "Sucess 200",
            "optional": false,
            "field": "OK",
            "description": ""
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/comments.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/users/:id/posts",
    "title": "post a new post",
    "name": "PostPost",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "post",
            "description": "<p>user post</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/getfeed",
    "title": "get the posts made by this user and their friends",
    "name": "getFeed",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "get",
            "description": "<p>user feed</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/get_from_token",
    "title": "get the authenticated user that is identified by a JWT",
    "name": "getFromToken",
    "group": "User",
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
            "field": "OK",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/:id/posts",
    "title": "get the posts made by this user",
    "name": "getPosts",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "get",
            "description": "<p>user posts</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/:id/postcount",
    "title": "get the number of posts made by this user",
    "name": "getPosts",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "get",
            "description": "<p>user postcount</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "../t1g1/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/crowdfundings/:crowdfunding_id/images",
    "title": "- Create crowdfunding image",
    "name": "CreatecrowdfundingImage",
    "group": "crowdfunding",
    "permission": [
      {
        "name": "crowdfunding creator"
      }
    ],
    "description": "<p>Upload image and add it to the crowdfunding's images</p>",
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "crowdfunding_id",
            "description": "<p>ID of the crowdfunding to get images of</p>"
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
    "examples": [
      {
        "title": "Syntax",
        "content": "PUT: /api/crowdfundings/<ID>/images",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "PUT: /api/crowdfundings/5/images\nfiles.image?",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "crowdfunding"
  },
  {
    "type": "delete",
    "url": "/crowdfundings/:crowdfunding_id/images/:image",
    "title": "- Delete crowdfunding image",
    "name": "DeletecrowdfundingImage",
    "group": "crowdfunding",
    "permission": [
      {
        "name": "crowdfunding creator"
      }
    ],
    "description": "<p>Delete image of a crowdfunding by its URL</p>",
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "crowdfunding_id",
            "description": "<p>ID of the crowdfunding to get images of</p>"
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
    "examples": [
      {
        "title": "Syntax",
        "content": "DELETE: /api/crowdfundings/<ID>/images/<IMAGE_URL>",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "DELETE: /api/crowdfundings/5/images/http://dummyimage.com/965x531.png/dddddd/000000",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "crowdfunding"
  },
  {
    "type": "get",
    "url": "/crowdfundings/:crowdfunding_id/images",
    "title": "- Get crowdfunding images' urls",
    "name": "GetcrowdfundingImages",
    "group": "crowdfunding",
    "permission": [
      {
        "name": "visitor"
      }
    ],
    "description": "<p>Get images of a crowdfunding</p>",
    "parameter": {
      "fields": {
        "RequestParam": [
          {
            "group": "RequestParam",
            "type": "Integer",
            "optional": false,
            "field": "crowdfunding_id",
            "description": "<p>ID of the crowdfunding to get images of</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Syntax",
        "content": "GET: /api/crowdfundings/<ID>/images",
        "type": "json"
      },
      {
        "title": "Example",
        "content": "GET: /api/crowdfundings/5/images",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "images",
            "description": "<p>List of images of the crowdfunding {crowdfunding_id, image_url}</p>"
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
    "filename": "../t1g1/routes/crowdfundings.js",
    "groupTitle": "crowdfunding"
  },
  {
    "type": "put",
    "url": "/users/change-image",
    "title": "- Change user image",
    "name": "ChangeUserImage",
    "group": "user",
    "permission": [
      {
        "name": "user itself"
      }
    ],
    "description": "<p>Upload image and replace current one with new</p>",
    "parameter": {
      "fields": {
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
    "examples": [
      {
        "title": "Syntax",
        "content": "PUT: /api/users/change-image\nfiles.image?",
        "type": "json"
      }
    ],
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
    "filename": "../t1g1/routes/users.js",
    "groupTitle": "user"
  }
] });
