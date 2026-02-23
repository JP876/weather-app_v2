import { lazy, memo, Suspense, useState } from "react";
import { Button, styled, Typography } from "@mui/material";
import AttributionIcon from "@mui/icons-material/Attribution";

import { GlassContainer } from "../ui/styledComps";
import { NUM_OF_COLUMNS } from "../../consts";

const AttributionModal = lazy(() => import("./AttributionModal"));

const FooterContainer = styled(GlassContainer)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "var(--footer_height)",
    borderTop: `1px solid ${theme.palette.grey[400]}`,
    paddingInline: theme.spacing(4),

    gridRowStart: 3,
    gridColumnStart: 1,
    gridColumnEnd: NUM_OF_COLUMNS + 1,
}));

const FooterMain = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <FooterContainer component="footer" onlyTopShadow>
                <Button
                    startIcon={<AttributionIcon />}
                    size="small"
                    variant="outlined"
                    onClick={() => setOpen(true)}
                >
                    Attributions
                </Button>
                <Typography variant="body1">Developed by Josip Popović</Typography>
            </FooterContainer>

            <Suspense fallback={null}>
                <AttributionModal open={open} onClose={() => setOpen(false)} />
            </Suspense>
        </>
    );
};

export default memo(FooterMain);
