using AutoMapper;
using backendfepon.Controllers;
using backendfepon.Data;
using backendfepon.DTOs.ProductDTOs;
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
    public class ProductsControllerTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;
        private readonly ProductsController _controller;

        public ProductsControllerTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(_options);

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<ProductProfile>(); // Asegúrate de que tienes un perfil de AutoMapper para Product
            });

            _mapper = config.CreateMapper();

            // Configurar el logging
            var serviceProvider = new ServiceCollection()
                .AddLogging(builder => builder
                    .AddConsole()
                    .SetMinimumLevel(LogLevel.Information))
                .BuildServiceProvider();

            _controller = new ProductsController(_context, _mapper);
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
        public async Task GetProducts_ReturnsProducts_WhenProductsExist()
        {
            // Arrange
            InitializeDatabase();

            var product1 = new Product
            {
                Product_Id = 1,
                State_Id = Constants.DEFAULT_STATE,
                Name = "Product 1",
                Description = "Description 1",
                Label = "Label 1",
                Economic_Value = 100,
                Quantity = 10,
                Category = new Category { Description = "Category 1" },
                Provider = new Provider { Name = "Provider 1", Email = "provider1@example.com", Phone = "123456789" }
            };

            _context.Products.Add(product1);
            _context.SaveChanges();

            // Act
            var result = await _controller.GetProducts();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<ProductDTO>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnedProducts = Assert.IsType<List<ProductDTO>>(okResult.Value);

            Assert.Single(returnedProducts);
        }

        [Fact]
        public async Task GetProduct_ReturnsNotFound_WhenProductDoesNotExist()
        {
            // Arrange
            InitializeDatabase();

            // Act
            var result = await _controller.GetProduct(100);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ProductDTO>>(result);
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(actionResult.Result);

            Assert.Equal("Producto no encontrado.", ((dynamic)notFoundResult.Value).Message);
        }

        [Fact]
        public async Task PostProduct_ReturnsCreatedProduct()
        {
            // Arrange
            InitializeDatabase();

            var productDTO = new CreateUpdateProductDTO
            {
                name = "Product 1",
                description = "Description 1",
                price = 100,
                quantity = 10,
                label = "Label 1",
                category = "Category 1",
                provider = "Provider 1"
            };

            var category = new Category { Category_Id = 1, Description = "Category 1" };
            var provider = new Provider { Provider_Id = 1, Name = "Provider 1", Email = "provider1@example.com", Phone = "123456789" };

            _context.Categories.Add(category);
            _context.Providers.Add(provider);
            _context.SaveChanges();

            try
            {
                // Act
                var result = await _controller.PostProduct(productDTO);

                // Assert
                var actionResult = Assert.IsType<ActionResult<ProductDTO>>(result);
                if (!(actionResult.Result is CreatedAtActionResult))
                {
                    var objectResult = actionResult.Result as ObjectResult;
                    var errorMessage = objectResult?.Value?.ToString() ?? "No error message";
                    Assert.True(false, $"Unexpected result type: {actionResult.Result.GetType().Name}, Error: {errorMessage}");
                }
                Assert.IsType<CreatedAtActionResult>(actionResult.Result);

                var createdAtActionResult = (CreatedAtActionResult)actionResult.Result;
                var returnedProduct = Assert.IsType<ProductDTO>(createdAtActionResult.Value);

                Assert.Equal(productDTO.name, returnedProduct.name);
                Assert.Equal(productDTO.description, returnedProduct.description);
                Assert.Equal(productDTO.price, returnedProduct.price);
                Assert.Equal(productDTO.quantity, returnedProduct.quantity);
                Assert.Equal(productDTO.label, returnedProduct.label);
            }
            catch (Exception ex)
            {
                Assert.True(false, ex.Message);
            }
        }

        [Fact]
        public async Task PutProduct_ReturnsNoContent()
        {
            // Arrange
            InitializeDatabase();

            var product = new Product
            {
                Product_Id = 2,
                State_Id = Constants.DEFAULT_STATE,
                Name = "Product 1",
                Description = "Description 1",
                Label = "Label 1",
                Economic_Value = 100,
                Quantity = 10,
                Category = new Category { Description = "Category 1" },
                Provider = new Provider { Name = "Provider 1", Email = "provider1@example.com", Phone = "123456789" }
            };

            _context.Products.Add(product);
            _context.SaveChanges();

            var updatedProductDTO = new CreateUpdateProductDTO
            {
                name = "Product 2",
                description = "Description 2",
                price = 200,
                quantity = 20,
                label = "Label 2",
                category = "Category 2",
                provider = "Provider 2"
            };

            var category = new Category { Category_Id = 2, Description = "Category 2" };
            var provider = new Provider { Provider_Id = 2, Name = "Provider 2", Email = "provider2@example.com", Phone = "987654321" };

            _context.Categories.Add(category);
            _context.Providers.Add(provider);
            _context.SaveChanges();

            // Act
            var result = await _controller.PutProduct(2, updatedProductDTO);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }


        [Fact]
        public async Task PatchProductState_UpdatesStateToInactive()
        {
            // Arrange
            InitializeDatabase();

            var product = new Product
            {
                Product_Id = 4,
                State_Id = Constants.DEFAULT_STATE,
                Name = "Product 1",
                Description = "Description 1",
                Label = "Label 1",
                Economic_Value = 100,
                Quantity = 10,
                Category = new Category { Description = "Category 1" },
                Provider = new Provider { Name = "Provider 1", Email = "provider1@example.com", Phone = "123456789" }
            };

            _context.Products.Add(product);
            _context.SaveChanges();

            // Act
            var result = await _controller.PatchProductState(4);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var updatedProduct = await _context.Products.FindAsync(4);

            Assert.Equal(Constants.STATE_INACTIVE, updatedProduct.State_Id);
        }
    }
}
