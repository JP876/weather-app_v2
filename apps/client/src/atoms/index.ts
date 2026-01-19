import { atom } from "jotai";

import type { CityType } from "../types";

export const worldcitiesAtom = atom<CityType[] | null>(null);
