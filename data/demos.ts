export const demos = {
  restaurant: {
    name: "Savor & Sage",
    kicker: "SEASONAL KITCHEN · A FICTIONAL RESTAURANT",
    headline: "A slower kind of extraordinary.",
    intro:
      "An intimate table. Ingredients at their best. A menu that follows the rhythm of the season.",
    action: "Explore the menu",
    secondary: "Our philosophy",
    inner: "A season, on a plate.",
    description:
      "A considered menu built around the market, the grower, and the pleasure of sharing something good.",
    items: [
      {
        name: "Garden, in green",
        detail: "Pea velouté · whipped ricotta · herb oil",
        price: "18",
      },
      {
        name: "From the coast",
        detail: "Roasted sea bass · fennel · lemon beurre blanc",
        price: "34",
      },
      {
        name: "A sweet ending",
        detail: "Poached pear · vanilla cream · almond crumble",
        price: "14",
      },
    ],
    feature: "Good food begins long before the kitchen.",
    featureText:
      "We follow the seasons and let simple ingredients lead. This fictional restaurant concept explores the craft of a welcoming digital dining experience.",
    nav: ["The menu", "Our story", "Visit us"],
    note: "FICTIONAL RESTAURANT · DESIGN CONCEPT · RESERVATIONS ARE NOT PROCESSED",
    category: "RESTAURANT",
  },
  "real-estate": {
    name: "Forma Living",
    kicker: "DISTINCTIVE SPACES. CONSIDERED LIVING.",
    headline: "Find a place that feels like you.",
    intro:
      "An edited collection of exceptional homes, shaped by architecture, light, and the way you want to live.",
    action: "Explore the collection",
    secondary: "Our approach",
    inner: "Spaces worth coming home to.",
    description:
      "From quiet courtyards to open horizons. Discover a different perspective on home.",
    items: [
      {
        name: "The Courtyard House",
        detail: "Palm Springs · 4 beds · 3 baths",
        price: "$2,450,000",
      },
      {
        name: "Horizon Residence",
        detail: "Joshua Tree · 3 beds · 2 baths",
        price: "$1,850,000",
      },
      {
        name: "The Glass Pavilion",
        detail: "Malibu · 5 beds · 4 baths",
        price: "$4,200,000",
      },
    ],
    feature: "Architecture you can feel.",
    featureText:
      "Warm materials. Open sightlines. A slower pace. Explore the Courtyard House, a fictional architectural listing designed around a seamless connection to the outdoors.",
    nav: ["Properties", "Our perspective", "Enquire"],
    note: "FICTIONAL LISTINGS · CONCEPT PRICES · NO PROPERTY SALES OR ENQUIRIES ARE PROCESSED",
    category: "REAL ESTATE",
  },
  saas: {
    name: "Orbit",
    kicker: "LESS BUSYWORK. MORE MOMENTUM.",
    headline: "Your team's next great idea starts here.",
    intro:
      "Bring projects, decisions, and the people behind them into one beautifully focused workspace.",
    action: "Explore the workspace",
    secondary: "See the details",
    inner: "Clarity, built into every day.",
    description:
      "Everything your team needs to move from an idea to a finished project. Together, in one place.",
    items: [
      {
        name: "One shared view",
        detail: "Plan priorities with a calm, flexible project board.",
        price: "01",
      },
      {
        name: "Decisions, in context",
        detail: "Keep notes and next steps beside the work.",
        price: "02",
      },
      {
        name: "Progress you can see",
        detail: "Turn milestones into a clear picture of momentum.",
        price: "03",
      },
    ],
    feature: "A little less noise. A lot more focus.",
    featureText:
      "Simple plans for teams with thoughtful ambitions. This is a fictional software concept; no account creation, payment, or subscription is processed.",
    nav: ["Product", "How it works", "Plans"],
    note: "FICTIONAL SOFTWARE · SAMPLE WORKSPACE · NO SIGNUP OR BILLING",
    category: "SOFTWARE",
  },
  store: {
    name: "ATELIER / 01",
    kicker: "THE EVERYDAY, RECONSIDERED.",
    headline: "Fewer pieces. More possibility.",
    intro:
      "Modern essentials with a quiet point of view. An edited wardrobe for the life between occasions.",
    action: "Discover the collection",
    secondary: "Our perspective",
    inner: "The new essentials.",
    description:
      "Beautifully simple silhouettes. Thoughtful proportions. Pieces that work harder, so you don't have to.",
    items: [
      {
        name: "The Sculpted Coat",
        detail: "Soft wool blend · warm camel",
        price: "$280",
      },
      {
        name: "The Everyday Shirt",
        detail: "Organic cotton · chalk",
        price: "$95",
      },
      {
        name: "The Wide Trouser",
        detail: "Structured twill · deep charcoal",
        price: "$140",
      },
    ],
    feature: "The shape of things to come.",
    featureText:
      "A sculpted shoulder, a generous silhouette, a thoughtful finish. A fictional fashion collection exploring the balance between form and everyday function.",
    nav: ["Collection", "The edit", "Our story"],
    note: "FICTIONAL FASHION STORE · DEMO BAG ONLY · NO CHECKOUT OR PAYMENTS",
    category: "FASHION",
  },
} as const;
export type DemoSlug = keyof typeof demos;
export const demoUI = {
  architectureAlt: "Original geometric illustration of a modern courtyard home",
  garmentAlts: [
    "Original sculptural coat illustration",
    "Original cotton shirt illustration",
    "Original tailored trouser illustration",
  ],
  workspaceAlt: "Fictional project workspace",
  filterLabel: "Filter concept properties",
  billingLabel: "Demo billing frequency",
  taskContext: "Design direction / sample",
  sampleInitials: "JD",
  concept: "Concept project",
  back: "Back to Elvora",
  menu: "Open menu",
  close: "Close menu",
  details: "Discover more",
  collection: "THE COLLECTION",
  feature: "A CLOSER LOOK",
  bag: "Bag",
  add: "Add to demo bag",
  added: "Added to demo bag",
  monthly: "Monthly",
  yearly: "Yearly",
  plans: [
    {
      name: "Studio",
      price: "19",
      description: "A considered space for small teams.",
    },
    {
      name: "Collective",
      price: "39",
      description: "Room for your next chapter.",
    },
  ],
  planAction: "Explore this demo plan",
  planNote: "This is a design demo. No subscription has been started.",
  locations: ["All homes", "Palm Springs", "Joshua Tree", "Malibu"],
  footnote:
    "An independent concept by Elvora. All brands, listings, products and business information on this page are fictional.",
  smallTitle: "DESIGNED FOR A MORE CONSIDERED EVERYDAY",
  currency: "per member / month",
  sample: "SAMPLE WORKSPACE",
  project: "Website launch",
  progress: "Project progress",
  tasks: [
    "Refine the direction",
    "Design the experience",
    "Build with intention",
  ],
  board: ["IN PROGRESS", "IN REVIEW", "COMPLETE"],
  activity: "Everything, in good order.",
  dimensions: "4 bedrooms / 3 bathrooms / 3,200 sq ft",
  material: "DESIGNED WITH INTENTION",
  itemDetails: "Material & care",
  itemCare: "Illustrative collection details. No physical products are sold.",
  restaurantCaption: "An illustrated study of seasonal ingredients",
  restaurantLabel: "THE SPRING TABLE",
  realEstateCaption: "Architectural study / The Courtyard House",
  storeCaption: "VOLUME 01 / MODERN ESSENTIALS",
  planLabel: "SIMPLE, THOUGHTFUL PLANS",
} as const;
