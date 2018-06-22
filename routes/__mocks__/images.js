var express = require('express');
var router = express.Router();

// IMAGES.
// ===============================================================================
/**
 * @api {get} /images/:type/:image Get image
 * @apiName GetImage
 * @apiGroup Images
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {String} type Type of image (crowdfundings | services).
 * @apiParam (RequestParam) {String} image Filename of the image to retrieve.
 *
 * @apiSuccess (Success 201) {String} message Sucessfully created a crowdfunding project.
 *
 * @apiError (Error 400) BadRequest Invalid crowdfunding data.
 * @apiError (Error 500) InternalServerError Couldn't create a crowdfunding.
 */
router.get('/:type/:image', function(req, res) {
    res.sendStatus(200);
});



module.exports = router;
