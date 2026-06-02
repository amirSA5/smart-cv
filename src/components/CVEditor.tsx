import EducationForm from "./editor/EducationForm";
import ExperienceForm from "./editor/ExperienceForm";
import AchievementsForm from "./editor/AchievementsForm";
import ITSkillsForm from "./editor/ITSkillsForm";
import OptionalSectionsForm from "./editor/OptionalSectionsForm";
import PersonalInfoForm from "./editor/PersonalInfoForm";
import ProfileForm from "./editor/ProfileForm";
import ReferencesForm from "./editor/ReferencesForm";
import SkillsForm from "./editor/SkillsForm";

const CVEditor = () => (
  <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
    <PersonalInfoForm />
    <ProfileForm />
    <SkillsForm />
    <ITSkillsForm />
    <EducationForm />
    <ExperienceForm />
    <AchievementsForm />
    <ReferencesForm />
    <OptionalSectionsForm />
  </form>
);

export default CVEditor;
