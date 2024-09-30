const request = require("supertest");
const app = require('../../app'); // Assurez-vous que ce chemin pointe vers votre fichier app.js
const mongoose = require("mongoose");

let token; // Pour stocker le token d'authentification
let formationId; // Pour stocker l'ID de la formation créée

beforeAll(async () => {
  // Connectez-vous et obtenez un token d'authentification
  const res = await request(app)
    .post("/auth/login")
    .send({ email: "test@example.com", password: "password123" });
  token = res.body.token; // Supposons que votre API renvoie un token JWT
});

describe("Formation API", () => {
  it("should create a new formation", async () => {
    const res = await request(app)
      .post("/formations")
      .set("Authorization", `Bearer ${token}`)
      .send({
        titre: "Test Formation",
        description: "Description de test",
        duree: 8,
        niveau: "Débutant",
        prix: 100,
        dateDebut: new Date(),
        dateFin: new Date(Date.now() + 86400000), // +1 jour
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    formationId = res.body._id;
  });

  it("should get all formations", async () => {
    const res = await request(app).get("/formations");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should get a specific formation", async () => {
    const res = await request(app).get(`/formations/${formationId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.titre).toEqual("Test Formation");
  });

  it("should update a formation", async () => {
    const res = await request(app)
      .put(`/formations/${formationId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ titre: "Updated Formation" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.titre).toEqual("Updated Formation");
  });

  it("should delete a formation", async () => {
    const res = await request(app)
      .delete(`/formations/${formationId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
