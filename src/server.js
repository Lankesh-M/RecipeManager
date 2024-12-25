
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
require('dotenv').config();


// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection
// console.log(process.env.MONGODB_URI);
// console.log(process.env.PORT);
mongoose.connect("mongodb+srv://lankeshmeganathan:5h5NOkoLYS9GT4Ti@cluster0.aelci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{});

const db = mongoose.connection;

// mongodb+srv://lankeshmeganathan:<db_password>@cluster0.aelci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Mongoose Schema & Model
const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: { type: String, required: true },
    instructions: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Recipe = mongoose.model('Recipe', recipeSchema);


// Routes
// Create Recipe
app.post('/api/recipes', async (req, res) => {
    try {
        const recipe = new Recipe(req.body);
        await recipe.save();
        console.log(recipe);
        recipe.createdAt = recipe.createdAt.toDateString();
        res.status(201).json(recipe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Read All Recipes
app.get('/api/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Read Single Recipe
app.get('/api/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Recipe
app.put('/api/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        res.json(recipe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Recipe
app.delete('/api/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        res.json({ message: 'Recipe deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Serve HTML Frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));