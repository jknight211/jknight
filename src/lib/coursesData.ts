// Import comprehensive courses list with course codes
import { COMPREHENSIVE_POLY_COURSES } from './poly_courses_comprehensive';

export const SECONDARY_SCHOOLS = [
  'Anglo-Chinese School (Independent)',
  'Raffles Institution',
  'Hwa Chong Institution',
  'Dunman High School',
  'Victoria School',
  'Cedar Girls\' Secondary School',
  'Catholic High School',
  'River Valley High School',
  'Nanyang Girls\' High School',
  'Methodist Girls\' School',
  'Raffles Girls\' School',
  'St. Joseph\'s Institution',
  'Singapore Chinese Girls\' School',
  'Chung Cheng High School (Main)',
  'Nan Hua High School',
  'Nan Chiau High School',
  'Maris Stella High School',
  'Anglican High School',
  'CHIJ St. Nicholas Girls\' School',
  'Anderson Serangoon Secondary School',
  'Ang Mo Kio Secondary School',
  'Bedok View Secondary School',
  'Bendemeer Secondary School',
  'Bowen Secondary School',
  'Bukit Merah Secondary School',
  'Bukit Panjang Government High School',
  'Canberra Secondary School',
  'Changkat Changi Secondary School',
  'Clementi Town Secondary School',
  'Commonwealth Secondary School',
  'Compassvale Secondary School',
  'Crescent Girls\' School',
  'Deyi Secondary School',
  'Edgefield Secondary School',
  'Fairfield Methodist School (Secondary)',
  'Fuhua Secondary School',
  'Gan Eng Seng School',
  'Geylang Methodist School (Secondary)',
  'Greendale Secondary School',
  'Hai Sing Catholic School',
  'Holy Innocents\' High School',
  'Hougang Secondary School',
  'Junyuan Secondary School',
  'Jurong Secondary School',
  'Jurongville Secondary School',
  'Kent Ridge Secondary School',
  'Kranji Secondary School',
  'Kuo Chuan Presbyterian Secondary School',
  'Mayflower Secondary School',
  'Meridian Secondary School',
  'Montfort Secondary School',
  'Naval Base Secondary School',
  'New Town Secondary School',
  'Northland Secondary School',
  'Outram Secondary School',
  'Pasir Ris Secondary School',
  'Paya Lebar Methodist Girls\' School (Secondary)',
  'Pei Hwa Secondary School',
  'Peicai Secondary School',
  'Peirce Secondary School',
  'Presbyterian High School',
  'Punggol Secondary School',
  'Queenstown Secondary School',
  'Riverside Secondary School',
  'Sembawang Secondary School',
  'Sengkang Secondary School',
  'Serangoon Secondary School',
  'Si Ling Secondary School',
  'Singapore Sports School',
  'Springdale Secondary School',
  'St. Anthony\'s Canossian Secondary School',
  'St. Gabriel\'s Secondary School',
  'St. Hilda\'s Secondary School',
  'St. Margaret\'s Secondary School',
  'St. Patrick\'s School',
  'Tampines Secondary School',
  'Tanjong Katong Girls\' School',
  'Tanjong Katong Secondary School',
  'Temasek Secondary School',
  'West Spring Secondary School',
  'Woodgrove Secondary School',
  'Woodlands Ring Secondary School',
  'Woodlands Secondary School',
  'Yio Chu Kang Secondary School',
  'Yishun Secondary School',
  'Yishun Town Secondary School',
  'Yuan Ching Secondary School',
  'Zhenghua Secondary School',
  'Zhonghua Secondary School'
];

export const SECONDARY_SUBJECTS = [
  'English Language',
  'Mathematics',
  'Additional Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Combined Science (Physics/Chemistry)',
  'Combined Science (Chemistry/Biology)',
  'Geography',
  'History',
  'Literature in English',
  'Principles of Accounts',
  'Art',
  'Design & Technology',
  'Food & Nutrition',
  'Music',
  'Computer Applications'
];

