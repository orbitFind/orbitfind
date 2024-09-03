import { updateUser } from "@/api/user";
import { useAppDispatch } from "@/store/store";
import { motion } from "framer-motion";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaCamera, FaUser, FaEnvelope } from "react-icons/fa";
import CropperModal from "./CropperModal";
import { User } from "@/constants/interfaces";

interface DetailsFormProps {
    user: User;
    fetchUser: () => void;
}

const DetailsForm: React.FC<DetailsFormProps> = ({ user, fetchUser }) => {
    const dispatch = useAppDispatch();

    const [bio, setBio] = useState<string>("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState<string>("");
    const [profilePic, setProfilePic] = useState<string>("");


    const [imagePreview, setImagePreview] = useState("");
    const [showCropper, setShowCropper] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [cropper, setCropper] = useState<Cropper | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const cropperRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        if (user) {
            // console.log(user);
            setBio(user.bio);
            setUsername(user.username);
            setEmail(user.email);
            setProfilePic(user.profilePic);
        }
    }, [user]);

    const handleIsEditing = (value: boolean) => {
        setIsEditing(value);
        if (user) {
            // console.log(user);
            setBio(user.bio);
            setUsername(user.username);
            setEmail(user.email);
            setProfilePic(user.profilePic);
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCrop = () => {
        if (cropper) {
            const canvas = cropper.getCroppedCanvas();
            setProfilePic(canvas.toDataURL());
            setShowCropper(false);
        }
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value);

    const handleCropperInit = (instance: Cropper) => {
        setCropper(instance);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateUser({
            ...user!,
            bio,
            username,
            email,
            profilePic
        })).then((_) => {
            setIsEditing(false);
        }).catch(error => {
            console.log(error)
        })

        fetchUser();
    }

    const cropperModalProps = {
        showCropper,
        imagePreview,
        cropperRef,
        handleCropperInit,
        setShowCropper,
        handleCrop
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                {/* Profile Picture */}
                <div className="relative mb-6">
                    <img
                        src={profilePic}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-[#535C91] object-cover shadow-lg transition-transform duration-300 transform hover:scale-105"
                    />
                    {isEditing && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 p-2 bg-[#9290C3] rounded-full shadow-md transition-transform duration-300 transform hover:scale-110"
                        >
                            <FaCamera className="text-white text-lg" />
                        </button>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                {/* User Details, changed into a form, so that you can update everything at once. */}
                <div className="w-full space-y-4">
                    {[
                        { label: "Username", icon: <FaUser />, value: username, onChange: handleUsernameChange },
                        { label: "Email", icon: <FaEnvelope />, value: email, onChange: handleEmailChange },
                    ].map(({ label, icon, value, onChange }, index) => (
                        <motion.div
                            key={index}
                            className="w-full flex flex-col mb-4"
                            initial={{ opacity: 0.8 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <label className="text-[#E5E7EB] text-sm mb-1">{label}</label>
                            <motion.div
                                className="flex items-center bg-[#070F2B] p-2 rounded-lg border border-[#535C91] transition-transform duration-300 transform hover:scale-105"
                                initial={{ opacity: 0.8 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <span className="text-[#9290C3] text-xl mr-2">{icon}</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => onChange(e)}
                                        className="bg-transparent flex-1 text-[#E5E7EB] focus:outline-none"
                                    />
                                ) : (
                                    <span className="text-[#E5E7EB]">{value}</span>
                                )}
                            </motion.div>
                        </motion.div>
                    ))}

                    {/* Bio */}
                    <motion.div
                        className="w-full mb-4"
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <label className="text-[#E5E7EB] text-sm mb-1">Bio</label>
                        {isEditing ? (
                            <textarea
                                value={bio ?? ""}
                                onChange={(e) => handleBioChange(e)}
                                className="bg-[#070F2B] p-2 rounded-lg border border-[#535C91] w-full h-32 text-[#E5E7EB] focus:outline-none"
                            />
                        ) : (
                            <p className="bg-[#070F2B] p-2 rounded-lg border border-[#535C91] text-[#E5E7EB]">
                                {bio}
                            </p>
                        )}
                    </motion.div>

                    {/* Edit/Save Button */}
                    <div className="w-full flex justify-center md:justify-start">
                        {isEditing &&
                            <motion.button
                                type="submit"
                                className="bg-[#9290C3] text-white py-2 px-4 rounded transition-colors duration-300 hover:bg-[#E5E7EB] hover:text-[#1B1A55]"
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                Save Changes
                            </motion.button>
                        }

                        {!isEditing &&
                            <motion.button
                                onClick={() => handleIsEditing(true)}
                                className="bg-[#9290C3] text-white py-2 px-4 rounded transition-colors duration-300 hover:bg-[#E5E7EB] hover:text-[#1B1A55]"
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                Edit Profile
                            </motion.button>
                        }
                    </div>
                </div>
            </form >

            <CropperModal {...cropperModalProps} />
        </>
    );
}

export default DetailsForm