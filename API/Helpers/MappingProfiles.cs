using API.Dtos;
using API.Models;
using AutoMapper;

namespace API.Helpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Department, DepartmentDto>();

        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Login, opt => opt.MapFrom(src => src.UserName))
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
            .ForMember(dest => dest.MiddleName, opt => opt.MapFrom(src => src.MiddleName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.Documents, opt => opt.MapFrom(src => src.Documents))
            .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.Department));

        CreateMap<AddUserDto, User>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Login))
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
            .ForMember(dest => dest.MiddleName, opt => opt.MapFrom(src => src.MiddleName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email));

        CreateMap<DocumentToUser, DocumentToUserDto>()
            .ForMember(dest => dest.DocumentName, opt => opt.MapFrom(src => src.Document.Name))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
            .ForMember(dest => dest.RequestDate, opt => opt.MapFrom(src => src.RequestDate))
            .ForMember(dest => dest.ReceivedDate, opt => opt.MapFrom(src => src.ReceivedDate));
        
        CreateMap<DocumentToUser, DocumentStatusDto>()
            .ForMember(dest => dest.DocumentId, opt => opt.MapFrom(src => src.DocumentId))
            .ForMember(dest => dest.DocumentName, opt => opt.MapFrom(src => src.Document.Name))
            .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => src.Document.Department.Name))
            .ForMember(dest => dest.RequestDate, opt => opt.MapFrom(src => src.RequestDate))
            .ForMember(dest => dest.ExpectedReceivingDate, opt => opt.MapFrom(src => src.ExpectedReceivingDate))
            .ForMember(dest => dest.ReceivedDate, opt => opt.MapFrom(src => src.ReceivedDate))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));
    }
}
