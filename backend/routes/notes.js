const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get All the Notes using: GET "/api/notes/getuser". Login required
//Fetch all Notes Route
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        // Fid Notes of the corresponding User
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)// Send notes as a response
    } catch (error) {
        console.error(error.message);
        // If any error occurs then show a custom error message
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 2: Add a new Note using: POST "/api/notes/addnote". Login required
// Add Note Route
router.post('/addnote', fetchuser, [
    // Adding Validation checks to the title and description field
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        try {
            // Using destruturing method of javascript
            const { title, description, tag } = req.body;
            // If there are errors, return Bad request and the errors
            // Return the bad request if error occurs while validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                //New Note object contains a title, des, tag and user
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save()// Saving the notes
            res.json(savedNote)// Return the notes as a response
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote". Login required
// Updating Note Route
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;// Using Destructuring Method of Javascript
    try {
        // Create a newNote object
        const newNote = {};// Creating a New Note Object
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };
        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);// Getting the Notes, with the help of findbyId Method
        if (!note) { return res.status(404).send("Not Found") }// Show an error, if notes are not found

        if (note.user.toString() !== req.user.id) {// Matching the existing user id with the logged in user id
            return res.status(401).send("Not Allowed");// Show an error if the validation fails
        }
        //Find and Update the note by using the findByIdAndUpdate Method
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
// Delete Note Route
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let note = await Note.findById(req.params.id);// Getting the Notes with the help of findbyId Method
        if (!note) { return res.status(404).send("Not Found") }// show an error if notes are not found

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {// Matching the existing user id with the logged in user id
            return res.status(401).send("Not Allowed");// Show an error of the validation fails
        }

        note = await Note.findByIdAndDelete(req.params.id)// Find the delete the note by using the findbyIdAndDelete Method
        res.json({ "Success": "Note has been deleted", note: note });// Send this message as a response
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router