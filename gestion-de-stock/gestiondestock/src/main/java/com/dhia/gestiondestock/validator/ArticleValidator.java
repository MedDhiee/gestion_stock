package com.dhia.gestiondestock.validator;

import com.dhia.gestiondestock.dto.ArticleDto;
import com.dhia.gestiondestock.dto.UtilisateurDto;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class ArticleValidator {
    public static List<String> validate(ArticleDto dto){
        List<String> errors = new ArrayList<>();

        if(dto == null){
            errors.add("Veuillez renseigner la référence de l'article");
            errors.add("Veuillez renseigner le prénom de l'article");
            errors.add("Veuillez renseigner le prix d'achat de l'article");
            errors.add("Veuillez renseigner le prix de vente de l'article");
            errors.add("Veuillez selectionner une categorie");
            return errors;
        }
        if (!StringUtils.hasLength(dto.getCodeArticle())){
            errors.add("Veuillez renseigner la référence de l'article");
        }
        if (dto.getIn_stock() == null){
            errors.add("Veuillez renseigner le prénom de l'article");
        }

        if (dto.getPrixAchat() == null){
            errors.add("Veuillez renseigner le prix d'achat de l'article");
        }
        if (dto.getPrixVente() == null){
            errors.add("Veuillez renseigner le prix de vente de l'article");
        }
        if (dto.getCategory() == null){
            errors.add("Veuillez selectionner une categorie");
        }
        return errors;
    }
}
