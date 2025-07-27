// pages/index.js
'use client';
import { useEffect, useRef, useState } from 'react';
import api from '../utils/axios';

type UploadedFile = {
    filename: string;
    url: string;
};

export default function Home() {
    const [fileName, setFileName] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        getUploadFiles();
    }, []);

    const getUploadFiles = async () => {
        try {
            const res = await api.get('/file');
            setUploadedFiles(res.data.files);
        } catch (err) {
            console.error("❌ Error fetching files", err);
        }
    }

    const handleButtonClick = () => {
        console.log('📂 Upload button clicked');
        fileInputRef.current?.click(); // trigger hidden input
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('e.target.files:', e.target.files);
        if (!e.target.files || e.target.files.length === 0) {
            console.log('⚠️ No files selected');
            return;
        }
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            console.log("file", file);

            setFileName(file.name);

            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await api.post('file/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (res.data.success) {
                    getUploadFiles();
                } else {
                    console.error('❌ Upload failed:', res.data.message);
                    alert('Upload failed.');
                }
            } catch (err: any) {
                console.error('❌ Error uploading:', err.response?.data || err.message);
                alert('Upload error.');
            }
        }
    };

    console.log("uploadedFiles", uploadedFiles);

    const s3BaseURL = "https://task-fileupload-demo.s3.ap-south-1.amazonaws.com/";

    const handleDelete = async (filename: string) => {
        try {
            const res = await fetch(`http://localhost:8000/file/${filename}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                getUploadFiles();
            } else {
                console.error('Delete failed:', data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Upload a File</h1>

            {/* Hidden input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".png,.jpg,.jpeg,.gif,.pdf,.doc,.docx,.txt,.xlsx"
                onChange={handleFileChange}
            />

            {/* Styled button */}
            <div className='flex items-center gap-3'>
                <button
                    onClick={handleButtonClick}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Upload File
                </button>

                {/* File name display */}
                {fileName && (
                    <p className="mt-4 text-gray-700">
                        <strong>Selected File:</strong> {fileName}
                    </p>
                )}
            </div>

            <ul>
                {uploadedFiles.map((file, idx) => (
                    <li key={idx} className='flex items-center gap-3'>
                        <a href={`${file.url}`} target="_blank" rel="noreferrer">
                            {file.filename}
                        </a>
                        <button onClick={() => handleDelete(file.filename)}>delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
