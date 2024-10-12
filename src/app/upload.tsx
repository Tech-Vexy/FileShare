"use client"
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFileToPinata } from '@/utils/config';

const UploadPage = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [ipfsHash, setIpfsHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = (acceptedFiles: File[]) => {
        setSelectedFile(acceptedFiles[0]);
        setError(null);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setError(null);
        try {
            const result = await uploadFileToPinata(selectedFile, (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            });
            setIpfsHash(result.IpfsHash);
        } catch (error) {
            setError('Failed to upload file. Please try again.'+error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Upload a File or Files</h1>

            <div {...getRootProps()} className="p-4 border border-dashed border-gray-500 cursor-pointer">
                <input {...getInputProps()} />
                <p>Drag 'n' drop a file here, or click to select one</p>
            </div>

            {selectedFile && (
                <div className="mt-4">
                    <p>Selected file: {selectedFile.name}</p>
                    <button onClick={handleUpload} className="mt-2 p-2 bg-blue-500 text-white rounded">
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            )}

            {uploading && <progress value={uploadProgress} max="100" className="mt-4 w-full">{uploadProgress}%</progress>}

            {ipfsHash && (
                <div className="mt-4">
                    <p>File uploaded! IPFS Hash: {ipfsHash}</p>
                    <a href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        View File
                    </a>
                </div>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
};

export default UploadPage;
