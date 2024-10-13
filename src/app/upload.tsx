import { useState } from 'react';
import { uploadFileToPinata } from '@/utils/config'; // Ensure this handles multiple files
import { AxiosProgressEvent } from 'axios'; // Import the AxiosProgressEvent type

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type UploadedFile = {
    IpfsHash: string;
    name: string;
};

const UploadPage = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]); // Use explicit type

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(Array.from(e.target.files || []));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        const validFiles = selectedFiles.filter(file => file.size <= MAX_FILE_SIZE);

        if (validFiles.length === 0) {
            setError('All selected files exceed the 10MB size limit.');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const uploadPromises = validFiles.map((file) =>
                uploadFileToPinata(file, (progressEvent: AxiosProgressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1)); // Handle possible undefined total
                    setUploadProgress((prevProgress) => ({
                        ...prevProgress,
                        [file.name]: percentCompleted,
                    }));
                })
            );

            const results = await Promise.all(uploadPromises);
            setUploadedFiles(results); // Store uploaded file metadata (like IPFS hash)
        } catch (err) {
            setError(err + 'Failed to upload files. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Upload Files</h1>

            <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="border p-2 mb-4 w-full rounded"
            />

            {selectedFiles.length > 0 && (
                <div className="mb-4">
                    {selectedFiles.map((file) => (
                        <div key={file.name} className="mb-2">
                            <span className="text-sm">{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                            {uploadProgress[file.name] !== undefined && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${uploadProgress[file.name]}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={handleUpload}
                className="p-2 bg-blue-500 text-white rounded-lg"
                disabled={uploading || selectedFiles.length === 0}
            >
                {uploading ? 'Uploading...' : 'Upload Files'}
            </button>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {uploadedFiles.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-2">Uploaded Files</h2>
                    <ul>
                        {uploadedFiles.map((file, index) => (
                            <li key={index} className="mb-2">
                                {file.name} - <a href={`https://gateway.pinata.cloud/ipfs/${file.IpfsHash}`} className="text-blue-500 hover:underline">View</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UploadPage;
