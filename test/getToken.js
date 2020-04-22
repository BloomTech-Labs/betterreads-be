const request = require("supertest");

const server = require("../api/server");

module.exports = async function getToken () {
    return (await request(server).post("/api/auth/signin").send({ "emailAddress": "test", "password": "test"})).body.token
};