//import Link from 'next/link';
"use client"
import UploadPage from "@/app/upload";
import FilesPage from "@/app/files";

const Home = () => (
    <div className="flex min-h-screen w-full bg-gray-900 text-gray-50 flex-col items-center justify-center px-8 py-12 ">
        <div className="logo-container">
            <img src="favicon.ico" alt="Icon"/>
            <div className="logo-text">File<span className="text-white">Share</span></div>
        </div>
        <div className="p-4 border border-gray-200 border-b-2">
            <UploadPage/>
        </div>
        <div>
            <FilesPage/>
        </div>
    </div>
);

export default Home;
