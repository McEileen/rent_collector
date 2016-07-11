/* eslint-disable new-cap, no-underscore-dangle */

import express from 'express';
import Apartment from '../models/apartment';
const router = module.exports = express.Router();
import bodyValidator from '../validators/apartments/body';
import paramsValidator from '../validators/params';

// index
router.get('/', (req, res) => {
  Apartment.find((err, apartments) => res.send({ apartments }));
});

// post
router.post('/', bodyValidator, (req, res) => {
  Apartment.create(res.locals, (err, apartment) => {
    res.send({ apartment });
  });
});

// edit
router.put('/:id', paramsValidator, bodyValidator, (req, res) => {
  Apartment.findByIdAndUpdate(req.params.id, res.locals, { new: true }, (err, apartment) => {
    res.send({ apartment });
  });
});

// delete
router.delete('/:id', paramsValidator, (req, res) => {
  Apartment.findByIdAndRemove(req.params.id, (err, apartment) => {
    if (apartment) {
      res.send({ id: apartment._id });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});
