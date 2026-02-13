import React from "react";

function PrivacyPolicy() {
  return (
    <div className="p-6 bg-white text-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">

        <h1 className="mt-10 text-3xl font-bold mb-6">Privacy Policy</h1>

        <p className="mb-4">
          This Privacy Policy explains how DIGIFERATE CONSULTING (OPC) PRIVATE LIMITED ("Digiferate", "we", "our", or "Service Provider") collects, uses, and protects information when you use our Android Mobile Application and Website.
        </p>

        {/* ================= ANDROID APP SECTION ================= */}

        <h2 className="text-2xl font-semibold mt-8 mb-3">
          Section 1: Android Mobile Application
        </h2>

        <h3 className="text-xl font-semibold mt-4 mb-2">
          Permissions Used
        </h3>

        <p className="mb-4">
          Our Android application uses the following permission:
        </p>

        <ul className="list-disc list-inside ml-4 mb-4 space-y-1">
          <li>
            <strong>Camera Permission (android.permission.CAMERA)</strong>
          </li>
        </ul>

        <p className="mb-4">
          The camera is used solely for computer vision and audience analytics purposes, including detecting general demographic attributes, motion, engagement levels, and content interaction patterns.
        </p>

        <p className="mb-4">
          The application does <strong>NOT</strong> collect, store, or transmit:
        </p>

        <ul className="list-disc list-inside ml-4 mb-4 space-y-1">
          <li>Personally identifiable information</li>
          <li>Facial recognition data</li>
          <li>Biometric identifiers</li>
          <li>Personal images or video recordings</li>
        </ul>

        <p className="mb-4 font-semibold">
          This data is used only to target the right content to the right people and is not shared or used for any other purposes.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-2">
          Information Collected
        </h3>

        <ul className="list-disc list-inside ml-4 mb-4 space-y-1">
          <li>Device type and operating system</li>
          <li>Application usage statistics</li>
          <li>Anonymous engagement and interaction data</li>
          <li>Performance and diagnostic information</li>
        </ul>

        <p className="mb-4">
          All collected data is anonymized and used only for improving service functionality and delivering relevant content.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-2">
          Data Storage and Security
        </h3>

        <p className="mb-4">
          We implement appropriate technical and organizational safeguards to protect information. No personal images, biometric identifiers, or personal identity data are stored.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-2">
          User Control
        </h3>

        <p className="mb-6">
          Users may stop all data collection by uninstalling the Android application.
        </p>


        {/* ================= WEBSITE SECTION ================= */}

        <h2 className="text-2xl font-semibold mt-8 mb-3">
          Section 2: Website
        </h2>

        <p className="mb-4">
          Digiferate Consulting website is owned by Digiferate, which is a data controller of your personal data.
        </p>

        <p className="mb-4">
          We have adopted this Privacy Policy, which determines how we process information collected by Digiferate Consulting and explains why we must collect certain personal data.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-2">
          Personal information we collect
        </h3>

        <p className="mb-4">
          When you visit our website, we automatically collect certain information about your device, including browser information, IP address, time zone, and cookies.
        </p>

        <p className="mb-4">
          We may also collect personal data such as email address and login credentials when you register or use our services.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-2">
          Why we process your data
        </h3>

        <p className="mb-4">
          We process minimal data necessary to maintain and improve our services, ensure security, and provide proper functionality.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-2">
          Information Security
        </h3>

        <p className="mb-4">
          We secure information using appropriate technical and organizational safeguards to prevent unauthorized access, disclosure, or misuse.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-2">
          Third-Party Services
        </h3>

        <p className="mb-4">
          We may use trusted third-party services such as Supabase and analytics providers for authentication, database management, and analytics.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-2">
          Your Rights
        </h3>

        <ul className="list-disc list-inside ml-4 mb-4 space-y-1">
          <li>Right to access your data</li>
          <li>Right to request correction</li>
          <li>Right to request deletion</li>
          <li>Right to restrict processing</li>
        </ul>

        <h3 className="text-xl font-semibold mt-4 mb-2">
          Contact Information
        </h3>

        <p className="mb-4">
          If you have questions regarding this Privacy Policy, contact us at:
        </p>

        <p className="mb-10 font-medium">
          Email: nivedita@digiferate.in
        </p>

        <p className="text-sm text-gray-500">
          Effective Date: February 13, 2026
        </p>

      </div>
    </div>
  );
}

export default PrivacyPolicy;
