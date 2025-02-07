const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connexion à la base de données SQLite
const db = new sqlite3.Database('./db/database.sqlite', (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');
    }
});

// Création de la table utilisateurs si elle n'existe pas
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
)`);

// Route pour obtenir tous les utilisateurs
app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ users: rows });
    });
});

// Route pour ajouter un utilisateur
app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ users: rows });
    });
});

// Route pour modifier un utilisateur
app.put('/users/:id', (req, res) => {
    const { name, email } = req.body;
    const { id } = req.params;
    db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ changes: this.changes });
    });
});

// Route pour supprimer un utilisateur
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ?', id, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ changes: this.changes });
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur backend en écoute sur http://localhost:${port}`);
});