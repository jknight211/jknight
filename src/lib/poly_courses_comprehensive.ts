// Comprehensive Polytechnic Courses List for Singapore 2025
// Each course includes: code, name, category, polytechnic, and required subjects

export const COMPREHENSIVE_POLY_COURSES = [
  // SINGAPORE POLYTECHNIC (SP) - Approximately 34 courses
  { code: 'S25', name: 'Accountancy', category: 'Business', poly: ['SP'], subjects: ['Principles of Accounts', 'Mathematics', 'English Language'] },
  { code: 'S41', name: 'Banking & Finance', category: 'Business', poly: ['SP'], subjects: ['Principles of Accounts', 'Mathematics', 'English Language'] },
  { code: 'S42', name: 'Business Administration', category: 'Business', poly: ['SP'], subjects: ['Principles of Accounts', 'English Language'] },
  { code: 'S76', name: 'Maritime Business', category: 'Business', poly: ['SP'], subjects: ['English Language', 'Mathematics'] },
  { code: 'S93', name: 'Supply Chain Management', category: 'Business', poly: ['SP'], subjects: ['Mathematics', 'English Language'] },

  { code: 'S66', name: 'Applied Chemistry', category: 'Science', poly: ['SP'], subjects: ['Chemistry', 'Physics', 'Mathematics'] },
  { code: 'S98', name: 'Biomedical Science', category: 'Science', poly: ['SP'], subjects: ['Chemistry', 'Biology', 'Mathematics'] },
  { code: 'S82', name: 'Chemical Engineering', category: 'Engineering', poly: ['SP'], subjects: ['Chemistry', 'Physics', 'Mathematics'] },
  { code: 'S16', name: 'Food Science & Technology', category: 'Science', poly: ['SP'], subjects: ['Chemistry', 'Biology', 'Mathematics'] },
  { code: 'S78', name: 'Optometry', category: 'Healthcare', poly: ['SP'], subjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics'] },
  { code: 'S17', name: 'Perfumery & Cosmetic Science', category: 'Science', poly: ['SP'], subjects: ['Chemistry', 'Biology'] },

  { code: 'S69', name: 'Aerospace Engineering', category: 'Engineering', poly: ['SP'], subjects: ['Physics', 'Mathematics', 'Additional Mathematics'] },
  { code: 'S46', name: 'Aeronautical & Aerospace Technology', category: 'Engineering', poly: ['SP'], subjects: ['Physics', 'Mathematics'] },
  { code: 'S94', name: 'Civil Engineering with Business', category: 'Engineering', poly: ['SP'], subjects: ['Physics', 'Mathematics', 'Additional Mathematics'] },
  { code: 'S43', name: 'Computer Engineering', category: 'IT', poly: ['SP'], subjects: ['Mathematics', 'Physics', 'Computer Applications'] },
  { code: 'S51', name: 'Electrical & Electronic Engineering', category: 'Engineering', poly: ['SP'], subjects: ['Physics', 'Mathematics', 'Additional Mathematics'] },
  { code: 'S86', name: 'Infocomm Security Management', category: 'IT', poly: ['SP'], subjects: ['Mathematics', 'Computer Applications'] },
  { code: 'S44', name: 'Information Technology', category: 'IT', poly: ['SP'], subjects: ['Mathematics', 'Computer Applications'] },
  { code: 'S81', name: 'Mechanical Engineering', category: 'Engineering', poly: ['SP'], subjects: ['Physics', 'Mathematics', 'Design & Technology'] },
  { code: 'S85', name: 'Mechatronics', category: 'Engineering', poly: ['SP'], subjects: ['Physics', 'Mathematics', 'Design & Technology'] },

  { code: 'S80', name: 'Architecture', category: 'Design', poly: ['SP'], subjects: ['Art', 'Mathematics', 'Physics'] },
  { code: 'S74', name: 'Interior Design', category: 'Design', poly: ['SP'], subjects: ['Art', 'Design & Technology'] },
  { code: 'S96', name: 'Experience & Product Design', category: 'Design', poly: ['SP'], subjects: ['Art', 'Design & Technology'] },
  { code: 'S55', name: 'Media, Arts & Design', category: 'Media', poly: ['SP'], subjects: ['English Language', 'Art'] },
  { code: 'S63', name: 'Music & Audio Technology', category: 'Media', poly: ['SP'], subjects: ['Music', 'Physics'] },
  { code: 'S97', name: 'Diploma in Applied AI & Analytics', category: 'IT', poly: ['SP'], subjects: ['Mathematics', 'Additional Mathematics', 'Computer Applications'] },

  // TEMASEK POLYTECHNIC (TP) - Approximately 37 courses
  { code: 'T02', name: 'Accountancy & Finance', category: 'Business', poly: ['TP'], subjects: ['Principles of Accounts', 'Mathematics', 'English Language'] },
  { code: 'T19', name: 'Business', category: 'Business', poly: ['TP'], subjects: ['Principles of Accounts', 'English Language'] },
  { code: 'T75', name: 'Culinary & Catering Management', category: 'Business', poly: ['TP'], subjects: ['English Language', 'Food & Nutrition'] },
  { code: 'T09', name: 'Law & Management', category: 'Business', poly: ['TP'], subjects: ['English Language', 'Literature in English'] },
  { code: 'T38', name: 'Leisure & Resort Management', category: 'Business', poly: ['TP'], subjects: ['English Language', 'Geography'] },
  { code: 'T33', name: 'Marketing', category: 'Business', poly: ['TP'], subjects: ['English Language', 'Principles of Accounts'] },
  { code: 'T28', name: 'Retail Management', category: 'Business', poly: ['TP'], subjects: ['English Language'] },

  { code: 'T03', name: 'Applied Food Science & Nutrition', category: 'Science', poly: ['TP'], subjects: ['Chemistry', 'Biology', 'Food & Nutrition'] },
  { code: 'T04', name: 'Baking & Culinary Science', category: 'Science', poly: ['TP'], subjects: ['Chemistry', 'Biology', 'Food & Nutrition'] },
  { code: 'T61', name: 'Biotechnology', category: 'Science', poly: ['TP'], subjects: ['Chemistry', 'Biology', 'Mathematics'] },
  { code: 'T05', name: 'Chemical Engineering', category: 'Engineering', poly: ['TP'], subjects: ['Chemistry', 'Physics', 'Mathematics'] },
  { code: 'T24', name: 'Consumer Behaviour & Research', category: 'Business', poly: ['TP'], subjects: ['English Language', 'Mathematics'] },
  { code: 'T40', name: 'Pharmaceutical Science', category: 'Science', poly: ['TP'], subjects: ['Chemistry', 'Biology', 'Mathematics'] },
  { code: 'T46', name: 'Veterinary Technology', category: 'Healthcare', poly: ['TP'], subjects: ['Biology', 'Chemistry'] },

  { code: 'T54', name: 'Aerospace Engineering', category: 'Engineering', poly: ['TP'], subjects: ['Physics', 'Mathematics', 'Additional Mathematics'] },
  { code: 'T50', name: 'Aerospace Electronics', category: 'Engineering', poly: ['TP'], subjects: ['Physics', 'Mathematics', 'Additional Mathematics'] },
  { code: 'T30', name: 'Biomedical Engineering', category: 'Engineering', poly: ['TP'], subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics'] },
  { code: 'T34', name: 'Computer Engineering', category: 'IT', poly: ['TP'], subjects: ['Mathematics', 'Physics', 'Computer Applications'] },
  { code: 'T37', name: 'Electronics', category: 'Engineering', poly: ['TP'], subjects: ['Physics', 'Mathematics', 'Additional Mathematics'] },
  { code: 'T06', name: 'Green Building & Sustainability', category: 'Engineering', poly: ['TP'], subjects: ['Physics', 'Chemistry', 'Mathematics'] },
  { code: 'T08', name: 'Information Technology', category: 'IT', poly: ['TP'], subjects: ['Mathematics', 'Computer Applications'] },
  { code: 'T47', name: 'Mechatronics', category: 'Engineering', poly: ['TP'], subjects: ['Physics', 'Mathematics', 'Design & Technology'] },

  { code: 'T10', name: 'Communication Design', category: 'Design', poly: ['TP'], subjects: ['Art', 'English Language'] },
  { code: 'T39', name: 'Environment Design', category: 'Design', poly: ['TP'], subjects: ['Art', 'Design & Technology'] },
  { code: 'T44', name: 'Interior Architecture & Design', category: 'Design', poly: ['TP'], subjects: ['Art', 'Design & Technology'] },
  { code: 'T64', name: 'Moving Images', category: 'Media', poly: ['TP'], subjects: ['English Language', 'Art'] },

  { code: 'T48', name: 'Psychology Studies', category: 'Humanities', poly: ['TP'], subjects: ['English Language'] },
  { code: 'T20', name: 'Early Childhood Development & Education', category: 'Education', poly: ['TP'], subjects: ['English Language'] },

  // NANYANG POLYTECHNIC (NYP) - Approximately 43 courses
  { code: 'N25', name: 'Accountancy & Finance', category: 'Business', poly: ['NYP'], subjects: ['Principles of Accounts', 'Mathematics', 'English Language'] },
  { code: 'N34', name: 'Banking & Finance', category: 'Business', poly: ['NYP'], subjects: ['Principles of Accounts', 'Mathematics', 'English Language'] },
  { code: 'N54', name: 'Business Management', category: 'Business', poly: ['NYP'], subjects: ['Principles of Accounts', 'English Language'] },
  { code: 'N69', name: 'Digital Marketing', category: 'Business', poly: ['NYP'], subjects: ['English Language'] },
  { code: 'N43', name: 'Logistics & Operations Management', category: 'Business', poly: ['NYP'], subjects: ['Mathematics', 'English Language'] },
  { code: 'N28', name: 'Mass Media Management', category: 'Business', poly: ['NYP'], subjects: ['English Language'] },

  { code: 'N23', name: 'Applied Chemistry', category: 'Science', poly: ['NYP'], subjects: ['Chemistry', 'Physics', 'Mathematics'] },
  { code: 'N50', name: 'Chemical & Biomolecular Engineering', category: 'Engineering', poly: ['NYP'], subjects: ['Chemistry', 'Physics', 'Mathematics'] },
  { code: 'N73', name: 'Food Science & Nutrition', category: 'Science', poly: ['NYP'], subjects: ['Chemistry', 'Biology', 'Food & Nutrition'] },
  { code: 'N61', name: 'Molecular Biotechnology', category: 'Science', poly: ['NYP'], subjects: ['Chemistry', 'Biology', 'Mathematics'] },
  { code: 'N38', name: 'Pharmaceutical Science', category: 'Science', poly: ['NYP'], subjects: ['Chemistry', 'Biology', 'Mathematics'] },
  { code: 'N89', name: 'Veterinary Technology', category: 'Healthcare', poly: ['NYP'], subjects: ['Biology', 'Chemistry'] },

  { code: 'N30', name: 'Biomedical Engineering', category: 'Engineering', poly: ['NYP'], subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics'] },
  { code: 'N55', name: 'Business Intelligence & Analytics', category: 'IT', poly: ['NYP'], subjects: ['Mathematics', 'Computer Applications'] },
  { code: 'N35', name: 'Clean Energy', category: 'Engineering', poly: ['NYP'], subjects: ['Physics', 'Chemistry', 'Mathematics'] },
  { code: 'N44', name: 'Computer Engineering', category: 'IT', poly: ['NYP'], subjects: ['Mathematics', 'Physics', 'Computer Applications'] },
  { code: 'N67', name: 'Cybersecurity & Digital Forensics', category: 'IT', poly: ['NYP'], subjects: ['Mathematics', 'Computer Applications'] },
  { code: 'N81', name: 'Data Science & Artificial Intelligence', category: 'IT', poly: ['NYP'], subjects: ['Mathematics', 'Additional Mathematics', 'Computer Applications'] },
  { code: 'N22', name: 'Electrical Engineering with Eco-Design', category: 'Engineering', poly: ['NYP'], subjects: ['Physics', 'Mathematics', 'Additional Mathematics'] },
  { code: 'N24', name: 'Electronics, Computer & Communications Engineering', category: 'Engineering', poly: ['NYP'], subjects: ['Physics', 'Mathematics', 'Additional Mathematics'] },
  { code: 'N66', name: 'Engineering with Business', category: 'Engineering', poly: ['NYP'], subjects: ['Physics', 'Mathematics'] },
  { code: 'N42', name: 'Information Technology', category: 'IT', poly: ['NYP'], subjects: ['Mathematics', 'Computer Applications'] },
  { code: 'N53', name: 'Robotics & Mechatronics', category: 'Engineering', poly: ['NYP'], subjects: ['Physics', 'Mathematics', 'Design & Technology'] },

  { code: 'N77', name: 'Design for User Experience', category: 'Design', poly: ['NYP'], subjects: ['Art', 'Design & Technology'] },
  { code: 'N79', name: 'Digital Animation', category: 'Media', poly: ['NYP'], subjects: ['Art', 'Computer Applications'] },
  { code: 'N87', name: 'Digital Game Art & Design', category: 'Media', poly: ['NYP'], subjects: ['Art', 'Computer Applications'] },
  { code: 'N90', name: 'Immersive Media & Game Development', category: 'IT', poly: ['NYP'], subjects: ['Computer Applications', 'Mathematics'] },
  { code: 'N85', name: 'Visual Communication', category: 'Design', poly: ['NYP'], subjects: ['Art', 'English Language'] },
  { code: 'N39', name: 'Film, Sound & Video', category: 'Media', poly: ['NYP'], subjects: ['English Language', 'Art'] },
  { code: 'N92', name: 'Mass Communication', category: 'Media', poly: ['NYP'], subjects: ['English Language', 'Literature in English'] },

  { code: 'N83', name: 'Nursing', category: 'Healthcare', poly: ['NYP'], subjects: ['Biology', 'Chemistry', 'English Language'] },
  { code: 'N88', name: 'Social Work', category: 'Humanities', poly: ['NYP'], subjects: ['English Language'] },

  // NGEE ANN POLYTECHNIC (NP) - Approximately 39 courses
  { code: 'N45', name: 'Business Studies', category: 'Business', poly: ['NP'], subjects: ['Principles of Accounts', 'English Language'] },
  { code: 'N04', name: 'Accountancy', category: 'Business', poly: ['NP'], subjects: ['Principles of Accounts', 'Mathematics', 'English Language'] },
  { code: 'N44', name: 'Banking & Financial Services', category: 'Business', poly: ['NP'], subjects: ['Principles of Accounts', 'Mathematics', 'English Language'] },
  { code: 'N08', name: 'Mass Communication', category: 'Media', poly: ['NP'], subjects: ['English Language', 'Literature in English'] },
  { code: 'N74', name: 'Tourism & Resort Management', category: 'Business', poly: ['NP'], subjects: ['English Language', 'Geography'] },

  { code: 'N62', name: 'Biomedical Science', category: 'Science', poly: ['NP'], subjects: ['Chemistry', 'Biology', 'Mathematics'] },
  { code: 'N41', name: 'Chemical & Biomolecular Engineering', category: 'Engineering', poly: ['NP'], subjects: ['Chemistry', 'Physics', 'Mathematics'] },
  { code: 'N40', name: 'Food Science & Technology', category: 'Science', poly: ['NP'], subjects: ['Chemistry', 'Biology', 'Food & Nutrition'] },
  { code: 'N37', name: 'Pharmaceutical Science', category: 'Science', poly: ['NP'], subjects: ['Chemistry', 'Biology', 'Mathematics'] },

  { code: 'N10', name: 'Architecture', category: 'Design', poly: ['NP'], subjects: ['Art', 'Mathematics', 'Physics'] },
  { code: 'N49', name: 'Landscape Architecture', category: 'Design', poly: ['NP'], subjects: ['Art', 'Biology', 'Geography'] },
  { code: 'N12', name: 'Biomedical Engineering', category: 'Engineering', poly: ['NP'], subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics'] },
  { code: 'N09', name: 'Civil Engineering', category: 'Engineering', poly: ['NP'], subjects: ['Physics', 'Mathematics', 'Additional Mathematics'] },
  { code: 'N05', name: 'Computer Engineering', category: 'IT', poly: ['NP'], subjects: ['Mathematics', 'Physics', 'Computer Applications'] },
  { code: 'N84', name: 'Cybersecurity & Digital Forensics', category: 'IT', poly: ['NP'], subjects: ['Mathematics', 'Computer Applications'] },
  { code: 'N14', name: 'Electronics, Computer & Communications Engineering', category: 'Engineering', poly: ['NP'], subjects: ['Physics', 'Mathematics', 'Additional Mathematics'] },
  { code: 'N06', name: 'Information Technology', category: 'IT', poly: ['NP'], subjects: ['Mathematics', 'Computer Applications'] },
  { code: 'N07', name: 'Multimedia & Animation', category: 'Media', poly: ['NP'], subjects: ['Art', 'Computer Applications'] },

  { code: 'N63', name: 'Film & Media Studies', category: 'Media', poly: ['NP'], subjects: ['English Language', 'Art'] },
  { code: 'N60', name: 'Digital Visual Effects', category: 'Media', poly: ['NP'], subjects: ['Art', 'Computer Applications'] },

  { code: 'N36', name: 'Health Sciences', category: 'Healthcare', poly: ['NP'], subjects: ['Biology', 'Chemistry', 'English Language'] },
  { code: 'N58', name: 'Nursing', category: 'Healthcare', poly: ['NP'], subjects: ['Biology', 'Chemistry', 'English Language'] },

  // REPUBLIC POLYTECHNIC (RP) - Approximately 36 courses
  { code: 'R02', name: 'Accountancy', category: 'Business', poly: ['RP'], subjects: ['Principles of Accounts', 'Mathematics', 'English Language'] },
  { code: 'R03', name: 'Business Administration', category: 'Business', poly: ['RP'], subjects: ['Principles of Accounts', 'English Language'] },
  { code: 'R30', name: 'Diploma in Customer Experience Management with Business', category: 'Business', poly: ['RP'], subjects: ['English Language'] },
  { code: 'R46', name: 'Supply Chain Management', category: 'Business', poly: ['RP'], subjects: ['Mathematics', 'English Language'] },

  { code: 'R41', name: 'Biomedical Science', category: 'Science', poly: ['RP'], subjects: ['Chemistry', 'Biology', 'Mathematics'] },
  { code: 'R42', name: 'Pharmaceutical Science', category: 'Science', poly: ['RP'], subjects: ['Chemistry', 'Biology', 'Mathematics'] },

  { code: 'R35', name: 'Applied AI & Analytics', category: 'IT', poly: ['RP'], subjects: ['Mathematics', 'Additional Mathematics', 'Computer Applications'] },
  { code: 'R67', name: 'Augmented & Virtual Reality Technology', category: 'IT', poly: ['RP'], subjects: ['Computer Applications', 'Art'] },
  { code: 'R04', name: 'Bioengineering', category: 'Engineering', poly: ['RP'], subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics'] },
  { code: 'R70', name: 'Civil Engineering', category: 'Engineering', poly: ['RP'], subjects: ['Physics', 'Mathematics', 'Additional Mathematics'] },
  { code: 'R43', name: 'Computer Engineering', category: 'IT', poly: ['RP'], subjects: ['Mathematics', 'Physics', 'Computer Applications'] },
  { code: 'R66', name: 'Cybersecurity', category: 'IT', poly: ['RP'], subjects: ['Mathematics', 'Computer Applications'] },
  { code: 'R44', name: 'Electrical & Electronic Engineering', category: 'Engineering', poly: ['RP'], subjects: ['Physics', 'Mathematics', 'Additional Mathematics'] },
  { code: 'R39', name: 'Engineering Systems & Management', category: 'Engineering', poly: ['RP'], subjects: ['Physics', 'Mathematics'] },
  { code: 'R45', name: 'Information Technology', category: 'IT', poly: ['RP'], subjects: ['Mathematics', 'Computer Applications'] },
  { code: 'R51', name: 'Materials Science', category: 'Science', poly: ['RP'], subjects: ['Chemistry', 'Physics', 'Mathematics'] },

  { code: 'R54', name: 'Digital & Precision Engineering', category: 'Engineering', poly: ['RP'], subjects: ['Physics', 'Mathematics', 'Design & Technology'] },
  { code: 'R40', name: 'Game Design', category: 'Media', poly: ['RP'], subjects: ['Computer Applications', 'Art'] },
  { code: 'R56', name: 'Integrated Events & Project Management', category: 'Business', poly: ['RP'], subjects: ['English Language'] },
  { code: 'R25', name: 'Mass Communication', category: 'Media', poly: ['RP'], subjects: ['English Language', 'Literature in English'] },
  { code: 'R26', name: 'Sonic Arts', category: 'Media', poly: ['RP'], subjects: ['Music', 'Physics'] },

  { code: 'R47', name: 'Health Management', category: 'Healthcare', poly: ['RP'], subjects: ['Biology', 'English Language'] },
  { code: 'R55', name: 'Nursing', category: 'Healthcare', poly: ['RP'], subjects: ['Biology', 'Chemistry', 'English Language'] },
  { code: 'R38', name: 'Outdoor & Adventure Learning', category: 'Education', poly: ['RP'], subjects: ['English Language', 'Physical Education'] },
];
