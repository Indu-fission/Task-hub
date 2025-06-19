using BusinessLayer.Services;
using EntityLayer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace TaskHubBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly ClientService _clientService;

        public ClientController(ClientService clientService)
        {
            _clientService = clientService;
        }
        [Route("GetAllClients")]
        [HttpGet]
        public IActionResult GetAllClients()
        {
            var result = _clientService.GetAllClients();
            return Ok(new { result });
        }



        //[Route("AddClient")]
        //[HttpPost]
        //public IActionResult AddClient(Clients client)
        //{

        //    var result = _clientService.AddClient(client);
        //    return Ok(new { result });
        //}

        [Route("AddClient")]
        [HttpPost]
        public async Task<IActionResult> AddClient([FromForm] ClientUploadDto clientUploadDto)
        {
            if (clientUploadDto.Files == null || !clientUploadDto.Files.Any())
            {
                return BadRequest("No files uploaded.");
            }

            var folderName = "Uploads";
            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), folderName);

            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            var savedFileNames = new List<string>();

            foreach (var file in clientUploadDto.Files)
            {
                var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(uploadPath, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                savedFileNames.Add(uniqueFileName);
            }

            var client = new Clients
            {
                Name = clientUploadDto.Name,
                Address = clientUploadDto.Address,
                FileName = string.Join(";", savedFileNames) // Store multiple filenames separated by semicolon
            };

            var result = _clientService.AddClient(client);

            return Ok(new { result });
        }
        [Route("UpdateClient")]
        [HttpPut]
        public async Task<IActionResult> UpdateClient([FromForm] ClientUploadDto clientUploadDto)
        {
            // Define the folder name for file uploads
            var folderName = "Uploads";
            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), folderName);

            // Create the folder if it doesn't exist
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            List<string> finalFileNames = new List<string>();

            // If the client has any old file names, add them to the final file names
            if (!string.IsNullOrEmpty(clientUploadDto.FileName))
            {
                finalFileNames.AddRange(clientUploadDto.FileName.Split(';', StringSplitOptions.RemoveEmptyEntries));
            }

            // Add newly uploaded files to the final file names
            if (clientUploadDto.Files != null && clientUploadDto.Files.Any())
            {
                foreach (var file in clientUploadDto.Files)
                {
                    var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
                    var filePath = Path.Combine(uploadPath, uniqueFileName);

                    // Save the file to the specified path
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    finalFileNames.Add(uniqueFileName);
                }
            }

            // Create a new Client object with updated data
            var client = new Clients
            {
                Id = clientUploadDto.Id,
                Name = clientUploadDto.Name,
                Address = clientUploadDto.Address,
                FileName = string.Join(";", finalFileNames) // Store file names as a semicolon-separated string
            };

            // Call the service to update the client
            var result = _clientService.UpdateClient(client);

            // Return the result of the update operation
            return Ok(new { result });
        }

        //[Route("UpdateClient")]
        //[HttpPut]
        //public IActionResult UpdateClient(Clients client)
        //{
        //    var result = _clientService.UpdateClient(client);
        //    return Ok(new { result });
        //}

        [Route("DeleteClientById")]
        [HttpDelete]
        public IActionResult DeleteClientById(int id)
        {
            var result = _clientService.DeleteClientById(id);
            return Ok(new { result });
        }

    }
}

