export type Screenshot = {
  src: string;
  title: string;
  alt: string;
  prompt: string;
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  industry: string;
  description: string;
  stack: string[];
  accent: string;
  screenshots: Screenshot[];
};

export type ProjectView = Omit<Project, "screenshots"> & {
  screenshots: Omit<Screenshot, "prompt">[];
};

const artDirection =
  "Create a polished fictional website UI screenshot, straight-on and edge-to-edge, 1600 by 1000 pixels (16:10). No browser frame, device frame, watermarks, real brands, or claims of real clients. Crisp typography, professional spacing, accessible contrast, realistic interface details. This is a concept design, not a photograph. ";

export const projects: Project[] = [
  {
    id: "restaurant",
    title: "Savor & Sage",
    subtitle: "A seat at a more thoughtful table.",
    industry: "Restaurant & Hospitality",
    description:
      "A fictional seasonal restaurant concept balancing warm editorial storytelling with a clear path to exploring the menu and reserving a table. These images are illustrative placeholders, not a live client website.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    accent: "#d7b799",
    screenshots: [
      { src: "/projects/restaurant-1.jpg", title: "Homepage", alt: "Savor & Sage restaurant homepage concept with an editorial dining layout", prompt: artDirection + "Design the Savor & Sage restaurant HOMEPAGE. Warm ivory, espresso brown, muted terracotta. Elegant serif headline 'Seasonal food. Lasting memories.' Two-column hero with an art-directed overhead seasonal dish, small navigation, Reserve a table button, and a quiet produce-focused footer strip. Editorial fine-dining aesthetic." },
      { src: "/projects/restaurant-2.jpg", title: "Seasonal menu", alt: "Savor & Sage seasonal menu concept with dish listings and prices", prompt: artDirection + "Design the Savor & Sage SEASONAL MENU page. Match its ivory, espresso, terracotta palette and elegant serif headings. Menu category tabs, two columns of beautifully spaced dishes with short ingredient descriptions and prices, and one small overhead food image. Restaurant navigation and Reserve a table action. Calm fine-dining editorial aesthetic." },
      { src: "/projects/restaurant-3.jpg", title: "Our story", alt: "Savor & Sage story page concept with editorial restaurant imagery", prompt: artDirection + "Design the Savor & Sage OUR STORY page. Ivory, espresso, terracotta, sophisticated serif typography. Asymmetric editorial grid: atmospheric kitchen image, short chef introduction, heading 'Rooted in the season', a farm-to-table process strip, and generous negative space. Consistent restaurant navigation." },
      { src: "/projects/restaurant-4.jpg", title: "Reservations", alt: "Savor & Sage reservation interface concept with date and time selection", prompt: artDirection + "Design the Savor & Sage RESERVATIONS page. Warm ivory and espresso with terracotta actions. Elegant heading 'Your table awaits', refined date picker, guest count, available time buttons, clearly labeled name and email fields, reservation summary card, and tasteful dining-room image. Fictional polished UI, no personal data." },
      { src: "/projects/restaurant-5.jpg", title: "Mobile homepage", alt: "Savor & Sage mobile homepage concept centered on a 16 by 10 canvas", prompt: artDirection + "Present the Savor & Sage MOBILE HOMEPAGE as one 390-pixel-wide responsive webpage centered on a warm ivory 1600x1000 canvas, without a phone frame. Elegant serif restaurant wordmark, accessible menu button, stacked headline 'Seasonal food. Lasting memories.', seasonal dish image, terracotta Reserve a table action, and glimpse of menu cards. Maintain readable mobile typography." },
    ],
  },
  {
    id: "real-estate",
    title: "Forma Estates",
    subtitle: "Exceptional spaces. A clearer perspective.",
    industry: "Real Estate",
    description:
      "A fictional property discovery experience designed around architectural imagery, uncluttered search, and considered listing details. An independent concept, with no real listings or agency affiliation.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    accent: "#b9c9b8",
    screenshots: [
      { src: "/projects/real-estate-1.jpg", title: "Homepage", alt: "Forma Estates homepage concept featuring modern architectural property imagery", prompt: artDirection + "Design the Forma Estates luxury REAL ESTATE HOMEPAGE. Pale stone, deep forest green, charcoal typography, restrained sans-serif. Hero heading 'Find a place that feels like you.' Large sunlit modern architecture image, floating location/type/budget search bar, and three small featured property previews. Understated, spacious, premium." },
      { src: "/projects/real-estate-2.jpg", title: "Property search", alt: "Forma Estates property search concept with filters and a listing grid", prompt: artDirection + "Design the Forma Estates PROPERTY SEARCH results page. Pale stone, forest green, charcoal sans-serif. Clean filter sidebar with location, price range and bedrooms; six architecture listing cards in a three-column grid with fictional prices and locations; sort dropdown and clear result count. Consistent minimal luxury navigation." },
      { src: "/projects/real-estate-3.jpg", title: "Property details", alt: "Forma Estates property detail concept with photography and listing information", prompt: artDirection + "Design the Forma Estates PROPERTY DETAIL page for fictional 'The Courtyard Residence'. Pale stone and forest green. Wide architectural photo gallery, clear fictional price, bedroom/bathroom/area facts, concise description, floor-plan thumbnail, and refined Request a viewing sidebar. Spacious premium real estate interface." },
      { src: "/projects/real-estate-4.jpg", title: "Book a viewing", alt: "Forma Estates viewing request concept with a schedule form", prompt: artDirection + "Design the Forma Estates BOOK A VIEWING page. Pale stone, forest green, charcoal. Split layout with modern residence image and property summary on the left; labeled day/time selectors, name/email fields, and Request viewing button on the right. No personal data. Elegant minimalist navigation and quiet legal note." },
      { src: "/projects/real-estate-5.jpg", title: "Mobile discovery", alt: "Forma Estates responsive mobile search concept on a 16 by 10 canvas", prompt: artDirection + "Present Forma Estates MOBILE PROPERTY DISCOVERY as one 390-pixel-wide webpage centered on a stone-colored 1600x1000 canvas without a phone frame. Forest-green wordmark, menu button, stacked search fields, filter chips, and two vertically stacked modern architecture listing cards with fictional prices. Crisp accessible mobile type." },
    ],
  },
  {
    id: "saas",
    title: "Orbit",
    subtitle: "Less busywork. More forward motion.",
    industry: "SaaS & Technology",
    description:
      "A fictional productivity platform landing page exploring how focused messaging, an approachable product preview, and transparent pricing can make complex software feel simple. No working SaaS product is implied.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    accent: "#c3b7f3",
    screenshots: [
      { src: "/projects/saas-1.jpg", title: "Landing page", alt: "Orbit SaaS landing page concept with a violet-accented product dashboard preview", prompt: artDirection + "Design the Orbit productivity SaaS LANDING PAGE. Near-black navy, soft lavender glows, crisp white sans-serif. Bold centered heading 'Your work. In a better orbit.' restrained explanatory text, violet Get started button, and elegant floating dashboard preview with task lists and simple charts. No invented customer logos or metrics." },
      { src: "/projects/saas-2.jpg", title: "Features", alt: "Orbit product features concept in a dark bento grid", prompt: artDirection + "Design the Orbit SaaS FEATURES page. Near-black navy, lavender accents, white sans-serif. Heading 'Make room for meaningful work.' Premium bento grid of task automation, team planning, and reporting features using small illustrative interface previews, fine borders, subtle glow, and generous spacing. No invented adoption statistics." },
      { src: "/projects/saas-3.jpg", title: "Pricing", alt: "Orbit pricing page concept with three clearly compared subscription tiers", prompt: artDirection + "Design the Orbit SaaS PRICING page. Dark navy, lavender, crisp white. Three transparent plan cards: Starter, Pro, Team, with fictional dollar prices, monthly/yearly switch, succinct feature lists, lavender highlighted middle card, and short FAQ. No fake testimonials or user counts. Premium accessible comparison layout." },
      { src: "/projects/saas-4.jpg", title: "Product preview", alt: "Orbit dashboard concept with project tasks and a weekly overview", prompt: artDirection + "Design the Orbit PRODUCT DASHBOARD concept. Dark navy interface, lavender highlights, subtle borders. Slim left navigation with Overview, Projects, Calendar; main weekly progress chart, three task columns with sample fictional tasks, and compact activity panel. Highly legible, realistic productivity UI without personal data." },
      { src: "/projects/saas-5.jpg", title: "Mobile landing page", alt: "Orbit mobile landing page concept centered on a dark 16 by 10 canvas", prompt: artDirection + "Present the Orbit MOBILE LANDING PAGE as one 390-pixel-wide webpage centered on a midnight navy 1600x1000 canvas without a phone frame. White Orbit wordmark, menu icon, stacked headline 'Your work. In a better orbit.', lavender CTA, small task dashboard preview and stacked feature cards. Readable responsive typography." },
    ],
  },
  {
    id: "ecommerce",
    title: "Objects & Co.",
    subtitle: "Everyday objects. Considered differently.",
    industry: "E-commerce & Lifestyle",
    description:
      "A fictional homewares storefront pairing a quiet visual identity with straightforward product discovery. A self-initiated exploration of collection, product, and shopping-bag layouts, not a functioning store.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    accent: "#dfc5ad",
    screenshots: [
      { src: "/projects/ecommerce-1.jpg", title: "Storefront", alt: "Objects and Co. homewares storefront concept with a neutral editorial product hero", prompt: artDirection + "Design the Objects & Co. HOMEWARES STOREFRONT. Warm off-white, sand, ink-black type, modern editorial serif mixed with sans-serif. Hero heading 'Good things. For everyday living.' Sculptural ceramic vase and linen still life, discreet Shop collection button, four small collection tiles. Restrained luxury, no real brands." },
      { src: "/projects/ecommerce-2.jpg", title: "Collection", alt: "Objects and Co. collection concept with a minimal product grid and filters", prompt: artDirection + "Design the Objects & Co. COLLECTION page titled 'Considered essentials'. Warm off-white, sand, ink type. Two-row product grid of ceramic vessels, linen, lighting and small furniture on neutral backdrops; understated category filters, sort control, fictional prices and elegant navigation. Generous editorial whitespace." },
      { src: "/projects/ecommerce-3.jpg", title: "Product details", alt: "Objects and Co. ceramic vase product detail concept with image gallery", prompt: artDirection + "Design the Objects & Co. PRODUCT DETAIL page for fictional 'Arc Ceramic Vessel'. Warm off-white, sand, ink typography. Large sculptural vase image left with three small thumbnails; right column with fictional price, short description, color swatches, quantity selector and black Add to bag button; expandable material and care details." },
      { src: "/projects/ecommerce-4.jpg", title: "Shopping bag", alt: "Objects and Co. shopping bag concept showing sample products and an order summary", prompt: artDirection + "Design the Objects & Co. SHOPPING BAG page. Off-white, sand, ink. Two fictional product rows with ceramic and linen thumbnails, readable names, quantity steppers and remove links; separate order summary with subtotal, shipping note and black Checkout button. Calm premium layout. No payment or personal details." },
      { src: "/projects/ecommerce-5.jpg", title: "Mobile storefront", alt: "Objects and Co. mobile storefront concept centered on a neutral 16 by 10 canvas", prompt: artDirection + "Present the Objects & Co. MOBILE STOREFRONT as one 390-pixel-wide webpage centered on a warm off-white 1600x1000 canvas without a phone frame. Editorial wordmark, menu and bag icons, stacked headline 'Good things. For everyday living.', ceramic still-life hero, black Shop collection action and two-column product previews. Refined responsive spacing." },
    ],
  },
];

// Replace this loader with a database query later; view components keep the same props.
export async function getProjects(): Promise<ProjectView[]> {
  return projects.map(({ screenshots, ...project }) => ({
    ...project,
    screenshots: screenshots.map(({ src, title, alt }) => ({ src, title, alt })),
  }));
}
