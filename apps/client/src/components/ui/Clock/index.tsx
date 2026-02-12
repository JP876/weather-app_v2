import { memo, useLayoutEffect, useMemo, useRef } from "react";
import { format as formatDate } from "date-fns";
import { Box, type BoxProps } from "@mui/material";

type ClockProps = Omit<BoxProps<"time">, "dateTime" | "component" | "ref"> & {
    format?: string;
    timezone?: string;
    locale?: string;
};

const Clock = ({ format, timezone, locale, ...rest }: ClockProps) => {
    const timeEl = useRef<HTMLTimeElement | null>(null);

    const timeFormatOptions = useMemo(() => {
        return Intl.DateTimeFormat().resolvedOptions();
    }, []);

    useLayoutEffect(() => {
        const TIMEZONE = timezone || timeFormatOptions.timeZone;
        const LOCALE = locale || timeFormatOptions.locale;
        const DATE_FORMAT = format || "HH:mm:ss dd/MMM/yyyy";

        const controller = new AbortController();

        const getCurrentTime = () => {
            const time = new Date().toLocaleString(LOCALE, { timeZone: TIMEZONE });
            const formated = formatDate(new Date(time), DATE_FORMAT);

            if (timeEl.current) {
                timeEl.current.dateTime = formated;
                timeEl.current.innerText = formated;
            }
        };
        getCurrentTime();

        document.addEventListener("second-passed", getCurrentTime, { signal: controller.signal });
        return () => {
            controller.abort();
        };
    }, [format, locale, timeFormatOptions.locale, timeFormatOptions.timeZone, timezone]);

    return <Box {...rest} component="time" ref={timeEl} />;
};

export default memo(Clock);
