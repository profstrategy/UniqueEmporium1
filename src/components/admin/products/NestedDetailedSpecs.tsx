"use client";

import React from "react";
import { useFieldArray, Control, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MinusCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductFormData } from "./ProductForm.tsx"; // Corrected import path

interface NestedFieldArrayProps {
  control: Control<ProductFormData>;
  name: `detailedSpecs.${number}.items`;
  errors: FieldErrors<ProductFormData>;
}

const NestedDetailedSpecs = ({ control, name, errors }: NestedFieldArrayProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
    keyName: "id",
  });

  return (
    <div className="space-y-2">
      {fields.map((itemField, itemIndex) => (
        <div key={itemField.id} className="flex items-center space-x-2">
          <Input
            {...control.register(`${name}.${itemIndex}.label` as const)}
            placeholder="Label (e.g., Color)"
            className={cn(errors?.[name]?.[itemIndex]?.label && "border-destructive")}
          />
          <Input
            {...control.register(`${name}.${itemIndex}.value` as const)}
            placeholder="Value (e.g., Black)"
            className={cn(errors?.[name]?.[itemIndex]?.value && "border-destructive")}
          />
          <Input
            {...control.register(`${name}.${itemIndex}.icon` as const)}
            placeholder="Icon (Lucide name, optional)"
            className="w-32"
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(itemIndex)}>
            <MinusCircle className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ label: "", value: "", icon: "" })}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Item
      </Button>
    </div>
  );
};

export default NestedDetailedSpecs;