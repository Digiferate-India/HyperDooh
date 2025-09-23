import React from 'react';

const teamMembers = [
  { name: 'Jane Doe', role: 'Lead Architect', imageUrl: 'https://i.pravatar.cc/150?img=1' },
  { name: 'John Smith', role: 'Creative Director', imageUrl: 'https://i.pravatar.cc/150?img=2' },
  { name: 'Emily White', role: 'Project Manager', imageUrl: 'https://i.pravatar.cc/150?img=3' },
];

const About = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen w-full">
      {/* Remove max-w-7xl mx-auto and adjust padding for full width */}
      <div className="w-full py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-indigo-400 sm:text-5xl tracking-wide uppercase">About Us</h2>
          <p className="mt-1 text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl">
            Crafting Spaces, Building Dreams
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-400">
            We are a passionate team of designers and architects dedicated to creating unique and inspiring environments.
          </p>
        </div>
        
        {/* Full width mission section */}
        <div className="mt-20 w-full">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center w-full">
            <div className="w-full">
              <h3 className="text-2xl font-bold sm:text-3xl text-indigo-400">Our Mission</h3>
              <p className="mt-3 text-lg text-gray-300">
                To innovate and excel in every project, delivering architectural solutions that are not only visually stunning but also functional and sustainable. We believe in a collaborative process, working closely with our clients to bring their vision to life.
              </p>
            </div>
            
          </div>
        </div>
        
        {/* Full width team section */}
        <div className="mt-20 text-center w-full">
          <h3 className="text-2xl font-bold sm:text-3xl text-indigo-400">Meet Our Team</h3>
          <div className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 w-full">
            {teamMembers.map((member) => (
              <div key={member.name} className="space-y-4 w-full">
                <img className="mx-auto h-40 w-40 rounded-full object-cover" src={member.imageUrl} alt={member.name} />
                <div className="space-y-2">
                  <h4 className="text-lg font-medium">{member.name}</h4>
                  <p className="text-indigo-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;