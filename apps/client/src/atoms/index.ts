import { atom } from "jotai";

import type { CityType } from "../types";

export const citiesAtom = atom<CityType[] | null>(null);
