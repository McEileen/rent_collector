import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const apartmentSchema = new Schema({
  name: { type: String, required: true },
  sqft: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  floor: { type: Number, required: true },
  rent: { type: Number, required: true },
  renter: { type: mongoose.Schema.ObjectId, ref: 'Renter' },
});

module.exports = mongoose.model('Apartment', apartmentSchema);
