"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PhotoUploadModal from "./photo-upload-modal";

interface ProgressPhoto {
  id: string;
  date: string;
  frontUrl: string | null;
  sideUrl: string | null;
  backUrl: string | null;
}

const BodyPlaceholderIcon = () => (
  <svg width="41" height="147" viewBox="0 0 41 147" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28.3031 10.413C28.3646 10.5121 28.7675 10.5099 28.8672 10.8009C29.3655 12.2512 28.2183 13.8157 28.0486 15.1927L27.7348 14.7639C24.944 16.3564 27.4909 18.9963 26.9883 21.4422L26.7275 19.4467L26.1443 18.2119L26.3521 21.8732L25.9322 21.0134C25.5823 22.3021 25.6884 23.7416 26.8335 24.5067C27.599 25.0195 30.3219 26.6379 31.0769 26.8793C32.3662 27.2909 33.6513 27.0539 34.947 27.6874C38.5753 29.4588 38.2466 34.0511 38.2382 37.5056C38.2276 41.1907 38.7153 45.3455 39.1034 49.1081C39.2963 50.983 40.187 52.9052 40.4987 54.8016C41.4657 60.6697 40.7299 67.8846 40.7638 73.9079C40.7829 77.4033 41.3873 79.5195 39.7586 82.7994C39.203 83.9178 36.7346 85.4242 35.4729 85.4457C35.1675 83.9803 36.5756 83.8144 37.2606 82.8468C38.2678 81.4202 38.3442 79.3061 37.2754 77.9054C36.2893 78.3816 37.3008 82.0645 35.2629 81.9977C34.8282 80.7758 35.492 79.4634 35.6574 78.2028C35.774 77.3106 35.5853 76.4421 35.7761 75.522C36.0476 74.2182 37.4005 73.2398 37.5744 71.7421C37.9052 68.8759 35.4898 62.4174 34.8961 59.2C34.4401 56.7174 34.5101 54.3685 34.1729 51.9613C33.7679 49.0736 32.4107 46.1859 32.2877 43.2099C31.9824 43.1582 31.9993 43.5827 31.9293 43.809C31.0408 46.6234 30.0462 50.9636 29.9487 53.8858C29.8405 57.129 31.1511 58.3703 32.0184 61.2623C34.2896 68.8221 35.2926 77.2438 34.6204 85.1203C34.016 92.2167 31.66 99.1084 32.0799 106.239C32.328 110.448 33.6004 113.879 33.348 118.307C33.0554 123.415 30.8733 129.438 30.8478 134.256C30.8393 136.004 32.1541 140.306 33.0893 141.849C33.3926 142.348 34.1305 142.932 34.2959 143.424C34.5992 144.322 34.5568 145.383 35.0191 146.281C34.9767 146.456 34.7816 146.678 34.6204 146.755C34.2132 146.954 26.9289 146.975 26.0298 146.868C23.8222 146.605 25.47 145.456 25.5081 144.579C25.5293 144.081 25.0564 143.805 25.0564 143.307C25.0564 142.872 25.4424 142.545 25.5145 142.025C25.6778 140.862 25.33 139.327 25.5145 138.146C25.6332 137.39 26.244 137.174 26.3458 136.62C27.6393 129.649 24.9928 124.449 24.6556 117.874C24.5008 114.87 25.3003 111.857 24.8126 108.879C24.5433 107.233 23.8859 105.569 23.6229 103.839C23.08 100.283 23.2539 96.6625 22.957 93.0938C22.4969 87.5878 20.5565 82.0624 21.7016 76.524C21.6507 76.1728 19.9373 75.9982 19.6531 76.371C19.07 76.8279 19.5662 77.5843 19.5768 78.2135C19.668 83.489 18.4083 88.3377 17.8718 93.5248C17.5558 96.5785 17.6428 99.7204 17.2102 102.765C16.8963 104.974 15.9357 107.392 15.7533 109.474C15.5201 112.131 16.082 114.844 15.9611 117.441C15.6643 123.824 12.7293 130.119 14.3177 136.571C14.4385 137.062 14.9814 137.526 15.0959 138.364C15.2698 139.625 14.7969 140.739 14.8902 141.795C14.9454 142.415 15.4289 142.896 15.3356 143.506C15.2656 143.963 14.7863 144.152 14.7609 144.372C14.7057 144.827 15.5731 145.844 15.3398 146.499C15.2741 146.79 14.4364 146.846 14.1692 146.865C12.3922 146.99 8.18486 147.102 6.53927 146.842C6.26147 146.796 6.007 146.704 5.77797 146.536L5.57015 146.111C6.1618 145.273 6.03881 144.372 6.25935 143.568C6.44596 142.892 7.68864 141.73 8.08944 140.902C8.66412 139.719 8.63867 138.45 9.06704 137.37C9.24729 136.918 9.75836 136.612 9.76048 136.239C9.81561 128.6 6.34205 121.096 7.28997 113.37C7.55928 111.181 8.37148 108.89 8.53476 106.662C9.09885 98.9296 6.51594 91.8762 5.99427 84.2497C5.51501 77.246 6.83403 70.2487 8.38208 63.4065C9.17943 59.8853 11.2279 57.4695 11.1728 53.8642C11.1346 51.3515 10.5409 48.0436 9.86863 45.6149C9.68626 44.9576 9.46147 43.865 8.96101 43.4146C8.96101 46.0739 7.79679 48.578 7.3239 51.1274C6.7789 54.0819 6.75345 57.0105 6.13423 60.0469C5.50017 63.1652 2.89182 70.0698 3.48771 72.7829C3.69977 73.7505 4.86611 74.563 5.08453 76.1167C5.35385 78.0304 5.15239 80.0668 5.56379 81.987L4.47804 81.8577L3.43894 77.8925C3.1675 78.0196 2.7561 78.929 2.69248 79.179C2.49739 79.9225 2.81124 81.8749 3.18658 82.5688C3.73794 83.5881 5.49805 83.8941 5.13755 85.4328C3.59798 85.3703 1.46889 83.7778 0.853914 82.3533C-0.815006 78.4851 0.52946 77.3063 0.236816 73.7118C0.0883735 71.8714 0.217731 71.5438 0.268625 69.8177C0.414947 64.8849 -0.110964 59.9176 0.786054 55.043C1.717 49.9917 2.96604 44.9899 3.41561 39.8287C3.56829 38.0875 3.12721 36.441 3.22051 34.6739C3.39016 31.4888 4.49288 27.6659 8.05551 27.0883C10.8293 26.6401 12.636 25.9828 15.1723 24.623C17.2674 23.5003 16.7882 22.2827 16.7988 20.1363C16.4977 20.0889 16.4658 20.7354 16.4362 20.9487C16.3662 21.4659 16.3937 21.8991 16.3768 22.4012C16.3704 22.5865 16.4658 23.177 16.1626 22.8279L16.5867 18.4123L15.9484 19.1623C15.9399 18.4317 16.5592 18.0869 16.4998 17.3284C16.4786 17.0439 15.8191 15.0505 15.7173 14.9837C15.1702 14.626 15.1977 15.3134 14.8924 15.3932C14.8245 13.9407 13.6327 12.7102 13.8108 11.1823C13.9084 10.344 14.4555 10.5099 14.4725 10.3117C14.4894 10.1134 14.218 9.5251 14.2328 9.03807C14.3049 6.618 14.9729 2.87692 17.1148 1.38566C17.8315 0.911565 20.7516 0 21.5829 0C22.6708 0 24.9377 0.928805 25.8241 1.6184C27.879 3.21741 28.3922 6.58783 28.477 9.051C28.4897 9.44752 28.1016 10.0854 28.3052 10.4108L28.3031 10.413Z" fill="#AAB4C3"/>
  </svg>
);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export default function ProgressCard() {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/progress-photos");
      if (response.ok) {
        const data = await response.json();
        // Filter only photos that have frontUrl
        const photosWithFront = data.photos.filter((p: ProgressPhoto) => p.frontUrl);
        setPhotos(photosWithFront);
      }
    } catch (error) {
      console.error("Error fetching progress photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleModalClose = () => {
    setIsPhotoModalOpen(false);
  };

  const handleUploadSuccess = () => {
    fetchPhotos();
  };

  // Get "before" (oldest) and "after" (newest) photos
  const beforePhoto = photos.length > 0 ? photos[photos.length - 1] : null;
  const afterPhoto = photos.length > 1 ? photos[0] : null;
  const hasPhotos = photos.length > 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#60988E]" />
      </div>
    );
  }

  // Empty state - no progress photos
  if (!hasPhotos) {
    return (
      <div className="bg-white rounded-2xl p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-[30px] font-semibold text-[#101827]"
            style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
          >
            Tavo Progresas
          </h3>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center border border-[#B2B4B9] rounded-lg hover:bg-[#F5F5F5] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.999 7.95605C8.11273 7.95605 0.763672 8.67024 0.763672 11.3721C0.763672 13.879 7.00775 14.5408 9.37709 14.7019L8.918 15.722C8.82758 15.9229 9.04648 16.1224 9.2382 16.0139L12.3858 14.2316C12.5399 14.1443 12.5399 13.9222 12.3858 13.8349L9.2382 12.0526C9.04648 11.944 8.82758 12.1435 8.918 12.3445L9.34292 13.2886C4.38936 12.9524 2.17184 11.7871 2.17184 11.372C2.17184 10.7889 5.61533 9.36423 11.999 9.36423C18.3827 9.36423 21.8262 10.7889 21.8262 11.372C21.8262 11.6333 20.5921 12.5611 16.8131 13.0736L17.002 14.469C19.845 14.083 23.2344 13.2322 23.2344 11.372C23.2344 8.67024 15.8854 7.95605 11.999 7.95605Z" fill="#555B65"/>
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-[#B2B4B9] rounded-lg hover:bg-[#F5F5F5] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_340_692)">
                  <path d="M4.5 3.75L19.5 20.25" stroke="#555B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14.5232 14.7746C13.7872 15.4437 12.8156 15.793 11.822 15.7457C10.8285 15.6984 9.89446 15.2584 9.22537 14.5224C8.55627 13.7864 8.20695 12.8148 8.25425 11.8213C8.30154 10.8278 8.74158 9.8937 9.47755 9.22461" stroke="#555B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.7031 8.31641C13.5004 8.46908 14.2266 8.87632 14.7726 9.47696C15.3186 10.0776 15.655 10.8392 15.7313 11.6473" stroke="#555B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.5584 15.8531C21.6022 14.0231 22.5012 12 22.5012 12C22.5012 12 19.5013 5.25001 12.0013 5.25001C11.3518 5.24912 10.7033 5.3018 10.0625 5.40751" stroke="#555B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.9375 6.43164C3.11531 8.36664 1.5 12.0004 1.5 12.0004C1.5 12.0004 4.5 18.7504 12 18.7504C13.7574 18.7642 15.4927 18.3593 17.0625 17.5691" stroke="#555B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_340_692">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>

        {/* Empty state placeholder */}
        <div className="flex-1 flex flex-col items-center justify-center mb-4">
          <div className="bg-[#EFEFEF] rounded-xl px-8 py-6">
            <BodyPlaceholderIcon />
          </div>
          <p
            className="text-[14px] text-[#555B65] text-center mt-4 px-4"
            style={{ fontFamily: "Outfit, sans-serif", lineHeight: "140%" }}
          >
            Įkelk savo „prieš" nuotrauką ir stebėk, kaip keičiasi tavo kūnas!
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPhotoModalOpen(true)}
          className="w-full h-8 bg-[#60988E] text-white text-[14px] font-medium rounded-lg hover:bg-[#4d7a72] transition-colors mt-auto"
        >
          Įkelti nuotrauką
        </button>

        <PhotoUploadModal
          isOpen={isPhotoModalOpen}
          onClose={handleModalClose}
          onSuccess={handleUploadSuccess}
        />
      </div>
    );
  }

  // Has progress photos state
  return (
    <div className="bg-white rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-[30px] font-semibold text-[#101827]"
          style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
        >
          Tavo progresas
        </h3>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center border border-[#B2B4B9] rounded-lg hover:bg-[#F5F5F5] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.999 7.95605C8.11273 7.95605 0.763672 8.67024 0.763672 11.3721C0.763672 13.879 7.00775 14.5408 9.37709 14.7019L8.918 15.722C8.82758 15.9229 9.04648 16.1224 9.2382 16.0139L12.3858 14.2316C12.5399 14.1443 12.5399 13.9222 12.3858 13.8349L9.2382 12.0526C9.04648 11.944 8.82758 12.1435 8.918 12.3445L9.34292 13.2886C4.38936 12.9524 2.17184 11.7871 2.17184 11.372C2.17184 10.7889 5.61533 9.36423 11.999 9.36423C18.3827 9.36423 21.8262 10.7889 21.8262 11.372C21.8262 11.6333 20.5921 12.5611 16.8131 13.0736L17.002 14.469C19.845 14.083 23.2344 13.2322 23.2344 11.372C23.2344 8.67024 15.8854 7.95605 11.999 7.95605Z" fill="#555B65"/>
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-[#B2B4B9] rounded-lg hover:bg-[#F5F5F5] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_340_692_2)">
                <path d="M4.5 3.75L19.5 20.25" stroke="#555B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.5232 14.7746C13.7872 15.4437 12.8156 15.793 11.822 15.7457C10.8285 15.6984 9.89446 15.2584 9.22537 14.5224C8.55627 13.7864 8.20695 12.8148 8.25425 11.8213C8.30154 10.8278 8.74158 9.8937 9.47755 9.22461" stroke="#555B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.7031 8.31641C13.5004 8.46908 14.2266 8.87632 14.7726 9.47696C15.3186 10.0776 15.655 10.8392 15.7313 11.6473" stroke="#555B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.5584 15.8531C21.6022 14.0231 22.5012 12 22.5012 12C22.5012 12 19.5013 5.25001 12.0013 5.25001C11.3518 5.24912 10.7033 5.3018 10.0625 5.40751" stroke="#555B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.9375 6.43164C3.11531 8.36664 1.5 12.0004 1.5 12.0004C1.5 12.0004 4.5 18.7504 12 18.7504C13.7574 18.7642 15.4927 18.3593 17.0625 17.5691" stroke="#555B65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_340_692_2">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>

      {/* Progress photos - Before and After */}
      <div className="grid grid-cols-2 gap-4 mb-4 flex-1">
        {/* Before photo (oldest) */}
        <div className="relative">
          <div className="aspect-[3/4] bg-[#F5F5F5] rounded-xl overflow-hidden relative">
            {beforePhoto?.frontUrl && (
              <Image
                src={beforePhoto.frontUrl}
                alt="Prieš"
                fill
                className="object-cover"
              />
            )}
          </div>
          <p
            className="text-[12px] text-[#9FA4B0] text-center mt-2"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {beforePhoto ? formatDate(beforePhoto.date) : ""}
          </p>
        </div>

        {/* After photo (newest) */}
        <div className="relative">
          <div className="aspect-[3/4] bg-[#F5F5F5] rounded-xl overflow-hidden relative">
            {afterPhoto?.frontUrl ? (
              <Image
                src={afterPhoto.frontUrl}
                alt="Po"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <BodyPlaceholderIcon />
                </div>
              </div>
            )}
          </div>
          <p
            className="text-[12px] text-[#9FA4B0] text-center mt-2"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {afterPhoto ? formatDate(afterPhoto.date) : "—"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <Link
        href="/dashboard/progresas"
        className="flex items-center justify-between text-[#101827] hover:text-[#60988E] transition-colors mb-4"
      >
        <span
          className="text-[15px] font-semibold uppercase"
          style={{ fontFamily: "Outfit, sans-serif", lineHeight: "110%", letterSpacing: "0.02em" }}
        >
          Visas progresas
        </span>
        <ArrowRight className="w-4 h-4" />
      </Link>

      <button
        type="button"
        onClick={() => setIsPhotoModalOpen(true)}
        className="w-full h-8 bg-[#60988E] text-white text-[14px] font-medium rounded-lg hover:bg-[#4d7a72] transition-colors"
      >
        Įkelti nuotrauką
      </button>

      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={handleModalClose}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
