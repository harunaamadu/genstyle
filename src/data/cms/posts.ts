import { postSchema, type Post } from "@/lib/validations/post";

const p = (text: string) => ({ type: "p" as const, text });
const h = (text: string) => ({ type: "h2" as const, text });
const list = (...items: string[]) => ({ type: "list" as const, items });
const quote = (text: string, cite?: string) => ({ type: "quote" as const, text, cite });

const img = (slug: string) => `/images/blog/${slug}.jpg`;

const ama = { name: "Ama Owusu", role: "Style Editor" };
const kofi = { name: "Kofi Mensah", role: "Head of Product" };

const raw = [
  {
    id: "post-1",
    slug: "capsule-wardrobe-ten-pieces",
    title: "How to Build a Capsule Wardrobe in Ten Pieces",
    excerpt:
      "Fewer clothes, more outfits. Start with a palette, then add ten pieces that all work together.",
    category: "Style Guides",
    publishedAt: "2026-09-24",
    author: ama,
    image: img("capsule-wardrobe-ten-pieces"),
    imageAlt: "A neatly arranged rail of neutral clothing",
    body: [
      p("A capsule wardrobe is a small set of clothes that all work with each other. The goal isn't owning less for its own sake. It's getting dressed in two minutes and liking what you see."),
      h("Start with colour, not clothes"),
      p("Choose two or three neutrals you already wear most, then one accent colour you love. Every new piece should sit comfortably inside that palette. If it only goes with one other thing you own, leave it on the rail."),
      h("The ten pieces"),
      p("This list works for most climates and most offices, and it's easy to adapt:"),
      list(
        "A camel or navy overcoat",
        "A white oxford shirt",
        "A heavyweight tee",
        "Tapered trousers",
        "A satin slip dress",
        "A denim jacket",
        "A pleated midi skirt",
        "A ribbed knit top",
        "A leather tote",
        "A minimal watch"
      ),
      p("Swap in what suits your life. The point is that every item can be worn with at least three others, and that each one earns its place by being worn often."),
      quote("Buy less, choose well, and wear it until it's worn out."),
    ],
  },
  {
    id: "post-2",
    slug: "wool-coat-care",
    title: "Wool Coat Care: Make Your Winter Piece Last a Decade",
    excerpt:
      "A good wool coat gets better with age if you treat it right. Brush it, rest it and skip the washing machine.",
    category: "Care & Craft",
    publishedAt: "2026-09-10",
    author: kofi,
    image: img("wool-coat-care"),
    imageAlt: "A camel wool coat hanging on a wooden hanger",
    body: [
      p("Wool is one of the most forgiving fabrics there is. It resists odour, sheds light dirt and recovers its shape. Most of what shortens a coat's life is over-cleaning."),
      h("Brush, don't wash"),
      p("After wearing, brush the coat in downward strokes with a soft clothes brush. That lifts dust and surface dirt before it works into the fibres. Hang it on a wide-shouldered hanger so the shape holds."),
      h("Rest between wears"),
      p("Give your coat a day or two to air out and let the fibres relax before you wear it again. Rotating two coats through the season is even better."),
      h("Quick care checklist"),
      list(
        "Steam out creases instead of ironing",
        "Spot clean marks with a barely damp cloth",
        "Dry clean once a season at most",
        "Store in a breathable cover, never plastic"
      ),
    ],
  },
  {
    id: "post-3",
    slug: "autumn-edit-colours",
    title: "The Autumn Edit: Five Colours Worth Wearing This Season",
    excerpt:
      "Warm neutrals and deep tones that layer well and work with what's already in your wardrobe.",
    category: "Trends",
    publishedAt: "2026-08-28",
    author: ama,
    image: img("autumn-edit-colours"),
    imageAlt: "Fabric swatches in camel, olive, burgundy, navy and stone",
    body: [
      p("Autumn colours are forgiving. They sit well together, and they flatter most skin tones, which makes them an easy way to refresh a wardrobe without starting over."),
      h("The five"),
      list(
        "Camel: the classic outerwear shade, warm without being loud",
        "Olive: a quiet green that pairs with almost everything",
        "Burgundy: richer than red, brilliant in satin or knit",
        "Navy: the softer alternative to black",
        "Stone: a pale neutral that lifts darker layers"
      ),
      p("Try building outfits from two of them plus a neutral. Camel and navy is a safe start. Olive and burgundy is a bolder one."),
    ],
  },
  {
    id: "post-4",
    slug: "organic-cotton-sourcing",
    title: "Why Organic Cotton? What We Look For in a Fabric",
    excerpt:
      "How we think about materials: comfort, durability, and how a fabric is grown and finished.",
    category: "Behind the Seams",
    publishedAt: "2026-08-12",
    author: kofi,
    image: img("organic-cotton-sourcing"),
    imageAlt: "Close-up of woven cotton fabric",
    body: [
      p("A fabric choice affects how a garment feels on day one, and how it looks after fifty washes. We judge materials on both."),
      h("What we check"),
      list(
        "Fibre quality: longer fibres make smoother, stronger yarn",
        "Weight and weave: dense enough to hold its shape",
        "Certification: for organic cotton, look for standards like GOTS (the Global Organic Textile Standard)",
        "Finishing: how the fabric is dyed and treated matters as much as how it's grown"
      ),
      p("No single material is perfect. The honest approach is choosing the right fibre for each garment and making it well enough that it gets worn for years."),
    ],
  },
  {
    id: "post-5",
    slug: "kids-school-wear-guide",
    title: "Dressing Kids for School: Fits That Survive Playtime",
    excerpt:
      "Reinforced knees, easy fastenings and a little room to grow: what to look for in school and play clothes.",
    category: "Style Guides",
    publishedAt: "2026-07-30",
    author: ama,
    image: img("kids-school-wear-guide"),
    imageAlt: "Children in colourful clothes playing outside",
    body: [
      p("Kids' clothes work hard. The best ones are comfortable enough to forget about, and tough enough to survive a playground."),
      h("What to look for"),
      list(
        "Reinforced knees and seams in high-wear areas",
        "Easy fastenings children can manage themselves",
        "Soft, breathable fabrics that wash well",
        "A little room to grow, but not so much it gets in the way"
      ),
      p("When in doubt between two sizes, check the size guide against your child's height and chest, and choose the one that fits now with a bit of room. Buying a size up for growth often just means a season of sleeves that don't fit."),
    ],
  },
  {
    id: "post-6",
    slug: "read-a-care-label",
    title: "How to Read a Care Label (and What the Symbols Mean)",
    excerpt:
      "Five symbols cover almost every garment. Learn them once and you'll never wonder about the wash again.",
    category: "Care & Craft",
    publishedAt: "2026-07-14",
    author: kofi,
    image: img("read-a-care-label"),
    imageAlt: "A garment care label with washing symbols",
    body: [
      p("Care labels look like a code, but there are only five shapes to learn. A cross through any of them means don't."),
      h("The five symbols"),
      list(
        "Wash tub: machine or hand wash. The number is the maximum temperature in °C",
        "Triangle: bleaching is allowed (crossed out means no bleach)",
        "Square with a circle: tumble drying (crossed out means air dry)",
        "Iron: ironing is fine. More dots means more heat",
        "Plain circle: professional dry cleaning"
      ),
      p("When a garment mixes fibres, follow the most delicate instruction on the label. And when you're unsure, wash cooler and air dry. It's gentler on both the fabric and your energy bill."),
    ],
  },
];

export const posts: Post[] = postSchema.array().parse(raw);