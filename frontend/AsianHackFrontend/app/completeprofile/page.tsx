"use client";
import { useState, useRef } from "react";
import { User, Camera, ArrowRight, SkipForward, Check } from "lucide-react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { useRouter } from "next/navigation";

// Simulated axios function - replace with your actual implementation
// const axiosWithCsrf = {
//   put: async (url, data, config) => {
//     // Simulate API call
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         console.log('Profile updated:', data);
//         resolve({ data: { success: true } });
//       }, 1500);
//     });
//   }
// };

interface Profile {
  id?: number;
  full_name: string;
  photo: string | File;
  semester: number | null;
  faculty: string | null;
  year: number | null;
  bio: string;
  temp_address: string;
  perm_address: string;
  contact_number: string;
  gender: string | null;
  school: string | null;
  college: string | null;
  background: string;
  user?: number;
}

export default function ProfileSetupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    photo: "",
    semester: null,
    faculty: null,
    year: null,
    bio: "",
    temp_address: "",
    perm_address: "",
    contact_number: "",
    gender: null,
    school: null,
    college: null,
    background: "",
  });

  const FACULTY_CHOICES = [
    "BSc.CSIT",
    "BIT",
    "BBA",
    "BBS",
    "B.Ed",
    "BSc",
    "BA",
  ];

  const GENDER_CHOICES = ["male", "female", "other"];
  const SEMESTER_CHOICES = Array.from({ length: 8 }, (_, i) => i + 1);
  const YEAR_CHOICES = Array.from({ length: 4 }, (_, i) => i + 1);

  const totalSteps = 4;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProfile(prev => ({ 
      ...prev, 
      [name]: name === "semester" || name === "year" ? 
        (value === "" ? null : parseInt(value)) : value 
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setProfile(prev => ({ ...prev, photo: file }));
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Navigate to dashboard or home page
    console.log("Profile setup skipped");
    setIsCompleted(true);
    // Mark completed
    setCompletedFlag(true);
  };

  // Store in localStorage
  function setCompletedFlag(value: boolean) {
    localStorage.setItem("is_completed_flag", JSON.stringify(value));
  }

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();

    Object.entries(profile).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (key === "photo") {
          if (value instanceof File) {
            formData.append(key, value);
          }
        } else {
          if (["semester", "year"].includes(key) && typeof value === "number") {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value as string);
          }
        }
      }
    });

    try {
      await axiosWithCsrf.put("/update-profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsCompleted(true);
      // Mark completed
      setCompletedFlag(true);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStepProgress = () => (currentStep / totalSteps) * 100;

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profile.full_name.trim() !== "";
      case 2:
        return profile.faculty && profile.semester && profile.year;
      case 3:
        return profile.contact_number.trim() !== "";
      case 4:
        return true; // Optional step
      default:
        return false;
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Excellent! Profile Setup Completed
          </h2>
          <p className="text-gray-600 mb-8">
            Your profile has been set up successfully. Now, let us know about your skills and interests!
          </p>
          <button
            onClick={() => router.push("/completeskills")}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Continue to Skills & Interests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
              <p className="text-indigo-100">
                Step {currentStep} of {totalSteps} - Help us know you better
              </p>
            </div>
            <button
              onClick={handleSkip}
              className="flex items-center gap-2 text-indigo-100 hover:text-white transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              Skip for now
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-indigo-400 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${getStepProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <User className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Let's start with the basics
                </h2>
                <p className="text-gray-600">
                  Tell us your name and add a profile picture
                </p>
              </div>

              {/* Profile Photo Upload */}
              <div className="flex justify-center mb-8">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-dashed border-indigo-300 hover:border-indigo-500 transition-colors">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                        <span className="text-sm text-indigo-600 font-medium">
                          Add Photo
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={profile.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Academic Information
                </h2>
                <p className="text-gray-600">
                  Help us understand your educational background
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Faculty *
                  </label>
                  <select
                    name="faculty"
                    value={profile.faculty || ""}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  >
                    <option value="">Select Faculty</option>
                    {FACULTY_CHOICES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Year *
                  </label>
                  <select
                    name="year"
                    value={profile.year || ""}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  >
                    <option value="">Select Year</option>
                    {YEAR_CHOICES.map((y) => (
                      <option key={y} value={y}>{`Year ${y}`}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Semester *
                  </label>
                  <select
                    name="semester"
                    value={profile.semester || ""}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  >
                    <option value="">Select Semester</option>
                    {SEMESTER_CHOICES.map((s) => (
                      <option key={s} value={s}>{`Semester ${s}`}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={profile.gender || ""}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  >
                    <option value="">Select Gender</option>
                    {GENDER_CHOICES.map((g) => (
                      <option key={g} value={g}>
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    School
                  </label>
                  <input
                    type="text"
                    name="school"
                    value={profile.school || ""}
                    onChange={handleChange}
                    placeholder="Previous school"
                    className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    College
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={profile.college || ""}
                    onChange={handleChange}
                    placeholder="Current college"
                    className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Contact Information
                </h2>
                <p className="text-gray-600">
                  How can we reach you?
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="text"
                  name="contact_number"
                  value={profile.contact_number}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Temporary Address
                </label>
                <input
                  type="text"
                  name="temp_address"
                  value={profile.temp_address}
                  onChange={handleChange}
                  placeholder="Current address"
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Permanent Address
                </label>
                <input
                  type="text"
                  name="perm_address"
                  value={profile.perm_address}
                  onChange={handleChange}
                  placeholder="Home address"
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Tell us about yourself
                </h2>
                <p className="text-gray-600">
                  This helps others connect with you (optional)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Write a short bio about yourself..."
                  rows={4}
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Background
                </label>
                <textarea
                  name="background"
                  value={profile.background}
                  onChange={handleChange}
                  placeholder="Tell us about your educational or professional background..."
                  rows={4}
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>

            <div className="flex gap-3">
              {currentStep < totalSteps && (
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Skip this step
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold transition-all ${
                    isStepValid()
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i + 1 <= currentStep
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}