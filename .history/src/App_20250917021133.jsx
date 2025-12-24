import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// --- Register GSAP Plugin ---
gsap.registerPlugin(ScrollTrigger);

// --- High-Fidelity Loader Component ---
const Loader = forwardRef(({ onLoaded }, ref) => {
  const loaderRef = useRef(null);
  const textContainerRef = useRef(null);
  const subtextRef = useRef(null);
  const svgPathRef = useRef(null);
  const lineRef = useRef(null);

  // Expose a trigger function to the parent component
  useImperativeHandle(ref, () => ({
    triggerExit() {
      const exitTl = gsap.timeline({
        onComplete: () => {
          if (onLoaded) onLoaded();
        },
      });

      // Step 1: Fade out the text and the SVG
      exitTl.to([textContainerRef.current, subtextRef.current, svgPathRef.current.parentElement], {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
      })
      // Step 2: Animate the line wipe AFTER the text is gone
      .to(lineRef.current, {
        x: 0,
        duration: 0.8,
        ease: 'power3.inOut',
      })
      // Step 3: Fade out the entire loader
      .to(
        loaderRef.current,
        {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.in',
        },
        '-=0.2'
      );
    },
  }));

  useEffect(() => {
    const path = svgPathRef.current;
    const pathLength = path.getTotalLength();

    // Set up the initial state for the SVG draw-in animation
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });
    
    const tl = gsap.timeline();

    // The main entry animation timeline
    tl.to(path, { // 1. Draw the SVG arc
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.inOut',
      })
      .to(path.parentElement, { // 2. Start spinning the SVG
        rotation: 360,
        duration: 1.5,
        ease: 'none',
        repeat: -1,
      }, '-=0.5')
      .from(textContainerRef.current.children, { // 3. Reveal the "OH" text
        yPercent: -100,
        stagger: 0.1,
        duration: 1.2,
        ease: 'power3.inOut',
      }, 0.5) // Start this slightly after the SVG draw begins
       .from(subtextRef.current, { // 4. Fade in the subtext
        opacity: 0,
        duration: 1.0,
        ease: 'power2.inOut',
      }, "-=1.0");

  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white"
    >
      <div className="relative overflow-hidden">
        {/* Main "OH" text with reveal effect */}
        <div className="preloader_oh text-[12vw] font-medium leading-none tracking-tighter sm:text-[10vw] md:text-[8vw] lg:text-[10rem]">
          <div className="flex" ref={textContainerRef}>
            <div className="oh_text">O</div>
            <div className="oh_text">H</div>
          </div>
          <div className="absolute top-0 left-0 flex">
            <div className="oh_text_duplicate">O</div>
            <div className="oh_text_duplicate">H</div>
          </div>
        </div>

        {/* Subtext */}
        <p ref={subtextRef} className="mt-2 text-center text-xs font-light tracking-[0.2em] sm:text-sm">
          (Architecture + Interior Design Studio)
        </p>
      </div>

      {/* Spinning SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 20 20"
        fill="none"
        className="absolute bottom-8"
      >
        <path
          ref={svgPathRef}
          d="M-4.37114e-07 10C-6.59372e-07 15.0847 4.02846 19.4286 9.00166 19.948C9.55096 20.0054 10 19.5523 10 19V19C10 18.4477 9.54999 18.0067 9.00237 17.935C5.11573 17.4265 2 13.9999 2 10C2 5.663 5.663 2 10 2C13.9999 2 17.4265 5.11573 17.935 9.00237C18.0067 9.54999 18.4477 10 19 10V10C19.5523 10 20.0054 9.55096 19.948 9.00166C19.4285 4.02846 15.0837 -2.14896e-07 10 -4.37114e-07C4.579 -6.74073e-07 -2.00154e-07 4.579 -4.37114e-07 10Z"
          fill="#FCFCFC"
        ></path>
      </svg>
      
      {/* Line wipe element */}
      <div
        ref={lineRef}
        className="absolute top-0 left-0 h-full w-full bg-black"
        style={{ transform: "translateX(-100%)" }}
      ></div>
    </div>
  );
});


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
  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#5C9AE1] p-2 shadow-lg">
    <svg
      className="h-12 w-12 text-white"
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
  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
    <svg
      className="h-12 w-12 text-gray-400"
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
    <div className="absolute right-0 top-0">
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
  <div className="relative flex h-20 w-20 rounded-2xl bg-[#34D399] p-4 shadow-lg">
    <div className="flex h-full w-full space-x-2">
      <div className="h-full w-2 rounded-full bg-black/20"></div>
      <div className="h-full w-2 rounded-full bg-black/20"></div>
      <div className="h-full w-2 rounded-full bg-black/20"></div>
    </div>
    <div className="absolute right-4 top-4 h-3 w-3 rounded-full bg-white"></div>
  </div>
);


