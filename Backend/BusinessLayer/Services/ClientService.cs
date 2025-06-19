using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EntityLayer.Interfaces;
using EntityLayer.Models;

namespace BusinessLayer.Services
{
    public class ClientService
    {
        IClientRepo _clientRepo;

        public ClientService(IClientRepo clientRepo)
        {
            _clientRepo = clientRepo;
        }
       

        public Clients AddClient(Clients client)
        {
            return _clientRepo.AddClient(client);
        }
        public List<Clients> GetAllClients()
        {
            return _clientRepo.GetAllClients();

        }

        public object UpdateClient(Clients client)
        {
            return _clientRepo.UpdateClient(client);
        }

        public object DeleteClientById(int id)
        {
            return _clientRepo.DeleteClientById(id);

        }

    }
}
