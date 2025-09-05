"use client";

import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiUserCheck, FiXCircle, FiShield } from "react-icons/fi";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";

interface AssignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleAssigned: (detail: any) => void;
  onStatusUpdate: (detail: any) => void;
  userId: number | null;
}

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  username: string;
}

const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
  isOpen,
  onClose,
  onRoleAssigned,
  onStatusUpdate,
  userId,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [roleRes, userRes] = await Promise.all([
          axiosWithCsrf.get<Role[]>("/api/roles/"), // Endpoint for roles
          axiosWithCsrf.get(`/api/user-status-role/${userId}`), // Endpoint for users
        ]);
        setRoles(roleRes.data);
        setIsActive(userRes.data.statuses.is_active);
        setIsStaff(userRes.data.statuses.is_staff);
        setIsSuperuser(userRes.data.statuses.is_superuser);
        setSelectedRole(userRes.data.role.id || "");
      } catch (err) {
        console.error("Error fetching users or roles", err);
      }
    };

    fetchData();
  }, [isOpen, userId]);

  const handleAssign = async () => {
    try {
      const res = await axiosWithCsrf.post("/api/assign-role/", {
        user_id: userId,
        role_id: Number(selectedRole),
      });

      console.log(userId);
      console.log(selectedRole);
      onRoleAssigned(res.data.detail);
      onClose();
    } catch (err) {
      console.error("Assignment failed:", err);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const res = await axiosWithCsrf.post("/api/update-user-status/", {
        user_id: userId,
        is_active: isActive,
        is_staff: isStaff,
        is_superuser: isSuperuser,
      });
      onStatusUpdate(res.data.detail);
      onClose();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-2">
          <Transition.Child as={Fragment}>
            <Dialog.Panel className="bg-white rounded-lg p-3 w-full max-w-md shadow-xl">
              <Dialog.Title className="text-lg text-center mt-3 font-semibold mb-6">
              Assign role and Change User status
              </Dialog.Title>

             <div className="flex flex-col gap-4 mb-2 p-3 pb-5 pt-5 border-[var(--gray-200)] rounded-lg border-[2px]">
               <h1 className="font-semibold text-md">Assign Role</h1>
               <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full mb-2 p-2 shadow-sm rounded"
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              <button
                  onClick={handleAssign}
                  disabled={!userId || !selectedRole} // ✅ Check for userId from props
                  className="px-4 w-fit py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                >
                  <FiUserCheck /> Assign Role
                </button>
             </div>

              <div className="flex flex-col gap-4 p-3 pb-5 pt-5 border-[var(--gray-200)] rounded-lg border-[2px]">
                <h1 className="font-semibold text-md">Update user Status</h1>
                <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <span>Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isStaff}
                    onChange={(e) => setIsStaff(e.target.checked)}
                  />
                  <span>Staff</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSuperuser}
                    onChange={(e) => setIsSuperuser(e.target.checked)}
                  />
                  <span>Superuser</span>
                </label>
                <button
                  onClick={handleUpdateStatus}
                  disabled={!userId}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                >
                  <FiUserCheck /> Update Status
                </button>
              </div>
              </div>

              <div className="flex mt-3 justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 flex items-center gap-2"
                >
                  <FiXCircle /> Cancel
                </button>
                
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AssignRoleModal;
