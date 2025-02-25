package com.dhia.gestiondestock.validator;

import com.dhia.gestiondestock.dto.CategoryDto;
import com.dhia.gestiondestock.dto.UtilisateurDto;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class UtilisateurValidator {
    public static List<String> validate(UtilisateurDto utilisateurDto){
        List<String> errors = new ArrayList<>();
        if (utilisateurDto == null || !StringUtils.hasLength(utilisateurDto.getNom())){
            errors.add("Veuillez renseigner le nom d'utilisateur");
        }
        if (utilisateurDto == null || !StringUtils.hasLength(utilisateurDto.getPrenom())){
            errors.add("Veuillez renseigner le prénom d'utilisateur");
        }
        if (utilisateurDto == null || !StringUtils.hasLength(utilisateurDto.getMotdepasse())){
            errors.add("Veuillez renseigner le mot de passe d'utilisateur");
        }
        if (utilisateurDto == null || !StringUtils.hasLength(utilisateurDto.getEmail())){
            errors.add("Veuillez renseigner l'email d'utilisateur");
        }
        return errors;
    }
}
