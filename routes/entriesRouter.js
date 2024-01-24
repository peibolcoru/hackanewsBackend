const express = require('express');
const entriesRouter = express.Router();

const authUser = require('../middlewares/authUser');
const addEntry = require('../controller/entries/addEntry.js');
const deleteEntry = require('../controller/entries/deleteEntry');
const getAllEntries = require('../controller/entries/getAllEntries');
const viewEntryOneUser = require('../controller/entries/viewEntryOneUser.js');
const updateEntry = require('../controller/entries/updateEntry.js');
const byThemeEntry = require('../controller/entries/byThemeEntry');
const likeEntry = require('../controller/entries/likeEntry');
const getMeEntries = require('../controller/entries/getMeEntries');
const getAllCategories = require('../controller/entries/getAllCategories');
const likeStatusUserEntry = require('../controller/entries/likeStatusUserEntry');

entriesRouter.get('/view/:news_id', viewEntryOneUser);
entriesRouter.post('/', authUser, addEntry);
entriesRouter.delete('/delete/:entryId', authUser, deleteEntry);
entriesRouter.get('/allentries', getAllEntries);
entriesRouter.post('/update/:entryId', authUser, updateEntry);
entriesRouter.get('/themes/:themeId', byThemeEntry);
entriesRouter.post('/like/:entryId', authUser, likeEntry);
entriesRouter.get('/meentries/', authUser, getMeEntries);
entriesRouter.get('/themes', getAllCategories);
entriesRouter.get('/likestatus/:entryId',authUser, likeStatusUserEntry)

module.exports = entriesRouter;
