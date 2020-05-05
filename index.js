// implement your API here
// import db
const db = require('./data/db.js');

// import express after installing it thru npm
const express = require('express');

// create a server object
const server = express();

server.listen(4000, () => {
  // show that server is listening
  console.log('server listening on port 4000');
});

// needed to parse json text located in the body into an actual object, useful for req.body
server.use(express.json());

// creates a user using the information sent inside the request body
server.post('/api/users', (req, res) => {
  const user = req.body;
  
  if(user.name && user.bio) {
    db.insert(user)
      .then(user => {
        res.status(201).json({ user });
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" });
      });
  } else {
    res.status(400).json({ errorMessage:  "Please provide name and bio for the user."});
  }

  // db.insert(user)
  //   .then((user) => {
  //     res.status(201).json({ success: true, user });
  //   })
  //   .catch((err) => {
  //     res.status(500).json({ errorMessage: "There was an error while saving the user to the database" });
  //   });
});

server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "The users information could not be retrieved." });
    });
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(user => {
      if(user){
        res.status(200).json({ success: true, user });
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
      };
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "The user information could not be retrieved." })
    });
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db.remove(id)
    .then(deletedUser => {
      if(deletedUser) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "The user could not be removed" })
    });
});

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;

  const userInfo = req.body;

  if(userInfo.name && userInfo.bio) {
    db.update(id, userInfo)
      .then(user => {
        if(user) {
          res.status(200).json({ userInfo })
        } else {
          res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "The user information could not be modified." })
      });
  } else {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
  }
});