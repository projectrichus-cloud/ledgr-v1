"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [role, setRole] = useState<UserRole>("business_owner");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // role + full_name land in raw_user_meta_data, which the
    // handle_new_user() trigger (see supabase/migrations/0001_init.sql)
    // reads to create the matching profiles row automatically.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role, full_name: fullName } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(role === "ca" ? "/onboarding/ca" : "/onboarding/business-owner");
  }

  return (
    <>
      <h1 className="mb-1 font-display text-2xl font-semibold">Create your account</h1>
      <p className="mb-6 text-sm text-ink-500">Separate onboarding for business owners and CAs.</p>

      <div className="mb-6 grid grid-cols-2 gap-2 rounded-md bg-mist-dark p-1">
        <button
          type="button"
          onClick={() => setRole("business_owner")}
          className={cn(
            "rounded-[6px] py-2 text-[13px] font-semibold transition-colors",
            role === "business_owner" ? "bg-paper text-ink-900 shadow-rest" : "text-ink-500"
          )}
        >
          Business Owner
        </button>
        <button
          type="button"
          onClick={() => setRole("ca")}
          className={cn(
            "rounded-[6px] py-2 text-[13px] font-semibold transition-colors",
            role === "ca" ? "bg-paper text-ink-900 shadow-rest" : "text-ink-500"
          )}
        >
          Chartered Accountant
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-[13px] text-red-600">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13.5px] text-ink-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-600">
          Sign in
        </Link>
      </p>
    </>
  );
}
