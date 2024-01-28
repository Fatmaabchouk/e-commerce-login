const express = require('express');
const auth = require('../controllers/auth');
const router = express.Router();

// Route pour la connexion de l'utilisateur
router.post('/login', auth.login);
router.post('/register', auth.register);
router.post('/profile' ,auth.profile );



module.exports = router;
