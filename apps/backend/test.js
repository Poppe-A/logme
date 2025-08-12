
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'db',        // adapte si besoin (ex: localhost ou nom service docker)
      port: 3306,        // port interne container MySQL
      user: 'logme-user',      // user MySQL
      password: 'password',  // mot de passe
      database: 'logme',      // nom base
    });

    console.log('Connexion réussie à MySQL !');

    // Exemple de requimple
    const [rows] = await connection.execute('SELECT * FROM sport');
    console.log('Date MySQL :', rows);

    await connection.end();
  } catch (err) {
    console.error('Erreur de connexion MySQL :', err);
  }
}

testConnection();
