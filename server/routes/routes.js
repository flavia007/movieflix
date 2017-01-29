var express = require('express');

//get instance of router for api routes
var router = express.Router();
var auth = require('../controllers/AuthController.js');
var catalog = require('../controllers/CatalogController.js');
var user = require('../controllers/UsersController.js');
var validateToken = require('../middlewares/validateToken');




/*
* Routes that can be accessed by any one
*/
router.post('/login', auth.login);
router.post('/signup', auth.signup);

/*
* Middleware checking for authentication
*/
router.use(validateToken); 
/*
* Routes that can be accessed only by autheticated users
*/
router.get('/catalog', catalog.getAll);
router.get('/catalog/:catalog_id', catalog.getOneById);
router.post('/catalog', catalog.addCatalog);

/*
* Routes that can be accessed only by authenticated & authorized users eg Admin
*/
/*router.get('/users', user.getAll);
router.get('/users/:id', user.getOne);
router.post('/users/', user.create);
router.put('/users/:id', user.update);
router.delete('/users/:id', user.delete);
router.post('/catalog', catalog.create);
router.put('/catalog/:id', catalog.update);
router.delete('/catalog/:id', catalog.delete);*/

module.exports = router;