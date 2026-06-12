import { memo, useLayoutEffect, useMemo } from "react";
import { format as formatDate } from "date-fns";
import { type TypographyProps } from "@mui/material";
import { useAtomValue } from "jotai";

import { userSettingsAtom } from "../../../atoms";
import ClampedTextContainer from "../ClampedTextContainer";

type ClockProps = Omit<TypographyProps<"p">, "ref"> & {
    format?: string;
    timezone?: string;
    locale?: string;
};

const Clock = ({ format, timezone, locale, ...rest }: ClockProps) => {
    const clockId = useMemo(() => crypto.randomUUID(), []);
    const { dateFormat } = useAtomValue(userSettingsAtom);

    const timeFormatOptions = useMemo(() => {
        return Intl.DateTimeFormat().resolvedOptions();
    }, []);

    useLayoutEffect(() => {
        const TIMEZONE = timezone || timeFormatOptions?.timeZone;
        const LOCALE = locale || timeFormatOptions?.locale;
        const DATE_FORMAT = format || dateFormat || "HH:mm:ss dd/MMM/yyyy";

        const controller = new AbortController();

        const getCurrentTime = () => {
            const el = document.getElementById(clockId);

            try {
                const time = new Date().toLocaleString(LOCALE, { timeZone: TIMEZONE });
                const formated = formatDate(new Date(time), DATE_FORMAT);

                if (el) {
                    el.innerText = formated;
                }
            } catch (err: unknown) {
                console.log(err);
                controller.abort();
            }
        };
        getCurrentTime();

        document.addEventListener("second-passed", getCurrentTime, { signal: controller.signal });
        return () => {
            controller.abort();
        };
    }, [
        clockId,
        dateFormat,
        format,
        locale,
        timeFormatOptions?.locale,
        timeFormatOptions?.timeZone,
        timezone,
    ]);

    return <ClampedTextContainer id={clockId} {...rest} />;
};

export default memo(Clock);
