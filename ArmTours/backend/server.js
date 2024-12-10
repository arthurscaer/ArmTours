require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 
const retry = require('async-retry');
const cache = require('memory-cache');

const app = express();
const secretKey = 'your_secret_key'; 

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

let connection;

async function connectDatabase() {
    await retry(async (bail) => {
        connection = mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '3306',
            user: process.env.DB_USER || 'admin',
            password: process.env.DB_PASSWORD || 'admin',
            database: process.env.DB_NAME || 'my_database'
        });
        await new Promise((resolve, reject) => {
            connection.connect((err) => {
                if (err) {
                    console.error('Fehler beim Verbinden zur Datenbank:', err);
                    return reject(err);
                }
                console.log('Mit der Datenbank verbunden');
                resolve();
            });
        });
    }, {
        retries: 5, 
        factor: 2, 
        minTimeout: 1000, 
        maxTimeout: 5000, 
    });
    connection.on('error', (err) => {
        console.error('Datenbankfehler:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connectDatabase(); 
        } else {
            throw err; 
        }
    });
}

connectDatabase().catch(err => {
    console.error('Fehler beim Verbinden zur Datenbank:', err);
});
const jwtSecret = process.env.ACCESS_TOKEN_SECRET;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        const userRole = req.user.role;
        console.log('Benutzerrolle:', userRole);
        if (!allowedRoles.includes(userRole)) {
            return res.sendStatus(403);
        }
        next();
    };
}

function cacheMiddleware(duration) {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url;
        let cachedBody = cache.get(key);
        if (cachedBody) {
            res.send(cachedBody);
            return;
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                cache.put(key, body, duration * 1000);
                res.sendResponse(body);
            };
            next();
        }
    };
}

app.post('/api/register', (req, res) => {
    const { username, password, vorname, nachname, birthdate } = req.body;
    const role = 'user'; // Standardrolle
    const sql = 'INSERT INTO users (username, password, vorname, nachname, birthdate, role) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [username, password, vorname, nachname, birthdate, role], (error, results) => {
        if (error) {
            console.error('Fehler bei der Registrierung:', error);
            res.status(500).json({ error: 'Registrierung fehlgeschlagen' });
            return;
        }
        res.json({ success: true });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    console.log('SQL-Abfrage:', sql); 
    connection.query(sql, [username, password], (error, results) => {
        if (error) {
            console.error('Fehler beim Einloggen:', error);
            res.status(500).json({ error: 'Login fehlgeschlagen' });
            return;
        }
        console.log('Abfrageergebnisse:', results); 
        if (results.length === 0) {
            res.status(401).json({ error: 'Ungültiger Benutzername oder Passwort' });
            return;
        }
        const user = results[0];
        console.log('Benutzerdaten:', user); 
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey, { expiresIn: '7d' });
        console.log('Token:', token); 
        console.log('Benutzerrolle:', user.role); 
        res.json({
            success: true,
            token,
            username: user.username,
            vorname: user.vorname,
            nachname: user.nachname,
            birthdate: user.birthdate,
            profileImageUrl: user.profileImageUrl,
            role: user.role
        });
    });
});

app.post('/api/updateProfile', authenticateToken, (req, res) => {
    const { username, vorname, nachname, birthdate, profileImageUrl } = req.body;
    const sql = 'UPDATE users SET vorname = ?, nachname = ?, birthdate = ?, profileImageUrl = ? WHERE username = ?';
    connection.query(sql, [vorname, nachname, birthdate, profileImageUrl, username], (error, results) => {
        if (error) {
            console.error('Fehler beim Aktualisieren des Profils:', error);
            res.status(500).json({ error: 'Profilaktualisierung fehlgeschlagen' });
            return;
        }
        res.json({ success: true });
    });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    dest: 'uploads/', 
});

app.post('/api/uploadImage', upload.single('image'), (req, res) => {
    if (!req.file) {
        console.log('Fehler: Kein Bild hochgeladen');
        return res.status(400).json({ error: 'Kein Bild hochgeladen' });
    }

    console.log('Datei empfangen:', req.file);

    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, `uploads/${req.file.originalname}`);

    fs.rename(tempPath, targetPath, err => {
        if (err) {
            console.error('Fehler beim Verschieben der Datei:', err);
            return res.status(500).json({ error: 'Fehler beim Verschieben der Datei' });
        }

        console.log('Datei verschoben nach:', targetPath);

        fs.readFile(targetPath, (err, data) => {
            if (err) {
                console.error('Fehler beim Lesen der Datei:', err);
                return res.status(500).json({ error: 'Fehler beim Lesen der Datei' });
            }

            const imageBase64 = `data:${req.file.mimetype};base64,${data.toString('base64')}`;
            const username = req.body.username;

            console.log('ImageBase64 Länge:', imageBase64.length);
            console.log('Benutzername:', username);

            if (!username) {
                console.log('Fehler: Kein Benutzername übergeben');
                return res.status(400).json({ error: 'Benutzername erforderlich' });
            }

            const sql = 'UPDATE users SET profileImageUrl = ? WHERE username = ?';
            connection.query(sql, [imageBase64, username], (error, results) => {
                if (error) {
                    console.error('Fehler beim Speichern des Bildpfads in der Datenbank:', error);
                    return res.status(500).json({ error: 'Bild konnte nicht gespeichert werden' });
                }

                console.log('Bildpfad erfolgreich in der Datenbank gespeichert:', results);

                fs.unlink(targetPath, err => {
                    if (err) {
                        console.error('Fehler beim Löschen der Datei:', err);
                        return res.status(500).json({ error: 'Fehler beim Löschen der Datei' });
                    }

                    console.log('Datei erfolgreich gelöscht:', targetPath);
                    res.status(200).json({ profileImageUrl: imageBase64 });
                });
            });
        });
    });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/addComment', authenticateToken, (req, res) => {
    const { username, comment, church_name } = req.body;
    const sql = `
      INSERT INTO comments (username, comment, church_name)
      VALUES (?, ?, ?)
    `;
    connection.query(sql, [username, comment, church_name], (error, results) => {
        if (error) {
            console.error('Fehler beim Hinzufügen des Kommentars:', error);
            res.status(500).json({ error: 'Fehler beim Hinzufügen des Kommentars' });
            return;
        }
        console.log('Kommentar erfolgreich hinzugefügt.');
        res.json({ success: true });
    });
});

