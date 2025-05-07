import { ChangeEvent, useRef, useState } from 'react';

interface ImageUploaderProps {
  onFileSelect: (file: File) => Promise<void>;
  buttonText: string;
  icon?: string;
  className?: string;
  acceptedFileTypes?: string;
  isLoading?: boolean;
}

const ImageUploader = ({
  onFileSelect,
  buttonText,
  icon,
  className = "",
  acceptedFileTypes = "image/jpeg,image/png,image/gif,image/webp",
  isLoading = false
}: ImageUploaderProps) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.match(acceptedFileTypes.replace(/,/g, '|'))) {
      setError("Please select a valid image file (JPEG, PNG, GIF, or WEBP)");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }
    
    // Clear previous errors
    setError(null);
    
    // Call the provided onFileSelect callback
    await onFileSelect(file);
    
    // Clear the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={`flex items-center gap-2 ${className}`}
      >
        {icon && <img src={icon} alt="" className="size-5 object-cover" />}
        <span>{isLoading ? 'Uploading...' : buttonText}</span>
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default ImageUploader;
