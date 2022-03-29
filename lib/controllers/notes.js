const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

module.exports = Router()
  .get('/', authenticate, authorize, (req, res, next) => {
    try {
      const notes = [
        {
          id: '1',
          title: 'Test Title',
          description: 'Highly Secret',
          created_at: expect.any(Number),
        },
      ];

      res.send(notes);
    } catch (error) {
      next(error);
    }
  })

  .post('/', async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { title, description, created_at } = req.body;
      const post = await post.create({
        userId,
        title,
        description,
        created_at,
      });
      res.send(post);
    } catch (error) {
      next(error);
    }
  });
