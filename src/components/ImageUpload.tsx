import { useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { CVData } from "../types/cv";

const ImageUpload = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { setValue, control } = useFormContext<CVData>();
  const image = useWatch({ control, name: "personal.profileImage" });
  const fullName = useWatch({ control, name: "personal.fullName" });

  const handleFile = (file?: File) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setValue("personal.profileImage", String(reader.result), {
        shouldDirty: true,
        shouldTouch: true,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-lg border-4 border-evergreen bg-white">
          {image ? (
            <img
              src={image}
              alt={`${fullName || "Profile"} preview`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-black uppercase tracking-[0.16em] text-evergreen">
              Image
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          <button
            type="button"
            className="secondary-button"
            onClick={() => inputRef.current?.click()}
          >
            Upload image
          </button>
          {image ? (
            <button
              type="button"
              className="danger-button"
              onClick={() =>
                setValue("personal.profileImage", "", {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
