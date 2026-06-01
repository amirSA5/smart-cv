import { useFieldArray, useFormContext } from "react-hook-form";
import { createId } from "../../data/defaultCv";
import type { CVData } from "../../types/cv";

const SkillsForm = () => {
  const { control, register } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  return (
    <section className="editor-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h2 className="text-lg font-black text-charcoal">Skills</h2>
        <button
          type="button"
          className="secondary-button"
          onClick={() => append({ id: createId("skill"), name: "" })}
        >
          Add skill
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 gap-2 min-[520px]:grid-cols-[minmax(0,1fr)_auto]"
          >
            <input
              className="field-input mt-0"
              placeholder="Skill name"
              {...register(`skills.${index}.name` as const)}
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

export default SkillsForm;
