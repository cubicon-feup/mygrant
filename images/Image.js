const uuidv1 = require('uuid/v1');
const allowedExtensions = ['image/jpeg', 'image/png'];

function storeLocally(imageFile) {
    const filename = `${uuidv1()}.${imageFile.mimetype.replace(/.*\//, '')}`;
    imageFile.mv('images/' + filename, function(error) {
        if(error)
            throw new Error('Failed storing image file.');
        else return 'Successfully stored the image.';
    });
}

module.exports = {
    uploadImage (req, res) {
        if(!req.files) {
            res.status(400).send('No files were uploaded.');
            return false;
        }
        let imageFile = req.files.image;
        if(imageFile) {
            let fileExtension = imageFile.mimetype;
            if(allowedExtensions.indexOf(fileExtension) === -1)
                res.status(400).send('The file\'s extension is not allowed.');
            let result = storeLocally(imageFile);
            if(result instanceof Error) {
                res.status(500).send(result);
                return false;
            } else {
                res.status(201).send(result);
                return true;
            }
        }
        res.status(400).send('No image detected.');
        return false;
    }
}
