import React, { useEffect, useState } from 'react';
import { getPinataFiles } from '@/utils/config';
import { DocumentIcon, VideoCameraIcon } from '@heroicons/react/outline';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';

type PinataFile = {
    ipfsHash: string;
    fileName: string;
};

const FilesPage = () => {
    const [files, setFiles] = useState<PinataFile[]>([]); // Use specific type instead of any[]
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedFiles = await getPinataFiles(page);
                setFiles(fetchedFiles);
            } catch (err: unknown) {
                setError(`Failed to fetch files. Please try again. ${err instanceof Error ? err.message : ''}`);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, [page]);

    const handleDownload = (fileUrl: string, fileName: string) => {
        const link = document.createElement('a');
        link.target = "_blank";
        link.href = fileUrl;
        link.download = fileName;
        link.click();
    };

    const getFileIcon = (fileName: string | undefined) => {
        if (!fileName) return <DocumentIcon className="w-6 h-6 text-gray-400" />;

        const fileExtension = fileName.split('.').pop()?.toLowerCase();
        switch (fileExtension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <ImageIcon fontSize="large" style={{ color: '#3b82f6' }} />;
            case 'pdf':
                return <PictureAsPdfIcon fontSize="large" style={{ color: '#ef4444' }} />;
            case 'mp4':
            case 'avi':
            case 'mkv':
                return <VideoCameraIcon className="w-6 h-6 text-green-500" />;
            case 'doc':
            case 'docx':
            case 'txt':
                return <DocumentIcon className="w-6 h-6 text-gray-500" />;
            default:
                return <DocumentIcon className="w-6 h-6 text-gray-400" />;
        }
    };

    return (
        <div className="min-h-screen container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Uploaded Files</h1>

            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-4 w-full h-[80vh] p-4">
                    {files.map((file) => (
                        <div key={file.ipfsHash} className="bg-gray-800 p-6 rounded-lg text-center flex flex-col justify-between items-center">
                            <div className="file-icon mb-4">
                                {getFileIcon(file.fileName)}
                            </div>
                            <div className="file-name text-white mb-2">
                                {file.fileName || "Unknown File"}
                            </div>
                            <button
                                onClick={() => handleDownload(`https://gateway.pinata.cloud/ipfs/${file.ipfsHash}`, file.fileName)}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center"
                            >
                                <DownloadIcon />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="flex justify-between mt-4">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="p-2 bg-gray-300 text-gray-700 rounded-lg"
                >
                    Previous
                </button>
                <button
                    onClick={() => setPage((prev) => prev + 1)}
                    className="p-2 bg-blue-500 text-white rounded-lg"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default FilesPage;
