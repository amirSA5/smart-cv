import { useFieldArray, useFormContext } from "react-hook-form";
import { createId } from "../../data/defaultCv";
import type { CVData } from "../../types/cv";

const ITSkillsForm = () => {
  const { control, register } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "itSkills",
  });

  return (
    <section className="editor-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h2 className="text-lg font-black text-charcoal">IT Skills</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Displayed separately in the Yellow Professional Timeline template.
          </p>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            append({
              id: createId("it-skill"),
              name: "",
              level: 80,
            })
          }
        >
          Add IT skill
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 gap-2 min-[520px]:grid-cols-[minmax(0,1fr)_110px_auto]"
          >
            <input
              className="field-input mt-0"
              placeholder="IT skill name"
              {...register(`itSkills.${index}.name` as const)}
            />
            <input
              className="field-input mt-0"
              max={100}
              min={0}
              placeholder="Level"
              type="number"
              {...register(`itSkills.${index}.level` as const, {
                max: 100,
                min: 0,
                valueAsNumber: true,
              })}
            />
            <button
              type="button"
              className="danger-button shrink-0"
              onClick={() => remove(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ITSkillsForm;
