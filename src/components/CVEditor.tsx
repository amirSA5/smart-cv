import EducationForm from "./editor/EducationForm";
import ExperienceForm from "./editor/ExperienceForm";
import OptionalSectionsForm from "./editor/OptionalSectionsForm";
import PersonalInfoForm from "./editor/PersonalInfoForm";
import ProfileForm from "./editor/ProfileForm";
import SkillsForm from "./editor/SkillsForm";

const CVEditor = () => (
  <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
    <PersonalInfoForm />
    <ProfileForm />
    <SkillsForm />
    <EducationForm />
    <ExperienceForm />
    <OptionalSectionsForm />
  </form>
);

export default CVEditor;
