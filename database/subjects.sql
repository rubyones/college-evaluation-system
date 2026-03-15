-- Subjects Table for Curriculum-based Filtering
CREATE TABLE IF NOT EXISTS subjects (
  subject_id VARCHAR(36) PRIMARY KEY,
  subject_name VARCHAR(255) NOT NULL,
  course_program ENUM('BSIT', 'BSEMC') NOT NULL,
  year_level INT NOT NULL,
  semester ENUM('1st Semester', '2nd Semester', 'Summer') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Example Insert
INSERT INTO subjects (subject_id, subject_name, course_program, year_level, semester) VALUES
  (UUID(), 'Introduction to Computing', 'BSIT', 1, '1st Semester'),
  (UUID(), 'Computer Programming 1', 'BSIT', 1, '1st Semester'),
  (UUID(), 'Discrete Mathematics', 'BSIT', 1, '1st Semester'),
  (UUID(), 'Computer Programming 2', 'BSIT', 1, '2nd Semester'),
  (UUID(), 'Human Computer Interaction', 'BSIT', 1, '2nd Semester'),
  (UUID(), 'Data Structures and Algorithms', 'BSIT', 1, '2nd Semester'),
  (UUID(), 'Game Design', 'BSEMC', 2, '1st Semester'),
  (UUID(), '3D Modeling', 'BSEMC', 2, '1st Semester'),
  (UUID(), 'Audio and Video Production', 'BSEMC', 2, '1st Semester');
