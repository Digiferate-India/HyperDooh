import { useState, useEffect } from "react"; 
import { supabase } from "../lib/supabaseClient";

// --- FolderIcon component (no change) ---
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

// --- MediaFile component (no change) ---
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
  const [folders, setFolders] = useState([]); 
  const [isLoadingList, setIsLoadingList] = useState(true);
  
  // ✅ --- STATE FOR NAVIGATION ---
  const [currentFolder, setCurrentFolder] = useState(null); // null = root

  // --- fetchLibrary function (no change) ---
  const fetchLibrary = async () => {
    setIsLoadingList(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: foldersData, error: foldersError } = await supabase
        .from("folders")
        .select("*")
        .eq("user_id", user.id)
        .order("name", { ascending: true });
      
      if (foldersError) throw foldersError;
      if (foldersData) setFolders(foldersData);

      const { data: mediaData, error: mediaError } = await supabase
        .from("media")
        .select("*")
        .order("created_at", { ascending: false });

      if (mediaError) throw mediaError;
      if (mediaData) setMediaFiles(mediaData);

    } catch (error) {
      console.error("Error fetching library:", error.message);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const handleFileChange = (event) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // --- handleUpload (Small update needed soon) ---
  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
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
        // ✅ We will update this line next!
        folder_id: currentFolder ? currentFolder.id : null,
      };

      const { error: insertError } = await supabase
        .from("media")
        .insert([fileRecord]);
      if (insertError) throw insertError;

      alert("File uploaded successfully!");
      setSelectedFile(null);
      fetchLibrary();

    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // --- handleCreateFolder (no change) ---
  const handleCreateFolder = async () => {
    const folderName = window.prompt("Enter a name for your new folder:");
    if (!folderName) return; 

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in.");

      const { error } = await supabase
        .from("folders")
        .insert({ name: folderName, user_id: user.id }); 
      
      if (error) throw error;

      alert("Folder created!");
      fetchLibrary(); 
    } catch (error) {
      alert("Error creating folder: " + error.message);
    }
  };

  // ✅ --- Helper variables to filter our media ---
  const mediaInCurrentFolder = mediaFiles.filter(
    file => file.folder_id === currentFolder?.id
  );
  const mediaWithoutFolders = mediaFiles.filter(file => !file.folder_id);

  // ✅ --- We now have two main "views" ---
  
  // VIEW 1: We are inside a folder
  if (currentFolder) {
    return (
      <div>
        <button onClick={() => setCurrentFolder(null)}>
          &larr; Back to Library
        </button>
        <h1>{currentFolder.name}</h1>
        
        {/* Upload form, now inside the folder view */}
        <div style={{ margin: "2rem 0", padding: "1rem", border: "1px dashed #ccc" }}>
          <h3>Upload to "{currentFolder.name}"</h3>
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* Media list for *this* folder */}
        <hr />
        <h2>Media in this folder</h2>
        {isLoadingList ? (
          <p>Loading...</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {mediaInCurrentFolder.map((file) => (
              <MediaFile key={file.id} file={file} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // VIEW 2: We are at the "root" (main library)
  return (
    <div>
      <h1>Upload Media</h1>
      {/* Upload Form (for unassigned media) */}
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        style={{
          backgroundColor: !selectedFile || isUploading ? "#ccc" : "#007bff",
        }}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
      
      <button
        onClick={handleCreateFolder}
        style={{
          backgroundColor: "#28a745",
          marginLeft: "10px",
        }}
      >
        + Create Folder
      </button>

      {selectedFile && (
        <p style={{ marginTop: "1rem" }}>Selected: {selectedFile.name}</p>
      )}

      <hr style={{ margin: "2rem 0" }} />

      {/* --- Display Folders section --- */}
      <h2>Your Folders</h2>
      {isLoadingList ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => setCurrentFolder(folder)} // <-- This makes it clickable
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                textAlign: "center",
                cursor: "pointer", // <-- Shows it's clickable
              }}
            >
              <FolderIcon />
              <p>{folder.name}</p>
            </div>
          ))}
        </div>
      )}

      <hr style={{ margin: "2rem 0" }} />

      {/* --- Media Library section (unassigned) --- */}
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