import { useFieldArray, useFormContext } from "react-hook-form";
import { createId } from "../../data/defaultCv";
import type { CVData } from "../../types/cv";

type CertificationItemProps = {
  index: number;
  onRemove: () => void;
};

const CertificationItem = ({ index, onRemove }: CertificationItemProps) => {
  const { control, register } = useFormContext<CVData>();
  const bulletArray = useFieldArray({
    control,
    name: `certifications.${index}.bullets`,
  });

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="field-input mt-0"
          placeholder="Certification"
          {...register(`certifications.${index}.title` as const)}
        />
        <input
          className="field-input mt-0"
          placeholder="Issuer"
          {...register(`certifications.${index}.issuer` as const)}
        />
        <input
          className="field-input mt-0"
          placeholder="Reference"
          {...register(`certifications.${index}.reference` as const)}
        />
        <input
          className="field-input mt-0"
          placeholder="Issue date"
          {...register(`certifications.${index}.issueDate` as const)}
        />
        <input
          className="field-input mt-0"
          placeholder="Expiry date"
          {...register(`certifications.${index}.expiryDate` as const)}
        />
        <input
          className="field-input mt-0"
          placeholder="Legacy year"
          {...register(`certifications.${index}.year` as const)}
        />
      </div>
      <textarea
        rows={2}
        className="field-input resize-y"
        placeholder="Description"
        {...register(`certifications.${index}.description` as const)}
      />

      <div className="mt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <span className="field-label">Certification bullet points</span>
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              bulletArray.append({
                id: createId("certification-bullet"),
                text: "",
              })
            }
          >
            Add bullet
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {bulletArray.fields.map((field, bulletIndex) => (
            <div
              key={field.id}
              className="grid grid-cols-1 gap-2 min-[520px]:grid-cols-[minmax(0,1fr)_auto]"
            >
              <input
                className="field-input mt-0"
                placeholder="Bullet point"
                {...register(
                  `certifications.${index}.bullets.${bulletIndex}.text` as const,
                )}
              />
              <button
                type="button"
                className="danger-button"
                onClick={() => bulletArray.remove(bulletIndex)}
              >
                Delete bullet
              </button>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="danger-button mt-4" onClick={onRemove}>
        Delete certification
      </button>
    </div>
  );
};

const OptionalSectionsForm = () => {
  const { control, register } = useFormContext<CVData>();
  const languageArray = useFieldArray({
    control,
    name: "languages",
  });
  const certificationArray = useFieldArray({
    control,
    name: "certifications",
  });

  return (
    <section className="editor-card">
      <h2 className="text-lg font-black text-charcoal">Optional sections</h2>

      <div className="mt-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <h3 className="font-black text-charcoal">Languages</h3>
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              languageArray.append({
                id: createId("language"),
                name: "",
                level: "",
              })
            }
          >
            Add language
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {languageArray.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <input
                className="field-input mt-0"
                placeholder="Language"
                {...register(`languages.${index}.name` as const)}
              />
              <input
                className="field-input mt-0"
                placeholder="Level"
                {...register(`languages.${index}.level` as const)}
              />
              <button
                type="button"
                className="danger-button"
                onClick={() => languageArray.remove(index)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <h3 className="font-black text-charcoal">Certifications</h3>
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              certificationArray.append({
                id: createId("certification"),
                title: "",
                issuer: "",
                year: "",
                reference: "",
                issueDate: "",
                expiryDate: "",
                description: "",
                bullets: [],
              })
            }
          >
            Add certification
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {certificationArray.fields.map((field, index) => (
            <CertificationItem
              key={field.id}
              index={index}
              onRemove={() => certificationArray.remove(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OptionalSectionsForm;
