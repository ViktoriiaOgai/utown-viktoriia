import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../components/MainLayout";
import { api } from "../../../services/api";
import { getErrorMessage } from "../../../utils/establishments";
import { validateClient } from "../../../utils/clientValidation";
import ClientForm from "./ClientForm";

type FormErrors = { name?: string; phone?: string; address?: string };

export default function AddClientPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const e = validateClient(name, phone, address);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async () => {
    if (!validate()) return;
    setError("");
    setIsSaving(true);
    try {
      await api.post("/admin/clients", {
        fullName: name.trim(),
        username: phone.trim(),
        address: address.trim(),
        role: "CLIENT",
      });
      navigate("/admin/clients");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to add client"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <ClientForm
        title="Add new client"
        crumbLabel="Add"
        name={name}
        phone={phone}
        address={address}
        onNameChange={setName}
        onPhoneChange={setPhone}
        onAddressChange={setAddress}
        onSubmit={handleAdd}
        isSaving={isSaving}
        error={error}
        errors={errors}
        submitLabel="Add"
      />
    </MainLayout>
  );
}
