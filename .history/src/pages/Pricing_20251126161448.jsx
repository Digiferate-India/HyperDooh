import React from "react";

const tiers = [
  {
    name: "Starter",
    price: "Rs. 4500",
    description: "Get started with core features.",
    features: [
      "LCD Device Plan",
      "Content Looping and Scheduling",
      "2GB storage/50 GiB memory transfer",
      "Support within 48 hours",
      "Content classification",
      "Split screen",
    ],
    cta: "Talk to Sales",
    highlight: false,
  },
  {
    name: "Pro",
    price: "Rs. 6000",
    description: "Everything you need to run small networks.",
    features: [
      "LCD Device Plan",
      "Content Looping and Scheduling",
      "8 GB file storage/100 GiB memory transfer",
      "Support within 48 hours",
      "Content classification",
      "Email support",
    ],
    cta: "Talk to Sales",
    highlight: true,
  },
  {
    name: "Business",
    price: "Rs. 10,000",
    description: "For larger deployments and teams.",
    features: [
      "LED Device Plan",
      "Content Looping and Scheduling",
      "30 GB file storage/100 GiB memory transfer",
      "Support within 48 hours",
      "Content classification",
      "Email support",
    ],
    cta: "Talk to Sales",
    highlight: false,
  },
  {
    name: "Audience measurement with AI(API)",
    price: "Rs. 6000",
    description: "For larger deployments and teams.",
    features: [
      "LCD Device Plan",
      "Content Looping and Scheduling",
      "30 GB file storage/100 GiB memory transfer",
      "Support within 48 hours",
      "Content classification",
      "Split screen",
      "Trigger based content generation",
      "Real time analytics",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
  {
    name: "Real time with AI/ML integration",
    price: "Rs. 8,000",
    description: "For larger deployments and teams.",
    features: [
      "LCD Device Plan",
      "Content Looping and Scheduling",
      "30 GB file storage/100 GiB memory transfer",
      "Support within 48 hours",
      "Content classification",
      "Split screen",
      "Trigger based content generation",
      "Real time analytics",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
  {
    name: "Audience measurement with AI(API)",
    price: "Rs. 14,000",
    description: "For larger deployments and teams.",
    features: [
      "LED Device Plan",
      "Content Looping and Scheduling",
      "30 GB file storage/100 GiB memory transfer",
      "Support within 48 hours",
      "Content classification",
      "Split screen",
      "Trigger based content generation",
      "Real time analytics",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <div className="relative isolate bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Choose a plan that scales with your digital signage network.
          </p>
        </div>


        <div className="mx-auto mt-12 grid max-w-md grid-cols-1 gap-8 sm:mt-16 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={
                "rounded-2xl ring-1 ring-white/10 p-8 bg-white/5 backdrop-blur-sm flex flex-col " +
                (tier.highlight ? "lg:-mt-4 lg:mb-4 ring-indigo-400/40" : "")
              }
            >
              <h3 className="text-xl font-semibold">{tier.name}</h3>
              <p className="mt-4 text-3xl font-bold">{tier.price}</p>
              <p className="mt-2 text-sm text-gray-300">{tier.description}</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-200">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <svg
                      className="h-5 w-5 text-emerald-400 flex-none"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <a
                  href="https://digiferate.setmore.com/"
                  className={
                    "inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 " +
                    (tier.highlight
                      ? "bg-white text-gray-900 hover:bg-gray-100 focus-visible:outline-white"
                      : "bg-white text-gray-900 hover:bg-gray-100 focus-visible:outline-white")
                  }
                >
                  {tier.cta}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-3xl mt-16">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">
              Frequently asked questions
            </h2>
            <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 text-sm text-gray-200">
              <div>
                <dt className="font-medium text-white">
                  Can I change plans later?
                </dt>
                <dd className="mt-2">
                  Yes, you can upgrade or downgrade any time.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-white">
                  Is there a free trial?
                </dt>
                <dd className="mt-2">
                  Talk to Sales. No credit card required.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-white">
                  Do you offer whitelabeling with Custom Features?
                </dt>
                <dd className="mt-2">Talk to Sales.</dd>
              </div>
              <div>
                <dt className="font-medium text-white">
                  What payment methods are supported?
                </dt>
                <dd className="mt-2">
                  All major cards are accepted. Invoices for Business plans.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      {/* Contact details at bottom */}
      <div className="px-6 lg:px-8 pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-300">Questions? Contact us</p>
            <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
              <a href="mailto:info@digiferate.in" className="text-white hover:text-gray-200 underline underline-offset-4">
                info@digiferate.in
              </a>
              <span className="hidden sm:inline text-gray-500">|</span>
              <a href="tel:+917795807079" className="text-white hover:text-gray-200 underline underline-offset-4">
                +91 77958 07079
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
