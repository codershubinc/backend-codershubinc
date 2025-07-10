console.log("Hello via Bun! test");

import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello from Bun!');
});

// Middleware to handle JSON requests
app.use(express.json());
// Middleware to handle URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Example route
app.get('/api', (req, res) => {
    res.json({ message: 'API is working!' });
});
// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});



