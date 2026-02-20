import type { GeneralSettingsType } from "../../../../atoms/types";

export type SingleSettingProps<T> = {
    value: T;
    updateSettings: (value: Partial<GeneralSettingsType>) => void;
};
