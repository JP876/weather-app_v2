import { memo, useId } from "react";
import InputLabel from "@mui/material/InputLabel";
import FormControl, { type FormControlProps } from "@mui/material/FormControl";
import MenuItem, { type MenuItemProps } from "@mui/material/MenuItem";
import Select, { type SelectProps } from "@mui/material/Select";

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
