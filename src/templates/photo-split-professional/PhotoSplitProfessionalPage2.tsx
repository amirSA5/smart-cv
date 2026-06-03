import { photoSplitProfessionalLabels } from "../../constants/cvLabels";
import type { CVLanguage } from "../../types/cv";
import AwardList from "./components/AwardList";
import CertificateList from "./components/CertificateList";
import EducationList from "./components/EducationList";
import ExperienceList from "./components/ExperienceList";
import HeaderBlock from "./components/HeaderBlock";
import InterestList from "./components/InterestList";
import LanguageList from "./components/LanguageList";
import ReferenceCards from "./components/ReferenceCards";
import SkillDots from "./components/SkillDots";
import StrengthList from "./components/StrengthList";
import type { PhotoSplitPageData } from "./photoSplitProfessionalPagination";
import {
  getPhotoSplitPageClass,
  getPhotoSplitPageStyle,
  getPhotoSplitSettings,
  getPhotoSplitStackClass,
} from "./photoSplitProfessionalStyles";

type PhotoSplitPageProps = {
  page: PhotoSplitPageData;
  language: CVLanguage;
};

const PhotoSplitProfessionalPage2 = ({
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
      <HeaderBlock pageLabel={labels.page2} personal={page.personal} />
      <div
        className="mt-5 h-[2px] w-full"
        style={{ backgroundColor: "var(--photo-accent)" }}
      />

      <div className={["mt-6", getPhotoSplitStackClass(settings)].join(" ")}>
        <ExperienceList
          compact
          entries={page.experience}
          title={labels.experienceContinued}
        />
        <EducationList entries={page.education} title={labels.educationContinued} />
        <SkillDots columns entries={page.skills} title={labels.skills} />
        <InterestList entries={page.interests} title={labels.interests} />
        <LanguageList entries={page.languages} title={labels.languages} />
        <CertificateList
          grid
          entries={page.certifications}
          title={labels.certifications}
        />
        <StrengthList grid entries={page.strengths} title={labels.strengthsContinued} />
        <AwardList grid entries={page.achievements} title={labels.achievements} />
        <ReferenceCards entries={page.references} title={labels.references} />
      </div>
    </article>
  );
};

export default PhotoSplitProfessionalPage2;
