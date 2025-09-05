"use client";

import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { FiSearch, FiCheckCircle, FiXCircle, FiShield } from "react-icons/fi";

// ---------------------
// 🔶 Define prop types
// ---------------------
interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleCreated: (data: any) => void; // You can replace `any` with your Role type
}

// 🔶 Define permission and role option types
interface Permission {
  id: number;
  label: string;
}

interface RoleOption {
  value: string;
  label: string;
}

// ---------------------
// 🔷 Component starts
// ---------------------
const AddRoleModal: React.FC<AddRoleModalProps> = ({
  isOpen,
  onClose,
  onRoleCreated,
}) => {
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [role, setRole] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch permissions and available role names
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [permRes, roleRes] = await Promise.all([
          axiosWithCsrf.get<Permission[]>("/api/permissions/"),
          axiosWithCsrf.get<RoleOption[]>("/api/available-roles/"),
        ]);
        setPermissions(permRes.data);
        setRoleOptions(roleRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    if (isOpen) fetchData();
  }, [isOpen]);

  // Toggle permission selection
  const handleTogglePermission = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // Handle role creation
  const handleSubmit = async () => {
    try {
      const res = await axiosWithCsrf.post("/api/roles-post/", {
        name: role,
        description,
        permissions: selectedPermissions,
      });
      onRoleCreated(res.data); // notify parent
      onClose(); // close modal
    } catch (err) {
      console.error("Failed to create role:", err);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 bg-white rounded-lg p-6 w-full max-w-md shadow-2xl border" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child as={Fragment}>
            <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <Dialog.Title className="text-lg font-semibold mb-4">
                Add New Role
              </Dialog.Title>

              {/* Dropdown for predefined role names */}
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mb-3 p-2 shadow-sm rounded"
              >
                <option value="">Select Role</option>
                {roleOptions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>

              {/* Description input */}
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mb-3 p-2 shadow-sm rounded"
              />

              {/* Search Permissions */}
              <div className="relative mb-3">
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search permissions..."
                  className="w-full pl-10 pr-4 py-2 shadow-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              {/* Permission checkboxes */}
              <div className="max-h-40 overflow-y-auto  rounded p-2 mb-4 shadow-sm bg-gray-50">
                {permissions
                  .filter((perm) =>
                    perm.label.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((perm) => (
                    <label
                      key={perm.id}
                      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm.id)}
                        onChange={() => handleTogglePermission(perm.id)}
                      />
                      <FiShield className="text-blue-500" />
                      <span>{perm.label}</span>
                    </label>
                  ))}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 flex items-center gap-2 text-gray-600 border rounded hover:bg-gray-100 transition"
                >
                  <FiXCircle />
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!role}
                  className="px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  <FiCheckCircle />
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddRoleModal;
