import { useId } from "react";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    type MenuItemProps,
    type SelectProps,
} from "@mui/material";

export type SelectItemType = {
    value: string | number;
    label?: React.ReactNode;
    menuItemProps?: MenuItemProps;
};

type SelectMainProps = { items: SelectItemType[] } & SelectProps;

const SelectMain = ({ label, items, ...rest }: SelectMainProps) => {
    const labelId = useId();

    return (
        <FormControl size="small" fullWidth>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select id="simple-select" label={label} {...rest} labelId={labelId}>
                {items.map((item, index) => {
                    return (
                        <MenuItem key={index} value={item.value} {...item.menuItemProps}>
                            {item.label}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};

export default SelectMain;
