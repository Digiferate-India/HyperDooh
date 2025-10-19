// In src/pages/UploadMedia.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function UploadMedia() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      // ✅ Step 1: Get the current user's ID first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to upload media.");
      }

      // ✅ Step 2: Create a unique and secure file path (e.g., user_id/timestamp-filename.mp4)
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const filePath = `${user.id}/${fileName}`;

      // Step 3: Upload the file to the 'media' storage bucket
      const { error: uploadError } = await supabase.storage
        .from('media') // This should be the name of your bucket
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // ✅ Step 4: Get the full public URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Step 5: Save the file info to the 'media' database table
      const fileRecord = {
        file_name: selectedFile.name,
        file_path: urlData.publicUrl, // Use the full public URL
        file_type: selectedFile.type,
        user_id: user.id, // ✅ Save the owner's ID
      };

      const { error: insertError } = await supabase.from('media').insert([fileRecord]);
      if (insertError) throw insertError;

      alert('File uploaded successfully!');
      setSelectedFile(null); // Clear the selection
      // This is a good place to re-fetch a list of media files if you are displaying one on this page.

    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div>
      <h1>Upload Media</h1>
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
      {selectedFile && <p style={{ marginTop: '1rem' }}>Selected: {selectedFile.name}</p>}
    </div>
  );
}

export default UploadMedia;