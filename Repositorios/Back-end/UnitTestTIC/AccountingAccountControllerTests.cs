using AutoMapper;
using backendfepon.Controllers;
using backendfepon.Cypher;
using backendfepon.Data;
using backendfepon.DTOs.AccountingAccountDTOs;
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
    public class AccountingAccountControllerTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly ApplicationDbContext _context;
        private readonly AccountingAccountController _controller;
        private readonly byte[] _key;
        private readonly byte[] _iv;

        public AccountingAccountControllerTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(_options);

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

            _controller = new AccountingAccountController(_context, configuration, null);
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
        public async Task GetAccountingAccounts_ReturnsAccounts_WhenAccountsExist()
        {
            // Arrange
            InitializeDatabase();

            var cypher = new CypherAES();

            var accountType = new AccountType
            {
                Account_Type_Id = 1,
                Account_Type_Name = "Assets"
            };

            var account = new CAccountingAccount
            {
                Account_Id = 1,
                Account_Name = cypher.EncryptStringToBytes_AES("Account1", _key, _iv),
                Current_Value = cypher.EncryptStringToBytes_AES("1000", _key, _iv),
                Accounting_Account_Status = cypher.EncryptStringToBytes_AES("Active", _key, _iv),
                Initial_Balance = cypher.EncryptStringToBytes_AES("1000", _key, _iv),
                Initial_Balance_Date = cypher.EncryptStringToBytes_AES(DateTime.Now.ToString("o"), _key, _iv),
                AccountType = accountType
            };

            _context.AccountTypes.Add(accountType);
            _context.CAccountinngAccounts.Add(account);
            _context.SaveChanges();

            // Act
            var result = await _controller.GetAccountingAccounts();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<AccountingAccountDTO>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnedAccounts = Assert.IsType<List<AccountingAccountDTO>>(okResult.Value);

            Assert.Single(returnedAccounts);
        }

        [Fact]
        public async Task GetAccountingAccount_ReturnsNotFound_WhenAccountDoesNotExist()
        {
            // Arrange
            InitializeDatabase();

            // Act
            var result = await _controller.GetAccountingAccount(100);

            // Assert
            var actionResult = Assert.IsType<ActionResult<AccountingAccountDTO>>(result);
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(actionResult.Result);

            Assert.Equal(404, notFoundResult.StatusCode);
        }

        [Fact]
        public async Task PostAccountingAccount_ReturnsCreatedAccount()
        {
            // Arrange
            InitializeDatabase();

            var cypher = new CypherAES();

            var accountType = new AccountType
            {
                Account_Type_Id = 1,
                Account_Type_Name = "Assets"
            };

            _context.AccountTypes.Add(accountType);
            _context.SaveChanges();

            var accountDTO = new CreateUpdateAccountingAccountDTO
            {
                accountName = "Account1",
                accountType = "Assets",
                currentValue = 1000,
                date = DateTime.Now.ToString("o"),
                initialBalance = 1000
            };

            // Act
            var result = await _controller.PostAccountingAccount(accountDTO);

            // Assert
            var actionResult = Assert.IsType<ActionResult<AccountingAccountDTO>>(result);
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            var returnedAccount = Assert.IsType<AccountingAccountDTO>(createdAtActionResult.Value);

            Assert.Equal(accountDTO.accountName, returnedAccount.accountName);
            Assert.Equal(accountDTO.accountType, returnedAccount.accountType);
            Assert.Equal(accountDTO.currentValue, returnedAccount.currentValue);
        }

    }
}
