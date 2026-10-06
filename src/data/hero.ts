import { siteConfig } from "./site-config";

export type HeroSlide = {
  id: "men" | "women" | "kids";
  label: string;
  description: string;
  caption: string;
  href: string;
  newInHref: string;
  image: string;
  alt: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "men",
    label: "Men",
    description:
      "Sharp tailoring, easy layers and everyday staples built to last.",
    caption: "Menswear essentials",
    href: "/men",
    newInHref: "/men/new-in",
    image: "https://res.cloudinary.com/dqylma6u3/image/upload/v1788539297/Cheerful_Shopper_on_a_Vibrant_High_Street_ihsh1x.png",
    alt: `Model wearing a layered menswear outfit from ${siteConfig().name}`,
  },
  {
    id: "women",
    label: "Women",
    description:
      "Effortless silhouettes and statement pieces for every part of your week.",
    caption: "The Autumn Edit",
    href: "/women",
    newInHref: "/women/new-in",
    image: "https://github.com/harunaamadu/fitsync/blob/29656e7ed790ab8e1217175605585df87c3df8fa/src/assets/images/fitsync_brown_coat_1791124226762.jpg?raw=true",
    alt: `Model wearing a brown coat from the ${siteConfig().name} autumn collection`,
  },
  {
    id: "kids",
    label: "Kids",
    description:
      "Comfortable, colourful and tough enough for playtime and school days.",
    caption: "Little legends",
    href: "/kids",
    newInHref: "/kids/boys",
    image: "https://github.com/harunaamadu/fitsync/blob/29656e7ed790ab8e1217175605585df87c3df8fa/src/assets/images/fitsync_hero_beanie_1791126256168.jpg?raw=true",
    alt: `Children wearing colourful ${siteConfig().name} outfits`,
  },
];

export const HERO_DEFAULT_INDEX = 1;
export const HERO_INTERVAL = 6000;