import { memo } from "react";
import { Box, Collapse, Stack, Typography } from "@mui/material";
import { useAtomValue } from "jotai";

import DailyChart from "./DailyChart";
import DailyList from "./DailyList";
import UserSettings from "./UserSettings";
import { userSettingsAtom } from "../../../../atoms";

const ListContainer = ({ children }: { children: React.ReactNode }) => {
    const settings = useAtomValue(userSettingsAtom);
    return <Collapse in={settings.daily.list}>{children}</Collapse>;
};

const GraphContainer = ({ children }: { children: React.ReactNode }) => {
    const settings = useAtomValue(userSettingsAtom);
    return <Collapse in={settings.daily.graph}>{children}</Collapse>;
};

const DailyMain = () => {
    return (
        <Box component="section">
            <Stack
                justifyContent="space-between"
                gap={2}
                sx={(theme) => ({
                    marginBottom: theme.spacing(4),
                    flexDirection: "row",
                    [theme.breakpoints.down("lg")]: {
                        flexDirection: "column",
                    },
                })}
            >
                <Typography variant="h5">Daily Forecast</Typography>
                <UserSettings />
            </Stack>
            <ListContainer>
                <DailyList />
            </ListContainer>
            <GraphContainer>
                <Box mt={2}>
                    <DailyChart />
                </Box>
            </GraphContainer>
        </Box>
    );
};

export default memo(DailyMain);
