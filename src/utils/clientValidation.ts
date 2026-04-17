type FormErrors = { name?: string; phone?: string; address?: string };

export function validateClient(name: string, phone: string, address: string): FormErrors {
  const e: FormErrors = {};

  if (!name.trim()) e.name = "Name is required";

  if (!phone.trim()) e.phone = "Phone number is required";
  else if (!/^\+?[\d\s\-()]{7,}$/.test(phone.trim())) {
    e.phone = "Invalid phone number";
  }

  if (!address.trim()) e.address = "Delivery address is required";

  return e;
}
