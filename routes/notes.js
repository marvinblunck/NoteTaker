const tips = require('express').Router();
const uuid = require('uuid');
const { readFromFile,readAndAppend,writeToFile,} = require('../helpers/fsUtils');

// GET Route for retrieving all the tips
notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// DELETE Route for a specific tip
tips.delete('/:tip_id', (req, res) => {
  const tipId = req.params.tip_id;
  readFromFile('./db/tips.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all tips except the one with the ID provided in the URL
      const result = json.filter((tip) => tip.tip_id !== tipId);

      // Save that array to the filesystem
      writeToFile('./db/tips.json', result);

      // Respond to the DELETE request
      res.json(`Item ${tipId} has been deleted 🗑️`);
    });
});

// POST Route for a new UX/UI tip
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
