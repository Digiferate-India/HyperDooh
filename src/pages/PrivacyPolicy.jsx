import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="p-6 bg-white text-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">

        <h1 className="mt-10 text-3xl font-bold mb-6">Privacy Policy</h1>

        {/* ================= ANDROID APP SECTION ================= */}

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          Section 1: Android Mobile Application
        </h2>

        <p className="mb-4">
          The HyperDOOH Android mobile application uses the device camera solely for computer vision and audience analytics purposes. This includes detecting general demographic attributes, engagement levels, and motion patterns to improve content relevance.
        </p>

        <p className="mb-4">
          The application does NOT collect, store, or transmit personally identifiable information, biometric identifiers, facial recognition data, or personal images and videos.
        </p>

        <p className="mb-4 font-semibold">
          This data is used only to target the right content to the right people and is not shared or used for any other purposes.
        </p>

        <p className="mb-6">
          All processing is performed securely, and users can stop all data collection by uninstalling the application.
        </p>


        {/* ================= WEBSITE SECTION ================= */}

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          Section 2: Website
        </h2>

        {/* ORIGINAL CONTENT STARTS HERE — UNCHANGED */}

        <p className="mb-4">
          Digiferate Consulting website is owned by Digiferate, which is a data
          controller of your personal data.
        </p>

        <p className="mb-4">
          We have adopted this Privacy Policy, which determines how we are
          processing the information collected by Digiferate Consulting, which
          also provides the reasons why we must collect certain personal data
          about you. Therefore, you must read this Privacy Policy before using
          Digiferate Consulting website.
        </p>

        <p className="mb-4">
          We take care of your personal data and undertake to guarantee its
          confidentiality and security.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          Personal information we collect:
        </h2>

        <p className="mb-4">
          When you visit the Digiferate Consulting, we automatically collect
          certain information about your device, including information about
          your web browser, IP address, time zone, and some of the installed
          cookies on your device. Additionally, as you browse the Site, we
          collect information about the individual web pages or products you
          view, what websites or search terms referred you to the Site, and how
          you interact with the Site. We refer to this automatically-collected
          information as “Device Information.” Moreover, we might collect the
          personal data you provide to us (including but not limited to Name,
          Surname, Address, payment information, etc.) during registration to be
          able to fulfill the agreement.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          Why do we process your data?
        </h2>

        <p className="mb-4">
          Our top priority is customer data security, and, as such, we may
          process only minimal user data, only as much as it is absolutely
          necessary to maintain the website. Information collected automatically
          is used only to identify potential cases of abuse and establish
          statistical information regarding website usage. This statistical
          information is not otherwise aggregated in such a way that it would
          identify any particular user of the system.
        </p>

        <p className="mb-4">
          You can visit the website without telling us who you are or revealing
          any information, by which someone could identify you as a specific,
          identifiable individual. If, however, you wish to use some of the
          website’s features, or you wish to receive our newsletter or provide
          other details by filling a form, you may provide personal data to us,
          such as your email, first name, last name, city of residence,
          organization, telephone number. You can choose not to provide us with
          your personal data, but then you may not be able to take advantage of
          some of the website’s features.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          Your rights:
        </h2>

        <p className="mb-4">
          If you are a European resident, you have the following rights related
          to your personal data:
        </p>

        <ul className="list-disc list-inside ml-4 mb-4 space-y-1">
          <li>The right to be informed.</li>
          <li>The right of access.</li>
          <li>The right to rectification.</li>
          <li>The right to erasure.</li>
          <li>The right to restrict processing.</li>
          <li>The right to data portability.</li>
          <li>The right to object.</li>
          <li>Rights in relation to automated decision-making and profiling.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          Links to other websites:
        </h2>

        <p className="mb-4">
          Our website may contain links to other websites that are not owned or
          controlled by us.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          Information security:
        </h2>

        <p className="mb-4">
          We secure information using appropriate safeguards.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          Legal disclosure:
        </h2>

        <p className="mb-4">
          We will disclose information if required by law.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">
          Contact information:
        </h2>

        <p className="mb-4">
          Contact us at digiferate@gmail.com.
        </p>

      </div>
    </div>
  );
}

export default PrivacyPolicy;
