const mysql = require('mysql2/promise');
const sendQuery = require('./connectToDB');

require('dotenv').config();

let pool;
const getConnection = async () => {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            timezone: 'local',
            connectionLimit: 10,
        });
    }
    return await pool.getConnection();
};

async function main () {
    let connection;

    try {
        connection = await getConnection();

        await connection.query('DROP TABLE IF EXISTS likes');
        await connection.query('DROP TABLE IF EXISTS news');
        await connection.query('DROP TABLE IF EXISTS themes');
        await connection.query('DROP TABLE IF EXISTS users');

        await connection.query(`

          CREATE TABLE themes (
            themes_id int NOT NULL AUTO_INCREMENT,
            theme_name varchar(45) NOT NULL,
            PRIMARY KEY (themes_id),
            UNIQUE KEY theme_name_UNIQUE (theme_name)
          ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
`);
        await connection.query(`

          CREATE TABLE users (
            user_id int unsigned NOT NULL AUTO_INCREMENT,
            user_name varchar(45) NOT NULL,
            user_email varchar(100) NOT NULL,
            user_password varchar(200) NOT NULL,
            user_avatar varchar(100) DEFAULT 'null',
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            modified_at datetime DEFAULT NULL,
            biography varchar(100) DEFAULT NULL,
            PRIMARY KEY (user_id),
            UNIQUE KEY user_id_UNIQUE (user_id),
            UNIQUE KEY user_name_UNIQUE (user_name),
            UNIQUE KEY user_email_UNIQUE (user_email)
          ) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;
          `);

        await connection.query(`

          CREATE TABLE news (
            id int unsigned NOT NULL AUTO_INCREMENT,
            new_title varchar(100) NOT NULL,
            new_pic varchar(100) DEFAULT NULL,
            new_entrance varchar(1000) DEFAULT NULL,
            new_text varchar(5000) NOT NULL,
            new_video varchar(100) DEFAULT NULL,
            created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            modified_at datetime DEFAULT NULL,
            new_likes int DEFAULT '0',
            users_user_id int unsigned NOT NULL,
            themes_themes_id int NOT NULL,
            PRIMARY KEY (id,users_user_id,themes_themes_id),
            UNIQUE KEY id_new_UNIQUE (id),
            KEY fk_news_users_idx (users_user_id),
            KEY fk_news_themes1_idx (themes_themes_id),
            CONSTRAINT fk_news_themes1 FOREIGN KEY (themes_themes_id) REFERENCES themes (themes_id),
            CONSTRAINT fk_news_users FOREIGN KEY (users_user_id) REFERENCES users (user_id)
          ) ENGINE=InnoDB AUTO_INCREMENT=385 DEFAULT CHARSET=utf8mb3;
`);

        await connection.query(`
CREATE TABLE likes (
  id INT NOT NULL AUTO_INCREMENT,
  new_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL, 
  PRIMARY KEY (id), 
  KEY fk_new_likes_idx (new_id),
  KEY fk_user_likes_idx (user_id),
  CONSTRAINT fk_new_likes FOREIGN KEY (new_id) REFERENCES news (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_user_likes FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE=InnoDB AUTO_INCREMENT=261 DEFAULT CHARSET=utf8mb3;
`);
    } catch (error) {
        console.log(error);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

main();
