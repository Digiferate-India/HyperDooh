// src/pages/PlaybackScreen.jsx
import DashboardLayout from "../layouts/DashboardLayout";

export default function PlaybackScreen() {
  return (
    <DashboardLayout>
      <h1 className="text-xl font-semibold mb-6">Overview</h1>

      <div className="p-4 bg-indigo-50 rounded-lg mb-6">
        <p className="font-medium">Playback Screen</p>
      </div>

      <div className="space-y-6">
        {/* Screen A */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Screen No. : A (Currently Playing)</h2>
          <div className="relative w-full h-56 bg-black rounded-lg overflow-hidden">
            <img
              src="https://i.imgur.com/Vse4q7W.jpeg"
              alt="Screen A Media"
              className="w-full h-full object-cover"
            />
            <button className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-700"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6 4l12 6-12 6V4z" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Screen B */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Screen No. : B (Currently Playing)</h2>
          <div className="relative w-full h-56 bg-black rounded-lg overflow-hidden">
            <img
              src="https://i.imgur.com/5tj6S7Ol.jpg"
              alt="Screen B Media"
              className="w-full h-full object-cover"
            />
            <button className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-700"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6 4l12 6-12 6V4z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
