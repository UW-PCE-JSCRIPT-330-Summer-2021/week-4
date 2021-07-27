const { Router } = require('express');
const router = Router();
const noteDAO = require('../daos/note');
const tokenDAO = require('../daos/token');

router.post("/", isLoggedIn async (req, res, next) => {
    try {
        const storeNote = await noteDAO.
    }
})

// Create: POST /notes
// Get all of my notes: GET /notes
// Get a single note: GET /notes/:id