const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Routes (uncomment as you build each module)
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/animals', require('./routes/animalRoutes'));
// app.use('/api/shelters', require('./routes/shelterRoutes'));
// app.use('/api/reports', require('./routes/reportRoutes'));
// app.use('/api/adoptions', require('./routes/adoptionRoutes'));

app.get('/', (req, res) => res.send('Tunisia Pet Rescue API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
