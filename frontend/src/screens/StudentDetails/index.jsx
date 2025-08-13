import React, { useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import {
  FaUser,
  FaIdCard,
  FaPassport,
  FaUniversity,
  FaUpload,
} from "react-icons/fa";
import Cropper from "react-easy-crop";
import { MNU_BackGround } from "../../assets";

export default function StudentDetails() {
  const studentInfo = [
    { label: "Student Name", value: "Ahmed Mohamed", icon: <FaUser /> },
    { label: "Student ID", value: "202301245", icon: <FaIdCard /> },
    { label: "National ID", value: "29801012345678", icon: <FaPassport /> },
    { label: "College", value: "Faculty of Commerce", icon: <FaUniversity /> },
  ];

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImage = async () => {
    // This will extract the cropped image as a Blob or Base64
    const image = await createImageFromCrop(imageSrc, croppedAreaPixels);
    console.log("Cropped Image", image);
    setShowCropModal(false);
  };

  // Helper to create cropped image
  const createImageFromCrop = (imageSrc, crop) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );
        canvas.toBlob((blob) => {
          resolve(URL.createObjectURL(blob));
        }, "image/jpeg");
      };
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${MNU_BackGround})`,
      }}
    >
      <Helmet>
        <meta charSet="utf-8" />
        <title>Student Details</title>
      </Helmet>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Card */}
      <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-xl shadow-2xl rounded-2xl w-full max-w-lg p-8 border border-white/30 m-2">
        <h1 className="text-3xl font-bold text-light-pink text-center mb-6 underline decoration-blue underline-offset-4">
          Welcome Abdullah
        </h1>

        {/* Info List */}
        <div className="space-y-4 mb-8 ">
          {studentInfo.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-mint-green bg-opacity-20 rounded-xl p-4 hover:bg-opacity-55 transition-all duration-300"
            >
              <div className="text-blue text-3xl bg-light-pink bg-opacity-20 p-3 rounded-full">
                {item.icon}
              </div>
              <div>
                <p className="text-sm text-gray-200">{item.label}</p>
                <p className="text-lg font-semibold text-light-pink">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Section */}
        <label
          htmlFor="upload-image"
          className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-gradient-to-r from-mint-blue to-blue text-light-pink font-semibold shadow-md cursor-pointer hover:from-mint-green hover:to-blue hover:scale-[1.02] transition-all duration-300"
        >
          <FaUpload className="text-lg" />
          Upload Student Image
          <input
            type="file"
            id="upload-image"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 m-2">
          <div className="bg-white rounded-xl shadow-xl p-4 w-full max-w-lg flex flex-col gap-4">
            <div className="relative w-full h-96 bg-gray-200">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={3/ 4} // Fixed 4:6 ratio
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-800 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={getCroppedImage}
                className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-mint-blue font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
