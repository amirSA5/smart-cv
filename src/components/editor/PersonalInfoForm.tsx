import { useFormContext } from "react-hook-form";
import type { CVData } from "../../types/cv";
import ImageUpload from "../ImageUpload";

const PersonalInfoForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CVData>();

  return (
    <section className="editor-card">
      <h2 className="text-lg font-black text-charcoal">Personal information</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="field-label">Full name</span>
          <input
            className="field-input"
            {...register("personal.fullName", {
              required: "Full name is required.",
            })}
          />
          {errors.personal?.fullName ? (
            <p className="field-error">{errors.personal.fullName.message}</p>
          ) : null}
        </label>

        <label>
          <span className="field-label">Job title</span>
          <input
            className="field-input"
            {...register("personal.jobTitle", {
              required: "Job title is required.",
            })}
          />
          {errors.personal?.jobTitle ? (
            <p className="field-error">{errors.personal.jobTitle.message}</p>
          ) : null}
        </label>

        <label>
          <span className="field-label">Phone</span>
          <input className="field-input" {...register("personal.phone")} />
        </label>

        <label>
          <span className="field-label">Email</span>
          <input
            className="field-input"
            type="email"
            {...register("personal.email", {
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
              },
            })}
          />
          {errors.personal?.email ? (
            <p className="field-error">{errors.personal.email.message}</p>
          ) : null}
        </label>

        <label>
          <span className="field-label">Website / portfolio</span>
          <input className="field-input" {...register("personal.website")} />
        </label>

        <label>
          <span className="field-label">Location</span>
          <input className="field-input" {...register("personal.location")} />
        </label>
      </div>
      <div className="mt-4">
        <span className="field-label">Profile image</span>
        <div className="mt-2">
          <ImageUpload />
        </div>
      </div>
    </section>
  );
};

export default PersonalInfoForm;
