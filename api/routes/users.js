const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  User.find()
    .select('name email _id')
    .exec()
    .then(users => {
      res.status(200).json({
        count: users.length,
        users: users.map(user => {
          const { _id, name, email } = user;
          return {
            _id,
            email,
            name,
            request: {
              type: 'GET',
              url: `${url}/${_id}`
            }
          };
        })
      });
    }).catch(error => {
      res.status(500).json({ error});
    });

});

router.post('/signup', (req, res) => {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const { email, password } = req.body;
  User.find({ email })
    .exec()
    .then( result => {
      if (result.length >= 1) {
        return res.status(422).json({
          message: `Mail(${email}) has been taked`,
        })
      }
      bcrypt.hash(password, 10, (error, hash) => {
        if (error) {
          return res.status(500).json({ error })
        } else {
          const user  = new User({
            _id: mongoose.Types.ObjectId(),
            email,
            password: hash
          });
          user.save()
            .then(result => {
              res.status(201).json({
                user: result,
                request: {
                  type: 'GET',
                  url: `${url}/${result._id}`
                }
              })
            })
            .catch(error => res.status(500).json({ error }))
        }
      });
    });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  User.find({ email })
    .exec()
    .then(users => {
      if(users.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }

      bcrypt.compare(password, users[0].password, (error, result) => {
        if (error) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }

        if (result) {
          return res.status(200).json({
            message: 'Auth successful'
          });
        }
        //default message
        return res.status(401).json({
          message: "Auth failed"
        });

      });
    })
    .catch(error => res.status(500).json({ error }))
});

router.delete('/:userId', (req, res) =>{
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const { userId: _id } = req.params;
  User.remove({_id})
    .exec()
    .then(user => {
      res.status(200).json({
        user,
        request: {
          type: 'POST',
          url,
          body: { email: "String"}
        }
      });
    }).catch(error => {
      res.status(500).json({error});
    });
});

module.exports = router;
