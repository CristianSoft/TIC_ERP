using AutoMapper;
using backendfepon.Controllers;
using backendfepon.Data;
using backendfepon.DTOs.FinantialRequestDTOs;
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
    public class FinantialRequestControllerTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;
        private readonly FinantialRequestController _controller;

        public FinantialRequestControllerTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(_options);

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<FinancialRequestProfile>(); // Asegúrate de que tienes un perfil de AutoMapper para FinancialRequest
            });

            _mapper = config.CreateMapper();

            // Configurar el logging
            var serviceProvider = new ServiceCollection()
                .AddLogging(builder => builder
                    .AddConsole()
                    .SetMinimumLevel(LogLevel.Information))
                .BuildServiceProvider();

            _controller = new FinantialRequestController(_context, _mapper);
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
        public async Task GetFinantialRequests_ReturnsRequests_WhenRequestsExist()
        {
            // Arrange
            InitializeDatabase();
            var state = new EventState { Event_State_Id = 1, Event_State_Name = "Active" };
            var budgetStatus = new FinancialRequestState { Request_State_Id = 1, State_Description = "Approved" };
            var state_state = new State { State_Id = 1, State_Name = "Inactivo" };

            var financialRequestevent = new FinancialRequest
            {
                Request_Id = 1,
                Request_Status_Id = budgetStatus.Request_State_Id,
                Financial_Request_State = budgetStatus,
                Value = 1000,
                State_Id = Constants.DEFAULT_STATE,
                Reason = "Prueba"
            };
            var event1 = new Event
            {
                Event_Id = 2,
                Event_Status_Id = Constants.DEFAULT_STATE,
                Title = "Event 1",
                Description = "Description 1",
                Start_Date = DateTime.Now,
                End_Date = DateTime.Now.AddDays(1),
                State = state,
                State_State = state_state,
                Financial_Request = financialRequestevent,
                Financial_Request_Id = financialRequestevent.Request_Id,
                Event_Location = "Location 1",
                Income = 5000,
                Budget_Status = budgetStatus.State_Description
            };

            var financialRequest = new FinancialRequest
            {
                Request_Id = 2,
                Request_Status_Id = budgetStatus.Request_State_Id,
                Financial_Request_State = budgetStatus,
                Value = 1000,
                State_Id = Constants.DEFAULT_STATE,
                Reason = "Reason 1",
                Events = event1
            };

            _context.FinancialRequestStates.Add(budgetStatus);
            _context.Events.Add(event1);
            _context.FinancialRequests.Add(financialRequest);
            _context.SaveChanges();

            // Act
            var result = await _controller.GetFinantialRequests();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<FinantialRequestDTO>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnedRequests = Assert.IsType<List<FinantialRequestDTO>>(okResult.Value);

            Assert.Equal(2,returnedRequests.Count);

        }

        [Fact]
        public async Task PutFinantialRequest_ReturnsNoContent()
        {
            // Arrange
            InitializeDatabase();
            var state = new EventState { Event_State_Id = 1, Event_State_Name = "Active" };
            var budgetStatus = new FinancialRequestState { Request_State_Id = 1, State_Description = "Approved" };
            var state_state = new State { State_Id = 1, State_Name = "Inactivo" };
            var financialRequestevent = new FinancialRequest
            {
                Request_Id = 1,
                Request_Status_Id = budgetStatus.Request_State_Id,
                Financial_Request_State = budgetStatus,
                Value = 1000,
                State_Id = Constants.DEFAULT_STATE,
                Reason = "Prueba"
            };
            var event1 = new Event {
                Event_Id = 2,
                Event_Status_Id = Constants.DEFAULT_STATE,
                Title = "Event 1",
                Description = "Description 1",
                Start_Date = DateTime.Now,
                End_Date = DateTime.Now.AddDays(1),
                State = state,
                State_State = state_state,
                Financial_Request = financialRequestevent,
                Financial_Request_Id = financialRequestevent.Request_Id,
                Event_Location = "Location 1",
                Income = 5000,
                Budget_Status = budgetStatus.State_Description
            };

            var financialRequest = new FinancialRequest
            {
                Request_Id = 2,
                Request_Status_Id = budgetStatus.Request_State_Id,
                Financial_Request_State = budgetStatus,
                Value = 1000,
                State_Id = Constants.DEFAULT_STATE,
                Reason = "Reason 1",
                Events = event1
            };

            _context.FinancialRequestStates.Add(budgetStatus);
            _context.Events.Add(event1);
            _context.FinancialRequests.Add(financialRequest);
            _context.SaveChanges();

            var updatedRequestDTO = new CreateUpdateFinantialRequestDTO
            {
                eventName = "Event 1",
                requestStatusName = "Approved",
                value = 2000,
                reason = "Updated Reason"
            };

            // Act
            var result = await _controller.PutFinantialRequest(2, updatedRequestDTO);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

    }
}