app.delete('/api/comments/:id', authenticateToken, authorizeRoles('superuser', 'supersuperuser'), (req, res) => {
    const commentId = req.params.id;

    const deleteRepliesSql = `
        WITH RECURSIVE ReplyHierarchy AS (
            SELECT id FROM replies WHERE comment_id = ?
            UNION ALL
            SELECT r.id FROM replies r
            INNER JOIN ReplyHierarchy rh ON r.parent_reply_id = rh.id
        )
        DELETE FROM replies WHERE id IN (SELECT id FROM ReplyHierarchy);
    `;

    connection.query(deleteRepliesSql, [commentId], (error) => {
        if (error) {
            console.error('Fehler beim Löschen der Antworten:', error);
            return res.status(500).json({ error: 'Fehler beim Löschen der Antworten' });
        }

        const deleteCommentSql = 'DELETE FROM comments WHERE id = ?';
        connection.query(deleteCommentSql, [commentId], (err) => {
            if (err) {
                console.error('Fehler beim Löschen des Kommentars:', err);
                return res.status(500).json({ error: 'Fehler beim Löschen des Kommentars' });
            }

            res.status(200).json({ message: 'Kommentar und alle zugehörigen Antworten wurden gelöscht.' });
        });
    });
});

app.delete('/api/replies/:id', authenticateToken, authorizeRoles('superuser', 'supersuperuser'), (req, res) => {
    const replyId = req.params.id;

    const deleteRepliesSql = `
        WITH RECURSIVE ReplyHierarchy AS (
            SELECT id FROM replies WHERE id = ?
            UNION ALL
            SELECT r.id FROM replies r
            INNER JOIN ReplyHierarchy rh ON r.parent_reply_id = rh.id
        )
        DELETE FROM replies WHERE id IN (SELECT id FROM ReplyHierarchy);
    `;

    connection.query(deleteRepliesSql, [replyId], (error) => {
        if (error) {
            console.error('Fehler beim Löschen der verschachtelten Antworten:', error);
            return res.status(500).json({ error: 'Fehler beim Löschen der verschachtelten Antworten' });
        }

        res.status(200).json({ message: 'Antwort und alle zugehörigen verschachtelten Antworten wurden gelöscht.' });
    });
});

app.get('/api/comments/:church_name', (req, res) => {
    const church_name = req.params.church_name;

    const sql = `
        SELECT c.id, c.username, c.comment, c.church_name, c.created_at, u.profileImageUrl AS profileImageUrl
        FROM comments c
        LEFT JOIN users u ON c.username = u.username
        WHERE c.church_name = ?
        ORDER BY c.created_at DESC
    `;
    connection.query(sql, [church_name], (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen der Kommentare:', error);
            res.status(500).json({ error: 'Fehler beim Abrufen der Kommentare' });
            return;
        }
        const formattedResults = results.map(result => ({
            ...result,
            created_at: result.created_at.toISOString(),
        }));
        res.json(formattedResults);
    });
});

app.get('/api/user/comments', (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({ error: 'Benutzername ist erforderlich' });
    }

    const sql = `
        SELECT c.id, c.username, c.comment, c.church_name, c.created_at, u.profileImageUrl AS profileImageUrl
        FROM comments c
        LEFT JOIN users u ON c.username = u.username
        WHERE c.username = ?
        ORDER BY c.created_at DESC
    `;

    connection.query(sql, [username], (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen der Kommentare:', error);
            res.status(500).json({ error: 'Fehler beim Abrufen der Kommentare' });
            return;
        }
        const formattedResults = results.map(result => ({
            ...result,
            created_at: result.created_at.toISOString(),
        }));

        res.json(formattedResults);
    });
});

app.get('/api/users', authenticateToken, authorizeRoles('supersuperuser'), (req, res) => {
    console.log('Anfrage zur Benutzerliste erhalten');
    const sql = 'SELECT username, role FROM users';
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen der Benutzerliste:', error);
            res.status(500).json({ error: 'Fehler beim Abrufen der Benutzerliste' });
            return;
        }
        console.log('Benutzerliste erfolgreich abgerufen:', results);
        res.json(results);
    });
});

app.get('/api/adminPanel', authenticateToken, authorizeRoles('supersuperuser'), (req, res) => {
    res.json({ message: 'Willkommen im Admin Panel' });
});

app.post('/api/protectedRoute', authenticateToken, authorizeRoles('superuser', 'supersuperuser'), (req, res) => {
    res.json({ message: 'Willkommen, Superuser!' });
});

