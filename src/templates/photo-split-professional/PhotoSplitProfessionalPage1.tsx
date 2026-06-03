import { photoSplitProfessionalLabels } from "../../constants/cvLabels";
import type { CVLanguage } from "../../types/cv";
import ContactGrid from "./components/ContactGrid";
import EducationList from "./components/EducationList";
import ExperienceList from "./components/ExperienceList";
import HeaderBlock from "./components/HeaderBlock";
import LanguageList from "./components/LanguageList";
import SectionTitle from "./components/SectionTitle";
import StrengthList from "./components/StrengthList";
import type { PhotoSplitPageData } from "./photoSplitProfessionalPagination";
import {
  bodyTextClass,
  getPhotoSplitPageClass,
  getPhotoSplitPageStyle,
  getPhotoSplitSettings,
  getPhotoSplitStackClass,
} from "./photoSplitProfessionalStyles";

type PhotoSplitPageProps = {
  page: PhotoSplitPageData;
  language: CVLanguage;
};

const Portrait = ({
  src,
  photoStyle,
}: {
  src?: string;
  photoStyle: PhotoSplitPageData["templateSettings"]["photoStyle"];
}) => (
  <div
    className={[
      "overflow-hidden bg-neutral-200",
      photoStyle === "circle"
        ? "mx-auto h-[218px] w-[218px] rounded-full"
        : "h-[278px] w-full",
      photoStyle === "rounded" ? "rounded-[16px]" : "",
    ].join(" ")}
  >
    {src?.trim() ? (
      <img alt="" className="h-full w-full object-cover" src={src} />
    ) : (
      <div className="flex h-full w-full items-center justify-center text-[12px] font-black uppercase tracking-[0.2em] text-neutral-500">
        Photo
      </div>
    )}
  </div>
);

const PhotoSplitProfessionalPage1 = ({
  page,
  language,
}: PhotoSplitPageProps) => {
  const labels = photoSplitProfessionalLabels[language];
  const settings = getPhotoSplitSettings(page.templateSettings);

  return (
    <article
      className={getPhotoSplitPageClass(settings)}
      style={getPhotoSplitPageStyle(settings)}
    >
      <div className="grid h-full grid-cols-[0.37fr_1fr] gap-8">
        <aside className="min-w-0">
          <Portrait
            photoStyle={settings.photoStyle}
            src={page.personal.profileImage}
          />
          <div className={["mt-4", getPhotoSplitStackClass(settings)].join(" ")}>
            <EducationList compact entries={page.education} title={labels.education} />
            <StrengthList entries={page.strengths} title={labels.strengths} />
            <LanguageList compact entries={page.languages} title={labels.languages} />
          </div>
        </aside>

        <main className="min-w-0 pt-10">
          <HeaderBlock personal={page.personal} />
          <ContactGrid personal={page.personal} />
          <div className={["mt-6", getPhotoSplitStackClass(settings)].join(" ")}>
            {page.profileSummary ? (
              <section>
                <SectionTitle mark="A" title={labels.profile} />
                <p className={bodyTextClass}>{page.profileSummary}</p>
              </section>
            ) : null}
            <ExperienceList entries={page.experience} title={labels.experience} />
          </div>
        </main>
      </div>
    </article>
  );
};

export default PhotoSplitProfessionalPage1;
