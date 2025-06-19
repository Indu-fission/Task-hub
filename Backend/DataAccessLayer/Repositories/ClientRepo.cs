using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccessLayer.Data;
using EntityLayer.Interfaces;
using EntityLayer.Models;

namespace DataAccessLayer.Repositories
{
    public class ClientRepo : IClientRepo
    {

        ClientDbContext _dbContext;

        public ClientRepo(ClientDbContext clientDb)
        {
            _dbContext = clientDb;
        }

       
        public Clients AddClient(Clients client)
        {
            _dbContext.Clients.Add(client);
            _dbContext.SaveChanges();
            return client;
        }
        
        public object DeleteClientById(int id)
        {
            var obj = _dbContext.Clients.Find(id);
            if (obj != null)
            {
                _dbContext.Clients.Remove(obj);
                _dbContext.SaveChanges();
            }
            return "Client Deleted Successfully";
        }
 
        public List<Clients> GetAllClients()
        {
            return _dbContext.Clients.ToList();
        }

        public object UpdateClient(Clients client)
        {
            _dbContext.Clients.Update(client);
            _dbContext.SaveChanges();
            return client;
        }


    }
}
