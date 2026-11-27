"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudentFormSchema, StudentFormInput } from "@/lib/validations";
import { CreditCard, Sparkles, User, Phone, Mail, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface StudentFormProps {
  onSuccess: (studentData: any, cardData: any) => void;
  onNameChange?: (name: string) => void;
}

export function StudentForm({ onSuccess, onNameChange }: StudentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<StudentFormInput>({
    resolver: zodResolver(StudentFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
    },
  });

  const currentFullName = watch("fullName");

  // Broadcast live name typing for synchronized card preview
  React.useEffect(() => {
    if (onNameChange) {
      onNameChange(currentFullName || "");
    }
  }, [currentFullName, onNameChange]);

  const onSubmit = async (data: StudentFormInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate NFC card");
      }

      toast.success("Card Generated Successfully!", {
        description: `${data.fullName}'s NFC card is now live on the TV display.`,
        duration: 4000,
      });

      onSuccess(result.student, result.card);

      // Reset form and focus back on Full Name for the next student
      reset({
        fullName: "",
        phone: "",
        email: "",
      });

      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    } catch (err: any) {
      toast.error("Generation Error", {
        description: err.message || "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const { ref: formNameRef, ...nameRegisterProps } = register("fullName");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 sm:p-7 shadow-sm relative overflow-hidden"
    >
      {/* Top Accent Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-emerald-500 to-amber-500" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-sky-600 shrink-0" />
            Event Registration & Personalization
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Collect attendee information and instantly personalize their NFC card.
          </p>
        </div>
        <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          Live TV Sync
        </span>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Student Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              {...nameRegisterProps}
              ref={(e) => {
                formNameRef(e);
                nameInputRef.current = e;
              }}
              type="text"
              placeholder="e.g. SIRAJUM MUNIR"
              className={`w-full bg-slate-50 border ${
                errors.fullName ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-sky-500"
              } rounded-xl pl-10 pr-4 py-2.5 text-slate-900 placeholder-slate-400 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:bg-white font-medium uppercase tracking-wider transition-all`}
              autoFocus
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.fullName.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Phone Number (BD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              {...register("phone")}
              type="tel"
              placeholder="017XXXXXXXX"
              className={`w-full bg-slate-50 border ${
                errors.phone ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-sky-500"
              } rounded-xl pl-10 pr-4 py-2.5 text-slate-900 placeholder-slate-400 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:bg-white font-medium transition-all`}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.phone.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              {...register("email")}
              type="email"
              placeholder="student@diu.edu.bd"
              className={`w-full bg-slate-50 border ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-sky-500"
              } rounded-xl pl-10 pr-4 py-2.5 text-slate-900 placeholder-slate-400 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:bg-white font-medium transition-all`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Main Submit Action */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-sky-600 via-emerald-600 to-teal-600 hover:from-sky-500 hover:via-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Personalizing Card & Publishing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate NFC Card</span>
              <ArrowRight className="w-4 h-4 ml-1 stroke-[3]" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