app.post('/api/assignRole', authenticateToken, authorizeRoles('supersuperuser'), (req, res) => {
    const { username, role } = req.body;
    const sql = 'UPDATE users SET role = ? WHERE username = ?';
    connection.query(sql, [role, username], (error, results) => {
        if (error) {
            console.error('Fehler beim Zuweisen der Rolle:', error);
            res.status(500).json({ error: 'Fehler beim Zuweisen der Rolle' });
            return;
        }
        res.json({ success: true });
    });
});

app.delete('/api/users/:username', (req, res) => {
    try {
        const { username } = req.params;

        const sql = 'DELETE FROM users WHERE username = ?';
        connection.query(sql, [username], (error, results) => {
            if (error) {
                console.error('Fehler beim Löschen des Benutzers:', error);
                res.status(500).send('Interner Serverfehler');
                return;
            }
            res.status(200).send('Benutzer erfolgreich gelöscht');
        });
    } catch (error) {
        console.error('Fehler beim Löschen des Benutzers:', error);
        res.status(500).send('Interner Serverfehler');
    }
});

app.get('/api/kirche/:province', (req, res) => {
    const province = req.params.province;
    const query = 'SELECT * FROM church_info WHERE province = ?';
    connection.query(query, [province], (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen der Kirchendaten:', error);
            res.status(500).json({ error: 'Fehler beim Abrufen der Kirchendaten' });
            return;
        }
        const churchData = results.map(church => {
            if (church.image_data) {
                church.image_data = `data:image/jpeg;base64,${church.image_data}`;
            }
            return church;
        });
        res.json(churchData);
    });
});

app.get('/api/kirche/:province/:id?', (req, res) => {
    const province = req.params.province;
    const churchId = req.params.id;
    let query = 'SELECT * FROM church_info WHERE province = ?';
    let queryParams = [province];

    if (churchId) {
        query += ' AND id = ?';
        queryParams.push(churchId);
    }

    console.log('SQL Query:', query); 
    console.log('Query Parameters:', queryParams); 

    connection.query(query, queryParams, (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen der Kirchendaten:', error);
            res.status(500).json({ error: 'Fehler beim Abrufen der Kirchendaten' });
            return;
        }

        console.log('Query Results:', results); 

        const churchData = results.map(church => {
            if (church.image_data) {
                church.image_data = `data:image/jpeg;base64,${church.image_data}`;
            }
            return church;
        });
        res.json(churchData);
    });
});

app.get('/api/random-church', (req, res) => {
    const query = 'SELECT * FROM church_info ORDER BY RAND() LIMIT 1';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen der Kirchendaten:', error);
            res.status(500).json({ error: 'Fehler beim Abrufen der Kirchendaten' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Keine Kirche gefunden' });
            return;
        }
        const churchData = results[0];
        if (churchData && churchData.image_data) {
            churchData.image_data = `data:image/jpeg;base64,${churchData.image_data}`;
        }
        if (!churchData.name) {
            churchData.name = 'Unbekannte Kirche';
        }
        res.json(churchData);
    });
});

app.get('/api/random-churches', cacheMiddleware(6000), (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    const query = `
      SELECT name, image_data, year_built, province
      FROM church_info
      ORDER BY RAND()
      LIMIT ?
    `;
    connection.query(query, [limit], (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen der zufälligen Kirchen:', error);
            res.status(500).json({ error: 'Fehler beim Abrufen der Kirchen' });
            return;
        }
        const churches = results.map(church => {
            if (church.image_data) {
                church.image_data = `data:image/jpeg;base64,${church.image_data}`;
            }
            if (!church.name) {
                church.name = 'Unbekannte Kirche';
            }
            return church;
        });
        res.json(churches);
    });
});

app.post('/api/upload/image', authenticateToken, upload.single('image'), authorizeRoles('superuser', 'supersuperuser'), (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, `uploads/${req.file.originalname}`);

    fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        fs.readFile(targetPath, (err, data) => {
            if (err) return handleError(err, res);

            const imageBase64 = data.toString('base64');
            const name = req.body.name;

            if (!name) {
                return res.status(400).json({ error: 'Name is required' });
            }

            const query = 'INSERT INTO church_info (name, image_data) VALUES (?, ?) ON DUPLICATE KEY UPDATE image_data = VALUES(image_data)';
            connection.query(query, [name, imageBase64], (error, results) => {
                if (error) {
                    console.error('Fehler beim Speichern des Bildes:', error);
                    res.status(500).json({ error: 'Fehler beim Speichern des Bildes' });
                    return;
                }

                fs.unlink(targetPath, err => {
                    if (err) return handleError(err, res);

                    res.status(200).json({ message: 'Bild erfolgreich hochgeladen und gespeichert' });
                });
            });
        });
    });
});

