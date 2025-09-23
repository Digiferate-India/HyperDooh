import React from "react";

const teamMembers = [
  {
    name: "Nivedita Kamath",
    role: "Founder",
    imageUrl: "https://i.postimg.cc/x1PbvYYX/1690034932257.jpg",
    description:
      "Product Management and Marketing professional with diverse experience in the areas of product lifecycle management and product marketing, business risk management, Finance, and project management. She runs Digiferate with diverse teams comprising of Full stack developers, product managers, and sales consultants.",
    linkedin: "https://www.linkedin.com/in/nivedita-kamath/",
    eco: true,
  },
  {
    name: "Tanishq Pratap",
    role: "Developer",
    imageUrl: "https://i.pravatar.cc/150?img=2",
    description:
      "A Multidisciplinary Designer and Developer with a passion for creating seamless digital experiences. Skilled in both front-end and back-end development, with a keen eye for design aesthetics.",
    linkedin: "#",
    eco: false,
  },
  {
    name: "Rakshith Kambi",
    role: "Advisor",
    imageUrl: "https://i.postimg.cc/9fg3q4nJ/1605601750780.jpg",
    description:
      "He specializes in developing sales, marketing, and advertising programs for a diverse clientele of international and Indian brands. His expertise spans various sectors including Retail, F&B, Hospitality, Fitness & Wellness, Corporate & Commercial, and Industrial Environments.",
    linkedin: "https://www.linkedin.com/in/rakshith-kambi-6100554a/",
    eco: false,
  },
    {
    name: "Mahinder T",
    role: "Subject Matter Expert",
    imageUrl: "https://i.postimg.cc/9fg3q4nJ/1605601750780.jpg",
    description:
      "He is a seasoned executive with a distinguished career path, progressing from a Quality Incharge to senior corporate leadership roles including General Manager, Director, and Chief Operating Officer (COO) for group companies.",
    linkedin: "https://www.linkedin.com/in/rakshith-kambi-6100554a/",
    eco: false,
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white w-full">
      {/* Header Section - Full Width */}
      <div className="w-full py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full text-center">
          <h2 className="text-base font-semibold text-indigo-400 tracking-wide uppercase mb-2">
            Our Approach
          </h2>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Crafting Digital Experiences
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We provide customized solutions to every business based on your requirements. We assess your location to provide a tailored solution that brings maximum results.
          </p>
        </div>
      </div>

      {/* Mission Section - Full Width */}
      <div className="w-full py-16 bg-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center w-full">
            <div className="w-full">
              <h3 className="text-2xl md:text-3xl font-bold text-indigo-400 mb-6">
                Our Mission
              </h3>
              <p className="text-lg text-gray-300 mb-4">
                To innovate and excel in every project, delivering digital
                solutions that are not only visually stunning but also
                functional and user-friendly.
              </p>
              <p className="text-lg text-gray-300">
                We believe in a collaborative process, working closely with our
                clients to bring their vision to life while leveraging the
                latest technologies.
              </p>
            </div>
            <div className="mt-10 lg:mt-0 w-full">
              <div className="rounded-2xl overflow-hidden shadow-2xl w-full">
                <img
                  className="w-full h-64 object-cover"
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Team collaboration"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section - Full Width */}
      <div className="w-full py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="text-center mb-16 w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-400 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Talented professionals dedicated to delivering exceptional digital
              experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 w-full"
              >
                {/* Member Header */}
                <div className="flex items-center mb-6 w-full">
                  <img
                    className="h-16 w-16 rounded-full object-cover mr-4 border-2 border-indigo-500"
                    src={member.imageUrl}
                    alt={member.name}
                  />
                  <div className="w-full">
                    <h4 className="text-lg font-semibold">{member.name}</h4>
                    <p className="text-indigo-400 text-sm">{member.role}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-6 leading-relaxed border-l-2 border-indigo-500 pl-4 w-full">
                  "{member.description}"
                </p>

                {/* Founded & ECO */}
                <div className="flex items-center justify-between mb-6 w-full">
                  <div className="flex items-center space-x-2">
                    
                    {member.eco && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-700/50">
                        HyperDOOH
                      </span>
                    )}
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="flex items-center justify-between mb-6 w-full">
                  <a
                    href={member.linkedin}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center"
                  >
                    <span>LinkedIn</span>
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.29 16.752V9.186h-2.24v7.566h2.24zM7.175 8.367c.779 0 1.262-.568 1.262-1.277-.014-.723-.483-1.277-1.248-1.277S5.9 6.367 5.9 7.09c0 .709.483 1.277 1.234 1.277h.041zM10.194 16.752h2.24v-4.35c0-.231.016-.463.084-.628.186-.463.61-.943 1.324-.943.934 0 1.307.671 1.307 1.654v4.267h2.24v-4.57c0-2.449-1.334-3.589-3.114-3.589-1.458 0-2.1.775-2.45 1.318h-.034v-1.134h-2.24c.03.67 0 7.566 0 7.566z" />
                    </svg>
                  </a>
                 
                </div>

                {/* AI Section */}
                <div className="pt-4 border-t border-gray-700 w-full">
                 
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section - Full Width */}
      <div className="w-full py-12 bg-gray-900">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm mb-4">
            http://www.ngsut.ac.com/?ref=lspamjs
          </p>
          <p className="text-gray-500 text-xs max-w-2xl mx-auto">
            Welcome to our website - We have innovative solutions that address
            complex digital challenges through layered agency models, giving you
            direct access to the key components we've created. Every promotion
            and user interaction delivers material results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
