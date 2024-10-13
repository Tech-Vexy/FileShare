
import axios,{AxiosProgressEvent} from 'axios';

// Use server-side environment variables instead of client-side
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

const pinataHeaders = {
    pinata_api_key: PINATA_API_KEY,
    pinata_secret_api_key: PINATA_SECRET_API_KEY,
};

export const uploadFileToPinata = async (file: File, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            maxBodyLength: Infinity,
            headers: {
                ...pinataHeaders,
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading file to Pinata:', error);
        throw error;
    }
};

export const getPinataFiles = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axios.get(`https://api.pinata.cloud/data/pinList?status=pinned&pageLimit=${limit}&pageOffset=${(page - 1) * limit}`, {
            headers: pinataHeaders,
        });
        return response.data.rows.map((file: { metadata: { name: string }; size: number; date_pinned: string; ipfs_pin_hash: string; }) => ({
            name: file.metadata.name,
            size: file.size,
            date: new Date(file.date_pinned).toLocaleDateString(),
            ipfsHash: file.ipfs_pin_hash,
        }));
    } catch (error) {
        console.error('Error fetching files from Pinata:', error);
        throw error;
    }
};
