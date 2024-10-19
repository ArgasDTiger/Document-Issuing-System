namespace API.Interfaces;

public interface ICredentialsGeneratorService
{
    Task<string> GenerateLogin(string firstName, string lastName);
}