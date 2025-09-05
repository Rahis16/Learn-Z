"use client";
import { useState, useEffect, useRef } from "react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";

interface Profile {
  id: number;
  full_name: string;
  photo: string;
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
  user: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function UpdateProfileModal({ open, onClose, onUpdate }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    if (!open) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axiosWithCsrf.get("/my-profile/");
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (profile) setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      if (profile) setProfile({ ...profile, photo: file as any });
    }
  };

  const handleSubmit = async () => {
    if (!profile) return;
    setLoading(true);
    const formData = new FormData();

    Object.entries(profile).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        // Only append photo if it's a File
        if (key === "photo") {
          if (value instanceof File) {
            formData.append(key, value);
          }
        } else {
          // Convert numbers to string
          if (["semester", "year"].includes(key) && typeof value === "number") {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value);
          }
        }
      }
    });

    try {
      await axiosWithCsrf.put("/update-profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUpdate?.();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white h-170 overflow-x-auto rounded-2xl shadow-2xl w-[95%] max-w-2xl p-8 relative animate-fadeIn scale-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-indigo-700">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : profile ? (
          <>
            {/* Profile Photo */}
            <div className="flex justify-center mb-6">
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={preview || profile.photo}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-white text-sm">Change</span>
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

            {/* Form */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="full_name"
                value={profile.full_name || ""}
                onChange={handleChange}
                placeholder="Full Name"
                className="p-3 border border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-indigo-400"
              />

              <select
                name="faculty"
                value={profile.faculty || ""}
                onChange={handleChange}
                className="p-3 border border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select Faculty</option>
                {FACULTY_CHOICES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>

              <select
                name="semester"
                value={profile.semester || ""}
                onChange={handleChange}
                className="p-3 border border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select Semester</option>
                {SEMESTER_CHOICES.map((s) => (
                  <option key={s} value={s}>{`Semester ${s}`}</option>
                ))}
              </select>

              <select
                name="year"
                value={profile.year || ""}
                onChange={handleChange}
                className="p-3 border border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select Year</option>
                {YEAR_CHOICES.map((y) => (
                  <option key={y} value={y}>{`Year ${y}`}</option>
                ))}
              </select>

              <textarea
                name="bio"
                value={profile.bio || ""}
                onChange={handleChange}
                placeholder="Bio"
                className="p-3 border border-gray-300 shadow-sm rounded-xl col-span-2 focus:ring-2 focus:ring-indigo-400"
              />

              <input
                type="text"
                name="temp_address"
                value={profile.temp_address || ""}
                onChange={handleChange}
                placeholder="Temporary Address"
                className="p-3 border border-gray-300 shadow-sm rounded-xl col-span-2 focus:ring-2 focus:ring-indigo-400"
              />

              <input
                type="text"
                name="perm_address"
                value={profile.perm_address || ""}
                onChange={handleChange}
                placeholder="Permanent Address"
                className="p-3 border border-gray-300 shadow-sm rounded-xl col-span-2 focus:ring-2 focus:ring-indigo-400"
              />

              <input
                type="text"
                name="contact_number"
                value={profile.contact_number || ""}
                onChange={handleChange}
                placeholder="Contact Number"
                className="p-3 border border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-indigo-400"
              />

              <select
                name="gender"
                value={profile.gender || ""}
                onChange={handleChange}
                className="p-3 border border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select Gender</option>
                {GENDER_CHOICES.map((g) => (
                  <option key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="school"
                value={profile.school || ""}
                onChange={handleChange}
                placeholder="School"
                className="p-3 border border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-indigo-400"
              />

              <input
                type="text"
                name="college"
                value={profile.college || ""}
                onChange={handleChange}
                placeholder="College"
                className="p-3 border border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-indigo-400"
              />

              <textarea
                name="background"
                value={profile.background || ""}
                onChange={handleChange}
                placeholder="Background"
                className="p-3 border border-gray-300 shadow-sm rounded-xl col-span-2 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-8 gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center">No profile data</p>
        )}
      </div>
    </div>
  );
}
