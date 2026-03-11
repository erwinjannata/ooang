import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";
import { ControllerRenderProps } from "react-hook-form";
import { NumericFormat } from "react-number-format";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldData: ControllerRenderProps<any, any>;
  loading: boolean;
  className?: string;
};

function CurrencyInput({ fieldData, loading, className }: Props) {
  return (
    <ButtonGroup className="w-full">
      <Button
        variant="outline"
        className="w-10 select-none font-medium"
        disabled
      >
        Rp.
      </Button>
      <NumericFormat
        value={fieldData.value}
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        allowNegative={false}
        onValueChange={(values) => {
          fieldData.onChange(
            values.floatValue! >= 0 ? values.floatValue : null,
          );
        }}
        placeholder="0.00"
        disabled={loading}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-medium",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
      />
    </ButtonGroup>
  );
}

export default CurrencyInput;
