
/* eslint-disable new-cap, no-underscore-dangle */
import express from 'express';
import Renter from '../models/renter';
const router = module.exports = express.Router();
import bodyValidator from '../validators/renters/body';
import paramsValidator from '../validators/renters/params';

// index
router.get('/', (req, res) => {
  Renter.find((err, renters) => res.send({ renters }));
});

// create
router.post('/', bodyValidator, (req, res) => {
  Renter.create(res.locals, (err, renter) => {
    res.send({ renter });
  });
});

// edit
router.put('/:id', paramsValidator, bodyValidator, (req, res) => {
  Renter.findByIdAndUpdate(req.params.id, res.locals, { new: true }, (err, renter) => {
    res.send({ renter });
  });
});

// delete
router.delete('/:id', paramsValidator, (req, res) => {
  Renter.findByIdAndRemove(req.params.id, (err, renter) => {
    if (renter) {
      res.send({ id: renter._id });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});