app.post('/api/churches', authenticateToken, authorizeRoles('superuser', 'supersuperuser'), upload.single('image'), (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, `uploads/${req.file.filename}`);
    const {
        name,
        description,
        province,
        year_built,
        address,
        surroundings_description,
        access_info,
        guided_tours,
        recommended_duration,
        events_and_services,
        accommodation_and_food
    } = req.body;

    if (!name || !description || !province) {
        return res.status(400).json({ error: 'Name, Beschreibung und Provinz sind erforderlich' });
    }

    fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        fs.readFile(targetPath, (err, data) => {
            if (err) return handleError(err, res);

            const imageBase64 = data.toString('base64');

            const query = `
                INSERT INTO church_info (
                    name, description, image_data, province,
                    year_built, address,
                     surroundings_description, access_info,
                    guided_tours,
                    recommended_duration, events_and_services, accommodation_and_food
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    description = VALUES(description),
                    image_data = VALUES(image_data),
                    province = VALUES(province),
                    year_built = VALUES(year_built),
                    address = VALUES(address),
                    surroundings_description = VALUES(surroundings_description),
                    access_info = VALUES(access_info),
                    guided_tours = VALUES(guided_tours),
                    recommended_duration = VALUES(recommended_duration),
                    events_and_services = VALUES(events_and_services),
                    accommodation_and_food = VALUES(accommodation_and_food)
            `;

            connection.query(query, [
                name, description, imageBase64, province,
                year_built, address,
                surroundings_description, access_info,
                guided_tours,
                recommended_duration, events_and_services, accommodation_and_food
            ], (error, results) => {
                if (error) {
                    console.error('Fehler beim Speichern der Kirche:', error);
                    res.status(500).json({ error: 'Fehler beim Speichern der Kirche' });
                    return;
                }

                fs.unlink(targetPath, err => {
                    if (err) return handleError(err, res);

                    res.status(200).json({ message: 'Kirche erfolgreich hinzugefügt und gespeichert' });
                });
            });
        });
    });
});

app.get('/api/additional-churches/:province', (req, res) => {
    const province = req.params.province;
    const query = `
        SELECT id, name, description, image_data, year_built, address, 
               surroundings_description, access_info, guided_tours, 
               recommended_duration, events_and_services, accommodation_and_food
        FROM church_info 
        WHERE province = ? AND id NOT IN 
            (SELECT MIN(id) FROM church_info WHERE province = ?)
    `;

    connection.query(query, [province, province], (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen der zusätzlichen Kirchendaten:', error);
            res.status(500).json({ error: 'Fehler beim Abrufen der zusätzlichen Kirchendaten' });
            return;
        }

        const additionalChurchesData = results.map(church => ({
            id: church.id,
            name: church.name,
            description: church.description,
            image_data: `data:image/jpeg;base64,${church.image_data}`,
            year_built: church.year_built,
            address: church.address,
            surroundings_description: church.surroundings_description,
            access_info: church.access_info,
            guided_tours: church.guided_tours,
            recommended_duration: church.recommended_duration,
            events_and_services: church.events_and_services,
            accommodation_and_food: church.accommodation_and_food
        }));

        res.json(additionalChurchesData);
    });
});

app.delete('/api/churches/:churchName', authenticateToken, authorizeRoles('superuser', 'supersuperuser'), (req, res) => {
    const churchName = req.params.churchName;

    const sqlDelete = 'DELETE FROM church_info WHERE name = ?';
    connection.query(sqlDelete, [churchName], (deleteError, deleteResults) => {
        if (deleteError) {
            console.error('Database deletion error:', deleteError);
            return res.status(500).json({ error: 'Error deleting church from database' });
        }

        if (deleteResults.affectedRows === 0) {
            console.error('No church found with the provided name');
            return res.status(404).json({ error: 'No church found with the provided name' });
        }

        console.log('Church deleted successfully from the database');
        res.json({ success: true });
    });
});

app.post('/api/upload/church', authenticateToken, authorizeRoles('superuser', 'supersuperuser'), upload.single('image'), (req, res) => {
    const tempPath = req.file ? req.file.path : null;
    const targetPath = tempPath ? path.join(__dirname, `uploads/${req.file.filename}`) : null;
    const {
        name,
        description,
        province,
        year_built,
        address,
        surroundings_description,
        access_info,
        guided_tours,
        recommended_duration,
        events_and_services,
        accommodation_and_food
    } = req.body;

    if (!name || !province) {
        return res.status(400).json({ error: 'Name und Provinz sind erforderlich' });
    }

    let imageBase64 = null;
    if (tempPath) {
        fs.rename(tempPath, targetPath, err => {
            if (err) return handleError(err, res);

            fs.readFile(targetPath, (err, data) => {
                if (err) return handleError(err, res);

                imageBase64 = data.toString('base64');
                processUpdate();
            });
        });
    } else {
        processUpdate();
    }

    function processUpdate() {
        const query = `
            INSERT INTO church_info (
                name, description, image_data, province,
                year_built, address,
                surroundings_description, access_info,
                guided_tours, recommended_duration,
                events_and_services, accommodation_and_food
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                description = VALUES(description),
                image_data = COALESCE(VALUES(image_data), image_data),
                province = VALUES(province),
                year_built = VALUES(year_built),
                address = VALUES(address),
                surroundings_description = VALUES(surroundings_description),
                access_info = VALUES(access_info),
                guided_tours = VALUES(guided_tours),
                recommended_duration = VALUES(recommended_duration),
                events_and_services = VALUES(events_and_services),
                accommodation_and_food = VALUES(accommodation_and_food)
        `;

        connection.query(query, [
            name, description, imageBase64, province,
            year_built, address,
            surroundings_description, access_info,
            guided_tours, recommended_duration,
            events_and_services, accommodation_and_food
        ], (error, results) => {
            if (error) {
                console.error('Fehler beim Speichern der Kirche:', error);
                res.status(500).json({ error: 'Fehler beim Speichern der Kirche' });
                return;
            }

            if (targetPath) {
                fs.unlink(targetPath, err => {
                    if (err) return handleError(err, res);
                });
            }

            res.status(200).json({ message: 'Kirche erfolgreich hinzugefügt oder aktualisiert' });
        });
    }
});

