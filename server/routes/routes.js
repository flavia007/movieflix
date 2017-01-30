var express = require('express');

//get instance of router for api routes
var router = express.Router();
var auth = require('../controllers/AuthController.js');
var catalog = require('../controllers/CatalogController.js');
var user = require('../controllers/UsersController.js');
var comment = require('../controllers/CommentController.js');
var AuthMiddleware = require('../middlewares/validateToken');




/*
* Routes that can be accessed by any one
*/
router.post('/login', auth.login);
router.post('/signup', auth.signup);

/*
* Middleware checking for authentication
*/
router.use(AuthMiddleware.validateToken); 
/*
* Routes that can be accessed only by autheticated users
*/
router.get('/catalog', catalog.getAll);
router.get('/catalog/:catalog_id', catalog.getOneById);
router.post('/comment', comment.addComment);
router.get('/comment/catalog/:catalog_id', comment.getOneByCatalogId);

/*
* Routes that can be accessed only by authenticated & authorized users eg Admin
*/

router.put('/catalog/:catalog_id', AuthMiddleware.authorizeUser, catalog.update);
router.delete('/catalog/:catalog_id',AuthMiddleware.authorizeUser, catalog.delete);
router.post('/catalog',AuthMiddleware.authorizeUser, catalog.addCatalog);

module.exports = router;