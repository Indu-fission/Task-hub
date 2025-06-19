using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EntityLayer.Models;

namespace EntityLayer.Interfaces
{
    public  interface IClientRepo
    {
        Clients AddClient(Clients client);
        List<Clients> GetAllClients();
        object UpdateClient(Clients client);
        object DeleteClientById(int id);

    }
}

