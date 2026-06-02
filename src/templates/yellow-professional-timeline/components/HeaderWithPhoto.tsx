import type { PersonalInfo } from "../../../types/cv";
import { yellowAccent } from "../yellowProfessionalTimelineStyles";

type HeaderWithPhotoProps = {
  personal: PersonalInfo;
  compact?: boolean;
};

const PhotoFrame = ({
  src,
  compact = false,
}: {
  src?: string;
  compact?: boolean;
}) => {
  const sizeClass = compact ? "h-[74px] w-[74px]" : "h-[138px] w-[138px]";
  const accentClass = compact ? "h-[50px] w-[50px]" : "h-[96px] w-[96px]";

  return (
    <div className={`relative shrink-0 ${sizeClass}`}>
      <span
        className={`absolute -right-3 -top-3 rounded-full ${accentClass}`}
        style={{ background: yellowAccent }}
      />
      <div className="relative h-full w-full overflow-hidden rounded-full border-[5px] border-black bg-white shadow-sm">
        {src?.trim() ? (
          <img alt="" className="h-full w-full object-cover" src={src} />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-[9px] font-black uppercase tracking-[0.18em] text-neutral-500">
            Photo
          </div>
        )}
      </div>
    </div>
  );
};

const HeaderWithPhoto = ({ personal, compact = false }: HeaderWithPhotoProps) => {
  if (compact) {
    return (
      <header className="mb-5 flex items-end justify-between border-b-[3px] border-black pb-4">
        <div className="min-w-0">
          <h1 className="text-[24px] font-black uppercase leading-[27px] tracking-[0.08em] text-black">
            {personal.fullName || "Your Name"}
          </h1>
          <p className="mt-1 text-[9.8px] font-black uppercase tracking-[0.25em] text-neutral-600">
            {personal.jobTitle || "Professional Title"}
          </p>
          <div className="mt-3 h-[3px] w-[116px]" style={{ background: yellowAccent }} />
        </div>
        <p className="min-w-[82px] shrink-0 whitespace-nowrap text-right text-[10px] font-black uppercase tracking-[0.1em] text-neutral-500">
          PAGE 2
        </p>
      </header>
    );
  }

  return (
    <header className="grid grid-cols-[minmax(0,1fr)_236px] gap-8">
      <div className="pt-5">
        <h1 className="max-w-[430px] text-[39px] font-black uppercase leading-[40px] tracking-[0.045em] text-black">
          {personal.fullName || "Your Name"}
        </h1>
        <p className="mt-2 text-[12px] font-medium leading-[16px] tracking-[0.34em] text-black">
          {personal.jobTitle || "Professional Title"}
        </p>
        <div className="mt-4 h-[2px] w-full bg-black" />
      </div>
      <div className="relative flex justify-center pb-3">
        <PhotoFrame src={personal.profileImage} />
      </div>
    </header>
  );
};

export default HeaderWithPhoto;
