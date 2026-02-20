import { memo, useId } from "react";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    type FormControlProps,
    type MenuItemProps,
    type SelectProps,
} from "@mui/material";

export type SelectItemType<TValue = string | number> = {
    value: TValue;
    label?: React.ReactNode;
    menuItemProps?: MenuItemProps;
};

type SelectMainProps = {
    items: SelectItemType[];
    formControlProps?: FormControlProps;
} & SelectProps<string>;

const SelectMain = ({ label, items, formControlProps, ...rest }: SelectMainProps) => {
    const labelId = useId();

    return (
        <FormControl size="small" fullWidth {...formControlProps}>
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

export default memo(SelectMain);
