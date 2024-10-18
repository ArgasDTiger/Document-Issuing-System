namespace API.Helpers;

public class Response(int statusCode, string? message = null)
{
    public int StatusCode { get; set; } = statusCode;
    public string? Message { get; set; } = message;
}