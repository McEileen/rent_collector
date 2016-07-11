/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
// const Renter = require('../../dst/models/renter');

describe('renters', () => {
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
});
