const router = require('express').Router();
const {
  addReaction,
  deleteReaction
} = require('../controllers/reaction-controller');

router
  .route('/')
  .post(addReaction);

router
  .route('/:reactionId')
  .delete(deleteReaction);

module.exports = router;
