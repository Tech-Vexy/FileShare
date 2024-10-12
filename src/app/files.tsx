import { useEffect, useState } from 'react';
import { getPinataFiles } from '@/utils/config';
import { Dialog } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';

const FilesPage = () => {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedFiles = await getPinataFiles(page);
                setFiles(fetchedFiles);
            } catch (error) {
                setError('Failed to fetch files. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, [page]);

    const filteredFiles = files.filter((file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenPreview = (fileUrl: string) => {
        setFilePreview(fileUrl);
        setIsModalOpen(true);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Uploaded Files</h1>

            <input
                type="text"
                placeholder="Search for a fle or files"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 mb-4 w-full rounded"
            />

            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFiles.map((file) => (
                        <div key={file.ipfsHash} className="bg-white shadow-md rounded-lg p-4">
                            <div className="truncate text-black">{file.name || 'Untitled File'}</div>
                            <p className="text-sm text-gray-600">Size: {file.size} bytes</p>
                            <p className="text-sm text-gray-600">Uploaded: {file.date}</p>
                            <button
                                onClick={() => handleOpenPreview(`https://gateway.pinata.cloud/ipfs/${file.ipfsHash}`)}
                                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
                            >
                                Preview
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="flex justify-between mt-4">
                <button onClick={() => setPage(page > 1 ? page - 1 : 1)} className="p-2 bg-blue-500 text-white rounded">
                    Previous
                </button>
                <button onClick={() => setPage(page + 1)} className="p-2 bg-blue-500 text-black rounded">
                    Next
                </button>
            </div>


            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black bg-opacity-30"></div>
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3">
                            <XIcon className="h-6 w-6 text-gray-500" />
                        </button>
                        <img src={filePreview || ''} alt="File preview" className="w-full h-auto" />
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default FilesPage;
