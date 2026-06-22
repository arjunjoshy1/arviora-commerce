export interface ShippingFields {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
}

interface ShippingFormProps {
  values: ShippingFields;
  onChange: (field: keyof ShippingFields, value: string) => void;
}

interface FieldConfig {
  name: keyof ShippingFields;
  label: string;
  placeholder: string;
  required: boolean;
  half?: boolean;
}

const FIELDS: FieldConfig[] = [
  { name: 'name', label: 'Full name', placeholder: 'Asha Rao', required: true },
  {
    name: 'phone',
    label: 'Phone',
    placeholder: '9876543210',
    required: true,
  },
  {
    name: 'line1',
    label: 'Address line 1',
    placeholder: 'House no, street',
    required: true,
  },
  {
    name: 'line2',
    label: 'Address line 2 (optional)',
    placeholder: 'Area, landmark',
    required: false,
  },
  {
    name: 'city',
    label: 'City',
    placeholder: 'Bengaluru',
    required: true,
    half: true,
  },
  {
    name: 'state',
    label: 'State',
    placeholder: 'Karnataka',
    required: true,
    half: true,
  },
  {
    name: 'postalCode',
    label: 'PIN code',
    placeholder: '560001',
    required: true,
    half: true,
  },
];

const ShippingForm = ({ values, onChange }: ShippingFormProps) => (
  <div className="grid grid-cols-2 gap-4">
    {FIELDS.map((field) => (
      <div
        key={field.name}
        className={field.half ? 'col-span-1' : 'col-span-2'}
      >
        <label
          htmlFor={field.name}
          className="mb-1.5 block text-sm font-medium"
        >
          {field.label}
        </label>
        <input
          id={field.name}
          value={values[field.name]}
          required={field.required}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.name, e.target.value)}
          className="w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none transition focus:border-ink focus:bg-surface"
        />
      </div>
    ))}
  </div>
);

export default ShippingForm;
