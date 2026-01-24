import { useCallback, useMemo } from "react";
import { useSetAtom } from "jotai";

import { snackbarAtom, type SnackbarAtomType } from "../atoms";

const useSnackbar = () => {
    const setSnackbarInfo = useSetAtom(snackbarAtom);

    const openSnackbar = useCallback(
        (info: Omit<SnackbarAtomType, "open">) => {
            setSnackbarInfo((prevState) => ({ ...prevState, ...info, open: true }));
        },
        [setSnackbarInfo],
    );

    const closeSnackbar = useCallback(() => {
        setSnackbarInfo((prevState) => ({ ...prevState, open: false }));
    }, [setSnackbarInfo]);

    return useMemo(() => ({ openSnackbar, closeSnackbar }), [closeSnackbar, openSnackbar]);
};

export default useSnackbar;
