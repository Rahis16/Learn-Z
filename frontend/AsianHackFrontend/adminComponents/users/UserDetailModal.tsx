"use client";

import { useEffect, useState, Fragment, JSX } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  FiUser,
  FiXCircle,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiBook,
  FiUsers,
  FiCheckCircle,
  FiAlertCircle,
  FiKey,
  FiDollarSign,
  FiCalendar,
  FiClipboard,
} from "react-icons/fi";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
}

interface Permission {
  code: string;
  label: string;
}

interface Role {
  name: string;
  description: string;
  permissions: Permission[];
}

interface Profile {
  full_name: string;
  status: string;
  profile_pic: string;
  role: Role;
  faculty: string;
  section: string;
  program: string;
  semester: string;
}

interface UserInfo {
  username: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  profile: Profile;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  last_login: string;
  phone_number: string;
  profile_pic: string;
  orders_count: number;
  total_spent: string;
  user: UserInfo;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchProfile = async () => {
      try {
        const res = await axiosWithCsrf.get(`/api/user-profile-data/${userId}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, [isOpen, userId]);

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: JSX.Element;
    label: string;
    value: string | number | boolean | JSX.Element;
  }) => (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      {icon}
      <span className="font-medium">{label}:</span>
      <span className="text-gray-800">
        {typeof value === "string" || typeof value === "number" || typeof value === "boolean"
          ? String(value)
          : value}
      </span>
    </div>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center px-2 py-6 sm:px-4">
          <Transition.Child as={Fragment}>
            <Dialog.Panel className="bg-white max-h-[90vh] overflow-y-auto custom-scrollbar rounded-xl w-full max-w-2xl shadow-2xl p-6">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                  <FiUser className="text-blue-600" /> User Profile
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  <FiXCircle size={22} />
                </button>
              </div>

              {profile ? (
                <div className="space-y-6">
                  {/* Profile Image + Basic Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={profile.profile_pic || "/images/profile2.jpg"}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-[2px] border-[var(--gray-200)] object-cover"
                    />
                    <div>
                      <p className="text-lg font-bold text-gray-800">
                        {profile.user.profile.full_name}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <FiMail className="text-blue-500" /> {profile.user.email}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <FiPhone className="text-green-500" /> {profile.phone_number}
                      </p>
                    </div>
                  </div>

                  {/* Grid Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <InfoRow icon={<FiUser />} label="Username" value={profile.user.username} />
                    <InfoRow icon={<FiBriefcase />} label="Role" value={profile.user.profile.role.name} />
                    <InfoRow icon={<FiBook />} label="Faculty" value={profile.user.profile.faculty} />
                    <InfoRow icon={<FiClipboard />} label="Program" value={profile.user.profile.program} />
                    <InfoRow icon={<FiClipboard />} label="Semester" value={profile.user.profile.semester} />
                    <InfoRow icon={<FiClipboard />} label="Section" value={profile.user.profile.section} />
                    <InfoRow
                      icon={<FiAlertCircle />}
                      label="Status"
                      value={
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            profile.user.profile.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {profile.user.profile.status}
                        </span>
                      }
                    />
                    <InfoRow icon={<FiCheckCircle />} label="Active" value={profile.user.is_active ? "Yes" : "No"} />
                    <InfoRow icon={<FiUsers />} label="Staff" value={profile.user.is_staff ? "Yes" : "No"} />
                    <InfoRow icon={<FiKey />} label="Superuser" value={profile.user.is_superuser ? "Yes" : "No"} />
                    <InfoRow icon={<FiCalendar />} label="Joined" value={new Date(profile.created_at).toLocaleDateString()} />
                    <InfoRow icon={<FiDollarSign />} label="Total Spent" value={`Rs. ${profile.total_spent}`} />
                    <InfoRow icon={<FiClipboard />} label="Orders" value={profile.orders_count} />
                  </div>

                  {/* Permissions */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <FiKey className="text-purple-500" /> Permissions
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                      {profile.user.profile.role.permissions.map((perm) => (
                        <li key={perm.code}>
                          <span className="font-medium">{perm.label}</span>{" "}
                          <span className="text-xs text-gray-500">({perm.code})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center text-sm text-gray-600 py-10">
                  Loading user details...
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded shadow-sm"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UserDetailModal;
