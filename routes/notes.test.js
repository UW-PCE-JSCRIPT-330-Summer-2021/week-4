const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

const User = require('../models/user');
const Note = require('../models/note');

describe("/notes", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const note = { text: 'note text' };
  const note2 = { text: 'note text two' };

  describe('Before login', () => {
    describe('POST /', () => {
      it('should send 401 without a token', async () => {
        const res = await request(server).post("/notes").send(note);
        expect(res.statusCode).toEqual(401);
      });
      it('should send 401 with a bad token', async () => {
        const res = await request(server)
          .post("/notes")
          .set('Authorization', 'Bearer BAD')
          .send(note);
        expect(res.statusCode).toEqual(401);
      });
    });
    describe('GET /', () => {
      it('should send 401 without a token', async () => {
        const res = await request(server).get("/notes").send(note);
        expect(res.statusCode).toEqual(401);
      });
      it('should send 401 with a bad token', async () => {
        const res = await request(server)
          .get("/notes")
          .set('Authorization', 'Bearer BAD')
          .send(note);
        expect(res.statusCode).toEqual(401);
      });
    });
    describe('GET /:id', () => {
      it('should send 401 without a token', async () => {
        const res = await request(server).get("/notes/123").send(note);
        expect(res.statusCode).toEqual(401);
      });
      it('should send 401 with a bad token', async () => {
        const res = await request(server)
          .get("/notes/456")
          .set('Authorization', 'Bearer BAD')
          .send(note);
        expect(res.statusCode).toEqual(401);
      });
    });
  });
  describe('after login', () => {
    const user0 = {
      email: 'user0@mail.com',
      password: '123password'
    };
    const user1 = {
      email: 'user1@mail.com',
      password: '456password'
    }
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
    describe('POST /', () => {
      it('should send 200', async () => {
        const res = await request(server)
          .post("/notes")
          .set('Authorization', 'Bearer ' + token0)
          .send(note);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(note)
      });
      it('should store note with userId', async () => {
        await request(server)
          .post("/notes")
          .set('Authorization', 'Bearer ' + token0)
          .send(note);
        const user = await User.findOne({email: user0.email}).lean();
        const savedNote = await Note.findOne({ userId: user._id }).lean();
        expect(savedNote).toMatchObject(note);
      });
      it('should store note with userId for user1', async () => {
        await request(server)
          .post("/notes")
          .set('Authorization', 'Bearer ' + token1)
          .send(note2);
        const user = await User.findOne({email: user1.email}).lean();
        const savedNote = await Note.findOne({ userId: user._id }).lean();
        expect(savedNote).toMatchObject(note2);
      });
    });
    describe('GET /', () => {
      let user0Notes;
      let user1Notes;
      beforeEach(async () => {
        user0Notes = [
          (await request(server).post("/notes").set('Authorization', 'Bearer ' + token0).send(note)).body,
          (await request(server).post("/notes").set('Authorization', 'Bearer ' + token0).send(note2)).body,
        ];
        user1Notes = [
          (await request(server).post("/notes").set('Authorization', 'Bearer ' + token1).send(note2)).body,
          (await request(server).post("/notes").set('Authorization', 'Bearer ' + token1).send(note)).body,
        ];
      });
      it('should return user0 only their notes', async () => {
        const res = await request(server)
          .get("/notes")
          .set('Authorization', 'Bearer ' + token0)
          .send(note);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(user0Notes)
      });
      it('should return user1 only their notes', async () => {
        const res = await request(server)
          .get("/notes")
          .set('Authorization', 'Bearer ' + token1)
          .send(note);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(user1Notes)
      });
    });
    describe('GET /:id', () => {
      let user0Notes;
      let user1Notes;
      beforeEach(async () => {
        user0Notes = [
          (await request(server).post("/notes").set('Authorization', 'Bearer ' + token0).send(note)).body,
          (await request(server).post("/notes").set('Authorization', 'Bearer ' + token0).send(note2)).body,
        ];
        user1Notes = [
          (await request(server).post("/notes").set('Authorization', 'Bearer ' + token1).send(note2)).body,
          (await request(server).post("/notes").set('Authorization', 'Bearer ' + token1).send(note)).body,
        ];
      });
      it('should return 400 if id is invalid', async () => {
        const res = await request(server)
          .get("/notes/123")
          .set('Authorization', 'Bearer ' + token0)
          .send();
        expect(res.statusCode).toEqual(400);
      });
      it.each([0, 1])('should return user0 note #%#', async (index) => {
        const note = user0Notes[index];
        const res = await request(server)
          .get("/notes/" + note._id)
          .set('Authorization', 'Bearer ' + token0)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(note);
      });
      it.each([0, 1])('should not return user0 note #%# from user1', async (index) => {
        const note = user1Notes[index];
        const res = await request(server)
          .get("/notes/" + note._id)
          .set('Authorization', 'Bearer ' + token0)
          .send();
        expect(res.statusCode).toEqual(404);
      });
      it.each([0, 1])('should return user1 note #%#', async (index) => {
        const note = user1Notes[index];
        const res = await request(server)
          .get("/notes/" + note._id)
          .set('Authorization', 'Bearer ' + token1)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(note);
      });
      it.each([0, 1])('should not return user1 note #%# from user0', async (index) => {
        const note = user0Notes[index];
        const res = await request(server)
          .get("/notes/" + note._id)
          .set('Authorization', 'Bearer ' + token1)
          .send();
        expect(res.statusCode).toEqual(404);
      });
    });
  });
});