const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../mock_data/db.json'); 
const cors = require('cors'); 

const app = express();
const JWT_SECRET = 'your_secret_key'; 

app.use(cors());

app.use(express.json());

app.post('/users', async (req, res) => {
    const { email, password } = req.body;

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: users.length + 1,
        email,
        password: hashedPassword
    };

    users.push(newUser);
    res.json(newUser);
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err || !isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
