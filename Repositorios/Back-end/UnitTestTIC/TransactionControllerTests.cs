using AutoMapper;
using backendfepon.Controllers;
using backendfepon.Cypher;
using backendfepon.Data;
using backendfepon.DTOs.TransactionDTOs;
using backendfepon.ModelConfigurations.Profiles;
using backendfepon.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace UnitTestTIC
{
    public class TransactionControllerTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;
        private readonly TransactionController _controller;
        private readonly byte[] _key;
        private readonly byte[] _iv;

        public TransactionControllerTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(_options);

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<TransactionProfile>(); // Asegúrate de que tienes un perfil de AutoMapper para Transaction
            });

            _mapper = config.CreateMapper();

            // Configurar el logging
            var serviceProvider = new ServiceCollection()
                .AddLogging(builder => builder
                    .AddConsole()
                    .SetMinimumLevel(LogLevel.Information))
                .BuildServiceProvider();

            // Simulación de configuración para claves y IV
            var configuration = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string>
            {
                { "AESConfig:IV", Convert.ToBase64String(Encoding.UTF8.GetBytes("ThisIsA16ByteIV!")) },
                { "AESConfig:KEY", "ThisIsA32ByteKeyForAESConfigKey!!" }
            }).Build();

            _iv = Convert.FromBase64String(configuration["AESConfig:IV"]);
            _key = SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(configuration["AESConfig:KEY"]));

            _controller = new TransactionController(_context, configuration, _mapper);
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
        public async Task GetTransactions_ReturnsTransactions_WhenTransactionsExist()
        {
            // Arrange
            InitializeDatabase();

            var cypher = new CypherAES();

            var originAccount = new CAccountingAccount
            {
                Account_Id = 1,
                Account_Name = cypher.EncryptStringToBytes_AES("OriginAccount", _key, _iv),
                Current_Value = cypher.EncryptStringToBytes_AES("1000", _key, _iv),
                Accounting_Account_Status = cypher.EncryptStringToBytes_AES("Active", _key, _iv),
                Initial_Balance = cypher.EncryptStringToBytes_AES("1000", _key, _iv),
                Initial_Balance_Date = cypher.EncryptStringToBytes_AES(DateTime.Now.ToString("o"), _key, _iv)
            };

            var destinationAccount = new CAccountingAccount
            {
                Account_Id = 2,
                Account_Name = cypher.EncryptStringToBytes_AES("DestinationAccount", _key, _iv),
                Current_Value = cypher.EncryptStringToBytes_AES("2000", _key, _iv),
                Accounting_Account_Status = cypher.EncryptStringToBytes_AES("Active", _key, _iv),
                Initial_Balance = cypher.EncryptStringToBytes_AES("2000", _key, _iv),
                Initial_Balance_Date = cypher.EncryptStringToBytes_AES(DateTime.Now.ToString("o"), _key, _iv)
            };

            var transactionType = new TransactionType
            {
                Transaction_Type_Id = 1,
                Transaction_Type_Name = "Transfer"
            };

            var transaction = new Transaction
            {
                Transaction_Id = 1,
                TransactionType = transactionType,
                OriginAccount = originAccount,
                DestinationAccount = destinationAccount,
                Value = 500,
                Date = DateTime.Now,
                Reason = "Payment"
            };

            _context.CAccountinngAccounts.Add(originAccount);
            _context.CAccountinngAccounts.Add(destinationAccount);
            _context.TransactionTypes.Add(transactionType);
            _context.Transactions.Add(transaction);
            _context.SaveChanges();

            // Act
            var result = await _controller.GetTransactions();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<TransactionDTO>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnedTransactions = Assert.IsType<List<TransactionDTO>>(okResult.Value);

            Assert.Equal(1, returnedTransactions.Count);
        }

        [Fact]
        public async Task GetTransaction_ReturnsNotFound_WhenTransactionDoesNotExist()
        {
            // Arrange
            InitializeDatabase();

            // Act
            var result = await _controller.GetTransaction(100);

            // Assert
            var actionResult = Assert.IsType<ActionResult<TransactionDTO>>(result);
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(actionResult.Result);

            Assert.Equal(404, notFoundResult.StatusCode);
        }



        [Fact]
        public async Task PostTransaction_ReturnsCreatedTransaction()
        {
            // Arrange
            InitializeDatabase();

            var cypher = new CypherAES();

            var originAccount = new CAccountingAccount
            {
                Account_Id = 1,
                Account_Name = cypher.EncryptStringToBytes_AES("OriginAccount", _key, _iv),
                Current_Value = cypher.EncryptStringToBytes_AES("1000", _key, _iv),
                Accounting_Account_Status = cypher.EncryptStringToBytes_AES("Active", _key, _iv),
                Initial_Balance = cypher.EncryptStringToBytes_AES("1000", _key, _iv),
                Initial_Balance_Date = cypher.EncryptStringToBytes_AES(DateTime.Now.ToString("o"), _key, _iv)
            };

            var destinationAccount = new CAccountingAccount
            {
                Account_Id = 2,
                Account_Name = cypher.EncryptStringToBytes_AES("DestinationAccount", _key, _iv),
                Current_Value = cypher.EncryptStringToBytes_AES("2000", _key, _iv),
                Accounting_Account_Status = cypher.EncryptStringToBytes_AES("Active", _key, _iv),
                Initial_Balance = cypher.EncryptStringToBytes_AES("2000", _key, _iv),
                Initial_Balance_Date = cypher.EncryptStringToBytes_AES(DateTime.Now.ToString("o"), _key, _iv)
            };

            var transactionType = new TransactionType
            {
                Transaction_Type_Id = 1,
                Transaction_Type_Name = "Transfer"
            };

            _context.CAccountinngAccounts.Add(originAccount);
            _context.CAccountinngAccounts.Add(destinationAccount);
            _context.TransactionTypes.Add(transactionType);
            _context.SaveChanges();

            var transactionDTO = new CreateUpdateTransactionDTO
            {
                transactionType = "Transfer",
                date = DateTime.Now,
                originAccount = "OriginAccount",
                destinationAccount = "DestinationAccount",
                value = 500,
                description = "Payment"
            };

            // Act
            var result = await _controller.PostTransaction(transactionDTO);

            // Assert
            var actionResult = Assert.IsType<ActionResult<TransactionDTO>>(result);
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            var returnedTransaction = Assert.IsType<TransactionDTO>(createdAtActionResult.Value);

            Assert.Equal(transactionDTO.originAccount, returnedTransaction.originAccount);
            Assert.Equal(transactionDTO.destinationAccount, returnedTransaction.destinationAccount);
            Assert.Equal(transactionDTO.value, returnedTransaction.value);
        }
    }
}
