using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;


namespace EntityLayer.Models
{
    public class Clients
    {

        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? FileName { get; set; }
    }

    public class ClientUploadDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string FileName { get; set; }
        public List<IFormFile>? Files { get; set; }
    }

}
