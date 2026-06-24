/* "use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
 */

// components/ui/sonner.tsx
"use client";

import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function SuccessIcon() {
  return <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />;
}

function ErrorIcon() {
  return <XCircle className="h-5 w-5 text-red-500 shrink-0" />;
}

function WarningIcon() {
  return <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />;
}

function InfoIcon() {
  return <Info className="h-5 w-5 text-blue-500 shrink-0" />;
}

function LoadingIcon() {
  return <Loader2 className="h-5 w-5 text-muted-foreground animate-spin shrink-0" />;
}

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      icons={{
        success: <SuccessIcon />,
        error: <ErrorIcon />,
        warning: <WarningIcon />,
        info: <InfoIcon />,
        loading: <LoadingIcon />,
      }}
      toastOptions={{
        classNames: {
          // base — applied to every toast
          toast: [
            "group toast flex items-start gap-3 rounded-lg border px-4 py-3 shadow-md",
            "text-sm font-medium",
            "group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border",
          ].join(" "),

          title: "text-sm font-semibold leading-tight",
          description: "text-xs text-muted-foreground mt-0.5 leading-snug",
          closeButton: [
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
            "hover:group-[.toast]:bg-muted/80",
          ].join(" "),
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground text-xs font-medium",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground text-xs",

          // success — visible green
          success: [
            "group-[.toaster]:bg-emerald-50 group-[.toaster]:border-emerald-200 group-[.toaster]:text-emerald-900",
            "dark:group-[.toaster]:bg-emerald-950/60 dark:group-[.toaster]:border-emerald-800 dark:group-[.toaster]:text-emerald-100",
          ].join(" "),

          // error — visible red
          error: [
            "group-[.toaster]:bg-red-50 group-[.toaster]:border-red-200 group-[.toaster]:text-red-900",
            "dark:group-[.toaster]:bg-red-950/60 dark:group-[.toaster]:border-red-800 dark:group-[.toaster]:text-red-100",
          ].join(" "),

          // warning — amber
          warning: [
            "group-[.toaster]:bg-amber-50 group-[.toaster]:border-amber-200 group-[.toaster]:text-amber-900",
            "dark:group-[.toaster]:bg-amber-950/60 dark:group-[.toaster]:border-amber-800 dark:group-[.toaster]:text-amber-100",
          ].join(" "),

          // info — blue
          info: [
            "group-[.toaster]:bg-blue-50 group-[.toaster]:border-blue-200 group-[.toaster]:text-blue-900",
            "dark:group-[.toaster]:bg-blue-950/60 dark:group-[.toaster]:border-blue-800 dark:group-[.toaster]:text-blue-100",
          ].join(" "),
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
