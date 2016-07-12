/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
import mongoose from 'mongoose';
import Renter from './renter';
const Schema = mongoose.Schema;

const apartmentSchema = new Schema({
  name: { type: String, required: true },
  sqft: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  floor: { type: Number, required: true },
  rent: { type: Number, required: true },
  renter: { type: mongoose.Schema.ObjectId, ref: 'Renter' },
});

// apartmentSchema.methods.lease = function (renter, cb) {
  // console.log('Renter:', Renter);
  // // save the apt with the renter
  // this.renter = renter._id;
  // this.save(() => {
  //   // upate the renter with the apartment & reduce funds
  //   renter.apartment = this._id;
  //   Renter.findByIdAndUpdate(renter._id, renter, ((err2) => {
  //     // console.log('In Render Update, renter:', renter);
  //     cb(err2, this, renter);
  //   }));
  // });
// };
apartmentSchema.methods.lease = function (renter) {
  console.log('renter:', renter);
  this.renter = renter._id;
  this.save(() => {
    // upate the renter with the apartment & reduce funds
    renter.apartment = this._id;
    Renter.findByIdAndUpdate(renter._id, renter, (err2) => {
      console.log('In Render Update, renter:', renter, err2);
    });
  });
};

module.exports = mongoose.model('Apartment', apartmentSchema);
