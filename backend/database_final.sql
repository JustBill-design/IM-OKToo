-- Drop existing tables and recreate with username as foreign key
DROP TABLE IF EXISTS CommentLikes;
DROP TABLE IF EXISTS PostLikes;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Posts;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Users;

-- Recreate tables with username as primary/foreign key
CREATE TABLE Users (
    username VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(50) UNIQUE NOT NULL,
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
    username VARCHAR(50) NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    views INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES Users (username) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Categories (category_id) ON DELETE CASCADE
);

CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Posts (post_id) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES Users (username) ON DELETE CASCADE
);

CREATE TABLE PostLikes (
    post_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, username),
    FOREIGN KEY (post_id) REFERENCES Posts (post_id) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES Users (username) ON DELETE CASCADE
);

CREATE TABLE CommentLikes (
    comment_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id, username),
    FOREIGN KEY (comment_id) REFERENCES Comments (comment_id) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES Users (username) ON DELETE CASCADE
);

-- Populate with username-based data
SET FOREIGN_KEY_CHECKS = 0;

-- Users (username is now the primary key)
INSERT INTO Users (username, first_name, email, password_hash, created_at, last_login, is_admin) VALUES
('nurse_sarah', 'Sarah', 'sarah.nurse@healthcare.com', 'hashed_password_123', '2024-01-15 10:30:00', '2024-07-20 14:25:00', FALSE),
('dr_johnson', 'Michael', 'dr.johnson@clinic.com', 'admin_hash_456', '2024-01-10 09:15:00', '2024-07-23 08:45:00', TRUE),
('caregiver_lisa', 'Lisa', 'lisa.caregiver@gmail.com', 'secure_hash_789', '2024-02-03 16:20:00', '2024-07-22 11:30:00', FALSE),
('family_david', 'David', 'david.family@outlook.com', 'password_hash_abc', '2024-02-18 13:45:00', '2024-07-21 16:10:00', FALSE),
('therapist_emma', 'Emma', 'emma.therapy@rehab.com', 'therapy_hash_def', '2024-01-05 08:00:00', '2024-07-23 07:20:00', FALSE),
('homecare_alex', 'Alex', 'alex.homecare@services.com', 'homecare_hash_ghi', '2024-03-01 11:15:00', '2024-07-19 13:55:00', FALSE),
('volunteer_maria', 'Maria', 'maria.volunteer@community.org', 'volunteer_hash_jkl', '2024-03-12 14:30:00', '2024-07-22 09:40:00', FALSE),
('nurse_tom', 'Thomas', 'tom.nurse@hospital.com', 'nurse_hash_mno', '2024-07-01 10:00:00', '2024-07-23 12:15:00', FALSE);

-- Categories
INSERT INTO Categories (name) VALUES
('Daily Care Tips'),
('Medication Management'),
('Mental Health Support'),
('Physical Therapy'),
('Nutrition Planning'),
('Safety Equipment'),
('Legal Advice'),
('Respite Care'),
('Dementia Care'),
('Mobility Help');

-- Posts (now uses username instead of user_id)
INSERT INTO Posts (username, category_id, title, content, views, likes_count, comments_count, created_at, updated_at) VALUES
('nurse_sarah', 1, 'Morning Care Routine Tips', 'Simple morning routine that helps elderly patients start their day safely and comfortably.', 245, 18, 7, '2024-06-15 14:30:00', '2024-06-15 14:30:00'),
('dr_johnson', 2, 'Medication Organization Systems', 'Effective ways to organize daily medications to prevent errors and missed doses.', 567, 42, 18, '2024-07-01 16:45:00', '2024-07-02 11:20:00'),
('caregiver_lisa', 3, 'Dealing with Caregiver Stress', 'Personal experience with burnout and recovery strategies that actually work.', 892, 67, 24, '2024-06-28 19:20:00', '2024-06-29 14:30:00'),
('family_david', 4, 'Safe Exercises for Seniors', 'Gentle exercises that can be done at home to maintain strength and mobility.', 445, 35, 15, '2024-07-10 11:30:00', '2024-07-11 16:45:00'),
('therapist_emma', 5, 'Healthy Meal Planning', 'Weekly meal plans designed for seniors with dietary restrictions.', 678, 51, 19, '2024-07-05 07:15:00', '2024-07-06 12:30:00'),
('homecare_alex', 6, 'Home Safety Checklist', 'Essential modifications to prevent falls and accidents at home.', 756, 63, 22, '2024-06-20 13:45:00', '2024-06-21 18:20:00');

-- Comments (now uses username instead of user_id)
INSERT INTO Comments (post_id, username, content, created_at) VALUES
(1, 'caregiver_lisa', 'This routine works great for our family.', '2024-06-15 15:30:00'),
(1, 'therapist_emma', 'Very helpful medication timing tips.', '2024-06-15 16:45:00'),
(1, 'homecare_alex', 'Could you share more exercise ideas?', '2024-06-16 09:20:00'),
(2, 'nurse_sarah', 'The pill organizer idea is excellent.', '2024-07-01 18:30:00'),
(2, 'family_david', 'Color coding works perfectly for us.', '2024-07-01 20:15:00'),
(2, 'volunteer_maria', 'We use similar systems at our center.', '2024-07-02 09:45:00'),
(3, 'dr_johnson', 'Thank you for sharing your story.', '2024-06-28 20:30:00'),
(3, 'homecare_alex', 'Do you have online support groups?', '2024-06-29 08:20:00'),
(3, 'nurse_tom', 'Your recovery gives me hope.', '2024-06-29 16:45:00'),
(4, 'nurse_sarah', 'These work great in clinical settings.', '2024-07-10 13:45:00'),
(4, 'caregiver_lisa', 'My dad loves these exercises.', '2024-07-10 15:20:00'),
(5, 'dr_johnson', 'Perfect for diabetic patients.', '2024-07-05 19:45:00'),
(5, 'volunteer_maria', 'Solved our meal planning problems.', '2024-07-06 08:15:00'),
(6, 'family_david', 'The safety checklist is comprehensive.', '2024-06-20 16:30:00'),
(6, 'nurse_tom', 'Installing grab bars made a difference.', '2024-06-21 12:45:00');

