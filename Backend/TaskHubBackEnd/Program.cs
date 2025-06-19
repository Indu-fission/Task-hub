using BusinessLayer.Services;
using DataAccessLayer.Data;
using DataAccessLayer.Repositories;
using EntityLayer.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 104857600; // 100 MB
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TaskHub API",
        Version = "1.0.0", // ? This is the important field!
        Description = "API for Admin and Client management"
    });
}); 
builder.Services.AddCors();
builder.Services.AddControllers();
               

builder.Services.AddControllersWithViews();


// Configure Database Context
builder.Services.AddDbContext<ClientDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
                         b => b.MigrationsAssembly("DataAccessLayer")));


// Dependency Injection for Services and Repositories
builder.Services.AddScoped<ClientService>();
builder.Services.AddScoped<IClientRepo, ClientRepo>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "TaskHub API v1");
        c.RoutePrefix = "swagger";
    });
    // Configure CORS to allow any origin, method, and header for development purposes
    app.UseCors(x => x.AllowAnyMethod()
                      .AllowAnyHeader()
                      .SetIsOriginAllowed(origin => true)
                      .AllowCredentials());
    app.UseCors("AllowLocalNetwork");
}

app.UseHttpsRedirection();

app.UseAuthorization();  // Add Authorization Middleware

app.MapControllers();

app.Run();