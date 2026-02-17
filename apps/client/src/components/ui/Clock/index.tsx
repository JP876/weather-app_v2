import { memo, useLayoutEffect, useMemo, useRef } from "react";
import { format as formatDate } from "date-fns";
import { Typography, type TypographyProps } from "@mui/material";
import { useAtomValue } from "jotai";

import { userSettingsAtom } from "../../../atoms";

type ClockProps = Omit<TypographyProps<"p">, "ref"> & {
    format?: string;
    timezone?: string;
    locale?: string;
};

const Clock = ({ format, timezone, locale, ...rest }: ClockProps) => {
    const timeEl = useRef<HTMLTimeElement | null>(null);
    const { dateFormat } = useAtomValue(userSettingsAtom);

    const timeFormatOptions = useMemo(() => {
        return Intl.DateTimeFormat().resolvedOptions();
    }, []);

    useLayoutEffect(() => {
        const TIMEZONE = timezone || timeFormatOptions.timeZone;
        const LOCALE = locale || timeFormatOptions.locale;
        const DATE_FORMAT = format || dateFormat || "HH:mm:ss dd/MMM/yyyy";

        const controller = new AbortController();

        const getCurrentTime = () => {
            const time = new Date().toLocaleString(LOCALE, { timeZone: TIMEZONE });
            const formated = formatDate(new Date(time), DATE_FORMAT);

            if (timeEl.current) {
                timeEl.current.innerText = formated;
            }
        };
        getCurrentTime();

        document.addEventListener("second-passed", getCurrentTime, { signal: controller.signal });
        return () => {
            controller.abort();
        };
    }, [
        dateFormat,
        format,
        locale,
        timeFormatOptions.locale,
        timeFormatOptions.timeZone,
        timezone,
    ]);

    return <Typography {...rest} ref={timeEl} />;
};

export default memo(Clock);
