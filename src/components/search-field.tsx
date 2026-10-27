import { Search } from "lucide-react";
import { TextField } from "@radix-ui/themes";

type SearchFieldProps = {
  defaultValue: string;
  placeholder: string;
  /** Read by screen readers, since the field has no visible label. */
  label: string;
};

/**
 * The search box used on list pages. Put it inside a GET <form>: submitting
 * sends its value as `?q=`, which the page reads from its search params.
 */
export default function SearchField({
  defaultValue,
  placeholder,
  label,
}: SearchFieldProps) {
  return (
    <TextField.Root
      type="search"
      name="q"
      size="3"
      defaultValue={defaultValue}
      placeholder={placeholder}
      aria-label={label}
    >
      <TextField.Slot>
        <Search size={16} />
      </TextField.Slot>
    </TextField.Root>
  );
}