export default function App() {
  const [loading, setLoading] = useState(true);
  const mainRef = useRef(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    // Simulate loading and then trigger the loader exit
    const timer = setTimeout(() => {
      if (loaderRef.current) {
        loaderRef.current.triggerExit();
      }
    }, 3000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  // This function is called by the Loader when its fade-out is complete
  const handleLoad = () => {
    // Start page animations
    const ctx = gsap.context(() => {
      // Animate the main content in
      gsap.to(mainRef.current, { autoAlpha: 1, duration: 0.5 });
      
      // Hero animations
      gsap.from("#hero-title", { duration: 1, y: 50, opacity: 0, ease: "power3.out", delay: 0.2, });
      gsap.from("#hero-button", { duration: 1, y: 50, opacity: 0, ease: "power3.out", delay: 0.4, });
      gsap.from("#hero-image", { duration: 1, scale: 0.9, opacity: 0, ease: "power3.out", delay: 0.6, });
      
      // Scroll-triggered animations
      gsap.from("#stats h3", { scrollTrigger: { trigger: "#stats", start: "top 80%" }, y: 50, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.2, });
      gsap.from(".feature-card", { scrollTrigger: { trigger: ".feature-card", start: "top 85%" }, y: 100, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.2, });
      gsap.from("#community-section > *", { scrollTrigger: { trigger: "#community-section", start: "top 80%" }, y: 50, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.2, });
    }, mainRef);
    
    // Set loading to false a bit later to ensure it's removed from DOM after animations start
    setTimeout(() => setLoading(false), 1000);

    return () => ctx.revert();
  };

  return (
    <>
      {loading && <Loader ref={loaderRef} onLoaded={handleLoad} />}
      <div
        ref={mainRef}
        className="w-screen overflow-x-hidden bg-[#ffffff] font-sans text-white"
        style={{ visibility: 'hidden' }} // Initially hide content
      >
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
                className="flex w-screen items-center justify-between bg-white/5 py-2 backdrop-blur-lg"
                aria-label="Global"
              >
                <div className="flex lg:flex-1">
                  <a href="#" className="-m-1.5 p-1.5">
                    <PaperjetLogo />
                  </a>
                </div>
                <div className="lg:flex lg:gap-x-12">
                  <a href="#" className="">
                    Product
                  </a>
                  <a href="#" className="">
                    Pricing
                  </a>
                  <a href="#" className="">
                    Company
                  </a>
                  <a href="#" className="">
                    Blog
                  </a>
                </div>
                <div className="mr-5.5 hidden items-center lg:flex lg:flex-1 lg:justify-end lg:gap-x-7">
                  <a href="#" className="text-sm font-semibold leading-6">
                    Sign in
                  </a>
                  <a
                    href="#"
                    className="mr-19.5 items-center rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Sign up
                  </a>
                </div>
              </nav>
            </div>
          </header>

          <main className="relative pt-24 sm:pt-32">
            <div className="mt-19 px-4 sm:px-6 lg:px-8">
              <div className="mx-auto mt-8 max-w-7xl text-center">
                <h1
                  id="hero-title"
                  className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl"
                >
                  Revolutionize your digital signage with real-time updates
                  based on audience insights and engagement metrics.
                </h1>
                <div
                  id="hero-button"
                  className="mt-10 flex items-center justify-center gap-x-6"
                >
                  <a
                    href="#"
                    className="mb-4 mt-5 rounded-md bg-amber-50 px-4 py-3 text-sm font-semibold text-white shadow-sm"
                  >
                    Book a Demo
                  </a>
                </div>
              </div>
              <div id="hero-image" className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <img
                    src="https://i.postimg.cc/RZ8j1QFh/carfinale.png"
                    alt="App screenshot"
                    className="w-full rounded-md shadow-2xl ring-1 ring-gray-900/10"
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
        {/* --- GRADIENT & BLACK SECTION END --- */}
        {/* Stats section */}
        <div id="stats" className="bg-color-white mt-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 text-center lg:grid-cols-3">
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