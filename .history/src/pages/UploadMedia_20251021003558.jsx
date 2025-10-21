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

// ✅ --- MediaFile component (UPDATED) ---
// It now takes 'onFileDelete'
function MediaFile({ file, folders, onFileMove, onFileDelete }) {
  
  const handleMove = (event) => {
    const folderId = event.target.value;
    if (!folderId) return;
    onFileMove(file.id, folderId);
  };
  
  // ✅ NEW: Call the delete function
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this file permanently?")) {
      onFileDelete(file); // Pass the whole file object
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "0.5rem",
        borderRadius: "8px",
      }}
    >
      {/* ... (image/video) ... */}
      {file.file_type.includes("image") ? (
        <img
          src={file.file_path}
          alt={file.file_name}
          style={{ width: "150px", height: "150px", objectFit: "cover" }}
        />
      ) : (
        <video
          src={file.file_path}
          style={{ width: "150px", height: "150px", backgroundColor: "black" }}
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

      {/* "Move to" Dropdown (no change) */}
      <select 
        onChange={handleMove} 
        style={{ 
          width: "100%", 
          marginTop: "0.5rem", 
          color: "#333",
          padding: "4px"
        }}
      >
        <option value="">Move to...</option>
        {folders.map(folder => (
          <option key={folder.id} value={folder.id}>
            {folder.name}
          </option>
        ))}
      </select>
      
      {/* ✅ NEW: Delete Button */}
      <button
        onClick={handleDelete}
        style={{
          width: "100%",
          marginTop: "0.5rem",
          padding: "4px",
          backgroundColor: "#dc3545", // Red color
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Delete
      </button>
    </div>
  );
}


function UploadMedia() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [mediaFiles, setMediaFiles] = useState([]);
  const [folders, setFolders] = useState([]); 
  const [isLoadingList, setIsLoadingList] = useState(true);
  
  const [currentFolder, setCurrentFolder] = useState(null); 

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

  // --- handleFileChange function (no change) ---
  const handleFileChange = (event) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // --- handleUpload (no change) ---
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
        .insert({ name: name, user_id: user.id }); 
      if (error) throw error;
      alert("Folder created!");
      fetchLibrary(); 
    } catch (error) {
      alert("Error creating folder: " + error.message);
    }
  };
  
  // --- handleFileMove (no change) ---
  const handleFileMove = async (fileId, targetFolderId) => {
    try {
      const { error } = await supabase
        .from("media")
        .update({ folder_id: targetFolderId }) 
        .eq("id", fileId); 
      if (error) throw error;
      alert("File moved successfully!");
      fetchLibrary(); 
    } catch (error) {
      alert("Error moving file: " + error.message);
    }
  };
  
  // ✅ --- NEW: Function to delete a file ---
  const handleFileDelete = async (file) => {
    try {
      // 1. Get the storage path from the full public URL
      // The URL is like: .../public/media/USER_ID/FILENAME.jpg
      // We need the part "USER_ID/FILENAME.jpg"
      const storagePath = file.file_path.split('/media/')[1];
      
      // 2. Delete from Storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([storagePath]);
        
      if (storageError) throw storageError;
      
      // 3. Delete from Database
      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', file.id);
        
      if (dbError) throw dbError;

      alert("File deleted successfully!");
      fetchLibrary(); // Refresh the list
      
    } catch (error) {
      alert("Error deleting file: " + error.message);
    }
  };

  // --- Helper variables (no change) ---
  const mediaInCurrentFolder = mediaFiles.filter(
    file => file.folder_id === currentFolder?.id
  );
  const mediaWithoutFolders = mediaFiles.filter(file => !file.folder_id);

  // --- VIEW 1: Inside a folder (UPDATED) ---
  if (currentFolder) {
    return (
      <div className="p-6 bg-white text-gray-900 min-h-screen"> 
        <button onClick={() => setCurrentFolder(null)}>
          &larr; Back to Library
        </button>
        <h1>{currentFolder.name}</h1>
        
        {/* ... (upload form) ... */}
        <div style={{ margin: "2rem 0", padding: "1rem", border: "1px dashed #ccc" }}>
          <h3>Upload to "{currentFolder.name}"</h3>
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            style={{
              backgroundColor: !selectedFile || isUploading ? "#ccc" : "#007bff",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginLeft: "10px"
            }}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        <hr />
        <h2>Media in this folder</h2>
        {isLoadingList ? (
          <p>Loading...</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {/* ✅ NEW: Pass onFileDelete prop */}
            {mediaInCurrentFolder.map((file) => (
              <MediaFile 
                key={file.id} 
                file={file} 
                folders={folders} 
                onFileMove={handleFileMove} 
                onFileDelete={handleFileDelete}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- VIEW 2: At the "root" (UPDATED) ---
  return (
    <div className="p-6 bg-white text-gray-900 min-h-screen">
      <h1>Upload Media</h1>
      {/* ... (upload form) ... */}
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        style={{
          backgroundColor: !selectedFile || isUploading ? "#ccc" : "#007bff",
          color: "#fff",
          padding: "8px 16px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
      <button
        onClick={handleCreateFolder}
        style={{
          backgroundColor: "#28a745",
          color: "#fff",
          padding: "8px 16px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginLeft: "10px",
        }}
      >
        + Create Folder
      </button>
      {selectedFile && (
        <p style={{ marginTop: "1rem" }}>Selected: {selectedFile.name}</p>
      )}

      <hr style={{ margin: "2rem 0" }} />

      {/* ... (Display Folders) ... */}
      <h2>Your Folders</h2>
      {isLoadingList ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => setCurrentFolder(folder)} 
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                textAlign: "center",
                cursor: "pointer", 
                border: "1px solid #eee"
              }}
            >
              <FolderIcon />
              <p>{folder.name}</p>
            </div>
          ))}
        </div>
      )}

      <hr style={{ margin: "2rem 0" }} />

      {/* --- Media Library (unassigned) (UPDATED) --- */}
      <h2>Your Media Library (Unassigned)</h2>
      {isLoadingList ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {/* ✅ NEW: Pass onFileDelete prop */}
          {mediaWithoutFolders.map((file) => (
            <MediaFile 
              key={file.id} 
              file={file} 
              folders={folders} 
              onFileMove={handleFileMove} 
              onFileDelete={handleFileDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default UploadMedia;