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
    desc: "Hey! I'm Tanveer, a Frontend Developer based in London. I'm passionate about crafting intuitive user experiences and also enjoy tinkering with hardware. Always excited to blend creativity with technology!",
    linkedin: "https://www.linkedin.com/in/tanveerxz",
  },
  {
    name: "Waseef Mohammad Khan",
    img: "/waseef.jpg",
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
    img: "/shami.jpg",
    desc: "Hey there! I'm Shami, an aspiring data analyst passionate about AI and Machine learning!! Also, an incoming Software engineering fellow at Headstarter AI!!",
    linkedin: "https://www.linkedin.com/in/shami-uz-zaman-b585431b6/",
  },
];

interface Event {
  id: number;
  title: string;
  date: string;
  region: string;
  category: string;
  people: number;
  description: string;
  location: string;
  tags: string[];
}

const events: Event[] = [
  {
    id: 1,
    title: "Central Park SummerStage",
    date: "August 24, 2024",
    region: "New York",
    category: "Music",
    people: 80,
    description: "Enjoy live music performances in Central Park.",
    location: "Central Park, New York, NY",
    tags: ["concert", "outdoor", "live"],
  },
  {
    id: 2,
    title: "Notting Hill Carnival",
    date: "August 25-26, 2024",
    region: "London",
    category: "Entertainment",
    people: 500,
    description:
      "Experience vibrant parades and music at one of the world’s largest street festivals.",
    location: "Notting Hill, London",
    tags: ["festival", "carnival", "culture"],
  },
  {
    id: 3,
    title: "India International Trade Fair",
    date: "November 14-27, 2024",
    region: "Delhi",
    category: "Business",
    people: 1000,
    description:
      "Explore products and services from various sectors at this premier trade fair.",
    location: "Pragati Maidan, New Delhi",
    tags: ["trade", "exhibition", "business"],
  },
  {
    id: 4,
    title: "Dhaka International Film Festival",
    date: "January 14-22, 2025",
    region: "Bangladesh",
    category: "Entertainment",
    people: 200,
    description:
      "A prestigious film festival showcasing local and international films.",
    location: "Dhaka, Bangladesh",
    tags: ["film", "festival", "culture"],
  },
  {
    id: 5,
    title: "London Fashion Week",
    date: "September 14-22, 2024",
    region: "London",
    category: "Art",
    people: 4000,
    description:
      "One of the biggest events in the fashion industry, showcasing the latest trends.",
    location: "Various venues, London",
    tags: ["fashion", "design", "show"],
  },
  {
    id: 6,
    title: "The Great New York State Fair",
    date: "August 22 - September 2, 2024",
    region: "New York",
    category: "Food",
    people: 80000,
    description:
      "Experience the best of New York State with food, music, and exhibits.",
    location: "Syracuse, New York",
    tags: ["fair", "food", "music"],
  },
  {
    id: 7,
    title: "New York Comic Con",
    date: "October 10-13, 2024",
    region: "New York",
    category: "Entertainment",
    people: 200000,
    description: "Join the largest pop culture event in the Northeast.",
    location: "Jacob K. Javits Convention Center, New York, NY",
    tags: ["comics", "pop culture", "convention"],
  },
  {
    id: 8,
    title: "Delhi Book Fair",
    date: "September 1-9, 2024",
    region: "Delhi",
    category: "Business",
    people: 150000,
    description: "An annual event that promotes reading and literature.",
    location: "Pragati Maidan, New Delhi",
    tags: ["books", "literature", "fair"],
  },
  {
    id: 9,
    title: "Bengal International Film Festival",
    date: "October 1-7, 2024",
    region: "Bangladesh",
    category: "Entertainment",
    people: 300,
    description:
      "Showcasing films from around the world with a focus on South Asian cinema.",
    location: "Dhaka, Bangladesh",
    tags: ["film", "international", "festival"],
  },
  {
    id: 10,
    title: "Dilli Haat Food Festival",
    date: "March 5-10, 2025",
    region: "Delhi",
    category: "Food",
    people: 5000,
    description: "A culinary festival featuring the diverse flavors of India.",
    location: "Dilli Haat, New Delhi",
    tags: ["food", "festival", "culture"],
  },
  {
    id: 11,
    title: "London Tech Week",
    date: "June 10-18, 2024",
    region: "London",
    category: "Technology",
    people: 8000,
    description: "The UK's largest festival of tech, showcasing innovation.",
    location: "Various venues, London",
    tags: ["technology", "innovation", "networking"],
  },
  {
    id: 12,
    title: "New York Fashion Week",
    date: "September 6-14, 2024",
    region: "New York",
    category: "Art",
    people: 5000,
    description: "A prestigious event showcasing the latest trends in fashion.",
    location: "Various venues, New York, NY",
    tags: ["fashion", "design", "show"],
  },
  {
    id: 13,
    title: "Delhi International Arts Festival",
    date: "November 30 - December 8, 2024",
    region: "Delhi",
    category: "Art",
    people: 1000,
    description: "Showcasing the best of performing arts in Delhi.",
    location: "Various venues, New Delhi",
    tags: ["arts", "performance", "culture"],
  },
  {
    id: 14,
    title: "Chennai International Film Festival",
    date: "December 6-13, 2024",
    region: "Bangladesh",
    category: "Entertainment",
    people: 400,
    description: "Showcasing international and regional cinema.",
    location: "Dhaka, Bangladesh",
    tags: ["film", "cinema", "festival"],
  },
  {
    id: 15,
    title: "The Great British Beer Festival",
    date: "August 1-5, 2024",
    region: "London",
    category: "Food",
    people: 10000,
    description: "The UK's largest beer festival, showcasing the best beers.",
    location: "Olympia London",
    tags: ["beer", "festival", "food"],
  },
  {
    id: 16,
    title: "Indian Premier League 2024",
    date: "March 23 - May 12, 2024",
    region: "Delhi",
    category: "Sports",
    people: 50000,
    description: "The most exciting cricket league in the world.",
    location: "Various stadiums in India",
    tags: ["cricket", "sports", "league"],
  },
  {
    id: 17,
    title: "Brooklyn Half Marathon",
    date: "May 18, 2024",
    region: "New York",
    category: "Sports",
    people: 3000,
    description:
      "Run through the streets of Brooklyn in this iconic half marathon.",
    location: "Brooklyn, NY",
    tags: ["running", "marathon", "sports"],
  },
  {
    id: 18,
    title: "Bangladesh International Kite Festival",
    date: "January 14, 2025",
    region: "Bangladesh",
    category: "Entertainment",
    people: 1000,
    description:
      "A colorful festival showcasing kites of all shapes and sizes.",
    location: "Dhaka, Bangladesh",
    tags: ["kites", "festival", "culture"],
  },
  {
    id: 19,
    title: "The Food Festival at Wembley",
    date: "August 18-20, 2024",
    region: "London",
    category: "Food",
    people: 15000,
    description:
      "A culinary extravaganza featuring top chefs and food vendors.",
    location: "Wembley Stadium, London",
    tags: ["food", "festival", "cuisine"],
  },
  {
    id: 20,
    title: "TechCrunch Disrupt 2024",
    date: "September 24-26, 2024",
    region: "New York",
    category: "Technology",
    people: 3000,
    description: "An annual technology conference and startup competition.",
    location: "Manhattan, New York",
    tags: ["technology", "startup", "conference"],
  },
];

const categories = [
  { value: "Music", label: "Music" },
  { value: "Technology", label: "Technology" },
  { value: "Sports", label: "Sports" },
  { value: "Food", label: "Food" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Art", label: "Art" },
  { value: "Business", label: "Business" },
];

const regions = [
  { value: "London", label: "London" },
  { value: "New York", label: "New York" },
  { value: "Delhi", label: "Delhi" },
  { value: "Bangladesh", label: "Bangladesh" },
];

export { teamMembers, events, categories, regions };