export const JC_SUBJECTS = [
  'H2 Mathematics',
  'H2 Physics',
  'H2 Chemistry',
  'H2 Biology',
  'H2 Economics',
  'H2 Geography',
  'H2 History',
  'H2 Literature in English',
  'H2 China Studies in Chinese',
  'H2 Computing',
  'H2 Art',
  'H1 General Paper',
  'H1 Mathematics',
  'H1 Physics',
  'H1 Chemistry',
  'H1 Biology',
  'H1 Economics',
  'H1 Geography',
  'H1 History',
  'H1 Literature in English',
  'H1 Chinese Language & Literature',
  'H3 Mathematics',
  'H3 Physics',
  'H3 Chemistry',
  'H3 Biology'
];

export const POLYTECHNICS = [
  'Singapore Polytechnic (SP)',
  'Temasek Polytechnic (TP)',
  'Nanyang Polytechnic (NYP)',
  'Ngee Ann Polytechnic (NP)',
  'Republic Polytechnic (RP)'
];

export const JUNIOR_COLLEGES = [
  'Anderson Serangoon Junior College',
  'Anglo-Chinese Junior College',
  'Catholic Junior College',
  'Dunman High School',
  'Eunoia Junior College',
  'Hwa Chong Institution',
  'Jurong Pioneer Junior College',
  'Nanyang Junior College',
  'National Junior College',
  'Raffles Institution',
  'River Valley High School',
  'St. Andrew\'s Junior College',
  'Tampines Meridian Junior College',
  'Temasek Junior College',
  'Victoria Junior College',
  'Yishun Innova Junior College'
];

export const ITE_COLLEGES = [
  'ITE College Central',
  'ITE College East',
  'ITE College West'
];

export const POLY_COURSES = COMPREHENSIVE_POLY_COURSES;

export const ITE_COURSES = [
  { name: 'Aerospace Machining & Manufacturing', category: 'Engineering', subjects: ['Physics', 'Mathematics', 'Design & Technology'] },
  { name: 'Automotive Technology', category: 'Engineering', subjects: ['Physics', 'Design & Technology'] },
  { name: 'Mechatronics Engineering', category: 'Engineering', subjects: ['Physics', 'Mathematics'] },
  { name: 'Electrical Technology', category: 'Engineering', subjects: ['Physics', 'Mathematics'] },
  { name: 'Electronics Engineering', category: 'Engineering', subjects: ['Physics', 'Mathematics'] },
  { name: 'Information Technology', category: 'IT', subjects: ['Mathematics', 'Computer Applications'] },
  { name: 'Cybersecurity', category: 'IT', subjects: ['Mathematics', 'Computer Applications'] },
  { name: 'Mobile Software Development', category: 'IT', subjects: ['Computer Applications'] },
  { name: 'Network Systems & Security', category: 'IT', subjects: ['Computer Applications'] },
  { name: 'Baking & Culinary Science', category: 'Culinary', subjects: ['Food & Nutrition'] },
  { name: 'Food & Beverage Operations', category: 'Services', subjects: ['English Language'] },
  { name: 'Hotel & Travel Operations', category: 'Services', subjects: ['English Language', 'Geography'] },
  { name: 'Retail Management', category: 'Business', subjects: ['English Language'] },
  { name: 'Business Services', category: 'Business', subjects: ['English Language', 'Principles of Accounts'] },
  { name: 'Nursing', category: 'Healthcare', subjects: ['Biology', 'Chemistry'] },
  { name: 'Veterinary Technology', category: 'Healthcare', subjects: ['Biology'] },
  { name: 'Beauty & Spa Management', category: 'Services', subjects: ['English Language'] },
  { name: 'Digital Animation', category: 'Design', subjects: ['Art', 'Computer Applications'] },
  { name: 'Digital Media Design', category: 'Design', subjects: ['Art', 'Design & Technology'] },
  { name: 'Visual Merchandising', category: 'Design', subjects: ['Art'] }
];

