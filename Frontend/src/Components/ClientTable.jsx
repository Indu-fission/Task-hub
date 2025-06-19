// import React from "react";
// import { BiEdit } from "react-icons/bi";
// import { RiDeleteBin5Line } from "react-icons/ri";
// import { useNavigate } from "react-router-dom";

// function ClientTable({ clients, handleDelete, editClient, openModal }) {
//   const navigate = useNavigate();

//   const handleEdit = (client) => {
//     editClient(client);
//     openModal();
//   };

//   const goToChatbot = (id) => {
//     navigate(`/clients/${id}/chatbot`);
//   };

//   const extractFileName = (filePath) => filePath.split("_").pop();

//   return (
//     <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-5 mx-5">
//       <table className="min-w-full">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="py-3 px-4 text-left">Client ID</th>
//             <th className="py-3 px-4 text-left">Client Name</th>
//             <th className="py-3 px-4 text-left">Address</th>
//             <th className="py-3 px-4 text-left">Files</th>
//             <th className="py-3 px-4 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {clients.map((client) => {
//             const files = (client.fileName || "")
//               .split(";")
//               .map((f) => f.trim())
//               .filter((f) => f);

//             const seen = new Set();
//             const uniqueFiles = files.filter((f) => {
//               const base = extractFileName(f);
//               if (seen.has(base)) return false;
//               seen.add(base);
//               return true;
//             });

//             return (
//               <tr key={client.id} className="border-t">
//                 <td
//                   className="py-2 px-4 text-blue-600 hover:underline cursor-pointer"
//                   onClick={() => goToChatbot(client.id)}
//                 >
//                   {client.id}
//                 </td>
//                 <td className="py-2 px-4">{client.name}</td>
//                 <td className="py-2 px-4">{client.address}</td>
//                 <td className="py-2 px-4">
//                   {uniqueFiles.length > 0 ? (
//                     uniqueFiles.map((file, index) => (
//                       <div key={index}>{extractFileName(file)}</div>
//                     ))
//                   ) : (
//                     <span>No files available</span>
//                   )}
//                 </td>
//                 <td className="py-2 px-4">
//                   <div className="flex items-center">
//                     <BiEdit
//                       className="text-violet-500 hover:text-violet-600 mr-2 cursor-pointer"
//                       size={20}
//                       onClick={() => handleEdit(client)}
//                     />
//                     <RiDeleteBin5Line
//                       className="text-red-500 hover:text-red-600 cursor-pointer"
//                       size={20}
//                       onClick={() => handleDelete(client.id)}
//                     />
//                   </div>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default ClientTable;


import React, { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"; // Import arrow icons

function ClientTable({ clients, handleDelete, editClient, openModal }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8; // Or 9, as you prefer

  const handleEdit = (client) => {
    editClient(client);
    openModal();
  };

  const goToChatbot = (id) => {
    navigate(`/clients/${id}/chatbot`);
  };

  const extractFileName = (filePath) => filePath.split("_").pop();

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentClients = clients.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(clients.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    // Show first page, last page, current page, and pages around current page
    const maxPagesToShow = 3; // Adjust as needed (e.g., 1 ... 4 5 6 ... 10)
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow + 2) { // Show all if few pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1); // Always show first page

      let startPage = Math.max(2, currentPage - halfPagesToShow);
      let endPage = Math.min(totalPages - 1, currentPage + halfPagesToShow);

      if (currentPage - halfPagesToShow <= 2) {
        endPage = Math.min(totalPages -1, 1 + maxPagesToShow);
      }

      if (currentPage + halfPagesToShow >= totalPages -1 ) {
        startPage = Math.max(2, totalPages - maxPagesToShow);
      }


      if (startPage > 2) {
        pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages); // Always show last page
    }
    return pageNumbers;
  };


  return (
    <div className="bg-white shadow-md rounded-lg mt-5 mx-5">
      <div className="overflow-x-auto"> {/* Moved overflow-x-auto here to not affect pagination */}
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Client ID</th>
              <th className="py-3 px-4 text-left">Client Name</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">Files</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  No clients to display.
                </td>
              </tr>
            )}
            {currentClients.map((client) => {
              const files = (client.fileName || "")
                .split(";")
                .map((f) => f.trim())
                .filter((f) => f);

              const seen = new Set();
              const uniqueFiles = files.filter((f) => {
                const base = extractFileName(f);
                if (seen.has(base)) return false;
                seen.add(base);
                return true;
              });

              return (
                <tr key={client.id} className="border-t hover:bg-gray-50">
                  <td
                    className="py-3 px-4 text-blue-600 hover:underline cursor-pointer whitespace-nowrap"
                    onClick={() => goToChatbot(client.id)}
                  >
                    {client.id}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{client.name}</td>
                  <td className="py-3 px-4">{client.address}</td>
                  <td className="py-3 px-4">
                    {uniqueFiles.length > 0 ? (
                      uniqueFiles.map((file, index) => (
                        <div key={index} className="text-sm">
                          {extractFileName(file)}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">No files</span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BiEdit
                        className="text-violet-500 hover:text-violet-600 mr-3 cursor-pointer"
                        size={22}
                        onClick={() => handleEdit(client)}
                        title="Edit Client"
                      />
                      <RiDeleteBin5Line
                        className="text-red-500 hover:text-red-600 cursor-pointer"
                        size={22}
                        onClick={() => handleDelete(client.id)}
                        title="Delete Client"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {clients.length > rowsPerPage && (
        <div className="flex justify-end items-center p-4 border-t">
          <nav className="flex items-center space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-150 ease-in-out
                ${currentPage === 1 ? 'text-gray-400' : 'text-gray-700'}`}
              aria-label="Previous page"
            >
              <FiChevronLeft size={20} />
            </button>

            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-2 py-1 text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => handlePageChange(page)}
                    disabled={currentPage === page}
                    className={`px-3 py-1.5 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-150 ease-in-out
                      ${currentPage === page
                        ? "bg-indigo-500 text-white font-semibold shadow-sm"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-150 ease-in-out
                ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-700'}`}
              aria-label="Next page"
            >
              <FiChevronRight size={20} />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

export default ClientTable;