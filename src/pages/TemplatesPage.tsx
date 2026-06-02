import { Link } from "react-router-dom";
import { templateOptions } from "../constants/templates";
import type { ReactElement } from "react";
import type { CVTemplateId } from "../types/cv";

const ModernSidebarMockup = () => (
  <div className="aspect-[210/297] w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
    <div className="flex h-full">
      <div className="w-[34%] bg-evergreen p-3">
        <div className="mb-5 h-16 w-16 rounded-full border-4 border-white/80 bg-white/30" />
        <div className="space-y-2">
          <div className="h-2 w-20 bg-white/80" />
          <div className="h-2 w-16 bg-white/50" />
          <div className="h-2 w-24 bg-white/50" />
        </div>
        <div className="mt-8 space-y-2">
          <div className="h-2 w-20 bg-white/80" />
          <div className="h-2 w-14 bg-white/50" />
          <div className="h-2 w-20 bg-white/50" />
        </div>
      </div>
      <div className="flex-1 p-4">
        <div className="ml-auto h-4 w-28 bg-charcoal" />
        <div className="ml-auto mt-2 h-2 w-20 bg-slate-300" />
        <div className="my-4 h-6 bg-evergreen/80" />
        <div className="space-y-2">
          <div className="h-2 w-24 bg-charcoal" />
          <div className="h-2 w-full bg-slate-200" />
          <div className="h-2 w-5/6 bg-slate-200" />
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-2 w-28 bg-charcoal" />
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  </div>
);

const TechProfessionalMockup = () => (
  <div className="aspect-[210/297] w-full overflow-hidden rounded-md border border-slate-200 bg-white p-5 shadow-sm">
    <div className="h-1 w-12 bg-black" />
    <div className="mt-5 h-5 w-36 bg-black" />
    <div className="mt-2 h-2 w-24 bg-neutral-500" />
    <div className="mt-4 flex gap-2">
      <div className="h-2 w-16 bg-neutral-300" />
      <div className="h-2 w-20 bg-neutral-300" />
      <div className="h-2 w-14 bg-neutral-300" />
    </div>
    <div className="mt-7 space-y-5">
      {[0, 1, 2, 3].map((item) => (
        <div key={item}>
          <div className="border-b border-black pb-1">
            <div className="h-2 w-36 bg-black" />
          </div>
          <div className="mt-2 space-y-1.5">
            <div className="h-2 w-full bg-neutral-200" />
            <div className="h-2 w-11/12 bg-neutral-200" />
            <div className="h-2 w-9/12 bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const YellowProfessionalTimelineMockup = () => (
  <div className="aspect-[210/297] w-full overflow-hidden rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <div className="grid h-full grid-cols-[1fr_0.42fr] gap-3">
      <div>
        <div className="h-6 w-36 bg-black" />
        <div className="mt-2 h-2 w-24 bg-yellow-400" />
        <div className="mt-4 h-1 w-full bg-black" />
        <div className="mt-5 space-y-4">
          <div>
            <div className="h-2 w-20 bg-black" />
            <div className="mt-2 h-2 w-full bg-neutral-200" />
            <div className="mt-1 h-2 w-10/12 bg-neutral-200" />
          </div>
          <div>
            <div className="h-2 w-24 bg-black" />
            <div className="relative mt-3 border-l-2 border-yellow-400 pl-4">
              {[0, 1, 2].map((item) => (
                <div key={item} className="relative mb-4">
                  <span className="absolute -left-[22px] top-1 h-3 w-3 rounded-full border-2 border-black bg-yellow-400" />
                  <div className="h-2 w-24 bg-black" />
                  <div className="mt-1 h-2 w-full bg-neutral-200" />
                  <div className="mt-1 h-2 w-9/12 bg-neutral-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="relative border-l-4 border-yellow-400 pl-3">
        <div className="mb-4 h-16 w-16 rounded-full bg-neutral-200" />
        <div className="space-y-2">
          <div className="h-2 w-16 bg-black" />
          <div className="h-2 w-full bg-neutral-200" />
          <div className="h-2 w-10/12 bg-neutral-200" />
        </div>
        <div className="mt-5 space-y-2">
          <div className="h-2 w-14 bg-black" />
          <div className="h-2 w-full bg-yellow-400" />
          <div className="h-2 w-9/12 bg-yellow-400" />
          <div className="h-2 w-10/12 bg-yellow-400" />
        </div>
      </div>
    </div>
  </div>
);

const mockups: Record<CVTemplateId, ReactElement> = {
  "modern-sidebar": <ModernSidebarMockup />,
  "tech-professional": <TechProfessionalMockup />,
  "yellow-professional-timeline": <YellowProfessionalTimelineMockup />,
};

const descriptions: Record<CVTemplateId, string> = {
  "modern-sidebar": "The existing dark green and black sidebar CV template.",
  "tech-professional":
    "A white and black professional resume template with clean section dividers.",
  "yellow-professional-timeline":
    "Black, white, and yellow professional resume with timeline experience and right-side profile/contact column.",
};

const TemplatesPage = () => (
  <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-evergreen">
          Templates
        </p>
        <h1 className="mt-2 text-3xl font-black text-charcoal">
          Choose a CV template
        </h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
          Select the visual style first. The selected template is saved with the
          client and used for preview and PDF export.
        </p>
      </div>
      <Link className="secondary-button text-center" to="/clients">
        Back to clients
      </Link>
    </div>

    <section className="mt-8 grid gap-6 md:grid-cols-3">
      {templateOptions.map((template) => (
        <article
          key={template.id}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
        >
          {mockups[template.id]}
          <h2 className="mt-5 text-xl font-black text-charcoal">
            {template.name} Template
          </h2>
          <p className="mt-2 min-h-12 text-sm font-semibold leading-6 text-slate-600">
            {descriptions[template.id]}
          </p>
          <Link
            className="primary-button mt-5 inline-flex justify-center"
            to={`/cv/new?template=${template.id}&lang=en`}
          >
            Use this template
          </Link>
        </article>
      ))}
    </section>
  </main>
);

export default TemplatesPage;
