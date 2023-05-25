using iziCox;
using iziCox.Services;
using Microsoft.AspNetCore.DataProtection;
using Minio;
using Minio.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "originea",
                      policy =>
                      {
                          policy.WithOrigins("*");
                      });
});

builder.Services.AddScoped<MinioObject>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("originea");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
