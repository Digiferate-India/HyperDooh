import { useState, useEffect } from "react"; 
import { supabase } from "../lib/supabaseClient";

// --- FolderIcon (no change) ---
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
function MediaFile({ file, folders, onFileMove, onFileDelete }) {
  
  const handleMove = (event) => {
    const folderId = event.target.value;
    if (!folderId) return;
    onFileMove(file.id, folderId);
  };
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this file permanently?")) {
      onFileDelete(file); 
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
      
      <button
        onClick={handleDelete}
        style={{
          width: "100%",
          marginTop: "0.5rem",
          padding: "4px",
          backgroundColor: "#dc3545", 
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

// --- FolderCard component (no change) ---
function FolderCard({ folder, onClick, onFolderDelete }) {

  const handleDeleteClick = (e) => {
    e.stopPropagation(); 
    
    if (window.confirm(`Are you sure you want to delete the "${folder.name}" folder? All media inside will be moved to "Unassigned".`)) {
      onFolderDelete(folder.id);
    }
  };

  return (
    <div
      onClick={onClick} 
      style={{
        padding: "0.5rem",
        borderRadius: "8px",
        textAlign: "center",
        cursor: "pointer", 
        border: "1px solid #eee",
        position: "relative" 
      }}
    >
      <button
        onClick={handleDeleteClick}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "rgba(220, 53, 69, 0.8)", 
          color: "white",
          border: "none",
          borderRadius: "60%",
          width: "24px",
          height: "24px",
          cursor: "pointer",
          fontWeight: "bold",
          lineHeight: "24px",
        }}
        title="Delete folder"
      >
        X
      </button>
      
      <FolderIcon />
      <p>{folder.name}</p>
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

  // --- fetchLibrary (no change) ---
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

  // --- handleFileChange (no change) ---
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
        .insert({ name: folderName, user_id: user.id }); 
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
  
  // --- handleFileDelete (no change) ---
  const handleFileDelete = async (file) => {
    try {
      const storagePath = file.file_path.split('/media/')[1];
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([storagePath]);
      if (storageError) throw storageError;
      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', file.id);
      if (dbError) throw dbError;
      alert("File deleted successfully!");
      fetchLibrary(); 
    } catch (error) {
      alert("Error deleting file: " + error.message);
    }
  };
  
  // --- handleFolderDelete (no change) ---
  const handleFolderDelete = async (folderId) => {
    try {
      const { error } = await supabase.rpc('delete_folder_and_unassign_media', {
        p_folder_id: folderId
      });
      
      if (error) throw error;
      
      alert("Folder deleted successfully! Media has been unassigned.");
      fetchLibrary(); 
    } catch (error) {
      alert("Error deleting folder: " + error.message);
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
        
        <div style={{ margin: "2rem 0", padding: "1rem", border: "1px dashed #ccc" }}>
          <h3>Upload to "{currentFolder.name}"</h3>
          
          {/* ✅ --- THIS IS THE FIXED LINE --- ✅ */}
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

  // --- VIEW 2: At the "root" (no change) ---
  return (
    <div className="p-6 bg-white text-gray-900 min-h-screen">
      <h1>Upload Media</h1>
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

      <h2>Your Folders</h2>
      {isLoadingList ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onClick={() => setCurrentFolder(folder)}
              onFolderDelete={handleFolderDelete}
            />
          ))}
        </div>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h2>Your Media Library (Unassigned)</h2>
      {isLoadingList ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
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