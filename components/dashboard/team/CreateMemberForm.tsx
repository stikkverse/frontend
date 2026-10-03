"use client";

import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { useCreateMember } from "@/hooks/useTeam";
import {
  createMemberSchema,
  type CreateMemberValues,
} from "@/lib/database/schema";

const CreateMemberForm = () => {
  const { mutate: createMember, isPending } = useCreateMember();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<CreateMemberValues>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: { email: "", password: "", role: "member" },
  });

  const onSubmit = (values: CreateMemberValues) => {
    createMember(values, {
      onSuccess: () => {
        toast.success(`${values.role} account created for ${values.email}`);
        form.reset({ email: "", password: "", role: "member" });
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { detail?: string } } };
        toast.error(
          err.response?.data?.detail ?? "Could not create user. Try again.",
        );
      },
    });
  };

  return (
    <div className="rounded-[14px] border border-border bg-(--surface) shadow-(--card-shadow) p-5">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus size={15} className="text-(--cyan)" />
        <p className="font-mono text-[10px] tracking-[0.14em] text-(--text-muted)">
          ADD TEAM MEMBER
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <div>
              <input
                {...field}
                type="email"
                placeholder="colleague@company.com"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-(--bg-alt) text-(--text) font-mono text-[12px] outline-none focus:border-(--cyan) transition-colors duration-200"
              />
              {fieldState.invalid && (
                <p className="font-mono text-[10px] text-(--red) mt-1">
                  {fieldState.error?.message}
                </p>
              )}
            </div>
          )}
        />

        <div className="flex gap-3">
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex-1">
                <div className="relative">
                  <input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Initial password"
                    autoComplete="new-password"
                    className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-(--bg-alt) text-(--text) font-mono text-[12px] outline-none focus:border-(--cyan) transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--cyan) transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {fieldState.invalid && (
                  <p className="font-mono text-[10px] text-(--red) mt-1">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <select
                {...field}
                className="w-32 shrink-0 px-3 rounded-lg border border-border bg-(--bg-alt) text-(--text) font-mono text-[12px] outline-none focus:border-(--cyan) cursor-pointer"
              >
                <option value="member">MEMBER</option>
                <option value="manager">MANAGER</option>
              </select>
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="font-mono text-[11px] font-semibold tracking-[0.06em] px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 border border-(--cyan) bg-(--cyan-bg) text-(--cyan) hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "CREATING..." : "CREATE MEMBER"}
        </button>

        <p className="font-mono text-[9px] text-(--text-muted) leading-relaxed">
          Members get read-only access. Managers can upload data and resolve
          alerts. The person signs in directly at the login page with this email
          and password — no registration needed. Share the password securely;
          they can reset it later.
        </p>
      </form>
    </div>
  );
};

export default CreateMemberForm;