-- PostLikes (now uses username instead of user_id)
INSERT INTO PostLikes (post_id, username, created_at) VALUES
(1, 'dr_johnson', '2024-06-15 15:00:00'),
(1, 'caregiver_lisa', '2024-06-15 15:35:00'),
(1, 'family_david', '2024-06-15 16:50:00'),
(1, 'therapist_emma', '2024-06-16 08:30:00'),
(2, 'nurse_sarah', '2024-07-01 17:00:00'),
(2, 'caregiver_lisa', '2024-07-01 18:35:00'),
(2, 'family_david', '2024-07-01 19:20:00'),
(2, 'homecare_alex', '2024-07-02 09:15:00'),
(3, 'nurse_sarah', '2024-06-28 20:00:00'),
(3, 'dr_johnson', '2024-06-28 20:35:00'),
(3, 'family_david', '2024-06-29 12:45:00'),
(3, 'therapist_emma', '2024-06-29 14:25:00'),
(4, 'nurse_sarah', '2024-07-10 12:00:00'),
(4, 'dr_johnson', '2024-07-10 13:50:00'),
(4, 'homecare_alex', '2024-07-11 10:35:00'),
(5, 'dr_johnson', '2024-07-05 08:00:00'),
(5, 'caregiver_lisa', '2024-07-05 12:30:00'),
(5, 'volunteer_maria', '2024-07-06 15:45:00'),
(6, 'nurse_sarah', '2024-06-20 14:30:00'),
(6, 'family_david', '2024-06-20 16:45:00'),
(6, 'therapist_emma', '2024-06-21 09:15:00');

-- CommentLikes (now uses username instead of user_id)
INSERT INTO CommentLikes (comment_id, username, created_at) VALUES
(1, 'nurse_sarah', '2024-06-15 15:35:00'),
(1, 'therapist_emma', '2024-06-15 17:20:00'),
(2, 'nurse_sarah', '2024-06-15 17:00:00'),
(2, 'caregiver_lisa', '2024-06-16 08:45:00'),
(3, 'nurse_sarah', '2024-06-16 10:30:00'),
(4, 'dr_johnson', '2024-07-01 19:00:00'),
(4, 'homecare_alex', '2024-07-02 09:30:00'),
(5, 'dr_johnson', '2024-07-01 20:45:00'),
(6, 'dr_johnson', '2024-07-02 12:30:00'),
(7, 'caregiver_lisa', '2024-06-28 21:00:00'),
(7, 'family_david', '2024-06-29 09:15:00'),
(8, 'caregiver_lisa', '2024-06-29 15:30:00'),
(9, 'dr_johnson', '2024-06-29 18:30:00'),
(10, 'family_david', '2024-07-10 14:20:00'),
(11, 'family_david', '2024-07-10 16:30:00'),
(12, 'therapist_emma', '2024-07-05 20:30:00'),
(13, 'therapist_emma', '2024-07-06 10:15:00'),
(14, 'homecare_alex', '2024-06-20 17:45:00'),
(15, 'nurse_sarah', '2024-06-21 13:20:00');

SET FOREIGN_KEY_CHECKS = 1;

-- Verification
SELECT 'Users' as TableName, COUNT(*) as RecordCount FROM Users
UNION ALL
SELECT 'Categories', COUNT(*) FROM Categories
UNION ALL
SELECT 'Posts', COUNT(*) FROM Posts
UNION ALL
SELECT 'Comments', COUNT(*) FROM Comments
UNION ALL
SELECT 'PostLikes', COUNT(*) FROM PostLikes
UNION ALL
SELECT 'CommentLikes', COUNT(*) FROM CommentLikes;

-- Test login credentials:
-- Username: nurse_sarah, Password: hashed_password_123
-- Username: dr_johnson, Password: admin_hash_456
-- Username: caregiver_lisa, Password: secure_hash_789




SELECT POST.post_id, POST.title, POST.content, POST.views, POST.likes_count, POST.comments_count, POST.created_at, u.username, cat.name, coms.comment_id, coms.content, coms.created_at, COMUSER.username
FROM
    POSTS POST
    JOIN USERS u ON POST.username = u.username
    INNER JOIN CATEGORIES cat ON POST.category_id = cat.category_id
    LEFT JOIN POSTLIKES likes ON POST.post_id = likes.post_id
    LEFT JOIN COMMENTS coms ON POST.post_id = coms.post_id
    LEFT JOIN USERS COMUSER ON COMUSER.username = coms.username
ORDER BY POST.created_at DESC;

SELECT 
    POST.post_id, 
    POST.title, 
    POST.content, 
    POST.views, 
    POST.likes_count, 
    POST.comments_count, 
    POST.created_at,
    POST.username AS post_author,
    CAT.name AS category_name
FROM POSTS POST
JOIN USERS U ON POST.username = U.username
JOIN CATEGORIES CAT ON POST.category_id = CAT.category_id
ORDER BY POST.created_at DESC;


select * from posts