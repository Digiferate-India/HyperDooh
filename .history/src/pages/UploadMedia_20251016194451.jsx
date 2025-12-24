// In src/pages/UploadMedia.jsx
import { useState, useEffect } from "react"; // Import useEffect
import { supabase } from "../lib/supabaseClient";

function UploadMedia() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ Step 1: Add state for the media list and loading status
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  // ✅ Step 2: Create a function to fetch the user's media
  const fetchMedia = async () => {
    setIsLoadingList(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("media")
        .select("*")
        .eq("user_id", user.id) // Only get media for the current user
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setMediaFiles(data);
    } catch (error) {
      console.error("Error fetching media:", error.message);
    } finally {
      setIsLoadingList(false);
    }
  };

  // ✅ Step 3: Use useEffect to fetch data when the component loads
  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileChange = (event) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to upload media.");

      const fileName = `${Date.now()}-${selectedFile.name}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, selectedFile);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      const fileRecord = {
        file_name: selectedFile.name,
        file_path: urlData.publicUrl,
        file_type: selectedFile.type,
        user_id: user.id,
      };

      // ✅ ADD THIS LINE
      console.log("Record to save:", fileRecord);

      const { error: insertError } = await supabase
        .from("media")
        .insert([fileRecord]);
      if (insertError) throw insertError;

      alert("File uploaded successfully!");
      setSelectedFile(null);

      // ✅ Step 4: Refresh the list after a successful upload
      fetchMedia();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h1>Upload Media</h1>
      {/* --- Upload Form --- */}
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
      <button
  onClick={handleUpload}
  disabled={!selectedFile || isUploading}
  style={{
    backgroundColor: !selectedFile || isUploading ? "#ccc" : "#007bff",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: !selectedFile || isUploading ? "not-allowed" : "pointer",
    fontSize: "16px",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
  }}
>
  {isUploading ? "Uploading..." : "Upload"}
</button>

      {selectedFile && (
        <p style={{ marginTop: "1rem" }}>Selected: {selectedFile.name}</p>
      )}

      <hr style={{ margin: "2rem 0" }} />

      {/* ✅ Step 5: Display the list of media files */}
      <h2>Your Media Library</h2>
      {isLoadingList ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {mediaFiles.map((file) => (
            <div
              key={file.id}
              style={{
                border: "1px solid #ccc",
                padding: "0.5rem",
                borderRadius: "8px",
              }}
            >
              {file.file_type.includes("image") ? (
                <img
                  src={file.file_path}
                  alt={file.file_name}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <video
                  src={file.file_path}
                  style={{
                    width: "150px",
                    height: "150px",
                    backgroundColor: "black",
                  }}
                />
              )}
              <p
                style={{
                  maxWidth: "150px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {file.file_name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UploadMedia;
