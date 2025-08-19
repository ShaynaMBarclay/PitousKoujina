import imageCompression from "browser-image-compression";

const handleImageUpload = async (file) => {
  const options = {
    maxSizeMB: 0.5,          // max 0.5MB
    maxWidthOrHeight: 1024,  // resize to max 1024px
    useWebWorker: true,
  };
  const compressedFile = await imageCompression(file, options);
  return compressedFile;
};
