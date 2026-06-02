import { useFieldArray, useFormContext } from "react-hook-form";
import { createId } from "../../data/defaultCv";
import type { CVData } from "../../types/cv";

const ReferencesForm = () => {
  const { control, register } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "references",
  });

  return (
    <section className="editor-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h2 className="text-lg font-black text-charcoal">References</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Used by the Yellow Professional Timeline template.
          </p>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            append({
              id: createId("reference"),
              name: "",
              position: "",
              company: "",
              phone: "",
              email: "",
            })
          }
        >
          Add reference
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-slate-200 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="field-input mt-0"
                placeholder="Name"
                {...register(`references.${index}.name` as const)}
              />
              <input
                className="field-input mt-0"
                placeholder="Position"
                {...register(`references.${index}.position` as const)}
              />
              <input
                className="field-input mt-0"
                placeholder="Company"
                {...register(`references.${index}.company` as const)}
              />
              <input
                className="field-input mt-0"
                placeholder="Phone"
                {...register(`references.${index}.phone` as const)}
              />
              <input
                className="field-input mt-0"
                placeholder="Email"
                {...register(`references.${index}.email` as const)}
              />
            </div>
            <button
              type="button"
              className="danger-button mt-3"
              onClick={() => remove(index)}
            >
              Delete reference
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReferencesForm;
