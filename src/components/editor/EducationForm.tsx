import { useFieldArray, useFormContext } from "react-hook-form";
import { createId } from "../../data/defaultCv";
import type { CVData } from "../../types/cv";

const EducationForm = () => {
  const { control, register } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  return (
    <section className="editor-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h2 className="text-lg font-black text-charcoal">Education</h2>
        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            append({
              id: createId("education"),
              degree: "",
              school: "",
              location: "",
              startYear: "",
              endYear: "",
              description: "",
            })
          }
        >
          Add education
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-slate-200 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="field-label">Degree</span>
                <input
                  className="field-input"
                  {...register(`education.${index}.degree` as const)}
                />
              </label>
              <label>
                <span className="field-label">School</span>
                <input
                  className="field-input"
                  {...register(`education.${index}.school` as const)}
                />
              </label>
              <label>
                <span className="field-label">Location</span>
                <input
                  className="field-input"
                  {...register(`education.${index}.location` as const)}
                />
              </label>
              <label>
                <span className="field-label">Start year</span>
                <input
                  className="field-input"
                  {...register(`education.${index}.startYear` as const)}
                />
              </label>
              <label>
                <span className="field-label">End year</span>
                <input
                  className="field-input"
                  {...register(`education.${index}.endYear` as const)}
                />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="field-label">Description</span>
              <textarea
                rows={3}
                className="field-input resize-y"
                {...register(`education.${index}.description` as const)}
              />
            </label>
            <button
              type="button"
              className="danger-button mt-4"
              onClick={() => remove(index)}
            >
              Delete education
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EducationForm;
