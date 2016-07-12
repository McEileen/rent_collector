/* eslint-disable no-unused-expressions, no-underscore-dangle */

const mongoose = require('mongoose');
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const Renter = require('../../dst/models/renter');
const Apartment = require('../../dst/models/apartment');

describe('renters', () => {
  beforeEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
  describe('get /renters', () => {
    it('should return no renters', (done) => {
      request(app)
      .get('/renters')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renters).to.have.length(0);
        done();
      });
    });
  });
  describe('post /renters', () => {
    it('should create a new renter', (done) => {
      request(app)
      .post('/renters')
      .send({ name: 'Mr. Rogers', money: 98500 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter.name).to.equal('Mr. Rogers');
        expect(rsp.body.renter.money).to.equal(98500);
        expect(rsp.body.renter.__v).to.not.be.null;
        expect(rsp.body.renter._id).to.not.be.null;
        done();
      });
    });
    it('should not create a new renter - bad money', (done) => {
      request(app)
      .post('/renters')
      .send({ name: 'Big Bird', money: 'f' })
      .end((err, rsp) => {
        expect(rsp.body.messages[0]).to.contain('"money" must be a number');
        expect(rsp.status).to.equal(400);
        done();
      });
    });
  });
  describe('put /renters/:id', () => {
    it('should edit an existing renter', (done) => {
      const r1 = new Renter();
      r1.name = 'Oscar the Grouch';
      r1.money = 25;
      r1.save(() => {
        request(app)
        .put(`/renters/${r1._id}`)
        .send({ name: r1.name, money: 0 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.renter.name).to.equal('Oscar the Grouch');
          expect(rsp.body.renter.money).to.equal(0);
          done();
        });
      });
    });
  });
  describe('delete /renters/:id', () => {
    it('should delete an existing renter', (done) => {
      const r1 = new Renter();
      r1.name = 'Elmo';
      r1.money = 1;
      r1.save(() => {
        request(app)
        .delete(`/renters/${r1._id}`)
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.id).to.equal(r1._id.toString());
          done();
        });
      });
    });
  });
  describe('put /renters/:id/payRent', () => {
    it('should reduce renters available money by the rent amount', (done) => {
      const a1 = new Apartment();
      const r1 = new Renter();
      r1.name = 'Oscar the Grouch';
      r1.money = 2500;
      r1.apartment = a1._id;
      r1.save(() => {
        // create the apartment
        a1.name = 'B3';
        a1.renter = r1._id;
        a1.sqft = 850;
        a1.bedrooms = 1;
        a1.floor = 3;
        a1.rent = 500;
        a1.save(() => {
          // call lease
          r1.payRent((err, r2) => {
            expect(err).to.be.null;
            expect(r2.money).to.equal(2000);
            done();
          });
        });
      });
    });
  });
});
