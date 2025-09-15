import React from "react";

// FAKE SVG Logo - in a real app, this would be an SVG file
const PaperjetLogo = () => (
  <svg
    width="100"
    height="24"
    viewBox="0 0 100 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="0"
      y="18"
      fontFamily="Inter, sans-serif"
      fontSize="13"
      fontWeight="bold"
      fill="white"
    >
      HYPERDOOH
    </text>
  </svg>
);

// Icon components - in a real app, you would use an icon library like lucide-react
const CheckCircle = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const ArrowRight = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

// Social Icons
const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#00acee"
    className="text-black-400 hover:text-white"
  >
    <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.76 2.81 1.91 3.58-.71 0-1.37-.22-1.95-.55v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.94.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21c7.34 0 11.35-6.08 11.35-11.35 0-.17 0-.34-.01-.51.78-.57 1.45-1.29 1.99-2.09z"></path>
  </svg>
);
const DiscordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#7289d7"
    className="text-gray-400 hover:text-white"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4464.8245-.6667 1.288-1.5442-.2938-3.1032-.2938-4.6474 0-.2203-.4635-.4557-.9127-.6667-1.288a.0741.0741 0 0 0-.0785-.0371 19.7913 19.7913 0 0 0-4.8851 1.5152.069.069 0 0 0-.0321.0256c-1.843 3.61-2.2434 7.42-1.9067 11.2424.0371.4218.3807.743.8039.7824a18.68 18.68 0 0 0 3.6454.7178.0741.0741 0 0 0 .0879-.0464c.2475-.4464.486-1.028.676-1.527-.2781-.0879-.5517-.185-.8116-.2938a.0741.0741 0 0 1-.0558-.097c.0558-.097.149-.1758.2475-.2203.9961-.486 1.955-.8455 2.8725-1.0741a.0741.0741 0 0 1 .0785.0163c.6974.4557 1.4494.8548 2.2536 1.1604a.0741.0741 0 0 1 .0785-.0163c.9175.2286 1.8765.5886 2.8725 1.0741.0985.0445.1917.1232.2475-.2203a.0741.0741 0 0 1-.0558.097c-.26.1088-.5335.2058-.8116.2938.19.499.4285 1.0805.676 1.527a.0741.0741 0 0 0 .0879.0464 18.7188 18.7188 0 0 0 3.6454-.7178c.4232-.0393.7668-.3606.8039-.7824.3367-3.8224-.0634-7.6324-1.9067-11.2424a.069.069 0 0 0-.0321-.0256zM8.02 15.3312c-.743 0-1.3442-.6012-1.3442-1.3442s.6012-1.3442 1.3442-1.3442 1.3442.6012 1.3442 1.3442-.6012 1.3442-1.3442 1.3442zm7.96 0c-.743 0-1.3442-.6012-1.3442-1.3442s.6012-1.3442 1.3442-1.3442 1.3442.6012 1.3442 1.3442-.6012 1.3442-1.3442 1.3442z"></path>
  </svg>
);
const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="black"
    className="text-gray-400 hover:text-white"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
  </svg>
);

const YouTubeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="red"
    className="text-gray-400 hover:text-white"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
  </svg>
);

// New Community Icons
const CommunityIconMail = () => (
  <div className="w-20 h-20 bg-[#5C9AE1] rounded-2xl shadow-lg flex items-center justify-center p-2">
    <svg
      className="w-12 h-12 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      ></path>
    </svg>
  </div>
);

const CommunityIconFile = () => (
  <div className="w-20 h-20 bg-white rounded-2xl shadow-lg p-2 flex items-center justify-center relative">
    <svg
      className="w-12 h-12 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      ></path>
    </svg>
    <div className="absolute top-0 right-0">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M32 0L0 32H32V0Z" fill="#F87171" />
      </svg>
    </div>
  </div>
);

