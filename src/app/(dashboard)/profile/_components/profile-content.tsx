"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User, Mail, Phone, MapPin, Home, Hash,
  Camera, Eye, EyeOff, ChevronRight, Lock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FormGroup } from "@/components/common/FormGroup";
import { CommonCard } from "@/components/common/CommonCard";
import { ActionFooter } from "@/components/common/ActionFooter";
import { ImageCropper } from "@/components/common/ImageCropper";
import { LocationSelects, type LocationValues } from "@/components/common/LocationSelects";
import {
  useClientMe,
  useUpdateClientProfile,
  useChangeClientPassword,
} from "@/hooks/use-client-auth";
import { resolveMediaUrl } from "@/lib/utils";
import { validateMobile } from "@/lib/validation";

// ─── Password Strength ────────────────────────────────────────────────────────
function getPasswordStrength(pw: string): { level: 0 | 1 | 2 | 3 | 4; label: string; color: string; bg: string } {
  if (!pw) return { level: 0, label: "", color: "", bg: "" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { level: 1, label: "Weak",       color: "bg-rose-500",    bg: "text-rose-500" };
  if (score === 2) return { level: 2, label: "Fair",       color: "bg-amber-400",   bg: "text-amber-500" };
  if (score === 3) return { level: 3, label: "Strong",     color: "bg-emerald-500", bg: "text-emerald-600" };
  return               { level: 4, label: "Very Strong", color: "bg-blue-500",    bg: "text-blue-600" };
}

function PasswordStrengthBar({ password }: { password: string }) {
  if (!password || password.length === 0) return null;
  const strength = getPasswordStrength(password);
  const hints: Record<number, string> = {
    1: "Use uppercase, numbers & symbols",
    2: "Add numbers or symbols",
    3: "Add symbols for max security",
    4: "Excellent password!",
  };
  return (
    <div className="space-y-1.5 px-0.5 pt-1">
      <div className="flex gap-1 h-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : "bg-muted"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${strength.bg}`}>{strength.label}</span>
        <span className="text-[10px] text-muted-foreground">{hints[strength.level] ?? ""}</span>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ProfileContent() {
  const { data: client, isLoading } = useClientMe();
  const updateMutation = useUpdateClientProfile();
  const passwordMutation = useChangeClientPassword();

  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: "", mobile: "", address: "",
    country: "", state: "", district: "", city: "", locality: "", pincode: "",
  });

  const [passwordData, setPasswordData] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (client) {
      setProfilePic(client.profile_pic ? resolveMediaUrl(client.profile_pic) : null);
      setFormData({
        name:     client.name     || "",
        mobile:   client.mobile   || "",
        address:  client.address  || "",
        country:  client.country  || "",
        state:    client.state    || "",
        district: client.district || "",
        city:     client.city     || "",
        locality: client.locality || "",
        pincode:  client.pincode  || "",
      });
    }
  }, [client]);

  const set = (key: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSave = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    const newErrors: Record<string, string> = {};
    const mobileErr = validateMobile(formData.mobile);
    if (mobileErr) newErrors.mobile = mobileErr;
    if (Object.keys(newErrors).length) { setErrors(newErrors); toast.error("Please correct the errors"); return; }
    const { name: _name, ...editableData } = formData;
    await updateMutation.mutateAsync({ ...editableData, profile_pic: profilePic });
  };

  const handleReset = () => {
    if (!client) return;
    setProfilePic(client.profile_pic ? resolveMediaUrl(client.profile_pic) : null);
    setFormData({
      name: client.name || "", mobile: client.mobile || "", address: client.address || "",
      country: client.country || "", state: client.state || "", district: client.district || "",
      city: client.city || "", locality: client.locality || "", pincode: client.pincode || "",
    });
  };

  const validateNewPassword = (pw: string): string => {
    if (!pw)                        return "New password is required";
    if (/\s/.test(pw))              return "Password must not contain spaces";
    if (pw.length < 8)              return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pw))         return "Must include at least 1 uppercase letter";
    if (!/[a-z]/.test(pw))         return "Must include at least 1 lowercase letter";
    if (!/[0-9]/.test(pw))         return "Must include at least 1 number";
    if (!/[^A-Za-z0-9]/.test(pw))  return "Must include at least 1 special character";
    return "";
  };

  const handlePasswordSave = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!passwordData.current_password) { toast.error("Current password is required"); return; }
    const pwErr = validateNewPassword(passwordData.new_password);
    if (pwErr) { toast.error(pwErr); return; }
    if (!passwordData.confirm_password) { toast.error("Confirm password is required"); return; }
    if (passwordData.current_password.trim() === passwordData.new_password.trim()) { toast.error("New password must be different from current password"); return; }
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("Confirm password does not match");
      return;
    }
    await passwordMutation.mutateAsync({
      current_password: passwordData.current_password,
      new_password: passwordData.new_password,
    });
    setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("Image size exceeds 10MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setImageToCrop(reader.result as string); setCropperOpen(true); e.target.value = ""; };
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background p-4 sm:p-6 lg:p-8">
      <div className="client-page-shell space-y-6">

        {/* Page Header */}
        <div className="flex flex-col gap-1 border-b border-border pb-5">
          <Badge variant="outline" className="w-fit rounded-sm px-2 py-1 text-[11px] uppercase tracking-[0.16em]">
            Client Portal
          </Badge>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground">
              <User className="size-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">My Profile</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Update your personal details, address and account password.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 pb-10">

          {/* ── Left Column ────────────────────────────────── */}
          <div className="flex-[2] space-y-6">

            {/* Personal Information */}
            <CommonCard title="Personal Information" subtitle="Your basic contact details" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <FormGroup label="Full Name" icon={User} error={errors.name} required>
                  <Input value={formData.name} readOnly disabled placeholder="Full name"
                    className="h-10 pl-12 rounded-sm bg-muted/50 cursor-default opacity-70" />
                </FormGroup>

                <FormGroup label="Mobile Number" icon={Phone} error={errors.mobile} required>
                  <Input value={formData.mobile} onChange={set("mobile")} placeholder="Enter mobile number"
                    className={`h-10 pl-12 rounded-sm ${errors.mobile ? "border-rose-500" : ""}`} />
                </FormGroup>

                <FormGroup label="Email Address" icon={Mail}>
                  <Input value={client?.email || ""} readOnly
                    className="h-10 pl-12 rounded-sm bg-muted/50 cursor-default opacity-70" />
                </FormGroup>
              </div>
            </CommonCard>

            {/* Address Details */}
            <CommonCard title="Address Details" subtitle="Physical location and correspondence info"
              icon={MapPin} iconColorClass="text-orange-600" iconBgClass="bg-orange-50 dark:bg-orange-500/10">
              <div className="space-y-5">
                <FormGroup label="Street Address" icon={Home} iconTop>
                  <textarea value={formData.address} onChange={set("address")} placeholder="Enter full address"
                    className="w-full pl-12 pr-3 py-3 border border-input bg-background rounded-sm outline-none transition-all text-sm min-h-[90px] resize-none focus:ring-2 focus:ring-ring" />
                </FormGroup>

                <LocationSelects
                  values={{ country: formData.country, state: formData.state, district: formData.district, city: formData.city }}
                  onChange={(loc: LocationValues) => setFormData((prev) => ({ ...prev, ...loc }))}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                  <FormGroup label="Locality" icon={MapPin}>
                    <Input value={formData.locality} onChange={set("locality")} placeholder="Enter locality"
                      className="h-10 pl-12 rounded-sm" />
                  </FormGroup>

                  <FormGroup label="Pincode" icon={Hash}>
                    <Input value={formData.pincode} onChange={set("pincode")} placeholder="Enter pincode"
                      className="h-10 pl-12 rounded-sm" />
                  </FormGroup>
                </div>
              </div>
            </CommonCard>

            {/* Change Password */}
            <CommonCard title="Change Password" subtitle="Update your login password"
              icon={Lock} iconColorClass="text-violet-600" iconBgClass="bg-violet-50 dark:bg-violet-500/10">
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                  <FormGroup label="Current Password" icon={Lock} error={passwordErrors.current_password}>
                    <Input type={showCurrent ? "text" : "password"} value={passwordData.current_password}
                      onChange={(e) => { setPasswordData((p) => ({ ...p, current_password: e.target.value })); setPasswordErrors((p) => ({ ...p, current_password: "" })); }}
                      onBlur={(e) => { if (!e.target.value) setPasswordErrors((p) => ({ ...p, current_password: "Current password is required" })); }}
                      placeholder="Enter current password" className={`h-10 pl-12 pr-10 rounded-sm ${passwordErrors.current_password ? "border-rose-500" : ""}`} />
                    <button type="button" onClick={() => setShowCurrent((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </FormGroup>

                  <FormGroup label="New Password" icon={Lock} error={passwordErrors.new_password}>
                    <Input type={showNew ? "text" : "password"} value={passwordData.new_password}
                      onChange={(e) => { setPasswordData((p) => ({ ...p, new_password: e.target.value })); setPasswordErrors((p) => ({ ...p, new_password: "" })); }}
                      onBlur={(e) => {
                        const v = e.target.value;
                        const err = validateNewPassword(v);
                        if (err) { setPasswordErrors((p) => ({ ...p, new_password: err })); return; }
                        if (v.trim() === passwordData.current_password.trim()) setPasswordErrors((p) => ({ ...p, new_password: "Must differ from current password" }));
                      }}
                      placeholder="Enter new password" className={`h-10 pl-12 pr-10 rounded-sm ${passwordErrors.new_password ? "border-rose-500" : ""}`} />
                    <button type="button" onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </FormGroup>

                  <FormGroup label="Confirm Password" icon={Lock} error={passwordErrors.confirm_password}>
                    <Input type={showConfirm ? "text" : "password"} value={passwordData.confirm_password}
                      onChange={(e) => { setPasswordData((p) => ({ ...p, confirm_password: e.target.value })); setPasswordErrors((p) => ({ ...p, confirm_password: "" })); }}
                      onBlur={(e) => {
                        const v = e.target.value;
                        if (!v) { setPasswordErrors((p) => ({ ...p, confirm_password: "Confirm password is required" })); return; }
                        if (v !== passwordData.new_password) setPasswordErrors((p) => ({ ...p, confirm_password: "Passwords do not match" }));
                      }}
                      placeholder="Confirm new password" className={`h-10 pl-12 pr-10 rounded-sm ${passwordErrors.confirm_password ? "border-rose-500" : ""}`} />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </FormGroup>
                </div>

                {/* Strength bar — full width, only when new password has value */}
                <PasswordStrengthBar password={passwordData.new_password} />

                <div>
                  <Button type="button" onClick={() => handlePasswordSave()} disabled={passwordMutation.isPending}
                    variant="outline" className="h-9 px-6 rounded-sm text-[12px] font-bold uppercase tracking-wider">
                    {passwordMutation.isPending ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>
            </CommonCard>
          </div>

          {/* ── Right Column ─────────────────────────────────── */}
          <div className="lg:w-72 space-y-5 lg:sticky lg:top-6 self-start">

            {/* Save Actions */}
            <div className="bg-card rounded-sm border border-border p-5 shadow-sm">
              <ActionFooter onSave={handleSave} onCancel={handleReset}
                saveLabel="Save Profile" cancelLabel="Reset Changes"
                isSubmitting={updateMutation.isPending} />
            </div>

            {/* Profile Photo */}
            <div className="bg-card rounded-sm border border-border p-6 shadow-sm text-center space-y-4">
              <div className="relative w-28 h-28 mx-auto">
                <Avatar className="w-full h-full rounded-full border-4 border-background shadow-lg">
                  <AvatarImage src={profilePic || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl font-black">
                    {client?.name?.charAt(0)?.toUpperCase() || "C"}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-md hover:opacity-90 transition-opacity border-2 border-background z-10">
                  <Camera size={14} />
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">{client?.name}</p>
                <p className="text-xs text-muted-foreground">{client?.email}</p>
              </div>
              <p className="text-[10px] text-muted-foreground italic">Max 10MB · JPG, PNG</p>
            </div>

            {/* Account Info */}
            <div className="bg-card rounded-sm border border-border p-5 shadow-sm space-y-3">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Account Info</p>
              {[
                { label: "Type",      value: client?.registration_type ? (client.registration_type.charAt(0).toUpperCase() + client.registration_type.slice(1)) : "—" },
                { label: "Plan",      value: client?.plan || null },
                { label: "Client ID", value: client?.client_id || `#${client?.id}` },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <ChevronRight size={12} className="text-muted-foreground/50" /> {row.label}
                  </span>
                  {row.label === "Plan" && !row.value ? (
                    <Link
                      href="/subscription"
                      className="rounded-sm border border-primary/30 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      Choose Plan
                    </Link>
                  ) : (
                    <span className="text-[12px] font-bold text-foreground">{row.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ImageCropper open={cropperOpen} imageSrc={imageToCrop || ""} onClose={() => setCropperOpen(false)}
        onCropComplete={(b64) => { setProfilePic(b64); setCropperOpen(false); setImageToCrop(null); }}
        aspectRatio={1} outputWidth={400} outputHeight={400} />
    </div>
  );
}
