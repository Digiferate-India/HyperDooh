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
          <video
            controls
            className="w-full h-64 rounded-lg object-cover"
            poster="https://i.imgur.com/Vse4q7W.jpeg"
          >
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Screen B */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Screen No. : B (Currently Playing)</h2>
          <video
            controls
            className="w-full h-64 rounded-lg object-cover"
            poster="https://i.imgur.com/5tj6S7Ol.jpg"
          >
            <source src="https://www.w3schools.com/html/movie.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </DashboardLayout>
  );
}
