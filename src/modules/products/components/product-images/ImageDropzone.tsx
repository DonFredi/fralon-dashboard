// modules/products/components/ImageDropzone.tsx
"use client";

import { useRef, useState } from "react";
import { ImageUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ImageDropzoneProps {
  onFiles: (files: File[]) => void;
  isPending: boolean;
}

export default function ImageDropzone({ onFiles, isPending }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onFiles(Array.from(files));
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload images — click or drag and drop"
      onClick={() => !isPending && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!isPending) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (!isPending) handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40",
        isPending && "pointer-events-none opacity-60 cursor-not-allowed",
        "cursor-pointer",
      )}
    >
      <div className="rounded-full bg-muted p-3">
        <ImageUp className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium">{isPending ? "Uploading..." : "Drag images here or click to browse"}</p>
        <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP — up to 5MB each</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={isPending}
      />
    </div>
  );
}
