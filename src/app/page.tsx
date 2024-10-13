//import Link from 'next/link';
"use client"
import UploadPage from "@/app/upload";
import FilesPage from "@/app/files";

const Home = () => (
    <div className="flex  bg-gray-900 text-gray-50 flex-col ">
        <div className="logo-container">
            <img src="favicon.ico" alt="Icon"/>
            <div className="logo-text">File<span className="text-white">Share</span></div>
        </div>
        <div>
            <UploadPage/>
        </div>
        <div>
            <FilesPage/>
        </div>
    </div>
);

export default Home;
