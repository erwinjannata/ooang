import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { ControllerRenderProps } from "react-hook-form";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldData: ControllerRenderProps<any, any>;
  loading: boolean;
};

function CurrencyInput({ fieldData, loading }: Props) {
  return (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>Rp.</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        {...fieldData}
        placeholder="0.00"
        type="text"
        value={fieldData?.value?.toLocaleString("id-ID") || ""}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");
          fieldData.onChange(value ? parseInt(value) : 0);
        }}
        disabled={loading}
      />
    </InputGroup>
  );
}

export default CurrencyInput;
