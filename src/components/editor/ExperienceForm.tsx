import { useFieldArray, useFormContext } from "react-hook-form";
import { createId } from "../../data/defaultCv";
import type { CVData } from "../../types/cv";

type ExperienceItemProps = {
  index: number;
  onRemove: () => void;
};

const ExperienceItem = ({ index, onRemove }: ExperienceItemProps) => {
  const { control, register } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `experience.${index}.bullets`,
  });

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="field-label">Job title</span>
          <input
            className="field-input"
            {...register(`experience.${index}.jobTitle` as const)}
          />
        </label>
        <label>
          <span className="field-label">Company</span>
          <input
            className="field-input"
            {...register(`experience.${index}.company` as const)}
          />
        </label>
        <label>
          <span className="field-label">Location</span>
          <input
            className="field-input"
            {...register(`experience.${index}.location` as const)}
          />
        </label>
        <label>
          <span className="field-label">Start date</span>
          <input
            className="field-input"
            {...register(`experience.${index}.startDate` as const)}
          />
        </label>
        <label>
          <span className="field-label">End date</span>
          <input
            className="field-input"
            {...register(`experience.${index}.endDate` as const)}
          />
        </label>
        <label className="flex items-center gap-3 self-end rounded-md border border-slate-200 px-3 py-2">
          <input
            type="checkbox"
            className="h-4 w-4 accent-evergreen"
            {...register(`experience.${index}.current` as const)}
          />
          <span className="text-sm font-bold text-slate-700">
            Current role
          </span>
        </label>
      </div>

      <div className="mt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <span className="field-label">Description bullet points</span>
          <button
            type="button"
            className="secondary-button"
            onClick={() => append({ id: createId("bullet"), text: "" })}
          >
            Add bullet
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {fields.map((field, bulletIndex) => (
            <div
              key={field.id}
              className="grid grid-cols-1 gap-2 min-[520px]:grid-cols-[minmax(0,1fr)_auto]"
            >
              <textarea
                rows={2}
                className="field-input mt-0 resize-y"
                placeholder="Describe an achievement or responsibility"
                {...register(
                  `experience.${index}.bullets.${bulletIndex}.text` as const,
                )}
              />
              <button
                type="button"
                className="danger-button h-fit shrink-0"
                onClick={() => remove(bulletIndex)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="danger-button mt-4" onClick={onRemove}>
        Delete experience
      </button>
    </div>
  );
};

const ExperienceForm = () => {
  const { control } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  return (
    <section className="editor-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h2 className="text-lg font-black text-charcoal">Experience</h2>
        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            append({
              id: createId("experience"),
              jobTitle: "",
              company: "",
              location: "",
              startDate: "",
              endDate: "",
              current: false,
              bullets: [{ id: createId("bullet"), text: "" }],
            })
          }
        >
          Add experience
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {fields.map((field, index) => (
          <ExperienceItem
            key={field.id}
            index={index}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default ExperienceForm;
