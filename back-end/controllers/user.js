const sUser = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {

    const user = await sUser.findOne({ user_name: req.body.user_name });
    if (user) {
        return res.status(401).json({ error: 'Utilisateur déjà existant' });
    }

    // Verify if email is already used
    const email = await sUser.findOne({ email: req.body.email });
    if (email) {
        return res.status(401).json({ error: 'Email déjà utilisé' });
    }

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new sUser({
                user_name: req.body.user_name,
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));

};

exports.login = (req, res, next) => {
    sUser.findOne({ user_name: req.body.user_name })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur introuvable' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
          }
          res.status(200).json({
            userId: user._id, 
            user_name: user.user_name,
            token: jwt.sign(
                { userId: user._id },
                process.env.JWT_TOKEN,
                { expiresIn: '48h' }
              )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.loginFromToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      return res.status(500).json({error: 'Invalid token'})
    } 
    
    sUser.findOne({ _id: userId })
    .then(user => {
        console.log(user);
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur introuvable' });
      }
      
      res.status(200).json({
        userId: user._id, 
        user_name: user.user_name,
        token: jwt.sign(
            { userId: user._id },
            process.env.JWT_TOKEN,
            { expiresIn: '48h' }
            )
      });
    })
    .catch(error => res.status(500).json({ error }));
}