app.delete('/api/deleteImage', authenticateToken, authorizeRoles('superuser', 'supersuperuser'), (req, res) => {
    const sqlSelect = 'SELECT name, image_data FROM church_info'; 

    connection.query(sqlSelect, (error, results) => {
        if (error) {
            console.error('Database selection error:', error);
            return res.status(500).json({ error: 'Error selecting last uploaded image data' });
        }

        if (results.length === 0 || !results[0].image_data) {
            console.error('No image data found');
            return res.status(404).json({ error: 'No image data found in database' });
        }

        const { name, image_data: imagePath } = results[0];
        console.log('Deleting image for church name:', name);

        fs.unlink(path.join(__dirname, 'uploads', imagePath), (unlinkError) => {
            if (unlinkError) {
                console.error('Error deleting image file:', unlinkError);
                return res.status(500).json({ error: 'Error deleting image file' });
            }

            console.log('Image file deleted successfully');

            const sqlUpdate = 'UPDATE church_info SET image_data = NULL WHERE name = ?';
            connection.query(sqlUpdate, [name], (updateError) => {
                if (updateError) {
                    console.error('Database update error:', updateError);
                    return res.status(500).json({ error: 'Error updating image data' });
                }

                console.log('Image data updated successfully in the database');

                res.json({ success: true });
            });
        });
    });
});

