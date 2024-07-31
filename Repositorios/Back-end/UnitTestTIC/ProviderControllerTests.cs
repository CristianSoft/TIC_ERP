using AutoMapper;
using backendfepon.Controllers;
using backendfepon.Data;
using backendfepon.DTOs.ProviderDTOs;
using backendfepon.ModelConfigurations.Profiles;
using backendfepon.Models;
using backendfepon.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTestTIC
{
    public class ProviderControllerTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;
        private readonly ProviderController _controller;

        public ProviderControllerTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(_options);

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<ProviderProfile>(); // Asegúrate de que tienes un perfil de AutoMapper para Provider
            });

            _mapper = config.CreateMapper();

            // Configurar el logging
            var serviceProvider = new ServiceCollection()
                .AddLogging(builder => builder
                    .AddConsole()
                    .SetMinimumLevel(LogLevel.Information))
                .BuildServiceProvider();

            _controller = new ProviderController(_context, _mapper);
            InitializeDatabase();
        }

        private void InitializeDatabase()
        {
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetProviders_ReturnsProviders_WhenProvidersExist()
        {
            // Arrange
            InitializeDatabase();

            var provider1 = new Provider
            {
                Provider_Id = 1,
                State_Id = Constants.DEFAULT_STATE,
                Name = "Provider 1",
                Phone = "123456789",
                Email = "provider1@example.com"
            };

            _context.Providers.Add(provider1);
            _context.SaveChanges();

            // Act
            var result = await _controller.GetProviders();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<ProviderDTO>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnedProviders = Assert.IsType<List<ProviderDTO>>(okResult.Value);

            Assert.Single(returnedProviders);
        }

        [Fact]
        public async Task GetProvider_ReturnsNotFound_WhenProviderDoesNotExist()
        {
            // Arrange
            InitializeDatabase();

            // Act
            var result = await _controller.GetProvider(100);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ProviderDTO>>(result);
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(actionResult.Result);

            Assert.Equal("Proveedor no encontrado.", ((dynamic)notFoundResult.Value).Message);
        }

        [Fact]
        public async Task PostProvider_ReturnsCreatedProvider()
        {
            // Arrange
            InitializeDatabase();

            var providerDTO = new CreateUpdateProviderDTO
            {
                name = "Provider 1",
                phone = "123456789",
                email = "provider1@example.com"
            };

            try
            {
                // Act
                var result = await _controller.PostProvider(providerDTO);

                // Assert
                var actionResult = Assert.IsType<ActionResult<ProviderDTO>>(result);
                if (!(actionResult.Result is CreatedAtActionResult))
                {
                    var objectResult = actionResult.Result as ObjectResult;
                    var errorMessage = objectResult?.Value?.ToString() ?? "No error message";
                    Assert.True(false, $"Unexpected result type: {actionResult.Result.GetType().Name}, Error: {errorMessage}");
                }
                Assert.IsType<CreatedAtActionResult>(actionResult.Result);

                var createdAtActionResult = (CreatedAtActionResult)actionResult.Result;
                var returnedProvider = Assert.IsType<ProviderDTO>(createdAtActionResult.Value);

                Assert.Equal(providerDTO.name, returnedProvider.name);
                Assert.Equal(providerDTO.phone, returnedProvider.phone);
                Assert.Equal(providerDTO.email, returnedProvider.email);
            }
            catch (Exception ex)
            {
                Assert.True(false, ex.Message);
            }
        }

        [Fact]
        public async Task PutProvider_ReturnsNoContent()
        {
            // Arrange
            InitializeDatabase();

            var provider = new Provider
            {
                Provider_Id = 2,
                State_Id = Constants.DEFAULT_STATE,
                Name = "Provider 1",
                Phone = "123456789",
                Email = "provider1@example.com"
            };

            _context.Providers.Add(provider);
            _context.SaveChanges();

            var updatedProviderDTO = new CreateUpdateProviderDTO
            {
                name = "Provider 2",
                phone = "987654321",
                email = "provider2@example.com"
            };

            // Act
            var result = await _controller.PutProvider(2, updatedProviderDTO);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }


        [Fact]
        public async Task PatchProviderState_UpdatesStateToInactive()
        {
            // Arrange
            InitializeDatabase();

            var provider = new Provider
            {
                Provider_Id = 4,
                State_Id = Constants.DEFAULT_STATE,
                Name = "Provider 1",
                Phone = "123456789",
                Email = "provider1@example.com"
            };

            _context.Providers.Add(provider);
            _context.SaveChanges();

            // Act
            var result = await _controller.PatchProviderState(4);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var updatedProvider = await _context.Providers.FindAsync(4);

            Assert.Equal(Constants.STATE_INACTIVE, updatedProvider.State_Id);
        }
    }
}
