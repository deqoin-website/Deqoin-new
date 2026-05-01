'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function UploadPage() {
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error('No file selected');
    }

    const file = inputFileRef.current.files[0];
    setIsUploading(true);

    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      const result = await response.json();
      setUploadResult(result);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Check your Cloudinary environment variables in .env');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: '4rem', background: '#000', minHeight: '100vh', color: '#fff', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Cloudinary Test Upload</h1>
      
      <form onSubmit={handleUpload} style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <input name="file" ref={inputFileRef} type="file" required style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '1rem' }} />
        <button 
          type="submit" 
          disabled={isUploading}
          style={{ 
            background: '#fff', 
            color: '#000', 
            padding: '1rem', 
            border: 'none', 
            cursor: 'pointer',
            opacity: isUploading ? 0.5 : 1
          }}
        >
          {isUploading ? 'YÜKLENİYOR...' : 'YÜKLE'}
        </button>
      </form>

      {uploadResult && (
        <div style={{ marginTop: '4rem' }}>
          <p style={{ marginBottom: '1rem' }}>Yükleme Başarılı!</p>
          <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto' }}>
            <Image src={uploadResult.url} alt="Uploaded" fill style={{ objectFit: 'cover' }} sizes="300px" />
          </div>
          <pre style={{ marginTop: '2rem', textAlign: 'left', background: 'rgba(255,255,255,0.1)', padding: '1rem', overflow: 'auto' }}>
            {JSON.stringify(uploadResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
