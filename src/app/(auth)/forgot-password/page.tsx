"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePublicBranding } from "@/hooks/use-public-branding";
import { resolveMediaUrl } from "@/lib/utils";
import { useForgotClientPassword, useResetClientPassword } from "@/hooks/use-client-auth";

const passwordPolicy = (v: string): string => {
  if (!v) return "Password is required.";
  if (/\s/.test(v)) return "Password must not contain spaces.";
  if (v.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(v)) return "Must include at least 1 uppercase letter.";
  if (!/[a-z]/.test(v)) return "Must include at least 1 lowercase letter.";
  if (!/[0-9]/.test(v)) return "Must include at least 1 number.";
  if (!/[^A-Za-z0-9]/.test(v)) return "Must include at least 1 special character.";
  return "";
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { data: branding } = usePublicBranding();
  const logoSrc = branding?.logo ? resolveMediaUrl(branding.logo) : null;
  const [logoError, setLogoError] = useState(false);

  // Step 1: email entry
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Step 2: OTP + new password
  const [step, setStep] = useState<1 | 2>(1);
  const [resetCode, setResetCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const forgotMutation = useForgotClientPassword();
  const resetMutation = useResetClientPassword();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/;
    if (!email.trim()) { setEmailError("Email is required."); return; }
    if (!emailRegex.test(email.trim())) { setEmailError("Enter a valid email address."); return; }
    setEmailError("");

    const res = await forgotMutation.mutateAsync({ email: email.trim() }).catch(() => null);
    if (res?.success) {
      setGeneratedCode(res.data?.reset_code ?? null);
      setStep(2);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!resetCode.trim()) errs.resetCode = "Reset code is required.";
    const pwErr = passwordPolicy(newPassword);
    if (pwErr) errs.newPassword = pwErr;
    if (!confirmPassword) errs.confirmPassword = "Please confirm your new password.";
    else if (newPassword !== confirmPassword) errs.confirmPassword = "Passwords do not match.";
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});

    const res = await resetMutation.mutateAsync({
      email: email.trim(),
      reset_code: resetCode.trim(),
      new_password: newPassword,
    }).catch(() => null);

    if (res?.success) {
      setTimeout(() => router.push("/login"), 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 py-12 overflow-y-auto">
      <style jsx global>{`
        input::-ms-reveal, input::-ms-clear { display: none; }
      `}</style>

      <div className="w-full max-w-md relative">
        {/* Floating Logo */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-10">
          <div className="h-14 w-14 rounded-lg bg-card p-1 shadow-md border border-border/50 overflow-hidden relative">
            <div className="h-full w-full relative rounded-md overflow-hidden flex items-center justify-center">
              {!logoSrc || logoError ? (
                <Building2 className="size-7 text-primary" />
              ) : (
                <Image src={logoSrc} alt={branding?.name || "Client Portal"} fill priority className="object-cover" onError={() => setLogoError(true)} />
              )}
            </div>
          </div>
        </div>

        <Card className="w-full shadow-lg border-0 pt-6">
          <CardHeader className="items-center pb-0 pt-2">
            <h4 className="text-2xl font-bold tracking-tight text-foreground">
              {step === 1 ? "Forgot Password" : "Reset Password"}
            </h4>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              {step === 1
                ? "Enter your registered email to receive a reset code."
                : "Enter the reset code and set your new password."}
            </p>
          </CardHeader>

          <CardContent className="pb-6">
            {step === 1 ? (
              <form onSubmit={handleRequestCode} noValidate className="space-y-3 mt-4">
                <div className="space-y-0.5">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="client@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    onBlur={() => {
                      if (!email.trim()) setEmailError("Email is required.");
                      else if (!/^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/.test(email.trim())) setEmailError("Enter a valid email address.");
                    }}
                    className={emailError ? "rounded-sm border-red-500 focus-visible:ring-red-500" : "rounded-sm"}
                  />
                  {emailError && <p className="text-xs text-red-500">{emailError}</p>}
                </div>

                <Button type="submit" className="w-full uppercase tracking-widest font-semibold h-9 mt-1" disabled={forgotMutation.isPending}>
                  {forgotMutation.isPending ? "Sending..." : "Get Reset Code"}
                </Button>

                <p className="text-center text-xs text-muted-foreground pt-1">
                  <Link href="/login" className="text-primary hover:underline font-medium">Back to Login</Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} noValidate className="space-y-3 mt-4">
                {/* Show generated code (dev/demo — remove when email sending is live) */}
                {generatedCode && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Your Reset Code</p>
                    <p className="text-2xl font-black tracking-[0.4em] text-amber-800">{generatedCode}</p>
                    <p className="text-[10px] text-amber-600 mt-1">Valid for 15 minutes. Copy this code before proceeding.</p>
                  </div>
                )}

                <div className="space-y-0.5">
                  <Label htmlFor="resetCode" className="text-xs">Reset Code</Label>
                  <Input
                    id="resetCode"
                    placeholder="Enter 6-digit code"
                    value={resetCode}
                    onChange={(e) => { setResetCode(e.target.value); setFieldErrors((p) => ({ ...p, resetCode: "" })); }}
                    className={fieldErrors.resetCode ? "rounded-sm border-red-500" : "rounded-sm"}
                    maxLength={6}
                  />
                  {fieldErrors.resetCode && <p className="text-xs text-red-500">{fieldErrors.resetCode}</p>}
                </div>

                <div className="space-y-0.5">
                  <Label htmlFor="newPassword" className="text-xs">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      placeholder="Min 8 chars, upper, lower, number, symbol"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setFieldErrors((p) => ({ ...p, newPassword: "" })); }}
                      onBlur={() => { const e = passwordPolicy(newPassword); if (e) setFieldErrors((p) => ({ ...p, newPassword: e })); }}
                      className={`pr-10 ${fieldErrors.newPassword ? "rounded-sm border-red-500" : "rounded-sm"}`}
                    />
                    <button type="button" tabIndex={-1} onMouseDown={(e) => e.preventDefault()} onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showNew ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </button>
                  </div>
                  {fieldErrors.newPassword && <p className="text-xs text-red-500">{fieldErrors.newPassword}</p>}
                </div>

                <div className="space-y-0.5">
                  <Label htmlFor="confirmPassword" className="text-xs">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors((p) => ({ ...p, confirmPassword: "" })); }}
                      onBlur={() => { if (confirmPassword && confirmPassword !== newPassword) setFieldErrors((p) => ({ ...p, confirmPassword: "Passwords do not match." })); }}
                      className={`pr-10 ${fieldErrors.confirmPassword ? "rounded-sm border-red-500" : "rounded-sm"}`}
                    />
                    <button type="button" tabIndex={-1} onMouseDown={(e) => e.preventDefault()} onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showConfirm ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && <p className="text-xs text-red-500">{fieldErrors.confirmPassword}</p>}
                </div>

                <Button type="submit" className="w-full uppercase tracking-widest font-semibold h-9 mt-1" disabled={resetMutation.isPending}>
                  {resetMutation.isPending ? "Resetting..." : "Reset Password"}
                </Button>

                <p className="text-center text-xs text-muted-foreground pt-1">
                  <button type="button" onClick={() => setStep(1)} className="text-primary hover:underline font-medium">
                    Use a different email
                  </button>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
