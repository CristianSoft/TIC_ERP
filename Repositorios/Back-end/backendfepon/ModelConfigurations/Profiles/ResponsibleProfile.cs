using AutoMapper;
using backendfepon.DTOs.ResponsibleDTOs;
using backendfepon.Models;

namespace backendfepon.ModelConfigurations.Profiles
{
    public class ResponsibleProfile : Profile
    {
        public ResponsibleProfile()
        {
            // Mapping from Responsible to ResponsibleDTO
            CreateMap<Responsible, ResponsibleDTO>()
                .ForMember(dest => dest.AdministrativeMember_Name, opt => opt.MapFrom(src => src.AdministrativeMember.Name + ' ' + src.AdministrativeMember.Last_Name))
                .ForMember(dest => dest.Event_Name, opt => opt.MapFrom(src => src.Event.Title));

            // Mapping from CreateUpdateResponsibleDTO to Responsible
            CreateMap<CreateUpdateResponsibleDTO, Responsible>()
                .ForMember(dest => dest.Administrative_Member_Id, opt => opt.Ignore())
                .ForMember(dest => dest.Event_Id, opt => opt.Ignore());
        }
    }
}
