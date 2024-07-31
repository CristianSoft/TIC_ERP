namespace backendfepon.ErrorsModels
{
    public class ErrorResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string Exception { get; set; }
        public List<ErrorDetail> Errors { get; set; } = new List<ErrorDetail>();
    }
}
