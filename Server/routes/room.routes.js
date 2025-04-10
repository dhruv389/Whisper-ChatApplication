const express = require('express');
const router = express.Router();
const Owner = require('../models/owner.model');
const User = require('../models/user.model');
const Message = require('../models/message.model');
const crypto = require('crypto');

// Create room
router.post('/create-room', async (req, res) => {
  const { groupTitle, imageLink, email, name } = req.body;
  const secretKey = crypto.randomBytes(6).toString('hex');

  try {
    const newOwner = new Owner({ groupTitle, imageLink, email, name, secretKey });
    await newOwner.save();
    res.status(201).json({ message: 'Room created', secretKey });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});


router.get('/users/:secretKey', async (req, res) => {
    const { secretKey } = req.params;
     
  
    try {
      const Users = await User.find({ secretKey });
     
  
      if (!Users) {
        return res.status(404).json({ message: 'Users not found for this secret key' });
      }
  
      res.status(200).json({ Users });
    } catch (error) {
      console.error('Error fetching Users by secret key:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Join room (get messages)
router.get('/roommessage/:secretKey', async (req, res) => {
  try {
    console.log(req.params.secretKey+"--------------------");
    const messages = await Message.find({ secretKey: req.params.secretKey });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch messages' });
  }
});

// Send message
router.post('/room/message', async (req, res) => {
    try {
        console.log(req.body);
      const { secretKey, message, email, name, imageLink } = req.body;
      const newMessage = new Message({ secretKey, message, email, name, imageLink });
      await newMessage.save();
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: 'Message could not be saved' });
    }
  });

// Close room
router.delete('/close-room/:secretKey', async (req, res) => {
  try {
    await Message.deleteMany({ secretKey: req.params.secretKey });
    await Owner.deleteOne({ secretKey: req.params.secretKey });
    res.status(200).json({ message: 'Room closed and data deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to close room' });
  }
});




router.get('/owner/:secretkey', async (req, res) => {
    
    const { secretkey } = req.params;
  
    try {
      const user = await Owner.findOne({
        secretKey:secretkey});
    
      
      if (!user) {
        return res.status(404).json({ message: 'woner not found' });
      }
      
      res.status(200).json({ user });
    } catch (error) {
      console.error('Error fetching user by email:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


router.post('/create-user', async (req, res) => {
    try {
      const { email, name, imageLink, bio ,secretKey } = req.body;
  
      // Check if user already exists
      const existing = await Owner.findOne({ secretKey });
      if (!existing) {
        return res.status(400).json({ message: 'Room is Not found' });
      }
console.log("-------")
      const existing2 = await User.findOne({ secretKey ,email});
      if (existing2) {
        return  res.status(201).json({ message: 'User found', existing2 });
      }
      const user = new User({ email, name, imageLink, bio,secretKey });
      
      await user.save();
  
      res.status(201).json({ message: 'User created', user });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // Update user
  router.put('/update-user/:email', async (req, res) => {
    try {
      const { name, imageLink, bio } = req.body;
  
      const updated = await User.findOneAndUpdate(
        { email: req.params.email },
        { name, imageLink, bio },
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User updated', user: updated });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  

module.exports = router;
