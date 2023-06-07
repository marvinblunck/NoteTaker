const notes = require('express').Router();
const uuid = require('../helpers/uuid');
const { readFromFile,readAndAppend,writeToFile,} = require('../helpers/fsUtils');

// GET Route for retrieving all the tips
notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// DELETE Route for a specific tip
notes.delete('/:id', (req, res) => {
  const id = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all tips except the one with the ID provided in the URL
      const newNotes = json.filter((note) => note.id !== id);

      // Save that array to the filesystem
      writeToFile('./db/db.json', newNotes);

      // Respond to the DELETE request
      res.json(`Item ${id} has been deleted 🗑️`);
    });
});


notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding Note');
  }
});

module.exports = notes;
