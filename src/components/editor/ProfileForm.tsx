import { useFormContext } from "react-hook-form";
import type { CVData } from "../../types/cv";

const ProfileForm = () => {
  const { register } = useFormContext<CVData>();

  return (
    <section className="editor-card">
      <h2 className="text-lg font-black text-charcoal">Profile summary</h2>
      <label className="mt-4 block">
        <span className="field-label">Summary</span>
        <textarea
          rows={6}
          className="field-input resize-y"
          {...register("profileSummary")}
        />
      </label>
    </section>
  );
};

export default ProfileForm;
