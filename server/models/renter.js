/* eslint-disable consistent-return, func-names */
import mongoose from 'mongoose';
// const Apartment = require('./apartment');
const Schema = mongoose.Schema;

const renterSchema = new Schema({
  name: { type: String, required: true },
  money: { type: Number, required: true, default: 0 },
  apartment: { type: mongoose.Schema.ObjectId, ref: 'Apartment' },
});

// renterSchema.methods.payRent = function (cb) {
//   const apartmentID = this.apartment;
//   if (!apartmentID) {
//     return cb(new Error('Renter has not signed a lease'));
//   }
//   console.log('Apartment', Apartment);
//   Apartment.findById(apartmentID, (err, apartment) => {
//     if (this.money < apartment.rent) {
//       return cb(new Error('Renter has insufficient funds'));
//     }
//     this.money -= apartment.rent;
//     this.save(saveError => {
//       cb(saveError, this);
//     });
//   });
// };
renterSchema.methods.payRent = function () {
  const apartmentID = this.apartment;
  if (!apartmentID) {
    return new Error('Renter has not signed a lease');
  }
  console.log('Apartment', apartmentID);
  this.model('apartment').findById(apartmentID, (err, apartment) => {
    if (this.money < apartment.rent) {
      return new Error('Renter has insufficient funds');
    }
    this.money -= apartment.rent;
    this.save(() => {
      console.log('test');
    });
  });
};

module.exports = mongoose.model('Renter', renterSchema);
