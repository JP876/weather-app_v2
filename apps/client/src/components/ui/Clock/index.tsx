import { memo, useLayoutEffect, useMemo, useRef } from "react";
import { format } from "date-fns";
import { Box } from "@mui/material";

type ClockProps = {
    format?: string;
    timezone?: string;
    locale?: string;
};

const Clock = (props: ClockProps) => {
    const timeEl = useRef<HTMLTimeElement | null>(null);

    const timeFormatOptions = useMemo(() => {
        return Intl.DateTimeFormat().resolvedOptions();
    }, []);

    useLayoutEffect(() => {
        const TIMEZONE = props?.timezone || timeFormatOptions.timeZone;
        const LOCALE = props?.locale || timeFormatOptions.locale;
        const DATE_FORMAT = props?.format || "HH:mm:ss dd/MMM/yyyy";

        const controller = new AbortController();

        const getCurrentTime = () => {
            const time = new Date().toLocaleString(LOCALE, { timeZone: TIMEZONE });
            const formated = format(new Date(time), DATE_FORMAT);

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
    }, [
        props?.format,
        props?.locale,
        props?.timezone,
        timeFormatOptions.locale,
        timeFormatOptions.timeZone,
    ]);

    return <Box component="time" ref={timeEl} />;
};

export default memo(Clock);
