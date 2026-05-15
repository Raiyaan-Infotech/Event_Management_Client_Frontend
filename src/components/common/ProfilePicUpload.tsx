"use client";

import { useState } from "react";
import { Camera, User } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageCropper } from "./ImageCropper";

interface ProfilePicUploadProps {
  value: string | null;
  onChange: (base64: string) => void;
  error?: string;
  disabled?: boolean;
  fallbackText?: string;
  maxMB?: number;
}

export function ProfilePicUpload({
  value, onChange, error, disabled = false, fallbackText, maxMB = 10,
}: ProfilePicUploadProps) {
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxMB * 1024 * 1024) { toast.error(`Image size exceeds ${maxMB}MB`); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setImageToCrop(reader.result as string); setCropperOpen(true); e.target.value = ""; };
    reader.readAsDataURL(file);
  };

  const handleCropDone = (base64: string) => { onChange(base64); setCropperOpen(false); setImageToCrop(null); };

  return (
    <>
      <div className="text-center">
        <div className="relative w-28 h-28 mx-auto mb-3 group">
          <Avatar className="w-full h-full rounded-full border-4 border-background shadow-lg">
            <AvatarImage src={value || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-black">
              {fallbackText ? fallbackText.charAt(0).toUpperCase() : <User className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
          {!disabled && (
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-md hover:opacity-90 transition border-2 border-background z-10">
              <Camera className="h-4 w-4" />
              <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
            </label>
          )}
        </div>
        {error && <p className="text-xs font-medium text-destructive mt-1">{error}</p>}
        {!disabled && <p className="text-[10px] text-muted-foreground italic">Max {maxMB}MB · JPG, PNG</p>}
      </div>
      {imageToCrop && (
        <ImageCropper open={cropperOpen} imageSrc={imageToCrop} onCropComplete={handleCropDone} onClose={() => { setCropperOpen(false); setImageToCrop(null); }} />
      )}
    </>
  );
}
