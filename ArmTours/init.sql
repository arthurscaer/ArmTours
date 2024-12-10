CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    vorname VARCHAR(255) NOT NULL,
    nachname VARCHAR(255) NOT NULL,
    birthdate DATE NOT NULL,
    role VARCHAR(50) NOT NULL,
    profileImageUrl LONGTEXT
);

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    province VARCHAR(255),
    church_name VARCHAR(255),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS church_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    province VARCHAR(255) NOT NULL,
    year_built TEXT NULL,
    address VARCHAR(255) NULL,
    surroundings_description TEXT NULL,
    access_info TEXT NULL,
    guided_tours VARCHAR(255) NULL,
    recommended_duration VARCHAR(255) NULL,
    events_and_services TEXT NULL,
    accommodation_and_food TEXT NULL,
    image_data MEDIUMTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    church_name VARCHAR(255),
    username VARCHAR(255),
    architecture_design INT,
    condition_preservation INT,
    atmosphere_spirituality INT,
    accessibility INT,
    visitor_comfort INT,
    cost_value INT,
    personal_experience TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (church_name) REFERENCES church_info(name) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE collections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    collection_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS collection_churches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    collection_id INT NOT NULL,
    church_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
    FOREIGN KEY (church_name) REFERENCES church_info(name) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_reply_id INT,
    comment_id INT NOT NULL,
    username VARCHAR(255),
    reply TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    original_reply_id INT,
    original_comment_text TEXT,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE SET NULL,
    FOREIGN KEY (parent_reply_id) REFERENCES replies(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ratingcomments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment_id INT,
    reply_id INT,
    username VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    target_type ENUM('comment', 'reply') NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (reply_id) REFERENCES replies(id) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);