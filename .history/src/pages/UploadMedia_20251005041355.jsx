// In src/pages/UploadMedia.jsx
import { useState } from 'react';

function UploadMedia() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    // event.target.files is an array of files, we just want the first one
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }
    // Supabase Storage logic will go here
    console.log('Uploading file:', selectedFile.name);
  };

  return (
    <div>
      <h1>Upload Media</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload
      </button>
      {selectedFile && <p style={{ marginTop: '1rem' }}>Selected: {selectedFile.name}</p>}
    </div>
  );
}

export default UploadMedia;