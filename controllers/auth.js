const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: process.env.DATABASE,
});

exports.register = (req, res) => {
    console.log(req.body);

    const { lastName, firstName, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM inscrit WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Erreur interne du serveur");
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'Cet e-mail est déjà utilisé. Veuillez vous connecter.'
            });
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Les mots de passe ne correspondent pas'
            });
        } else if (password.length < 6 || !/\d/.test(password)) {
            return res.render('register', {
                message: 'Votre mot de passe doit avoir au moins 6 caractères et inclure des chiffres'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        db.query('INSERT INTO inscrit SET ?', { lastName: lastName, firstName:firstName, email:email, password:hashedPassword }, (insertError) => {
            if (insertError) {
                console.error(insertError);
                return res.status(500).send("Erreur interne du serveur");
            }
            console.log("Utilisateur enregistré avec succès");

            return res.redirect('/login');
        });
        
    });


};exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM inscrit WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Erreur interne du serveur");
        }

        if (results.length === 0) {
            console.log("Utilisateur non enregistré");
            return res.render('login', {
                message: 'Cet e-mail n\'est pas enregistré. Veuillez vous inscrire.'
            });
        }

        const user = results[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            console.log("Mot de passe incorrect");
            return res.render('login', {
                message: 'Mot de passe incorrect'
            });
        }
        console.log("Mot de passe correct, redirection vers /profile");
        return res.redirect('/profile?firstname=' + user.firstName + '&lastname=' + user.lastName);
        
        
    });
};

exports.profile = (req, res) => {
    const { EEmail, phone, Adress1, Adress2, zip, firstName, lastName } = req.body;
       // Utilisez req.query pour obtenir les paramètres de l'URL

    // Vérifiez si l'e-mail actuel existe dans la base de données
    db.query('SELECT * FROM inscrit WHERE email = ?', [EEmail], async (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Erreur interne du serveur");
        }

        if (results.length === 0) {
            console.log("Rendu du message:", 'Votre email est incorrect');
            return res.render('profile', {
                message: 'Votre email est incorrect',
                 // Définissez une valeur par défaut ou gérez-la en conséquence
            });
        }

        // Récupérez les informations de l'utilisateur avant la mise à jour
        const userBeforeUpdate = results[0];

        // Vérifiez si l'e-mail correspond à celui de l'utilisateur actuel
        if (userBeforeUpdate.email !== EEmail) {
            console.log("Rendu du message:", 'Votre email est incorrect');
            return res.render('profile', {
                message: 'Votre email est incorrect'
            });
        }

        // Mettez à jour les informations de l'utilisateur dans la base de données
        db.query('UPDATE inscrit SET phone = ?, Adress1 = ?, Adress2 = ?, zip = ?, firstName = ?, lastName = ? WHERE email = ?',
            [phone, Adress1, Adress2, zip, firstName, lastName, EEmail], (updateError) => {
                if (updateError) {
                    console.error(updateError);
                    return res.status(500).send("Erreur interne du serveur");
                }

                // Redirigez vers /profile après la mise à jour réussie
                return res.redirect('/profile?firstname=' + firstName + '&lastname=' + lastName);
            });
    });


    // auth.js


};

