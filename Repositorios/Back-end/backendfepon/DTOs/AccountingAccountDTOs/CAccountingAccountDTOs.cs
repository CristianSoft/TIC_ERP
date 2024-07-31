namespace backendfepon.DTOs.AccountingAccountDTOs
{
    public class CAccountingAccountDTOs
    {
        public int Account_Id { get; set; }
        public string Account_Type_Name { get; set; }
        public byte[] Account_Name { get; set; }
        public byte[] Current_Value { get; set; }
        public byte[] Initial_Balance_Date { get; set; }
        public byte[] Initial_Balance { get; set; }
        public byte[] Accounting_Account_Status { get; set; }
    }
}
