import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

function Modal({ closeModal, saveClientData, clientToEdit, updateClientData }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    newFiles: [],
    newFileNames: [],
    existingFiles: [],
  });

  const [errors, setErrors] = useState({});
  const hasInitialized = useRef(false); // Track if initialization already happened

  useEffect(() => {
    if (clientToEdit && !hasInitialized.current) {
      const existingFileNames = clientToEdit.fileName
        ? clientToEdit.fileName.split(";").map(f => f.trim()).filter(Boolean)
        : [];

      setFormData({
        name: clientToEdit.name || "",
        address: clientToEdit.address || "",
        newFiles: [],
        newFileNames: [],
        existingFiles: existingFileNames,
      });

      hasInitialized.current = true;
    }

    // Reset when modal closes
    return () => {
      hasInitialized.current = false;
    };
  }, [clientToEdit]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.address.trim()) errs.address = "Address is required";
    if (formData.newFiles.length === 0 && formData.existingFiles.length === 0)
      errs.files = "At least one file is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const filtered = selectedFiles.filter(
      (file) =>
        !formData.newFiles.some((f) => f.name === file.name) &&
        !formData.existingFiles.some((existing) => existing.split("_").pop() === file.name)
    );

    const generatedNames = filtered.map((file) => `${Date.now()}_${file.name}`);

    setFormData((prev) => ({
      ...prev,
      newFiles: [...prev.newFiles, ...filtered],
      newFileNames: [...prev.newFileNames, ...generatedNames],
    }));
  };

  const removeNewFile = (index) => {
    const updatedNewFiles = [...formData.newFiles];
    const updatedNewNames = [...formData.newFileNames];
    updatedNewFiles.splice(index, 1);
    updatedNewNames.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      newFiles: updatedNewFiles,
      newFileNames: updatedNewNames,
    }));
  };

  const removeExistingFile = (index) => {
    const updated = [...formData.existingFiles];
    updated.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      existingFiles: updated,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const allFileNames = [...formData.existingFiles, ...formData.newFileNames];

    const payload = {
      id: clientToEdit?.id,
      name: formData.name,
      address: formData.address,
      files: formData.newFiles,
      fileName: allFileNames.join(";"),
    };

    if (clientToEdit) {
      updateClientData(payload);
    } else {
      saveClientData(payload);
    }

    Swal.fire({
      icon: "success",
      title: clientToEdit ? "Client updated!" : "Client added!",
    }).then(() => {
      closeModal();
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl mb-4 text-center">
          {clientToEdit ? "Update Client" : "Add Client"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full border p-2 rounded"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              className="w-full border p-2 rounded"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block">Upload / Change Files</label>
            <input type="file" multiple onChange={handleFileChange} />
            {errors.files && <p className="text-red-500 text-sm">{errors.files}</p>}
          </div>

          {formData.existingFiles.length > 0 && (
            <div className="mb-2">
              <p className="font-medium">Old Files:</p>
              {formData.existingFiles.map((file, i) => (
                <div
                  key={i}
                  className="text-sm flex justify-between items-center"
                >
                  <span>{file.split("_").pop()}</span>
                  <button
                    type="button"
                    onClick={() => removeExistingFile(i)}
                    className="text-red-500 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {formData.newFiles.length > 0 && (
            <div className="mb-2">
              <p className="font-medium">New Files:</p>
              {formData.newFiles.map((file, i) => (
                <div
                  key={i}
                  className="text-sm flex justify-between items-center"
                >
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeNewFile(i)}
                    className="text-red-500 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {clientToEdit ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;
