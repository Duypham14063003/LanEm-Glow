"use client";

import { useState } from "react";

import type { PublicSettings } from "@/types";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function AdminSettingsWorkspace({ initialSettings }: { initialSettings: PublicSettings }) {
  const [settings, setSettings] = useState({
    brandPhone: initialSettings.brandPhone ?? "",
    zaloUrl: initialSettings.zaloUrl ?? "",
    publicAnnouncement: initialSettings.publicAnnouncement ?? "",
    primaryCtaLabel: initialSettings.primaryCtaLabel ?? "",
    secondaryCtaLabel: initialSettings.secondaryCtaLabel ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const payload = (await response.json()) as
        | { settings: PublicSettings }
        | { error?: string };

      if (!response.ok) {
        setError(
          "error" in payload ? payload.error ?? "Không thể cập nhật cài đặt." : "Không thể cập nhật cài đặt."
        );
        return;
      }

      const nextSettings = (payload as { settings: PublicSettings }).settings;
      setSettings({
        brandPhone: nextSettings.brandPhone ?? "",
        zaloUrl: nextSettings.zaloUrl ?? "",
        publicAnnouncement: nextSettings.publicAnnouncement ?? "",
        primaryCtaLabel: nextSettings.primaryCtaLabel ?? "",
        secondaryCtaLabel: nextSettings.secondaryCtaLabel ?? "",
      });
      setMessage("Đã lưu cài đặt storefront.");
    } catch {
      setError("Không thể kết nối để lưu cài đặt. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="space-y-5 p-4 sm:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Số điện thoại thương hiệu">
          <Input
            value={settings.brandPhone}
            onChange={(event) => setSettings((current) => ({ ...current, brandPhone: event.target.value }))}
            disabled={isSaving}
          />
        </Field>
        <Field label="Zalo URL">
          <Input
            value={settings.zaloUrl}
            onChange={(event) => setSettings((current) => ({ ...current, zaloUrl: event.target.value }))}
            disabled={isSaving}
          />
        </Field>
        <Field className="md:col-span-2" label="Thông báo công khai">
          <Textarea
            value={settings.publicAnnouncement}
            onChange={(event) =>
              setSettings((current) => ({ ...current, publicAnnouncement: event.target.value }))
            }
            disabled={isSaving}
            className="min-h-28"
          />
        </Field>
        <Field label="CTA chính">
          <Input
            value={settings.primaryCtaLabel}
            onChange={(event) =>
              setSettings((current) => ({ ...current, primaryCtaLabel: event.target.value }))
            }
            disabled={isSaving}
          />
        </Field>
        <Field label="CTA phụ">
          <Input
            value={settings.secondaryCtaLabel}
            onChange={(event) =>
              setSettings((current) => ({ ...current, secondaryCtaLabel: event.target.value }))
            }
            disabled={isSaving}
          />
        </Field>
      </div>

      {message ? <p className="text-sm text-[var(--color-success)]">{message}</p> : null}
      {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}

      <Button onClick={handleSave} loading={isSaving}>
        Lưu cài đặt
      </Button>
    </Card>
  );
}

function Field({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}
