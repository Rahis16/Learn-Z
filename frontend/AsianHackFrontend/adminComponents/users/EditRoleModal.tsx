'use client';

import { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiSearch, FiCheckCircle, FiXCircle, FiShield } from 'react-icons/fi';
import { axiosWithCsrf } from '@/lib/axiosWithCsrf';

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: number;
  onRoleUpdated: () => void;
}

interface Permission {
  id: number;
  label: string;
  code:string;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  isOpen,
  onClose,
  roleId,
  onRoleUpdated,
}) => {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const [roleRes, permRes] = await Promise.all([
          axiosWithCsrf.get(`/api/roles/${roleId}/`),
          axiosWithCsrf.get<Permission[]>('/api/permissions/'),
        ]);

        setRoleName(roleRes.data.name);
        setDescription(roleRes.data.description);
        setSelectedPermissions(roleRes.data.permissions);
        setPermissions(permRes.data);
      } catch (error) {
        console.error('Error fetching role:', error);
      }
    };

    if (isOpen) fetchRole();
  }, [isOpen, roleId]);

  const handleTogglePermission = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleUpdate = async () => {
    try {
      await axiosWithCsrf.put(`/api/roles/${roleId}/`, {
        name: roleName,
        description,
        permissions: selectedPermissions,
      });
      onRoleUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/10" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child as={Fragment}>
            <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
              <Dialog.Title className="text-lg font-semibold mb-4">
                Edit Role
              </Dialog.Title>

              <input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full mb-3 p-2 rounded shadow-sm"
                disabled
              />

              <textarea
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

              <div className="max-h-40 overflow-y-auto rounded p-2 mb-4 shadow-sm bg-gray-50">
                {permissions
                  .filter((perm) =>
                    perm.label.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((perm) => (
                    <label
                      key={perm.id}
                      className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded"
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

              <div className="flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 flex items-center gap-2"
                >
                  <FiXCircle />
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <FiCheckCircle />
                  Update
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditRoleModal;
