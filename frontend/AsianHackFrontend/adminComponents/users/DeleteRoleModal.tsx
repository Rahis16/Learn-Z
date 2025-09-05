'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiAlertTriangle, FiXCircle, FiTrash } from 'react-icons/fi';
import { axiosWithCsrf } from '@/lib/axiosWithCsrf';

interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: number;
  roleName: string;
  onRoleDeleted: (detail: any) => void;
}

const DeleteRoleModal: React.FC<DeleteRoleModalProps> = ({
  isOpen,
  onClose,
  roleId,
  roleName,
  onRoleDeleted,
}) => {
  const handleDelete = async () => {
    try {
      const res = await axiosWithCsrf.delete(`/api/roles/${roleId}/`);
      onRoleDeleted(res.data.detail);
      onClose();
    } catch (err: any) {
       const errorMsg = err.response?.data?.detail || "Failed to delete role.";
       alert(errorMsg); // ✅ show error if role is protected or server error
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
            <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-sm">
              <div className="text-center">
                <FiAlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                <Dialog.Title className="text-xl font-semibold mb-2">
                  Confirm Deletion
                </Dialog.Title>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to delete the <strong>{roleName}</strong> role? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100 flex items-center gap-2"
                  >
                    <FiXCircle />
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
                  >
                    <FiTrash />
                    Delete
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteRoleModal;
