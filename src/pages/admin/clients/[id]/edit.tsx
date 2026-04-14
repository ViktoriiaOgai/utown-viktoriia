import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../../../components/MainLayout";
import { api } from "../../../../services/api";
import { getErrorMessage } from "../../../../utils/establishments";
import ClientForm from "../ClientForm";
import "../clients.scss";

type FormErrors = { name?: string; phone?: string; address?: string };

export default function EditClientPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    api
      .get(`/admin/clients/${id}`)
      .then((data: unknown) => {
        const d = data as Record<string, unknown>;
        const details = (d?.data ?? d) as Record<string, unknown>;
        const addr = (details?.address as Record<string, unknown> | undefined) ?? {};
        setName(String(details?.name ?? details?.fullName ?? ""));
        setPhone(String(details?.phone ?? details?.phoneNumber ?? ""));
        setAddress(String(details?.fullAddress ?? addr?.fullAddress ?? addr?.details ?? ""));
      })
      .catch((err: unknown) => {
        setError(getErrorMessage(err, "Failed to load client"));
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!name.trim()) e.name = "Name is required";
    if (!phone.trim()) e.phone = "Phone number is required";
    else if (!/^\+?[\d\s\-()]{7,}$/.test(phone.trim())) e.phone = "Invalid phone number";
    if (!address.trim()) e.address = "Delivery address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (!id) return;
    setError("");
    setIsSaving(true);
    try {
      await api.put(`/admin/clients/${id}`, {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      navigate("/admin/clients");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to save client"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="client-page">
          <div className="client-page__loading">Loading...</div>
        </div>
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
