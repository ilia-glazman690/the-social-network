const Thought = require('../models/Thought');
const User = require('../models/User');

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find()
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then((thoughts) => res.json(thoughts))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  
  getThoughtById(req, res) {
    Thought.findById(req.params.id)
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        // Push the created thought's _id to the associated user's thoughts array
        return User.findByIdAndUpdate(
          req.body.userId,
          { $push: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Thought created successfully' });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  
  updateThought(req, res) {
    Thought.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  
  deleteThought(req, res) {
    Thought.findByIdAndDelete(req.params.id)
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        // Remove the thought's _id from the associated user's thoughts array
        return User.findByIdAndUpdate(
          thought.userId,
          { $pull: { thoughts: req.params.id } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Thought deleted successfully' });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  }
};

module.exports = thoughtController;
