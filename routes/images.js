var express = require('express');
var router = express.Router();
var image = require('../images/Image');

const expressJwt = require('express-jwt');
const appSecret = require('../config/config').secret;
const authenticate = expressJwt({ secret: appSecret });
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
router.get('/:type/:image', function(req, res) { // check for valid input
    // check for valid input
	try {
		var type = req.params.type;
    	var image_url = req.params.image;
	} catch (err) {
        res.status(400).json({ 'error': err.toString() });
        return;
    }
    
    image.sendImage(req, res, type+'/'+image_url);
});


module.exports = router;
