package com.dhia.gestiondestock.dto;

import com.dhia.gestiondestock.model.Utilisateur;
import lombok.Builder;
import lombok.Data;

import javax.persistence.Column;
import java.util.List;
import java.util.stream.Collectors;

@Builder
@Data
public class UtilisateurDto {
    private Integer id;
    private String nom;
    private String prenom;
    private String email;
    private String motdepasse;
    private String photo;
    private List<RolesDto> roles;
    public static UtilisateurDto fromEntity(Utilisateur utilisateur){
        if(utilisateur==null){
            return null;
        }
        return UtilisateurDto.builder()
                .id(utilisateur.getId())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .email(utilisateur.getEmail())
                .motdepasse(utilisateur.getMotdepasse())
                .photo(utilisateur.getPhoto())
                .roles(
                        utilisateur.getRoles() != null ?
                                utilisateur.getRoles().stream()
                                        .map(RolesDto::fromEntity)
                                        .collect(Collectors.toList()) : null
                )
                .build();
    }
    public static Utilisateur toEntity(UtilisateurDto utilisateurDto){
        if(utilisateurDto==null){
            return null;
        }
        Utilisateur utilisateur=new Utilisateur();
        utilisateur.setId(utilisateurDto.getId());
        utilisateur.setNom(utilisateurDto.getNom());
        utilisateur.setPrenom(utilisateurDto.getPrenom());
        utilisateur.setEmail(utilisateurDto.getEmail());
        utilisateur.setMotdepasse(utilisateurDto.getMotdepasse());
        utilisateur.setPhoto(utilisateurDto.getPhoto());
        return utilisateur;
    }
}
