import { useAtomValue, useSetAtom } from "jotai";

import { generalSettingAtom, userSettingsAtom } from "../atoms";
import { useCallback } from "react";

const useSaveSettings = () => {
    const settings = useAtomValue(generalSettingAtom);
    const setUserSettings = useSetAtom(userSettingsAtom);

    const handleSaveSettings = useCallback(() => {
        setUserSettings((prevValue) => ({ ...prevValue, ...settings }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings]);

    return [handleSaveSettings] as const;
};

export default useSaveSettings;
