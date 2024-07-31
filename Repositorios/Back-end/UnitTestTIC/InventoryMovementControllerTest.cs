using AutoMapper;
using backendfepon.Controllers;
using backendfepon.Data;
using backendfepon.DTOs.InventoryMovementDTOs;
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
    public class InventoryMovementControllerTest
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;
        private readonly InventoryMovementController _controller;

        public InventoryMovementControllerTest()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(_options);

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<InventoryMovementProfile>();
            });

            _mapper = config.CreateMapper();

            // Configure logging
            var serviceProvider = new ServiceCollection()
                .AddLogging(builder => builder
                    .AddConsole()
                    .SetMinimumLevel(LogLevel.Information))
                .BuildServiceProvider();

            _controller = new InventoryMovementController(_context, _mapper);
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
        public async Task GetInventoryMovements_ReturnsInventoryMovements_WhenInventoryMovementsExist()
        {
            // Arrange
            InitializeDatabase();

            var inventoryMovement1 = new InventoryMovement
            {
                Movement_Id = 1,
                State_Id = Constants.DEFAULT_STATE,
                InventoryMovementType = new InventoryMovementType { Movement_Type_Name = "Type 1" },
                Product = new Product { Name = "Product 1", Description = "Description 1", Label = "Label 1" },
                Quantity = 10,
                Date = DateTime.Now
            };

            _context.InventoryMovements.Add(inventoryMovement1);
            _context.SaveChanges();

            // Act
            var result = await _controller.GetInventoryMovements();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<InventoryMovementDTO>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnedMovements = Assert.IsType<List<InventoryMovementDTO>>(okResult.Value);

            Assert.Equal(1,returnedMovements.Count);
        }

        [Fact]
        public async Task GetInventoryMovement_ReturnsNotFound_WhenInventoryMovementDoesNotExist()
        {
            // Arrange
            InitializeDatabase();

            // Act
            var result = await _controller.GetInventoryMovement(100);

            // Assert
            var actionResult = Assert.IsType<ActionResult<InventoryMovementDTO>>(result);
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(actionResult.Result);

            Assert.Equal("Movimiento de inventario no encontrado.", ((dynamic)notFoundResult.Value).Message);
        }

        [Fact]
        public async Task PostInventoryMovement_ReturnsCreatedInventoryMovement()
        {
            // Arrange
            InitializeDatabase();

            var inventoryMovementDTO = new CreateUpdateInventoryMovementDTO
            {
                product_Name = "Product 1",
                inventory_Movement_Type_Name = "Type 1",
                quantity = 10,
                Date = DateTime.Now
            };

            var product = new Product { Product_Id = 1, Name = "Product 1", Description = "Description 1", Label = "Label 1", Quantity = 100 };
            var inventoryMovementType = new InventoryMovementType { Movement_Type_Id = 1, Movement_Type_Name = "Type 1" };

            _context.Products.Add(product);
            _context.InventoryMovementTypes.Add(inventoryMovementType);
            _context.SaveChanges();

            try
            {
                // Act
                var result = await _controller.PostInventoryMovement(inventoryMovementDTO);

                // Assert
                var actionResult = Assert.IsType<ActionResult<InventoryMovementDTO>>(result);
                if (!(actionResult.Result is CreatedAtActionResult))
                {
                    var objectResult = actionResult.Result as ObjectResult;
                    var errorMessage = objectResult?.Value?.ToString() ?? "No error message";
                    Assert.True(false, $"Unexpected result type: {actionResult.Result.GetType().Name}, Error: {errorMessage}");
                }
                Assert.IsType<CreatedAtActionResult>(actionResult.Result);

                var createdAtActionResult = (CreatedAtActionResult)actionResult.Result;
                var returnedMovement = Assert.IsType<InventoryMovementDTO>(createdAtActionResult.Value);

                Assert.Equal(inventoryMovementDTO.product_Name, returnedMovement.product);
                Assert.Equal(inventoryMovementDTO.inventory_Movement_Type_Name, returnedMovement.movementType);
                Assert.Equal(inventoryMovementDTO.quantity, returnedMovement.quantity);
            }
            catch (Exception ex)
            {
                Assert.True(false, ex.Message);
            }
        }


        [Fact]
        public async Task PutInventoryMovement_ReturnsNoContent()
        {
            // Arrange
            InitializeDatabase();

            var inventoryMovement = new InventoryMovement
            {
                Movement_Id = 2,
                State_Id = Constants.DEFAULT_STATE,
                InventoryMovementType = new InventoryMovementType { Movement_Type_Name = "Type 1" },
                Product = new Product { Name = "Product 1", Description = "Description 1", Label = "Label 1" },
                Quantity = 10,
                Date = DateTime.Now
            };

            _context.InventoryMovements.Add(inventoryMovement);
            _context.SaveChanges();

            var updatedInventoryMovementDTO = new CreateUpdateInventoryMovementDTO
            {
                product_Name = "Product 3",
                inventory_Movement_Type_Name = "Type 2",
                quantity = 20,
                Date = DateTime.Now
            };

            var product = new Product { Product_Id = 3, Name = "Product 3", Description = "Description 1", Label = "Label 1" };
            var inventoryMovementType = new InventoryMovementType { Movement_Type_Id = 2, Movement_Type_Name = "Type 2" };

            _context.Products.Add(product);
            _context.InventoryMovementTypes.Add(inventoryMovementType);
            _context.SaveChanges();

            // Act
            var result = await _controller.PutInventoryMovement(2, updatedInventoryMovementDTO);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task PatchInventoryMovementState_UpdatesStateToInactive()
        {
            // Arrange
            InitializeDatabase();

            var inventoryMovement = new InventoryMovement
            {
                Movement_Id = 1,
                State_Id = Constants.DEFAULT_STATE,
                InventoryMovementType = new InventoryMovementType { Movement_Type_Name = "Type 1" },
                Product = new Product { Name = "Product 1", Description = "Description 1", Label = "Label 1" },
                Quantity = 10,
                Date = DateTime.Now
            };

            _context.InventoryMovements.Add(inventoryMovement);
            _context.SaveChanges();

            // Act
            var result = await _controller.PatchInventoryMovementState(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var updatedMovement = await _context.InventoryMovements.FindAsync(1);

            Assert.Equal(Constants.STATE_INACTIVE, updatedMovement.State_Id);
        }
    }
}