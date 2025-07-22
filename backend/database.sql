CREATE DATABASE IMOKTOO;

USE IMOKTOO;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    views INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Categories (category_id) ON DELETE CASCADE
);

CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Posts (post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE
);

CREATE TABLE PostLikes (
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES Posts (post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE
);

CREATE TABLE CommentLikes (
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id, user_id),
    FOREIGN KEY (comment_id) REFERENCES Comments (comment_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE
);

INSERT INTO
    Users (
        username,
        email,
        password_hash,
        is_admin
    )
VALUES (
        'yuchuan',
        'yuchuan@example.com',
        'hashed_pw1',
        FALSE
    ),
    (
        'yeye',
        'yeye@example.com',
        'hashed_pw2',
        FALSE
    ),
    (
        'bill',
        'bill@example.com',
        'hashed_pw3',
        FALSE
    ),
    (
        'dora',
        'dora@example.com',
        'hashed_pw4',
        FALSE
    );

INSERT INTO
    Categories (name)
VALUES ('General'),
    ('Anxiety'),
    ('Depression');

INSERT INTO
    Posts (
        user_id,
        category_id,
        title,
        content,
        views,
        likes_count,
        comments_count
    )
VALUES (
        1,
        1,
        'Feeling cute today might delete later',
        'i am sad',
        999,
        99,
        2
    ),
    (
        2,
        2,
        'ur mom',
        'i just got this i need food',
        250,
        30,
        1
    ),
    (
        2,
        3,
        'im depressed',
        'Today I managed to get out of bed and go school, but I still feel terrible and just want to sleep all day.',
        80000,
        8000,
        0
    );

-- For Post 1
INSERT INTO
    Comments (post_id, user_id, content)
VALUES (1, 3, 'cool!'),
    (1, 2, 'loll');

-- For Post 2
INSERT INTO
    Comments (post_id, user_id, content)
VALUES (2, 4, 'wow!');

SELECT * FROM Posts;

SELECT * FROM Comments;

SELECT * FROM Users;

SELECT POST.post_id, POST.title, POST.content, POST.views, POST.likes_count, POST.comments_count, POST.created_at, 
u.username, cat.name, coms.comment_id, coms.content, coms.created_at, COMUSER.username
FROM
    POSTS POST
    INNER JOIN USERS u ON POST.user_id = u.user_id
    INNER JOIN CATEGORIES cat ON POST.category_id = cat.category_id
    LEFT JOIN POSTLIKES likes ON POST.post_id = likes.post_id
    LEFT JOIN COMMENTS coms ON POST.post_id = coms.post_id
    LEFT JOIN USERS COMUSER ON COMUSER.user_id = coms.user_id
ORDER BY POST.created_at DESC;