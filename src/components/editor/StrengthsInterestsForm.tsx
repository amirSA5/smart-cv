import { useFieldArray, useFormContext } from "react-hook-form";
import { createId } from "../../data/defaultCv";
import type { CVData } from "../../types/cv";

const StrengthsInterestsForm = () => {
  const { control, register } = useFormContext<CVData>();
  const strengthsArray = useFieldArray({
    control,
    name: "strengths",
  });
  const interestsArray = useFieldArray({
    control,
    name: "interests",
  });

  return (
    <section className="editor-card">
      <div>
        <h2 className="text-lg font-black text-charcoal">
          Atouts / Strengths
        </h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Optional sections used by the Photo Split Professional template.
        </p>
      </div>

      <div className="mt-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <h3 className="font-black text-charcoal">Strengths</h3>
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              strengthsArray.append({
                id: createId("strength"),
                title: "",
                description: "",
              })
            }
          >
            Add strength
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {strengthsArray.fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border border-slate-200 p-4">
              <input
                className="field-input mt-0"
                placeholder="Strength title"
                {...register(`strengths.${index}.title` as const)}
              />
              <textarea
                rows={2}
                className="field-input resize-y"
                placeholder="Optional description"
                {...register(`strengths.${index}.description` as const)}
              />
              <button
                type="button"
                className="danger-button"
                onClick={() => strengthsArray.remove(index)}
              >
                Delete strength
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <h3 className="font-black text-charcoal">
            Centre d&apos;interet / Interests
          </h3>
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              interestsArray.append({
                id: createId("interest"),
                name: "",
              })
            }
          >
            Add interest
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {interestsArray.fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
            >
              <input
                className="field-input mt-0"
                placeholder="Interest"
                {...register(`interests.${index}.name` as const)}
              />
              <button
                type="button"
                className="danger-button"
                onClick={() => interestsArray.remove(index)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StrengthsInterestsForm;
