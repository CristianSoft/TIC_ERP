
using AutoMapper;
using backendfepon.Controllers;
using backendfepon.Data;
using backendfepon.DTOs.EventDTOs;
using backendfepon.ModelConfigurations.Profiles;
using backendfepon.Models;
using backendfepon.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Resources;
using System.Text;
using System.Threading.Tasks;

namespace UnitTestTIC
{
    public class EventControllerTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;
        private readonly EventController _controller;

        public EventControllerTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(_options);

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<EventProfile>(); // Asegúrate de que tienes un perfil de AutoMapper para Event
            });

            _mapper = config.CreateMapper();

            // Configurar el logging
            var serviceProvider = new ServiceCollection()
                .AddLogging(builder => builder
                    .AddConsole()
                    .SetMinimumLevel(LogLevel.Information))
                .BuildServiceProvider();

            _controller = new EventController(_context, _mapper);
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
        public async Task GetEvents_ReturnsEvents_WhenEventsExist()
        {
            // Arrange
            InitializeDatabase();

            var state = new EventState { Event_State_Id = 1, Event_State_Name = "Active" };
            var budgetStatus = new FinancialRequestState { Request_State_Id = 1, State_Description = "Approved" };
            var state_state = new State { State_Id = 1, State_Name = "Inactivo" };

            var financialRequest = new FinancialRequest
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
                Event_Id = 1,
                Event_Status_Id = Constants.DEFAULT_STATE,
                Title = "Event 1",
                Description = "Description 1",
                Start_Date = DateTime.Now,
                End_Date = DateTime.Now.AddDays(1),
                State = state,
                State_State = state_state,
                Financial_Request = financialRequest,
                Financial_Request_Id = financialRequest.Request_Id,
                Event_Location = "Location 1",
                Income = 5000,
                Budget_Status = budgetStatus.State_Description
            };

            _context.EventStates.Add(state);
            _context.FinancialRequestStates.Add(budgetStatus);
            _context.States.Add(state_state);
            _context.FinancialRequests.Add(financialRequest);
            _context.Events.Add(event1);
            _context.SaveChanges();

            // Act
            var result = await _controller.GetEvents();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<EventDTO>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnedEvents = Assert.IsType<List<EventDTO>>(okResult.Value);

            Assert.Equal(1,returnedEvents.Count);
        }


        [Fact]
        public async Task PutEvent_ReturnsNoContent()
        {
            // Arrange
            InitializeDatabase();

            var state = new EventState { Event_State_Id = 1, Event_State_Name = "Active" };
            var budgetStatus = new FinancialRequestState { Request_State_Id = 1, State_Description = "Approved" };
            var state_state = new State { State_Id = 1, State_Name = "Inactivo" };

            var financialRequest = new FinancialRequest
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
                Financial_Request = financialRequest,
                Financial_Request_Id = financialRequest.Request_Id,
                Event_Location = "Location 1",
                Income = 5000,
                Budget_Status = budgetStatus.State_Description
            };

            _context.EventStates.Add(state);
            _context.FinancialRequestStates.Add(budgetStatus);
            _context.States.Add(state_state);
            _context.FinancialRequests.Add(financialRequest);
            _context.Events.Add(event1);
            _context.SaveChanges();

            var updatedEventDTO = new CreateUpdateEventDTO
            {
                title = "Updated Event",
                status = "Active",
                description = "Updated Description",
                startDate = DateTime.Now.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture),
                endDate = DateTime.Now.AddDays(1).ToString("dd/MM/yyyy", CultureInfo.InvariantCulture),
                budget = 2000,
                budgetStatus = "Approved",
                location = "Updated Location",
                income = 6000
            };

            // Act
            var result = await _controller.PutEvent(2, updatedEventDTO);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }



        [Fact]
        public async Task PostEvent_ReturnsCreatedEvent()
        {
            // Arrange
            InitializeDatabase();

            var state = new EventState { Event_State_Id = 1, Event_State_Name = "Active" };
            var budgetStatus = new FinancialRequestState { Request_State_Id = 1, State_Description = "Approved" };
            var state_state = new State { State_Id = 1, State_Name = "Inactivo" };

            _context.EventStates.Add(state);
            _context.FinancialRequestStates.Add(budgetStatus);
            _context.States.Add(state_state);
            _context.SaveChanges();

            var eventDTO = new CreateUpdateEventDTO
            {
                title = "New Event",
                status = "Active",
                description = "Event Description",
                startDate = DateTime.Now.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture),
                endDate = DateTime.Now.AddDays(1).ToString("dd/MM/yyyy", CultureInfo.InvariantCulture),
                budget = 3000,
                budgetStatus = "Approved",
                location = "Event Location",
                income = 3000
            };

            // Act
            var result = await _controller.PostEvent(eventDTO);

            // Assert
            var actionResult = Assert.IsType<ActionResult<EventDTO>>(result);
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            var returnedEvent = Assert.IsType<EventDTO>(createdAtActionResult.Value);

            Assert.Equal(eventDTO.title, returnedEvent.title);
            Assert.Equal(eventDTO.description, returnedEvent.description);
            Assert.Equal(eventDTO.budget, returnedEvent.budget);
            Assert.Equal(eventDTO.location, returnedEvent.location);
            Assert.Equal(eventDTO.status, returnedEvent.status);
        }


        [Fact]
        public async Task PatchEventState_UpdatesStateToInactive()
        {
            // Arrange
            InitializeDatabase();

            var state = new EventState { Event_State_Id = 1, Event_State_Name = "Active" };
            var budgetStatus = new FinancialRequestState { Request_State_Id = 1, State_Description = "Approved" };
            var state_state = new State { State_Id = 1, State_Name = "Inactivo" };

            var financialRequest = new FinancialRequest
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
                Event_Id = 4,
                Event_Status_Id = Constants.DEFAULT_STATE,
                Title = "Event 1",
                Description = "Description 1",
                Start_Date = DateTime.Now,
                End_Date = DateTime.Now.AddDays(1),
                State = state,
                State_State = state_state,
                Financial_Request = financialRequest,
                Financial_Request_Id = financialRequest.Request_Id,
                Event_Location = "Location 1",
                Income = 5000,
                Budget_Status = budgetStatus.State_Description
            };

            _context.EventStates.Add(state);
            _context.FinancialRequestStates.Add(budgetStatus);
            _context.States.Add(state_state);
            _context.FinancialRequests.Add(financialRequest);
            _context.Events.Add(event1);
            _context.SaveChanges();

            // Act
            var result = await _controller.PatchEventState(4);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var updatedEvent = await _context.Events.FindAsync(4);

            Assert.Equal(Constants.STATE_INACTIVE, updatedEvent.Event_Status_Id);
        }

    }
}
