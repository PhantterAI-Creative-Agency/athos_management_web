"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CameraIcon } from "@/components/icons";

const JPEG_QUALITY = 0.85;
const MAX_FILE_SIZE = 8 * 1024 * 1024;

function resizeToCoverDataUrl(
  file: File,
  targetWidth: number,
  targetHeight: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("invalid_image"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("canvas_unsupported"));
          return;
        }

        const targetRatio = targetWidth / targetHeight;
        const imgRatio = img.width / img.height;
        let sx = 0;
        let sy = 0;
        let sw = img.width;
        let sh = img.height;
        if (imgRatio > targetRatio) {
          sw = img.height * targetRatio;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / targetRatio;
          sy = (img.height - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function BannerUpload({
  imageUrl,
  label,
  targetWidth,
  targetHeight,
  uploading = false,
  onUpload,
}: {
  imageUrl?: string;
  label: string;
  targetWidth: number;
  targetHeight: number;
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
      const dataUrl = await resizeToCoverDataUrl(file, targetWidth, targetHeight);
      onUpload(dataUrl);
    } catch {
      setError("Não foi possível processar essa imagem.");
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="block text-sm font-medium">{label}</span>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label={label}
        style={{ aspectRatio: `${targetWidth} / ${targetHeight}` }}
        className="group relative w-full overflow-hidden rounded-xl border border-dashed border-divider bg-background disabled:opacity-70"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={label}
            fill
            sizes="600px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-text-muted">
            <CameraIcon className="h-6 w-6" />
            <span className="text-xs">Enviar imagem</span>
          </span>
        )}

        <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
          <CameraIcon className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </span>

        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </span>
        )}
      </button>

      <p className="text-xs text-text-muted">
        Tamanho recomendado: {targetWidth} × {targetHeight}px
      </p>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
