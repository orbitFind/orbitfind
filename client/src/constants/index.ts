export const navLinks = [
  {
    id: "",
    title: "Join Waitlist",
  },
  {
    id: "about",
    title: "About Us",
  },
  {
    id: "features",
    title: "Features",
  },
];

const teamMembers = [
  {
    name: "Tanveer Singh",
    img: "/tanveer1.jpg",
    desc: "Hey! I’m Tanveer, a Frontend Developer based in London. I’m passionate about crafting intuitive user experiences and also enjoy tinkering with hardware. Always excited to blend creativity with technology!",
    linkedin: "https://www.linkedin.com/in/tanveerxz",
  },
  {
    name: "Waseef Mohammad Khan",
    img: '/waseef.jpg',
    desc: "Hey there! I'm Waseef, a London-based software and game developer, founder of W-15 Interactive, with a track record in innovative projects, leadership, and product management.",
    linkedin: "https://www.linkedin.com/in/waseefmohammadkhan/",
  },
  {
    name: "Bartosz Glowacki",
    img: "/bartosz.jpg",
    desc: "Hey there! I'm Bartosz, a software developer from Poland. I'm super into AI engineering, and in my free time, I love playing chess, making music, and solving Rubik's cubes. Really excited to be part of this project!",
    linkedin: "https://www.linkedin.com/in/bartosz-glowacki-kcl/",
  },
  {
    name: "Shami-uz Zaman",
    img: "/shami.jpg" ,
    desc: "Hey there! I'm Shami, an aspiring data analyst passionate about AI and Machine learning!! Also, an incoming Software engineering fellow at Headstarter AI!!",
    linkedin: "https://www.linkedin.com/in/shami-uz-zaman-b585431b6/",
  },
];

const events = [
  { 
    id: 1, 
    title: 'Central Park SummerStage', 
    date: 'August 24, 2024', 
    region: 'New York', 
    category: 'Music', 
    people: 120, 
    description: 'Enjoy live music performances in Central Park.',
    location: 'Central Park, New York, NY', 
    tags: ['concert', 'outdoor', 'live'],
    attachments: [
        'https://upload.wikimedia.org/wikipedia/commons/5/5b/Central_Park_SummerStage.jpg', 
        'https://www.centralparksummerstage.org/' 
    ]
  },
  { 
    id: 2, 
    title: 'Notting Hill Carnival', 
    date: 'August 25-26, 2024', 
    region: 'London', 
    category: 'Entertainment', 
    people: 150, 
    description: 'Experience vibrant parades and music at one of the world’s largest street festivals.',
    location: 'Notting Hill, London', 
    tags: ['festival', 'carnival', 'culture'],
    attachments: [
        'https://upload.wikimedia.org/wikipedia/commons/e/e3/Notting_Hill_Carnival.jpg', 
        'https://www.nottinghillcarnival.com/'
    ]
  },
  { 
    id: 3, 
    title: 'India International Trade Fair', 
    date: 'November 14-27, 2024', 
    region: 'Delhi', 
    category: 'Business', 
    people: 200, 
    description: 'Explore products and services from various sectors at this premier trade fair.',
    location: 'Pragati Maidan, New Delhi', 
    tags: ['trade', 'exhibition', 'business'],
    attachments: [
        'https://upload.wikimedia.org/wikipedia/commons/c/c7/India_International_Trade_Fair_2019.jpg', 
        'http://www.iitf.in/' 
    ]
  },
  { 
    id: 4, 
    title: 'Dhaka International Film Festival', 
    date: 'January 14-22, 2025', 
    region: 'Bangladesh', 
    category: 'Entertainment', 
    people: 80, 
    description: 'A prestigious film festival showcasing local and international films.',
    location: 'Dhaka, Bangladesh', 
    tags: ['film', 'festival', 'culture'],
    attachments: [
        'https://upload.wikimedia.org/wikipedia/commons/5/5b/Dhaka_Film_Festival.jpg', 
        'https://difff.org/' 
    ]
  },
  { 
    id: 5, 
    title: 'London Fashion Week', 
    date: 'September 14-22, 2024', 
    region: 'London', 
    category: 'Art', 
    people: 5000, 
    description: 'One of the biggest events in the fashion industry, showcasing the latest trends.',
    location: 'Various venues, London', 
    tags: ['fashion', 'design', 'show'],
    attachments: [
        'https://upload.wikimedia.org/wikipedia/commons/c/c8/London_Fashion_Week_Fall_2015.jpg', 
        'https://londonfashionweek.co.uk/' 
    ]
  },
  { 
    id: 6, 
    title: 'The Great New York State Fair', 
    date: 'August 22 - September 2, 2024', 
    region: 'New York', 
    category: 'Food', 
    people: 100000, 
    description: 'Experience the best of New York State with food, music, and exhibits.',
    location: 'Syracuse, New York', 
    tags: ['fair', 'food', 'music'],
    attachments: [
        'https://upload.wikimedia.org/wikipedia/commons/a/a0/NY_State_Fair_2018.jpg', 
        'https://nysfair.ny.gov/' 
    ]
  },
  { 
    id: 7, 
    title: 'New York Comic Con', 
    date: 'October 10-13, 2024', 
    region: 'New York', 
    category: 'Entertainment', 
    people: 250000, 
    description: 'Join the largest pop culture event in the Northeast.',
    location: 'Jacob K. Javits Convention Center, New York, NY', 
    tags: ['comics', 'pop culture', 'convention'],
    attachments: [
        'https://upload.wikimedia.org/wikipedia/commons/d/db/New_York_Comic_Con_2018.jpg', 
        'https://www.newyorkcomiccon.com/' 
    ]
  },
  { 
    id: 8, 
    title: 'Delhi Book Fair', 
    date: 'September 1-9, 2024', 
    region: 'Delhi', 
    category: 'Business', 
    people: 300000, 
    description: 'An annual event that promotes reading and literature.',
    location: 'Pragati Maidan, New Delhi', 
    tags: ['books', 'literature', 'fair'],
    attachments: [
        'https://upload.wikimedia.org/wikipedia/commons/e/e8/Delhi_Book_Fair.jpg', 
        'http://www.delhibookfair.com/' 
    ]
  },
  { 
    id: 9, 
    title: 'Bengal International Film Festival', 
    date: 'October 1-7, 2024', 
    region: 'Bangladesh', 
    category: 'Entertainment', 
    people: 150, 
    description: 'Showcasing films from around the world with a focus on South Asian cinema.',
    location: 'Dhaka, Bangladesh', 
    tags: ['film', 'international', 'festival'],
    attachments: [
        'https://upload.wikimedia.org/wikipedia/commons/1/11/Bengal_Film_Festival.jpg', 
        'https://www.bengalfilmfestival.com/' 
    ]
  },
  { 
    id: 10, 
    title: 'Dilli Haat Food Festival', 
    date: 'March 5-10, 2025', 
    region: 'Delhi', 
    category: 'Food', 
    people: 5000, 
    description: 'A culinary festival featuring the diverse flavors of India.',
    location: 'Dilli Haat, New Delhi', 
    tags: ['food', 'festival', 'culture'],
    attachments: [
        'https://upload.wikimedia.org/wikipedia/commons/8/8f/Dilli_Haat.jpg', 
        'http://www.dillihaat.net/' 
    ]
  },
];


export { teamMembers, events };
