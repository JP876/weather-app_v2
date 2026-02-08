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
        <Box>
            <Stack direction="row" mb={4} justifyContent="space-between" gap={2}>
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
