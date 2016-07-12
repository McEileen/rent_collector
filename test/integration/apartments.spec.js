/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const mongoose = require('mongoose');
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const Apartment = require('../../dst/models/apartment');
const Renter = require('../../dst/models/renter');

describe('apartments', () => {
  beforeEach((done) => {
    // mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.collections.apartments.drop(() => {
      mongoose.connection.collections.renters.drop(() => {
        done();
      });
    });
  });
  describe('get /apartments', () => {
    it('should return no apartments', (done) => {
      request(app)
      .get('/apartments')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(0);
        done();
      });
    });
  });

  describe('post /apartments', () => {
    it('should create a new apartment', (done) => {
      request(app)
      .post('/apartments')
      .send({ name: 'A1', sqft: 25000, bedrooms: 7, floor: 11, rent: 1200 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment.name).to.equal('A1');
        expect(rsp.body.apartment.sqft).to.equal(25000);
        expect(rsp.body.apartment.bedrooms).to.equal(7);
        expect(rsp.body.apartment.floor).to.equal(11);
        expect(rsp.body.apartment.rent).to.equal(1200);
        expect(rsp.body.apartment.__v).to.not.be.null;
        expect(rsp.body.apartment._id).to.not.be.null;
        done();
      });
    });
    it('should not create a new apartment - negative sqft', (done) => {
      request(app)
      .post('/apartments')
      .send({ name: 'A1', sqft: -25000, bedrooms: 7, floor: 11, rent: 1200 })
      .end((err, rsp) => {
        expect(rsp.body.messages[0]).to.contain('"sqft" must be larger than or equal to 0');
        expect(rsp.status).to.equal(400);
        done();
      });
    });
  });

  describe('put /apartments/:id', () => {
    it('should edit an existing apartment', (done) => {
      const a1 = new Apartment();
      a1.name = 'B3';
      a1.sqft = 850;
      a1.bedrooms = 1;
      a1.floor = 3;
      a1.rent = 500;
      a1.save(() => {
        request(app)
        .put(`/apartments/${a1._id}`)
        .send({ name: a1.name, sqft: a1.sqft, bedrooms: a1.bedrooms, floor: a1.floor, rent: 550 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.apartment.bedrooms).to.equal(1);
          expect(rsp.body.apartment.rent).to.equal(550);
          done();
        });
      });
    });
    it('should not allow you to make rent a negative number', (done) => {
      const a2 = new Apartment();
      a2.name = 'B8';
      a2.sqft = 975;
      a2.bedrooms = 2;
      a2.floor = 1;
      a2.rent = 600;
      a2.save(() => {
        request(app)
        .put(`/apartments/${a2._id}`)
        .send({ name: a2.name, sqft: a2.sqft, bedrooms: a2.bedrooms, floor: a2.floor, rent: -100 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(400);
          expect(rsp.body.messages[0]).to.contain('"rent" must be larger than or equal to 0');
          done();
        });
      });
    });
  });
  describe('delete /apartments/:id', () => {
    it('should delete an existing apartment', (done) => {
      const a1 = new Apartment();
      a1.name = 'B3';
      a1.sqft = 850;
      a1.bedrooms = 1;
      a1.floor = 3;
      a1.rent = 500;
      a1.save(() => {
        request(app)
        .delete(`/apartments/${a1._id}`)
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.id).to.equal(a1._id.toString());
          done();
        });
      });
    });
  });
  // put lease
  describe('put /apartments/:id/lease', () => {
    it('should lease an apartment for a renter', (done) => {
      const a1 = new Apartment({ name: 'testAp', sqft: 2200, bedrooms: 3, floor: 4, rent: 2500 });
      console.log(a1);
      const r1 = new Renter({ name: 'renter1', money: 10000 });
      a1.lease(r1);
      done();
    });

    it.skip('should lease an apartment for a renter', (done) => {
      // create the renter
      const r1 = new Renter();
      r1.name = 'Oscar the Grouch';
      r1.money = 2500;
      r1.save(() => {
        // create the apartment
        const a1 = new Apartment();
        a1.name = 'B3';
        a1.sqft = 850;
        a1.bedrooms = 1;
        a1.floor = 3;
        a1.rent = 500;
        a1.save(() => {
          // call lease
          a1.lease(r1, (err, a2, r2) => {
            expect(err).to.be.null;
            expect(a2.renter).to.equal(r1._id);
            expect(r2.apartment).to.equal(a1._id);
            expect(r2.money).to.equal(2500);
            done();
          });
        });
      });
    });
  });
});
