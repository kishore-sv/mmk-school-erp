"use client"

import { indianStates } from "@/config/contact"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

type StateComboboxProps = {
  id: string
  value: string
  onChange: (value: string) => void
  invalid?: boolean
  disabled?: boolean
  placeholder?: string
}

export function StateCombobox({
  id,
  value,
  onChange,
  invalid,
  disabled,
  placeholder = "Search or select state",
}: StateComboboxProps) {
  const items = [...indianStates]

  return (
    <Combobox
      items={items}
      value={value || null}
      onValueChange={(next) => onChange(next ?? "")}
    >
      <ComboboxInput
        id={id}
        placeholder={placeholder}
        aria-invalid={invalid}
        disabled={disabled}
        className="w-full"
        autoComplete="address-level1"
      />
      <ComboboxContent>
        <ComboboxEmpty>No state found.</ComboboxEmpty>
        <ComboboxList>
          {(state: string) => (
            <ComboboxItem key={state} value={state}>
              {state}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}