app.post('/api/rateChurch', authenticateToken, (req, res) => {
    const {
        church_name,
        username,
        architecture_design,
        condition_preservation,
        atmosphere_spirituality,
        accessibility,
        visitor_comfort,
        cost_value,
        personal_experience
    } = req.body;

    const sql = `
      INSERT INTO ratings (
        church_name, username, architecture_design, condition_preservation, 
        atmosphere_spirituality, accessibility, visitor_comfort, cost_value, personal_experience
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(sql, [
        church_name, username, architecture_design, condition_preservation,
        atmosphere_spirituality, accessibility, visitor_comfort, cost_value, personal_experience
    ], (error, results) => {
        if (error) {
            console.error('Fehler beim Hinzufügen der Bewertung:', error);
            res.status(500).json({ error: 'Fehler beim Hinzufügen der Bewertung' });
            return;
        }
        res.json({ success: true });
    });
});

app.get('/api/ratings/:church_name', (req, res) => {
    const church_name = req.params.church_name;
    console.log('Empfangener Kirchenname:', church_name); 
    const sql = `
        SELECT id, church_name, username, architecture_design, condition_preservation, 
            atmosphere_spirituality, accessibility, visitor_comfort, cost_value, personal_experience, created_at
        FROM ratings 
        WHERE church_name = ? 
        ORDER BY created_at DESC
    `;
    connection.query(sql, [church_name], (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen der Bewertungen:', error);
            res.status(500).json({ error: 'Fehler beim Abrufen der Bewertungen' });
            return;
        }
        console.log('Empfangene Bewertungen:', results);
        const formattedResults = results.map(result => ({
            ...result,
            created_at: result.created_at.toISOString(), 
        }));
        res.json(formattedResults);
    });
});

app.delete('/api/ratings/:id', authenticateToken, authorizeRoles('superuser', 'supersuperuser'), (req, res) => {
    const ratingId = req.params.id;

    const deleteRatingSql = 'DELETE FROM ratings WHERE id = ?';

    connection.query(deleteRatingSql, [ratingId], (error) => {
        if (error) {
            console.error('Fehler beim Löschen der Bewertung:', error);
            return res.status(500).json({ error: 'Fehler beim Löschen der Bewertung' });
        }

        res.status(200).json({ message: 'Bewertung wurde gelöscht.' });
    });
});

app.post('/api/addToCollection', authenticateToken, (req, res) => {
    const { username } = req.user; 
    const { churchName, collectionId } = req.body; 

    if (!collectionId) {
        return res.status(400).json({ error: 'ID der Sammlung ist erforderlich' });
    }
    if (!churchName) {
        return res.status(400).json({ error: 'Name der Kirche ist erforderlich' });
    }

    const checkSql = 'SELECT * FROM collection_churches WHERE church_name = ? AND collection_id = ?';
    connection.query(checkSql, [churchName, collectionId], (checkError, checkResults) => {
        if (checkError) {
            console.error('Fehler beim Überprüfen der Kirche:', checkError);
            return res.status(500).json({ error: 'Fehler beim Überprüfen der Kirche' });
        }

        if (checkResults.length > 0) {
            return res.status(400).json({ error: 'Der Ort existiert bereits in dieser Sammlung.' });
        }

        const insertSql = 'INSERT INTO collection_churches (collection_id, church_name) VALUES (?, ?)';
        connection.query(insertSql, [collectionId, churchName], (insertError, insertResults) => {
            if (insertError) {
                console.error('Fehler beim Hinzufügen zur Sammlung:', insertError);
                return res.status(500).json({ error: 'Fehler beim Hinzufügen zur Sammlung' });
            }
            res.json({ success: true });
        });
    });
});

app.get('/api/myCollections', authenticateToken, (req, res) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Nicht autorisiert' });
    }

    const username = req.user.username;

    const sql = `
        SELECT c.id, c.collection_name, GROUP_CONCAT(cc.church_name) AS church_names
        FROM collections c
        LEFT JOIN collection_churches cc ON c.id = cc.collection_id
        WHERE c.username = ?
        GROUP BY c.id
    `;
    connection.query(sql, [username], (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen der Sammlungen:', error);
            return res.status(500).json({ error: 'Fehler beim Abrufen der Sammlungen' });
        }
        res.json(results);
    });
});

app.delete('/api/collections/:id', authenticateToken, (req, res) => {
    const username = req.user && req.user.username;  
    const collectionId = req.params.id;

    if (!username) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!collectionId) {
        return res.status(400).json({ error: 'Ungültige Sammlungs-ID' });
    }

    const sql = 'DELETE FROM collections WHERE id = ? AND username = ?';
    connection.query(sql, [collectionId, username], (error, results) => {
        if (error) {
            console.error('Fehler beim Löschen der Sammlung:', error);
            return res.status(500).json({ error: 'Fehler beim Löschen der Sammlung' });
        }
        res.json({ success: true });
    });
});

app.post('/api/createCollection', authenticateToken, (req, res) => {
    const { username } = req.body; 
    const { name } = req.body;

    console.log('Benutzerrolle:', req.user.role);
    console.log('Benutzerinformationen:', req.user);
    console.log('Gesendete Daten:', req.body);

    if (!username) {
        return res.status(400).json({ error: 'Benutzername ist erforderlich' });
    }

    if (!name) {
        return res.status(400).json({ error: 'Name der Sammlung ist erforderlich' });
    }

    const sql = 'INSERT INTO collections (username, collection_name) VALUES (?, ?)';
    connection.query(sql, [username, name], (error, results) => {
        if (error) {
            console.error('Fehler beim Erstellen der Sammlung:', error);
            return res.status(500).json({ error: 'Fehler beim Erstellen der Sammlung' });
        }

        const collectionId = results.insertId;

        const fetchCollectionSql = 'SELECT * FROM collections WHERE id = ?';
        connection.query(fetchCollectionSql, [collectionId], (fetchError, fetchResults) => {
            if (fetchError) {
                console.error('Fehler beim Abrufen der erstellten Sammlung:', fetchError);
                return res.status(500).json({ error: 'Fehler beim Abrufen der erstellten Sammlung' });
            }
            const createdCollection = fetchResults[0];
            res.json(createdCollection);
        });
    });
});

app.post('/api/addToCollection/:collectionId', authenticateToken, (req, res) => {
    const userId = req.user && req.user.id; 
    const collectionId = req.params.collectionId;
    const { churchName } = req.body;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!collectionId) {
        return res.status(400).json({ error: 'Ungültige Sammlungs-ID' });
    }
    if (!churchName) {
        return res.status(400).json({ error: 'Name der Kirche ist erforderlich' });
    }
    const checkOwnershipQuery = 'SELECT * FROM collections WHERE id = ? AND username = ?';
    connection.query(checkOwnershipQuery, [collectionId, userId], (checkError, checkResults) => {
        if (checkError) {
            console.error('Fehler beim Überprüfen der Sammlungszugehörigkeit:', checkError);
            return res.status(500).json({ error: 'Fehler beim Überprüfen der Sammlungszugehörigkeit' });
        }

        if (checkResults.length === 0) {
            return res.status(403).json({ error: 'Sie haben keine Berechtigung, dieser Sammlung etwas hinzuzufügen' });
        }
        const addToCollectionQuery = 'UPDATE collections SET church_name = ? WHERE id = ?';
        connection.query(addToCollectionQuery, [churchName, collectionId], (addError, addResults) => {
            if (addError) {
                console.error('Fehler beim Hinzufügen zur Sammlung:', addError);
                return res.status(500).json({ error: 'Fehler beim Hinzufügen zur Sammlung' });
            }

            res.json({ success: true });
        });
    });
});

app.get('/api/churchToProvince/:churchName', (req, res) => {
    const churchName = req.params.churchName;
    if (!churchName) {
        return res.status(400).json({ error: 'Kirchenname ist erforderlich' });
    }

    const query = 'SELECT province FROM church_info WHERE name = ?';
    connection.query(query, [churchName], (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen der Provinz:', error);
            res.status(500).json({ error: 'Fehler beim Abrufen der Provinz' });
            return;
        }
        if (results.length > 0) {
            res.json({ province: results[0].province });
        } else {
            res.status(404).json({ error: 'Kirche nicht gefunden' });
        }
    });
});

app.post('/api/comments/:id/replies', authenticateToken, (req, res) => {
    const commentId = req.params.id;
    const { reply, parent_reply_id } = req.body;
    const username = req.user.username;

    if (!reply) {
        return res.status(400).json({ error: 'Antwort ist erforderlich' });
    }

    const getOriginalTextSql = parent_reply_id
        ? 'SELECT reply AS original_comment_text FROM replies WHERE id = ?'
        : 'SELECT comment AS original_comment_text FROM comments WHERE id = ?';

    connection.query(getOriginalTextSql, [parent_reply_id || commentId], (err, results) => {
        if (err) {
            console.error('Fehler beim Abrufen des Originaltexts:', err);
            return res.status(500).json({ error: 'Fehler beim Abrufen des Originaltexts' });
        }

        const original_comment_text = results[0]?.original_comment_text || 'Kein Originaltext verfügbar';

        const insertReplySql = 'INSERT INTO replies (comment_id, username, reply, parent_reply_id, original_comment_text) VALUES (?, ?, ?, ?, ?)';
        connection.query(insertReplySql, [commentId, username, reply, parent_reply_id || null, original_comment_text], (error, results) => {
            if (error) {
                console.error('Fehler beim Hinzufügen der Antwort:', error);
                return res.status(500).json({ error: 'Fehler beim Hinzufügen der Antwort' });
            }

            const newReply = {
                id: results.insertId,
                comment_id: commentId,
                username: username,
                reply: reply,
                original_comment_text: original_comment_text,
                created_at: new Date().toISOString()
            };

            res.status(201).json(newReply);
        });
    });
});

app.post('/api/replies/:id/replies', authenticateToken, (req, res) => {
    const parentReplyId = req.params.id;
    const { reply, comment_id } = req.body;
    const username = req.user.username;

    if (!reply || !comment_id) {
        return res.status(400).json({ error: 'Antwort und comment_id sind erforderlich' });
    }

    const getOriginalTextQuery = `
        WITH RECURSIVE ReplyHierarchy AS (
            SELECT id, reply AS original_comment_text
            FROM replies
            WHERE id = ?
            UNION ALL
            SELECT r.id, rh.original_comment_text
            FROM replies r
            INNER JOIN ReplyHierarchy rh ON r.parent_reply_id = rh.id
        )
        SELECT original_comment_text
        FROM ReplyHierarchy
        ORDER BY id DESC
        LIMIT 1
    `;

    connection.query(getOriginalTextQuery, [parentReplyId], (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen des Originaltexts:', error);
            return res.status(500).json({ error: 'Fehler beim Abrufen des Originaltexts' });
        }

        const original_comment_text = results[0]?.original_comment_text || '';
        const insertReplyQuery = 'INSERT INTO replies (parent_reply_id, comment_id, username, reply, original_comment_text) VALUES (?, ?, ?, ?, ?)';
        connection.query(insertReplyQuery, [parentReplyId, comment_id, username, reply, original_comment_text], (error, results) => {
            if (error) {
                console.error('Fehler beim Hinzufügen der Antwort auf eine Antwort:', error);
                return res.status(500).json({ error: 'Fehler beim Hinzufügen der Antwort auf eine Antwort' });
            }

            const newReply = {
                id: results.insertId,
                parent_reply_id: parentReplyId,
                comment_id: comment_id,
                username: username,
                reply: reply,
                original_comment_text: original_comment_text,
                created_at: new Date().toISOString()
            };

            res.status(201).json(newReply);
        });
    });
});

app.get('/api/comments/:id/replies', (req, res) => {
    const commentId = req.params.id;

    const sql = `
      SELECT r.id, r.reply, r.username, r.created_at, r.original_comment_text, u.profileImageUrl
      FROM replies r
      LEFT JOIN users u ON r.username = u.username
      WHERE r.comment_id = ?
      ORDER BY r.created_at ASC
    `;

    connection.query(sql, [commentId], (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen der Antworten:', error);
            return res.status(500).json({ error: 'Fehler beim Abrufen der Antworten' });
        }

        const formattedResults = results.map(result => ({
            ...result,
            created_at: new Date(result.created_at).toISOString(),
        }));

        res.json(formattedResults);
    });
});

app.get('/api/replies/:id/replies', (req, res) => {
    const parentReplyId = req.params.id;

    const sql = `
        WITH RECURSIVE ReplyHierarchy AS (
            SELECT id, reply, username, created_at, parent_reply_id, original_comment_text
            FROM replies
            WHERE id = ?
            UNION ALL
            SELECT r.id, r.reply, r.username, r.created_at, r.parent_reply_id, rh.original_comment_text
            FROM replies r
            INNER JOIN ReplyHierarchy rh ON r.parent_reply_id = rh.id
        )
        SELECT r.id, r.reply, r.username, r.created_at, r.original_comment_text, u.profileImageUrl
        FROM ReplyHierarchy r
        LEFT JOIN users u ON r.username = u.username
        ORDER BY r.created_at ASC
    `;

    connection.query(sql, [parentReplyId], (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen der Antworten:', error);
            return res.status(500).json({ error: 'Fehler beim Abrufen der Antworten' });
        }

        const formattedResults = results.map(result => ({
            id: result.id,
            reply: result.reply,
            username: result.username,
            created_at: new Date(result.created_at).toISOString(),
            original_comment_text: result.original_comment_text || 'Kein Originaltext verfügbar',
            profileImageUrl: result.profileImageUrl
        }));

        res.json(formattedResults);
    });
});

app.post('/api/comments/:id/rate', authenticateToken, (req, res) => {
    const id = req.params.id;
    const { rating, isReply } = req.body; 
    const username = req.user.username;
    const targetType = isReply ? 'reply' : 'comment';
    const column = isReply ? 'reply_id' : 'comment_id';
    const otherColumn = isReply ? 'comment_id' : 'reply_id';

    if (rating !== 1 && rating !== -1) {
        return res.status(400).json({ error: 'Ungültige Bewertung. Nur 1 (Daumen hoch) oder -1 (Daumen runter) sind erlaubt.' });
    }

    const checkExistenceQuery = isReply
        ? 'SELECT * FROM replies WHERE id = ?'
        : 'SELECT * FROM comments WHERE id = ?';

    connection.query(checkExistenceQuery, [id], (error, results) => {
        if (error) {
            console.error('Fehler beim Überprüfen der Existenz:', error);
            return res.status(500).json({ error: 'Fehler beim Überprüfen der Existenz' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: `Der ${targetType} mit der ID ${id} existiert nicht.` });
        }

        const checkRatingQuery = `SELECT * FROM ratingcomments WHERE ${column} = ? AND username = ? AND target_type = ?`;
        connection.query(checkRatingQuery, [id, username, targetType], (error, results) => {
            if (error) {
                console.error('Fehler beim Überprüfen der Bewertung:', error);
                return res.status(500).json({ error: 'Fehler beim Überprüfen der Bewertung' });
            }

            if (results.length > 0) {
                const updateRatingQuery = `UPDATE ratingcomments SET rating = ? WHERE ${column} = ? AND username = ? AND target_type = ?`;
                connection.query(updateRatingQuery, [rating, id, username, targetType], (error) => {
                    if (error) {
                        console.error('Fehler beim Aktualisieren der Bewertung:', error);
                        return res.status(500).json({ error: 'Fehler beim Aktualisieren der Bewertung' });
                    }
                    fetchRatings(id, targetType, res);
                });
            } else {
                const insertRatingQuery = `INSERT INTO ratingcomments (${column}, ${otherColumn}, username, rating, target_type) VALUES (?, NULL, ?, ?, ?)`;
                connection.query(insertRatingQuery, [id, username, rating, targetType], (error) => {
                    if (error) {
                        console.error('Fehler beim Hinzufügen der Bewertung:', error);
                        return res.status(500).json({ error: 'Fehler beim Hinzufügen der Bewertung' });
                    }
                    fetchRatings(id, targetType, res);
                });
            }
        });
    });

    function fetchRatings(id, targetType, res) {
        const sql = `
            SELECT rating, COUNT(*) AS count
            FROM ratingcomments
            WHERE ${targetType}_id = ? AND target_type = ?
            GROUP BY rating
        `;

        connection.query(sql, [id, targetType], (error, results) => {
            if (error) {
                console.error('Fehler beim Abrufen der Bewertungen:', error);
                return res.status(500).json({ error: 'Fehler beim Abrufen der Bewertungen' });
            }

            const ratings = {
                thumbsUp: 0,
                thumbsDown: 0
            };

            results.forEach(result => {
                if (result.rating === 1) {
                    ratings.thumbsUp = result.count;
                } else if (result.rating === -1) {
                    ratings.thumbsDown = result.count;
                }
            });

            res.status(200).json({ ratings });
        });
    }
});

app.get('/api/comments/:id/ratings', (req, res) => {
    const id = req.params.id;
    const isReply = req.query.isReply === 'true'; 
    const targetType = isReply ? 'reply' : 'comment';

    const sql = `
        SELECT rating, COUNT(*) AS count
        FROM ratingcomments
        WHERE ${targetType}_id = ? AND target_type = ?
        GROUP BY rating
    `;

    connection.query(sql, [id, targetType], (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen der Bewertungen:', error);
            return res.status(500).json({ error: 'Fehler beim Abrufen der Bewertungen' });
        }

        const ratings = {
            thumbsUp: 0,
            thumbsDown: 0
        };

        results.forEach(result => {
            if (result.rating === 1) {
                ratings.thumbsUp = result.count;
            } else if (result.rating === -1) {
                ratings.thumbsDown = result.count;
            }
        });

        res.json(ratings);
    });
});

app.get('/api/collection/:id/churches', (req, res) => {
    const collectionId = req.params.id;

    const query = `
        SELECT ci.name, ci.image_data, ci.description, ci.province 
        FROM collections c 
        JOIN collection_churches cc ON c.id = cc.collection_id 
        JOIN church_info ci ON cc.church_name = ci.name 
        WHERE c.id = ?
    `;
    
    connection.query(query, [collectionId], (err, results) => {
        if (err) {
            console.error('Fehler beim Abrufen der Kirchen:', err);
            return res.status(500).json({ error: 'Datenbankfehler' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Keine Orte in dieser Sammlung gefunden' });
        }

        const churches = results.map(result => ({
            name: result.name,
            image_data: result.image_data ? `data:image/jpeg;base64,${result.image_data}` : null, 
            description: result.description,
            province: result.province 
        }));
        
        res.json({ churches });
    });
});

app.delete('/api/collections/:collectionId/churches/:churchName', authenticateToken, (req, res) => {
    const { collectionId, churchName } = req.params;
  
    const sql = `
        DELETE FROM collection_churches
        WHERE collection_id = ? AND church_name = ?
    `;
    
    connection.query(sql, [collectionId, churchName], (error, results) => {
      if (error) {
        console.error('Fehler beim Löschen des Ortes aus der Sammlung:', error);
        return res.status(500).json({ error: 'Fehler beim Löschen des Ortes' });
      }
  
      res.status(204).send();
    });
  });

  app.get('/api/all-churches', (req, res) => {
    const query = 'SELECT * FROM church_info';
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Fehler beim Abrufen der Kirchendaten:', error);
            res.status(500).json({ error: 'Fehler beim Abrufen der Kirchendaten' });
            return;
        }
        
        const churchData = results.map(church => {
            if (church.image_data) {
                church.image_data = `data:image/jpeg;base64,${church.image_data}`;
            }
            return church;
        });

        res.json(churchData);
    });
});


function handleError(err, res) {
    console.error(err);
    res.status(500).json({ error: 'Ein Fehler ist aufgetreten' });
}

app.get('/api/welcome', authenticateToken, (req, res) => {
    res.json({ message: `Willkommen, ${req.user.username}!` });
});

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});