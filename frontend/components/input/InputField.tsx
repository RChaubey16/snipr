import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function InputField({
  id,
  label,
  description = "",
  showDescription = true,
  type = "text",
  placeholder = "",
}: {
  id: string;
  label: string;
  description?: string;
  showDescription?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <Field className="w-80">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} type={type} placeholder={placeholder} />
      {showDescription && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
