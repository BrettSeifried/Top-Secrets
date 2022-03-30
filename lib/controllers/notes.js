const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const Note = require('../models/Note');

module.exports = Router()
  .get('/', authenticate, authorize, (req, res, next) => {
    try {
      const notes = [
        {
          id: '1',
          title: 'Test Title',
          content: 'Highly Secret',
          created_at: expect.any(Number),
        },
      ];

      res.send(notes);
    } catch (error) {
      next(error);
    }
  })

  .post('/', authenticate, authorize, async (req, res, next) => {
    try {
      const { userId } = req.user.id;
      const { title, content, created_at } = req.body;
      const post = await Note.insert({
        userId,
        title,
        content,
        created_at,
      });
      res.send(post);
    } catch (error) {
      next(error);
    }
  });
