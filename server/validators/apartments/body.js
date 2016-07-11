/* eslint-disable no-param-reassign */

import joi from 'joi';

const schema = {
  name: joi.string().required(),
  sqft: joi.number().min(0).required(),
  bedrooms: joi.number().min(0).required(),
  floor: joi.number().min(0).required(),
  rent: joi.number().min(0).required(),
  // renter: joi.object(),
};

module.exports = (req, res, next) => {
  const result = joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send({ messages: result.error.details.map(d => d.message) });
  } else {
    res.locals = result.value;
    next();
  }
};
