const request = require("supertest");

const server = require("../api/server");
const getToken = require("./getToken");

describe("user-shelves-router.js", () => {
   
    describe("POST /api/shelves/user/:userId", () => {
        it("returns 201 created and the created shelf", async () => {
            const response = await request(server).post("/api/shelves/user/1")
                .send({ "shelfName": "test shelf 2", "isPrivate": false })
                .set({ authorization: await getToken() });
            
            expect(response.status).toBe(201);
            expect(response.body).not.toBe(undefined);
            expect(response.body["shelfName"]).toBe("test shelf 2");
        });        
    });
    
    describe("GET to /user/:userId", () => {
        it("returns 200 ok and an array of shelves", async () => {
            const token = await getToken();
            const response = await request(server).get("/api/shelves/user/1")
                .set({ authorization: token });
            const array = response.body;            
            
            expect(response.status).toBe(200);
            expect(response.body).not.toBe(0); 
            expect(array.map(shelf => shelf["shelfName"])).toContain("test shelf 2");          
        });
    });
    
    describe("GET to /api/shelves/:shelfId", () => {
        it("returns 200 ok and an array of books", async () => {
            const response = await request(server).get("/api/shelves/1")
                .set({ authorization: token });
                
            expect(response.status).toBe(200);
            expect(response.body.length).not.toBe(undefined);            
        });
    });
    
    describe("DELETE to /api/shelves/:shelfId", () => {
       it("returns 200 ok and a message", async () => {
            const res = await request(server).get("/api/shelves/user/1")
                .set({ authorization: token });
            const last = res.body[0]["shelfId"];
            const response = await request(server).delete(`/api/shelves/${ last }`)
                .set({ authorization: token });
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("shelf deleted successfully");
       }, 10000); 
    });
    
    describe("PUT to /api/shelves/:sheldId", () => {
        it("returns 201 created and a message", async () => {
            const response = await request(server).put("/api/shelves/20")
                .send({ "shelfName": "test of put", "isPrivate": false })
                .set({ authorization: token });
                
            
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("updated successfully");            
        });
    });
});