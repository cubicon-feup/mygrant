const uuidv1 = require('uuid/v1');
const allowedExtensions = ['image/jpeg', 'image/png'];

function storeLocally(imageFile, subfolder) {
    const filename = `${uuidv1()}.${imageFile.mimetype.replace(/.*\//, '')}`;
    imageFile.mv('images/' + subfolder + filename, function(error) {
        if(error)
            return 'Error: failed storing image file.';
    });
    return filename;
}

module.exports = {
    uploadImage (req, res, subfolder) {
        if(!req.files) {
            res.status(400).send('Error: no files were uploaded.');
            return false;
        }
        let imageFile = req.files.image;
        if(imageFile) {
            let fileExtension = imageFile.mimetype;
            if(allowedExtensions.indexOf(fileExtension) === -1) {
                res.status(400).send('Error: file\'s extension is not allowed.');
                return false;
            }
            let filename = storeLocally(imageFile, subfolder);
            if(filename.indexOf('Error') === 0) {
                res.status(500).send(filename);
                return false;
            } else {
                res.status(201).send(filename);
                return filename;
            }
        } else {
            res.status(400).send('Error: no image detected.');
            return false;
        }
    }
}