const CommunityIconServer = () => (
  <div className="w-20 h-20 bg-[#34D399] rounded-2xl shadow-lg p-4 relative flex">
    <div className="flex space-x-2 h-full w-full">
      <div className="h-full w-2 bg-black/20 rounded-full"></div>
      <div className="h-full w-2 bg-black/20 rounded-full"></div>
      <div className="h-full w-2 bg-black/20 rounded-full"></div>
    </div>
    <div className="w-3 h-3 bg-white rounded-full absolute top-4 right-4"></div>
  </div>
);

export default function App() {
  return (
    <div className="bg-[#ffffff] min-h-[30vh] w-screen font-sans text-white overflow-x-hidden">
      {/* --- GRADIENT & BLACK SECTION START --- */}
      <div className="relative isolate bg-black text-white">
        {/* Background Gradient */}
        <div
          className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[190deg] bg-gradient-to-tr from-[#EC1091] to-[#0271E3] opacity-90 sm:left-[calc(50%)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <header className="absolute inset-x-0 top-0 z-50">
          <div className="px-1 sm:px-6 lg:px-8">
            <nav
              className="flex items-center justify-between py-2 w-screen bg-white/5 backdrop-blur-lg"
              aria-label="Global"
            >
              <div className="flex lg:flex-1">
                <a href="#" className="-m-1.5 p-1.5">
                  <PaperjetLogo />
                </a>
              </div>
              <div className="lg:flex lg:gap-x-12">
                <a
                  href="#"
                  className=""
                >
                  Product
                </a>
                <a
                  href="#"
                  className=""
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className=""
                >
                  Company
                </a>
                <a
                  href="#"
                  className=""
                >
                  Blog
                </a>
              </div>
              <div className="mr-5.5 hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-7 items-center">
                <a
                  href="#"
                  className="text-sm font-semibold leading-6"
                >
                  Sign in
                </a>
                <a
                  href="#"
                  className="items-center mr-19.5 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Sign up
                </a>
              </div>
            </nav>
          </div>
        </header>

        <main className="relative pt-24 sm:pt-32">
          <div className="mt-19 px-4 sm:px-6 lg:px-8">
            <div className="mt-8 max-w-7xl mx-auto text-center">
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Revolutionize your digital signage with real-time updates based
                on audience insights and engagement metrics.
              </h1>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  className="mt-5 mb-4 text-white rounded-md bg-amber-50 px-4 py-3 text-sm font-semibold shadow-sm"
                >
                  Book a Demo
                </a>
              </div>
            </div>
            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <img
                  src="https://i.postimg.cc/Fz3b4xXB/1.png"
                  alt="App screenshot"
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10 w-full"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* --- GRADIENT & BLACK SECTION END --- */}
      {/* Stats section */}
      <div className="bg-color-white mt-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 text-center lg:grid-cols-3 max-w-7xl mx-auto">
            <div>
              <h3 className="text-4xl font-bold tracking-tight text-black sm:text-5xl">
                1M+
              </h3>
              <p className="mt-2 text-base leading-7 text-gray-400">
                Audience Interests
              </p>
            </div>
            <div>
              <h3 className="text-4xl font-bold tracking-tight text-black sm:text-5xl">
                5K+
              </h3>
              <p className="mt-2 text-base leading-7 text-gray-400">
                Trusted companies
              </p>
            </div>
            <div>
              <h3 className="text-4xl font-bold tracking-tight text-black sm:text-5xl">
                200+
              </h3>
              <p className="mt-2 text-base leading-7 text-gray-400">
                Trusted partners
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logos section */}
      <div className="mt-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-m font-bold text-black">
              Trusted by 25,000+ <br /> Businesses
            </p>
            <div className="mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
              <span className="col-span-1 text-2xl font-bold text-gray-400 text-center">
                Zebra
              </span>
              <span className="col-span-1 text-2xl font-bold text-gray-400 text-center">
                Mondaze
              </span>
              <span className="col-span-1 text-2xl font-bold text-gray-400 text-center">
                Hexlant
              </span>
              <span className="col-span-1 text-2xl font-bold text-gray-400 text-center">
                AIMMO
              </span>
              <span className="col-span-1 text-2xl font-bold text-gray-400 text-center">
                SELECT
              </span>
              <span className="col-span-1 text-2xl font-bold text-gray-400 text-center">
                Company
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="mt-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="relative aspect-video rounded-xl shadow-2xl overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/bhFKnRNxeRU?si=7nPsPLxy2EjDz0bF"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 max-w-7xl mx-auto">
            <div className="bg-white/3 rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl text-black font-bold">
                Signage Connection
              </h3>
              <p className="mt-2 mb-7 text-gray-900">
                Easily collaborate with colleagues to quickly solve complex
                problems, as well as allow customers to track progress in real
                time.
              </p>
              <div className="mt-6 -m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <img
                  src="https://i.postimg.cc/9FKy8K3Y/2.png"
                  alt="Feature 1"
                  className="rounded-md w-full"
                />
              </div>
            </div>
            {/* --- THIS WRAPPER NOW CONTAINS THE OTHER THREE BOXES --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/3 rounded-2xl p-8 shadow-xl">
                <h3 className="text-xl text-black font-bold">
                  Multiplayer with CV
                </h3>
                <p className="mt-2 mb-7 text-gray-900">
                  Track and engage with audiences as they move through your
                  stores and spaces.
                </p>
                <div className="mt-6 -m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <img
                    src="https://i.postimg.cc/ZKKspjzr/b1661c70589275-5baa87e6cd245.jpg"
                    alt="Feature 2"
                    className="rounded-md w-full"
                  />
                </div>
              </div>
              <div className="bg-white/3 rounded-2xl p-8 shadow-xl">
                <h3 className="text-xl text-black font-bold">Lightning fast</h3>
                <p className="mt-2 mb-7 text-gray-900">
                  Update content and playlists on one, or thousands of screens
                  in an instant.
                </p>
                <div className="mt-6 -m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <img
                    src="https://i.postimg.cc/1X2v5QsZ/Block.png"
                    alt="Feature 3"
                    className="rounded-md w-full object-cover aspect-[4/5]"
                  />
                </div>
              </div>
              <div className="bg-white/3 rounded-2xl p-8 shadow-xl">
                <h3 className="text-xl text-black font-bold">
                  Signage Connection
                </h3>
                <p className="mt-2 mb-7 text-gray-900">
                  Easily collaborate with colleagues to quickly solve complex
                  problems, as well as allow customers to track progress in real
                  time.
                </p>
                <div className="mt-6 -m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <div className="relative aspect-video overflow-hidden rounded-md">
                    <iframe
                      src="https://www.youtube.com/embed/13Lbyssl6QQ?si=3lHkkwRvfx51uR17"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 sm:py-32">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <span className="bg-white/10 text-black text-xs font-medium px-2.5 py-1 rounded-full">
                PRICING
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-indigo-400 sm:text-4xl">
                The right price for you, whoever you are
              </h2>
              <p className="mt-6 text-lg leading-8 text-black">
                Choose a plan that works for you.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:grid-cols-3">
              {/* Plan 1 */}
              <div className="relative bg-white/5 p-8 rounded-3xl shadow-xl ring-2 ring-indigo-500">
                <h3 className="text-base font-semibold leading-7 text-indigo-400">
                  Professional
                </h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-indigo-400">
                    $99
                  </span>
                  <span className="text-base text-gray-400">/month</span>
                </p>
                <p className="mt-6 text-base leading-7 text-black">
                  For small teams and startups.
                </p>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-black"
                >
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-indigo-400" />{" "}
                    10 users
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-indigo-400" />{" "}
                    Basic analytics
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-indigo-400" />{" "}
                    24/7 support
                  </li>
                </ul>
                <a
                  href="#"
                  className="mt-8 block text-white rounded-md bg-black-500 px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm border-2 border-b-indigo-400"
                >
                  Choose plan
                </a>
              </div>

              {/* Plan 2 */}
              <div className="relative bg-white/5 p-8 sm:mx-8 lg:mx-0 rounded-3xl shadow-xl ring-1 ring-white/10">
                <h3 className="text-base font-semibold leading-7 text-black">
                  Business
                </h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-indigo-400">
                    $123
                  </span>
                  <span className="text-base text-gray-400">/month</span>
                </p>
                <p className="mt-6 text-base leading-7 text-black">
                  For growing businesses.
                </p>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-black"
                >
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-gray-400" />{" "}
                    50 users
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-gray-400" />{" "}
                    Advanced analytics
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-gray-400" />{" "}
                    Priority support
                  </li>
                </ul>
                <a
                  href="#"
                  className="mt-8 block rounded-md border px-3.5 py-2.5 text-center text-sm font-semibold"
                >
                  Choose plan
                </a>
              </div>

              {/* Plan 3 */}
              <div className="relative bg-white/5 p-8 rounded-3xl shadow-xl ring-1 ring-white/10">
                <h3 className="text-base font-semibold leading-7 text-black">
                  Enterprise
                </h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-indigo-400">
                    $252
                  </span>
                  <span className="text-base text-gray-400">/month</span>
                </p>
                <p className="mt-6 text-base leading-7 text-black">
                  For large enterprises.
                </p>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-black"
                >
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-gray-400" />{" "}
                    Unlimited users
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-gray-400" />{" "}
                    Custom integrations
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-6 w-5 flex-none text-gray-400" />{" "}
                    Dedicated support
                  </li>
                </ul>
                <a
                  href="#"
                  className="mt-8 block rounded-md border px-3.5 py-2.5 text-center text-sm font-semibold"
                >
                  Choose plan
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="text-center py-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center mb-6">
              <div className="inline-flex items-center justify-center space-x-3 bg-white-900/40 p-3 rounded-3xl shadow-lg ring-1 ring-white/10">
                <CommunityIconMail />
                <CommunityIconFile />
                <CommunityIconServer />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-indigo-400 sm:text-4xl">
              Join the community
            </h2>
            <p className="mt-4 text-lg leading-8 text-black">
              Join our 1,000,000+ person community and contribute to a more
              private, Signage-first technology.
            </p>
            <div className="mt-8">
              <a
                href="#"
                className="inline-flex items-center gap-x-2 rounded-full bg-white border-2 px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200"
              >
                Join Now
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#fbfbfb]">
        <div className="py-12">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center space-x-6">
                <a href="#">
                  <TwitterIcon />
                </a>
                <a href="#">
                  <DiscordIcon />
                </a>
                <a href="#">
                  <GithubIcon />
                </a>
                <a href="#">
                  <YouTubeIcon />
                </a>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
                <div className="md:col-start-2">
                  <h3 className="text-sm font-semibold leading-6 text-black">
                    PRODUCTS
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-black hover:text-black"
                      >
                        Mail
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-black hover:text-white"
                      >
                        Drive
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-black hover:text-white"
                      >
                        Chat
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-black hover:text-white"
                      >
                        Calendar
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-black hover:text-white"
                      >
                        Photos
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-black hover:text-white"
                      >
                        Download
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-black">
                    RESOURCES
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-black hover:text-white"
                      >
                        Blog
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-black hover:text-white"
                      >
                        Help
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-black hover:text-white"
                      >
                        About us
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-black hover:text-white"
                      >
                        Changelog
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-black">
                    LEGAL
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-black hover:text-white"
                      >
                        Terms of Service
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-black hover:text-white"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-black hover:text-white"
                      >
                        Cookies
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-sm leading-6 text-black hover:text-white"
                      >
                        Licenses
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <p className="mt-10 text-center text-xs leading-5 text-gray-400">
                &copy; 2025 HyperDooh, Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}