export const JC_LIST = [
  'Anderson Serangoon Junior College',
  'Anglo-Chinese Junior College',
  'Catholic Junior College',
  'Dunman High School',
  'Eunoia Junior College',
  'Hwa Chong Institution',
  'Jurong Pioneer Junior College',
  'Nanyang Junior College',
  'National Junior College',
  'Raffles Institution',
  'River Valley High School',
  'St. Andrew\'s Junior College',
  'Tampines Meridian Junior College',
  'Temasek Junior College',
  'Victoria Junior College',
  'Millennia Institute'
];

export const CAREER_PREDICTIONS = [
  {
    course: 'Computer Engineering',
    jobs: [
      { title: 'Software Engineer', salary: '$3,500 - $5,500', demand: 'Very High', growth: '+15%' },
      { title: 'Systems Analyst', salary: '$3,800 - $6,000', demand: 'High', growth: '+12%' },
      { title: 'IT Consultant', salary: '$4,000 - $7,000', demand: 'High', growth: '+10%' }
    ]
  },
  {
    course: 'Data Science & Analytics',
    jobs: [
      { title: 'Data Scientist', salary: '$4,000 - $7,500', demand: 'Very High', growth: '+20%' },
      { title: 'Data Analyst', salary: '$3,200 - $5,500', demand: 'Very High', growth: '+18%' },
      { title: 'Business Intelligence Analyst', salary: '$3,500 - $6,000', demand: 'High', growth: '+15%' }
    ]
  },
  {
    course: 'Accountancy',
    jobs: [
      { title: 'Accountant', salary: '$2,800 - $4,500', demand: 'High', growth: '+8%' },
      { title: 'Auditor', salary: '$3,000 - $5,000', demand: 'High', growth: '+7%' },
      { title: 'Financial Analyst', salary: '$3,500 - $6,000', demand: 'Medium', growth: '+10%' }
    ]
  },
  {
    course: 'Banking & Finance',
    jobs: [
      { title: 'Bank Officer', salary: '$3,000 - $5,500', demand: 'High', growth: '+9%' },
      { title: 'Financial Advisor', salary: '$3,500 - $7,000', demand: 'High', growth: '+11%' },
      { title: 'Investment Analyst', salary: '$4,000 - $8,000', demand: 'Medium', growth: '+12%' }
    ]
  },
  {
    course: 'Mechanical Engineering',
    jobs: [
      { title: 'Mechanical Engineer', salary: '$3,200 - $5,500', demand: 'High', growth: '+10%' },
      { title: 'Project Engineer', salary: '$3,500 - $6,000', demand: 'High', growth: '+8%' },
      { title: 'Manufacturing Engineer', salary: '$3,000 - $5,000', demand: 'Medium', growth: '+7%' }
    ]
  },
  {
    course: 'Nursing',
    jobs: [
      { title: 'Registered Nurse', salary: '$2,800 - $4,500', demand: 'Very High', growth: '+15%' },
      { title: 'Clinical Nurse Specialist', salary: '$3,500 - $5,500', demand: 'High', growth: '+12%' },
      { title: 'Nursing Educator', salary: '$3,800 - $6,000', demand: 'Medium', growth: '+10%' }
    ]
  },
  {
    course: 'Game Design & Development',
    jobs: [
      { title: 'Game Developer', salary: '$3,000 - $6,000', demand: 'High', growth: '+14%' },
      { title: 'Game Designer', salary: '$3,200 - $5,500', demand: 'High', growth: '+13%' },
      { title: 'UI/UX Designer (Gaming)', salary: '$3,500 - $6,500', demand: 'High', growth: '+16%' }
    ]
  },
  {
    course: 'Architecture',
    jobs: [
      { title: 'Architectural Assistant', salary: '$2,800 - $4,500', demand: 'Medium', growth: '+6%' },
      { title: 'Architect', salary: '$4,500 - $8,000', demand: 'Medium', growth: '+8%' },
      { title: 'Urban Planner', salary: '$3,800 - $6,500', demand: 'Medium', growth: '+7%' }
    ]
  }
];
