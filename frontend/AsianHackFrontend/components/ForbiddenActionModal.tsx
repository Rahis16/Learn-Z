"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface ForbiddenActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ForbiddenActionModal: React.FC<ForbiddenActionModalProps> = ({
  isOpen,
  onClose,
  message,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
          <Transition.Child as={Fragment}>
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-2xl transition-all">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold text-red-600 flex items-center gap-2"
                >
                  <FiAlertTriangle className="text-xl" /> Forbidden Action
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="mt-3 text-sm text-gray-700 leading-relaxed">
                {message}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded shadow-sm"
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

export default ForbiddenActionModal;
