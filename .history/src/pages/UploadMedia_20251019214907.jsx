import { useState, useEffect } from "react"; 
import { supabase } from "../lib/supabaseClient";

// ✅ --- We can create a simple Folder icon component ---
function FolderIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      style={{ width: "150px", height: "150px", color: "#f3b049" }}
    >
      <path d="M19.5 21a3 3 0 003-3v-9a3 3 0 00-3-3h-5.604A3.375 3.375 0 0111.396 3H7.5a3 3 0 00-3 3v12a3 3 0 003 3h12z" />
    </svg>
  );
}

// ✅ --- And a simple Media file card component ---
function MediaFile({ file }) {
  return (
    <div
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
        title={file.file_name}
      >
        {file.file_name}
      </p>
    </div>
  );
}


function UploadMedia() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [mediaFiles, setMediaFiles] = useState([]);
  const [folders, setFolders] = useState([]); // ✅ State for folders
  const [isLoadingList, setIsLoadingList] = useState(true);

  // ✅ Renamed to fetchLibrary, fetches both folders and media
  const fetchLibrary = async () => {
    setIsLoadingList(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Folders
      const { data: foldersData, error: foldersError } = await supabase
        .from("folders")
        .select("*")
        .eq("user_id", user.id)
        .order("name", { ascending: true });
      
      if (foldersError) throw foldersError;
      if (foldersData) setFolders(foldersData);

      // 2. Fetch Media
      const { data: mediaData, error: mediaError } = await supabase
        .from("media")
        .select("*")
        // We use the new policy, so we don't need .eq("user_id")
        // This will get media we own OR media in folders we own
        .order("created_at", { ascending: false });

      if (mediaError) throw mediaError;
      if (mediaData) setMediaFiles(mediaData);

    } catch (error) {
      console.error("Error fetching library:", error.message);
    } finally {
      setIsLoadingList(false);
    }
  };

  // ✅ Use-effect now calls fetchLibrary
  useEffect(() => {
    fetchLibrary();
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to upload media.");

      const fileName = `${Date.now()}-${selectedFile.name}`;
      const filePath = `${user.id}/${fileName}`; // Files are still stored by user.id

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
        // folder_id is null by default, which is perfect
      };

      const { error: insertError } = await supabase
        .from("media")
        .insert([fileRecord]);
      if (insertError) throw insertError;

      alert("File uploaded successfully!");
      setSelectedFile(null);

      // ✅ Refresh the library
      fetchLibrary();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ --- Helper to filter media ---
  const mediaWithoutFolders = mediaFiles.filter(file => !file.folder_id);

  return (
    <div>
      <h1>Upload Media</h1>
      {/* --- Upload Form (no change) --- */}
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
        }}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      {selectedFile && (
        <p style={{ marginTop: "1rem" }}>Selected: {selectedFile.name}</p>
      )}

      <hr style={{ margin: "2rem 0" }} />

      {/* ✅ --- New Section to Display Folders --- */}
      <h2>Your Folders</h2>
      {isLoadingList ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {folders.map((folder) => (
            <div
              key={folder.id}
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <FolderIcon />
              <p>{folder.name}</p>
            </div>
          ))}
        </div>
      )}

      <hr style={{ margin: "2rem 0" }} />

      {/* ✅ --- Updated Section for Media --- */}
      <h2>Your Media Library (Unassigned)</h2>
      {isLoadingList ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {mediaWithoutFolders.map((file) => (
            <MediaFile key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UploadMedia;