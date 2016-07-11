
/* eslint-disable new-cap */
import express from 'express';
import Renter from '../models/renter';
const router = module.exports = express.Router();

// index
router.get('/', (req, res) => {
  Renter.find((err, renters) => res.send({ renters }));
});
