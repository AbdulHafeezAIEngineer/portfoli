export const demos = {
  "restaurant": {
    "name": "Savor & Sage",
    "kicker": "SEASONAL KITCHEN · A FICTIONAL RESTAURANT",
    "headline": "A seasonal restaurant menu.",
    "intro": "Browse the fictional dishes and prices, then explore the illustrated ingredients.",
    "action": "Explore the menu",
    "secondary": "Our philosophy",
    "inner": "Example dishes and prices.",
    "description": "A seasonal menu with dish descriptions and illustrative prices. No table reservation or food order is processed.",
    "items": [
      {
        "name": "Garden, in green",
        "detail": "Pea velouté · whipped ricotta · herb oil",
        "price": "18"
      },
      {
        "name": "From the coast",
        "detail": "Roasted sea bass · fennel · lemon beurre blanc",
        "price": "34"
      },
      {
        "name": "A sweet ending",
        "detail": "Poached pear · vanilla cream · almond crumble",
        "price": "14"
      }
    ],
    "feature": "Good food begins long before the kitchen.",
    "featureText": "We follow the seasons and let simple ingredients lead. This fictional restaurant concept explores the craft of a welcoming digital dining experience.",
    "nav": [
      "The menu",
      "Our story",
      "Visit us"
    ],
    "note": "FICTIONAL RESTAURANT · DESIGN CONCEPT · RESERVATIONS ARE NOT PROCESSED",
    "category": "RESTAURANT"
  },
  "real-estate": {
    "name": "Forma Living",
    "kicker": "FICTIONAL PROPERTY LISTINGS",
    "headline": "Homes in Palm Springs, Joshua Tree and Malibu.",
    "intro": "Compare three illustrative listings by location. All properties and asking prices are fictional.",
    "action": "Explore the collection",
    "secondary": "Our approach",
    "inner": "Browse the sample listings.",
    "description": "A property listing interface with location filters and an illustrated floorplan.",
    "items": [
      {
        "name": "The Courtyard House",
        "detail": "Palm Springs · 4 beds · 3 baths",
        "price": "$2,450,000"
      },
      {
        "name": "Horizon Residence",
        "detail": "Joshua Tree · 3 beds · 2 baths",
        "price": "$1,850,000"
      },
      {
        "name": "The Glass Pavilion",
        "detail": "Malibu · 5 beds · 4 baths",
        "price": "$4,200,000"
      }
    ],
    "feature": "The Courtyard House floorplan.",
    "featureText": "Explore the Courtyard House, a fictional architectural listing with a floorplan and a sample project enquiry.",
    "nav": [
      "Properties",
      "Our perspective",
      "Enquire"
    ],
    "note": "FICTIONAL LISTINGS · CONCEPT PRICES · NO PROPERTY SALES OR ENQUIRIES ARE PROCESSED",
    "category": "REAL ESTATE"
  },
  "saas": {
    "name": "Orbit",
    "kicker": "PROJECT WORKSPACE / INTERFACE CONCEPT",
    "headline": "Project tasks and team activity.",
    "intro": "A fictional workspace with a task board, sample activity and example plan cards.",
    "action": "Explore the workspace",
    "secondary": "See the details",
    "inner": "The example project board.",
    "description": "An interface study for planning tasks and reviewing their status. It does not create accounts or subscriptions.",
    "items": [
      {
        "name": "One shared view",
        "detail": "Plan priorities with a calm, flexible project board.",
        "price": "01"
      },
      {
        "name": "Decisions, in context",
        "detail": "Keep notes and next steps beside the work.",
        "price": "02"
      },
      {
        "name": "Progress you can see",
        "detail": "Turn milestones into a clear picture of momentum.",
        "price": "03"
      }
    ],
    "feature": "A little less noise. A lot more focus.",
    "featureText": "Compare the example plans and inspect the task board. This is a fictional software interface; it does not create accounts, accept payments or start subscriptions.",
    "nav": [
      "Product",
      "How it works",
      "Plans"
    ],
    "note": "FICTIONAL SOFTWARE · SAMPLE WORKSPACE · NO SIGNUP OR BILLING",
    "category": "SOFTWARE"
  },
  "store": {
    "name": "ATELIER / 01",
    "kicker": "THE EVERYDAY, RECONSIDERED.",
    "headline": "Coats, shirts and trousers.",
    "intro": "Browse the fictional clothing collection and its material details.",
    "action": "Discover the collection",
    "secondary": "Our perspective",
    "inner": "The sample collection.",
    "description": "An illustrated fashion storefront. All products and prices are demo data.",
    "items": [
      {
        "name": "The Sculpted Coat",
        "detail": "Soft wool blend · warm camel",
        "price": "$280"
      },
      {
        "name": "The Everyday Shirt",
        "detail": "Organic cotton · chalk",
        "price": "$95"
      },
      {
        "name": "The Wide Trouser",
        "detail": "Structured twill · deep charcoal",
        "price": "$140"
      }
    ],
    "feature": "The shape of things to come.",
    "featureText": "Explore the illustrated coat, shirt and trousers. Material and care details are sample content; no purchase is processed.",
    "nav": [
      "Collection",
      "The edit",
      "Our story"
    ],
    "note": "FICTIONAL FASHION STORE · DEMO BAG ONLY · NO CHECKOUT OR PAYMENTS",
    "category": "FASHION"
  }
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
      description: "Sample plan for a small team.",
    },
    {
      name: "Collective",
      price: "39",
      description: "Sample plan for a larger team.",
    },
  ],
  planAction: "Explore this demo plan",
  planNote: "This is a design demo. No subscription has been started.",
  locations: ["All homes", "Palm Springs", "Joshua Tree", "Malibu"],
  footnote:
    "An independent concept by Elvora. All brands, listings, products and business information on this page are fictional.",
  smallTitle: "FICTIONAL PRODUCT INTERFACE",
  currency: "per member / month",
  sample: "SAMPLE WORKSPACE",
  project: "Website launch",
  progress: "Project progress",
  tasks: [
    "Refine the direction",
    "Design the experience",
    "Test the enquiry form",
  ],
  board: ["IN PROGRESS", "IN REVIEW", "COMPLETE"],
  activity: "Everything, in good order.",
  dimensions: "4 bedrooms / 3 bathrooms / 3,200 sq ft",
  material: "MATERIAL DETAILS / SAMPLE CONTENT",
  itemDetails: "Material & care",
  itemCare: "Illustrative collection details. No physical products are sold.",
  restaurantCaption: "An illustrated study of seasonal ingredients",
  restaurantLabel: "THE SPRING TABLE",
  realEstateCaption: "Architectural study / The Courtyard House",
  storeCaption: "VOLUME 01 / MODERN ESSENTIALS",
  planLabel: "EXAMPLE PLANS",
} as const;
