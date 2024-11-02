using System.Text;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace API.Services;

public class CredentialsGeneratorService : ICredentialsGeneratorService
{
    private readonly UserManager<User> _userManager;

    public CredentialsGeneratorService(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task<string> GenerateLogin(string firstName, string lastName)
    {
        var transliteratedFirstName = TransliterateToLatin(firstName).Substring(0, 1);
        var transliteratedLastName = TransliterateToLatin(lastName);

        var random = new Random();
        string login;
        int randomNumbers;

        do
        {
            randomNumbers = random.Next(1000, 9999);
            login = $"{transliteratedFirstName.ToLower()}_{transliteratedLastName.ToLower()}{randomNumbers}";
        } while (await _userManager.FindByNameAsync(login) != null);

        return login;
    }

    private string TransliterateToLatin(string text)
    {
        var transliterationMap = new Dictionary<char, string>
        {
            {'А', "A"}, {'Б', "B"}, {'В', "V"}, {'Г', "H"}, {'Ґ', "G"}, {'Д', "D"}, {'Е', "E"}, {'Є', "Ye"}, {'Ж', "Zh"}, {'З', "Z"}, 
            {'И', "Y"}, {'І', "I"}, {'Ї', "Yi"}, {'Й', "Y"}, {'К', "K"}, {'Л', "L"}, {'М', "M"}, {'Н', "N"}, {'О', "O"}, {'П', "P"}, 
            {'Р', "R"}, {'С', "S"}, {'Т', "T"}, {'У', "U"}, {'Ф', "F"}, {'Х', "Kh"}, {'Ц', "Ts"}, {'Ч', "Ch"}, {'Ш', "Sh"}, {'Щ', "Shch"}, 
            {'Ю', "Yu"}, {'Я', "Ya"},
            {'а', "a"}, {'б', "b"}, {'в', "v"}, {'г', "h"}, {'ґ', "g"}, {'д', "d"}, {'е', "e"}, {'є', "ie"}, {'ж', "zh"}, {'з', "z"}, 
            {'и', "y"}, {'і', "i"}, {'ї', "i"}, {'й', "i"}, {'к', "k"}, {'л', "l"}, {'м', "m"}, {'н', "n"}, {'о', "o"}, {'п', "p"}, 
            {'р', "r"}, {'с', "s"}, {'т', "t"}, {'у', "u"}, {'ф', "f"}, {'х', "kh"}, {'ц', "ts"}, {'ч', "ch"}, {'ш', "sh"}, {'щ', "shch"}, 
            {'ю', "iu"}, {'я', "ia"}
        };

        var transliteratedText = new StringBuilder();
        foreach (var c in text)
        {
            if (transliterationMap.ContainsKey(c))
            {
                transliteratedText.Append(transliterationMap[c]);
            }
            else
            {
                transliteratedText.Append(c);
            }
        }
        return transliteratedText.ToString();
    }
}
