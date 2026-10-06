import type { Locale } from "../config";
import { en, type Dictionary } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { nl } from "./nl";
import { ja } from "./ja";

export const dictionaries: Record<Locale, Dictionary> = { en, es, fr, nl, ja };
export type { Dictionary };