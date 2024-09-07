import { motion } from "framer-motion";
import Cropper from "react-cropper";

interface CropperModalProps {
    showCropper: boolean;
    imagePreview: string;
    cropperRef: React.MutableRefObject<HTMLImageElement | null>;
    handleCropperInit: (instance: Cropper) => void;
    setShowCropper: React.Dispatch<React.SetStateAction<boolean>>;
    handleCrop: () => void;
}

const CropperModal: React.FC<CropperModalProps> = (props) => {
    return props.showCropper && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
            <motion.div
                className="relative bg-[#1B1A55] p-4 rounded-lg shadow-lg max-w-full max-h-full w-full md:w-11/12 lg:w-2/3 xl:w-1/2 overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <h2 className="text-2xl text-[#E5E7EB] mb-4">Crop Your Image</h2>
                <div className="relative w-full h-64 md:h-80 lg:h-96">
                    <Cropper
                        src={props.imagePreview}
                        style={{ height: '100%', width: '100%' }}
                        aspectRatio={1}
                        guides={false}
                        ref={props.cropperRef}
                        onInitialized={props.handleCropperInit}
                    />
                </div>
                <div className="flex justify-between mt-4">
                    <motion.button
                        onClick={() => props.setShowCropper(false)}
                        className="bg-[#9290C3] text-white py-2 px-4 rounded transition-colors duration-300 hover:bg-[#E5E7EB] hover:text-[#1B1A55]"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        onClick={props.handleCrop}
                        className="bg-[#4CAF50] text-white py-2 px-4 rounded transition-colors duration-300 hover:bg-[#388E3C]"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        Save
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}

export default CropperModal;
