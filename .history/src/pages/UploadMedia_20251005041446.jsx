// In src/pages/UploadMedia.jsx
import { useState } from 'react';
import { supabase } from '../api/supabaseClient';

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
      // 1. Upload the file to the 'media' bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(`public/${selectedFile.name}`, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 2. If upload is successful, save file info to the 'media' table
      const fileRecord = {
        file_name: selectedFile.name,
        file_path: uploadData.path,
        file_type: selectedFile.type,
      };

      const { error: insertError } = await supabase.from('media').insert([fileRecord]);
      if (insertError) throw insertError;

      alert('File uploaded and record saved successfully!');
      setSelectedFile(null); // Clear the selection

    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div>
      <h1>Upload Media</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
      {selectedFile && <p style={{ marginTop: '1rem' }}>Selected: {selectedFile.name}</p>}
    </div>
  );
}

export default UploadMedia;