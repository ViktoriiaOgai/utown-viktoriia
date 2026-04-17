import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../../components/MainLayout";
import ClientForm from "../ClientForm";
import { api } from "../../../../services/api";
import { getErrorMessage } from "../../../../utils/establishments";
import { validateClient } from "../../../../utils/clientValidation";

type FormErrors = { name?: string; phone?: string; address?: string };

export default function EditClientPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    setError("");

    api
      .get(`/admin/clients/${id}`)
      .then((r) => {
        const data = r.data?.data ?? r.data;
        setName(String(data?.name ?? ""));
        setPhone(String(data?.phone ?? ""));
        setAddress(String(data?.address ?? ""));
      })
      .catch((err) => {
        setError(getErrorMessage(err, "Failed to load client"));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const validate = (): boolean => {
    const e = validateClient(name, phone, address);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!id) return;
    if (!validate()) return;

    setError("");
    setIsSaving(true);

    try {
      await api.put(`/admin/clients/${id}`, {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      navigate("/admin/clients");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save client"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div style={{ padding: "2rem" }}>Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ClientForm
        title="Edit client"
        crumbLabel="Edit"
        name={name}
        phone={phone}
        address={address}
        onNameChange={setName}
        onPhoneChange={setPhone}
        onAddressChange={setAddress}
        onSubmit={handleSave}
        isSaving={isSaving}
        error={error}
        errors={errors}
        submitLabel="Save"
      />
    </MainLayout>
  );
}
