"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CameraIcon } from "@/components/icons";

const MAX_DIMENSION = 512;
const JPEG_QUALITY = 0.82;
const MAX_FILE_SIZE = 8 * 1024 * 1024;

function resizeToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("invalid_image"));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("canvas_unsupported"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function AvatarUpload({
  photoUrl,
  seed,
  label,
  size = "h-20 w-20",
  uploading = false,
  onUpload,
}: {
  photoUrl?: string;
  seed: string;
  label: string;
  size?: string;
  uploading?: boolean;
  onUpload: (dataUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("A imagem deve ter até 8MB.");
      return;
    }

    try {
      setError(null);
      const dataUrl = await resizeToDataUrl(file);
      onUpload(dataUrl);
    } catch {
      setError("Não foi possível processar essa imagem.");
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label="Alterar foto de perfil"
        className={`group relative overflow-hidden rounded-full bg-surface ${size} disabled:opacity-70`}
      >
        <Image
          src={photoUrl || `https://picsum.photos/seed/${seed}/400/400`}
          alt={label}
          fill
          sizes="128px"
          className="object-cover"
          unoptimized={!!photoUrl}
        />

        <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
          <CameraIcon className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </span>

        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </span>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
