const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
const cors = require('cors');
app.use(cors());

// Connect to MongoDB
const password = process.env.MONGODB_PASSWORD || '';
const URL = process.env.MONGODB_URL.replace('password', password);

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define Mongoose Schemas
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        maxlength: 25,
        minlength: 10,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('UsertaskManagerAI', userSchema);

// Routes
app.get('/', (req, res) => {
    res.send("This is the home page!");
});

const taskRouter = require("./routes/taskroutes"); 
app.use('/api', taskRouter);

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ name, email, password: hashedPassword });

        // Save the user to the database
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
        console.log("User registered successfully!");
    } catch (error) {
        // Enhanced logging to capture more details
        console.error('Error during registration:', error.message);
        if (error.code === 11000) {
            return res.status(409).json({ error: 'idk error' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Enter details first' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("User logged in!");
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/dashboard', (req, res) => {
    // Handle logic for the /dashboard route
    res.send("This is the dashboard!");
});
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
