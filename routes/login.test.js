  
const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

const User = require('../models/user');

describe("/login", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const user0 = {
    email: 'user0@mail.com',
    password: '123password'
  };
  const user1 = {
    email: 'user1@mail.com',
    password: '456password'
  }

  describe("before signup", () => {
    describe("POST /", () => {
      it("should return 401", async () => {
        const res = await request(server).post("/login").send(user0);
        expect(res.statusCode).toEqual(401);
      });
    });

    describe("POST /password", () => {
      it("should return 401", async () => {
        const res = await request(server).post("/login/password").send(user0);
        expect(res.statusCode).toEqual(401);
      });
    });
/*
    describe("POST /logout", () => {
      it("should return 401", async () => {
        const res = await request(server).post("/login/logout").send();
        expect(res.statusCode).toEqual(401);
      });
    });*/
  }); 
  
  describe("signup ", () => {
    describe("POST /signup", () => {
      it("should return 400 without a password", async () => {
        const res = await request(server).post("/login/signup").send({
          email: user0.email
        });
        expect(res.statusCode).toEqual(400);
      });
      it("should return 400 with empty password", async () => {
        const res = await request(server).post("/login/signup").send({
          email: user1.email,
          password: ""
        });
        expect(res.statusCode).toEqual(400);
      });
      it("should return 200 with a password", async () => {
        const res = await request(server).post("/login/signup").send(user1);
        expect(res.statusCode).toEqual(200);
      });
      it("should return 409 Conflict with a repeat signup", async () => {
        let res = await request(server).post("/login/signup").send(user0);
        expect(res.statusCode).toEqual(200);
        res = await request(server).post("/login/signup").send(user0);
        expect(res.statusCode).toEqual(409);
      });
      it("should not store raw password", async () => {
        await request(server).post("/login/signup").send(user0);
        const users = await User.find().lean();
        users.forEach((user) => {
          expect(Object.values(user)).not.toContain(user0.password);
        });
      });
    });
  });
  describe.each([user0, user1])("User %# after signup", (user) => {
    beforeEach(async () => {
      await request(server).post("/login/signup").send(user0);
      await request(server).post("/login/signup").send(user1);
    });

    describe("POST /", () => {
      it("should return 400 when password isn't provided", async () => {
        const res = await request(server).post("/login").send({
          email: user.email
        });
        expect(res.statusCode).toEqual(400);
      });
      it("should return 401 when password doesn't match", async () => {
        const res = await request(server).post("/login").send({
          email: user.email,
          password: '123'
        });
        expect(res.statusCode).toEqual(401);
      });
      it("should return 200 and a token when password matches", async () => {
        const res = await request(server).post("/login").send(user);
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body.token).toEqual('string');
      });
      it("should not store token on user", async () => {
        const res = await request(server).post("/login").send(user);
        const token = res.body.token;
        const users = await User.find().lean();
        users.forEach((user) => {
          expect(Object.values(user)).not.toContain(token);
        });
      });
    });
  });
  describe("After both users login", () => {
    let token0;
    let token1;
    beforeEach(async () => {
      await request(server).post("/login/signup").send(user0);
      const res0 = await request(server).post("/login").send(user0);
      token0 = res0.body.token;
      await request(server).post("/login/signup").send(user1);
      const res1 = await request(server).post("/login").send(user1);
      token1 = res1.body.token;
    });

    describe("POST /password", () => {
      it("should reject bogus token", async () => {
        const res = await request(server)
          .post("/login/password")
          .set('Authorization', 'Bearer BAD')
          .send({ password: '123' });
        expect(res.statusCode).toEqual(401);
      });
      it("should reject empty password", async () => {
        const res = await request(server)
          .post("/login/password")
          .set('Authorization', 'Bearer ' + token0)
          .send({ password: '' });
        expect(res.statusCode).toEqual(400);
      });
      it("should change password for user0", async () => {
        const res = await request(server)
          .post("/login/password")
          .set('Authorization', 'Bearer ' + token0)
          .send({ password: '123' });
        expect(res.statusCode).toEqual(200);
        let loginRes0 = await request(server).post("/login").send(user0);
        expect(loginRes0.statusCode).toEqual(401);
        loginRes0 = await request(server).post("/login").send({
          email: user0.email,
          password: '123'
        });
        expect(loginRes0.statusCode).toEqual(200);
        const loginRes1 = await request(server).post("/login").send(user1);
        expect(loginRes1.statusCode).toEqual(200);
      });
      it("should change password for user1", async () => {
        const res = await request(server)
          .post("/login/password")
          .set('Authorization', 'Bearer ' + token1)
          .send({ password: '123' });
        expect(res.statusCode).toEqual(200);
        const loginRes0 = await request(server).post("/login").send(user0);
        expect(loginRes0.statusCode).toEqual(200);
        let loginRes1 = await request(server).post("/login").send(user1);
        expect(loginRes1.statusCode).toEqual(401);
        loginRes1 = await request(server).post("/login").send({
          email: user1.email,
          password: '123'
        });
        expect(loginRes1.statusCode).toEqual(200);
      });
     
    });
    /* describe("POST /logout", () => {
      it("should reject bogus token", async () => {
        const res = await request(server)
          .post("/login/logout")
          .set('Authorization', 'Bearer BAD')
          .send();
        expect(res.statusCode).toEqual(401);
      });
      it("should prevent only user0 from making a password change", async () => {
        const res = await request(server)
          .post("/login/logout")
          .set('Authorization', 'Bearer ' + token0)
          .send();
        expect(res.statusCode).toEqual(200);
        const res0 = await request(server)
          .post("/login/password")
          .set('Authorization', 'Bearer ' + token0)
          .send({ password: '123' });
        expect(res0.statusCode).toEqual(401);
        const res1 = await request(server)
          .post("/login/password")
          .set('Authorization', 'Bearer ' + token1)
          .send({ password: '123' });
        expect(res1.statusCode).toEqual(200);
      });
      it("should prevent only user1 from making a password change", async () => {
        const res = await request(server)
          .post("/login/logout")
          .set('Authorization', 'Bearer ' + token1)
          .send();
        expect(res.statusCode).toEqual(200);
        const res0 = await request(server)
          .post("/login/password")
          .set('Authorization', 'Bearer ' + token0)
          .send({ password: '123' });
        expect(res0.statusCode).toEqual(200);
        const res1 = await request(server)
          .post("/login/password")
          .set('Authorization', 'Bearer ' + token1)
          .send({ password: '123' });
        expect(res1.statusCode).toEqual(401);
      });
    }); */
  });
});