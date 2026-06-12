import { useCallback } from "react";
import { useSetAtom } from "jotai";

import {
    generalSettingAtom,
    openConfirmSettingsAtom,
    openSettingsAtom,
    userSettingsAtom,
} from "../atoms";
import { store } from "../consts";
import compareObjects from "../utils/compareObjects";

const useCloseSettings = () => {
    const setOpenConfirm = useSetAtom(openConfirmSettingsAtom);
    const setOpenSettings = useSetAtom(openSettingsAtom);

    const onClose = useCallback(() => {
        const userSettings = store.get(userSettingsAtom);
        const generalSettings = store.get(generalSettingAtom);

        delete userSettings.daily;
        delete userSettings.hourly;

        if (compareObjects(userSettings, generalSettings)) {
            setOpenSettings(false);
        } else {
            setOpenConfirm(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [onClose] as const;
};

export default useCloseSettings;
