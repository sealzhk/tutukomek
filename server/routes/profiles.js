const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const multer  = require('multer');

const User = require('../models/user');
const Donations = require('../models/donation');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        console.log(file);
        var filetype = '';
        if(file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if(file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if(file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});

const upload = multer({ storage: storage });

router.post('/register', (req, res) => {
    let userData = req.body
    let user = new User(userData)
    user.save((error, registeredUser) => {
        if (error) {
            console.log(error)
        } else {
            let payload = { subject: registeredUser._id}
            let user_id = registeredUser._id;
            let token = jwt.sign(payload, 'secretKey')
            res.status(200).send({token, user_id})
        }
    })
})

router.post('/login', (req, res) => {
    let userData = req.body
    User.findOne({email: userData.email}, (error, user) => {
        if (error) {
            console.log(error)
        } else {
            if (!user) {
                res.status(401).send('Invalid email')
            } else
            if (user.password !== userData.password) {
                res.status(401).send('Invalid password')
            } else {
                let payload = { subject: user._id}
                let user_id = user._id;
                let token = jwt.sign(payload, 'secretKey')
                res.status(200).send({token, user_id})
            }
        }
    })
})

router.get('/:id', function(req, res){
    console.log('Get request for a single user');
    User.findById(req.params.id)
        .exec(function(err, user){
            if (err){
                console.log("Error retrieving user");
            } else {
                res.json(user);
            }
        })
})

router.put('/editpageimage/:id', upload.single('imagePath'), function (req, res){
    var user = {
        firstname: req.body.firstname,
        lastname:  req.body.lastname,
        birthday:  req.body.birthday,
        gender:    req.body.gender,
        imagePath: 'http://localhost:3000/images/' + req.file.filename
    };
    console.log(req);
    console.log('Update user data with image');
    User.findByIdAndUpdate(req.params.id,
        { $set: user },
        { new: true },
        (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in User Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.put('/editpagewithoutimage/:id', function (req, res){
    var user = {
        firstname: req.body.firstname,
        lastname:  req.body.lastname,
        birthday:  req.body.birthday,
        gender:    req.body.gender,
        imagePath: req.body.imagePath
    };
    console.log('Update user data without image');
    User.findByIdAndUpdate(req.params.id,
        { $set: user },
        { new: true },
        (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in User Update:' + JSON.stringify(err, undefined, 2)); }
        });
});

router.put('/changepass/:id', function (req, res){
    var user = {
        password: req.body.password
    };

    console.log('Update user password');
    User.findByIdAndUpdate(req.params.id,
        { $set: user },
        { new: true },
        (err, doc) => {
            if (!err) { res.send(doc); }
            else { console.log('Error in User Password Update :' + JSON.stringify(err, undefined, 2)); }
        });
});

router.get('/mydonations/:id', function (req, res){
    Donations.find({userid: req.params.id}, function(err, donations) {
        if(err){
            res.send(err);
        }
        else {
            if (!donations) {
                res.send("That user doesnt exist");
            }
            else {
                res.send(donations);
            }
        }
    })
})

module.exports = router