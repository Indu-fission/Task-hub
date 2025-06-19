import React, { useState, useEffect } from 'react';
import Modal from '../Components/Modal';
import ClientTable from '../Components/ClientTable';
import Swal from 'sweetalert2';
import axios from 'axios';

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const BASE_URL = "http://localhost:7189/api/Client";

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/GetAllClients`);
      if (response.status === 200) {
        setClients(response.data.result || []);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setClientToEdit(null);
    setIsModalOpen(false);
  };

  const saveClientData = async (data) => {
    try {
      const formPayload = new FormData();
      formPayload.append("Id", data.id || 0);
      formPayload.append("Name", data.name);
      formPayload.append("Address", data.address);

      let fileNameString = "";
      if (data.files && data.files.length > 0) {
        const fileArray = Array.from(data.files);
        fileNameString = fileArray.map(file => file.name).join(";");
        fileArray.forEach(file => {
          formPayload.append("Files", file);
        });
      }

      formPayload.append("FileName", fileNameString);

      const response = await axios.post(`${BASE_URL}/AddClient`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.status === 200) {
        fetchClients();
        closeModal();
      }
    } catch (error) {
      console.error("Error saving client:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.title || "Something went wrong!",
      });
    }
  };

  const updateClientData = async (clientData) => {
    try {
      const formData = new FormData();
      formData.append("Id", clientData.id || 0);
      formData.append("Name", clientData.name || "");
      formData.append("Address", clientData.address || "");
  
      if (clientData.files && clientData.files.length > 0) {
        const fileNames = clientData.files.map(file => file.name).join(";");
        formData.append("FileName", fileNames);
        clientData.files.forEach(file => formData.append("Files", file));
      } else {
        formData.append("FileName", clientData.fileName?.join(";") || "");
      }
  
      const response = await axios.put(`${BASE_URL}/UpdateClient`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
  
      if (response.status === 200 || response.status === 204) {
        fetchClients();  // This function should refresh the client data
        closeModal();  // Close the modal after updating
      }
    } catch (error) {
      console.error("Error updating client:", error.response?.data || error.message);
    }
  };
  

  const editClient = (client) => {
    setClientToEdit(client);
    setIsModalOpen(true);
  };

  const handleDelete = (clientId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this client!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${BASE_URL}/DeleteClientById?id=${clientId}`);
          fetchClients();
          Swal.fire('Deleted!', 'The client has been deleted.', 'success');
        } catch (error) {
          console.error("Error deleting client:", error);
        }
      }
    });
  };

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.fileName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between mb-6 p-5">
        <input
          type="text"
          placeholder="Search Clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 w-1/3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Add New Client
        </button>
      </div>

      <ClientTable
        clients={filteredClients}
        handleDelete={handleDelete}
        editClient={editClient}
        openModal={openModal}
      />

      {isModalOpen && (
        <Modal
          closeModal={closeModal}
          saveClientData={saveClientData}
          clientToEdit={clientToEdit}
          updateClientData={updateClientData}
        />
      )}
    </div>
  );
}

export default Dashboard;
