import { useFieldArray, useFormContext } from "react-hook-form";
import { createId } from "../../data/defaultCv";
import type { CVData } from "../../types/cv";

const AchievementsForm = () => {
  const { control, register } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "achievements",
  });

  return (
    <section className="editor-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h2 className="text-lg font-black text-charcoal">Achievements</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Used by the Tech Professional template.
          </p>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            append({
              id: createId("achievement"),
              title: "",
              description: "",
            })
          }
        >
          Add achievement
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-slate-200 p-4">
            <input
              className="field-input mt-0"
              placeholder="Achievement title"
              {...register(`achievements.${index}.title` as const)}
            />
            <textarea
              rows={3}
              className="field-input resize-y"
              placeholder="Achievement details"
              {...register(`achievements.${index}.description` as const)}
            />
            <button
              type="button"
              className="danger-button"
              onClick={() => remove(index)}
            >
              Delete achievement
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AchievementsForm;
