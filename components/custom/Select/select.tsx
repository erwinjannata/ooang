import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
  allowAll?: boolean;
  allLabel?: string;
  className?: string;
};

function CustomSelect({
  value,
  onChange,
  label,
  groups,
  className,
  allowAll = false,
  allLabel,
  ...props
}: Props) {
  return (
    <Select value={value} onValueChange={onChange} disabled={props.disabled}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={label} {...props} />
      </SelectTrigger>
      <SelectContent>
        {groups.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel className="capitalize">{group.label}</SelectLabel>
            {allowAll && (
              <SelectItem value="all" className="font-medium">
                {allLabel}
              </SelectItem>
            )}
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
