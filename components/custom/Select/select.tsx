import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = React.ComponentProps<"select"> & {
  value?: string;
  onChange: (value: string) => void;
  label: string;
  groups: {
    label: string;
    items: {
      label: string;
      value: string;
    }[];
  }[];
};

function CustomSelect({ value, onChange, label, groups, ...props }: Props) {
  return (
    <Select value={value} onValueChange={onChange} disabled={props.disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={label} {...props} />
      </SelectTrigger>
      <SelectContent>
        {groups.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel className="capitalize">{group.label}</SelectLabel>
            {group.items.map((item) => (
              <SelectItem key={item.label} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}

export default CustomSelect;
