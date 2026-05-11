"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function ClientLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });

  const validateEmail = (v: string) => {
    if (!v.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()))
      return "Enter a valid email address.";
    return "";
  };

  const validatePassword = (v: string) => {
    if (!v) return "Password is required.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    setErrors({ email: emailErr, password: passwordErr });
    setTouched({ email: true, password: true });
    if (emailErr || passwordErr) return;

    setLoading(true);
    try {
      // Set a short-lived pending cookie so middleware allows the redirect
      const secureFlag = location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `client_auth_pending=true; path=/; max-age=15; SameSite=Lax${secureFlag}`;

      const res = await fetch("/api/clients/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw { response: { data: errData } };
      }

      toast.success("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.assign("/dashboard");
      }, 300);
    } catch (err: unknown) {
      document.cookie =
        "client_auth_pending=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Invalid email or password.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field: keyof typeof errors) =>
    touched[field] && errors[field]
      ? "rounded-sm border-red-500 focus-visible:ring-red-500"
      : touched[field] && !errors[field]
        ? "rounded-sm border-green-500 focus-visible:ring-green-500"
        : "rounded-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 py-12 overflow-y-auto">
      <style jsx global>{`
        input::-ms-reveal,
        input::-ms-clear {
          display: none;
        }
      `}</style>

      <div className="w-full max-w-md relative">
        {/* Floating Logo */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-10">
          <div className="h-14 w-14 rounded-lg bg-card p-1 shadow-md border border-border/50 overflow-hidden relative">
            <div className="h-full w-full relative rounded-md overflow-hidden">
              <Image
                src="/vendor-logo.png"
                alt="Client Portal"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <Card className="w-full shadow-lg border-0 pt-6">
          <CardHeader className="items-center pb-0 pt-2">
            <h4 className="text-2xl font-bold tracking-tight text-foreground">
              Client Login
            </h4>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              Welcome back! Sign in to access your client portal.
            </p>
          </CardHeader>

          <CardContent className="pb-6">
            <form onSubmit={handleSubmit} noValidate className="space-y-3 mt-4">
              {/* Email */}
              <div className="space-y-0.5">
                <Label htmlFor="email" className="text-xs">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="client@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                  }}
                  onBlur={() => {
                    setTouched((p) => ({ ...p, email: true }));
                    setErrors((p) => ({ ...p, email: validateEmail(email) }));
                  }}
                  className={fieldClass("email")}
                />
                {touched.email && errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-0.5">
                <Label htmlFor="password" className="text-xs">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((p) => ({ ...p, password: "" }));
                    }}
                    onBlur={() => {
                      setTouched((p) => ({ ...p, password: true }));
                      setErrors((p) => ({
                        ...p,
                        password: validatePassword(password),
                      }));
                    }}
                    className={`pr-10 ${fieldClass("password")}`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <Eye className="size-4" />
                    ) : (
                      <EyeOff className="size-4" />
                    )}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(v) => setRememberMe(!!v)}
                    className="w-[18px] h-[18px] rounded-[4px] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm font-medium cursor-pointer select-none"
                  >
                    Remember Me
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full uppercase tracking-widest font-semibold h-9 mt-1"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
