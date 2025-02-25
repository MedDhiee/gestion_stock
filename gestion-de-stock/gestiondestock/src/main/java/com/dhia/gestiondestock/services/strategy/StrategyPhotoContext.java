package com.dhia.gestiondestock.services.strategy;

import com.dhia.gestiondestock.exception.ErrorCodes;
import com.dhia.gestiondestock.exception.InvalidOperationException;
import com.flickr4java.flickr.FlickrException;
import java.io.InputStream;
import lombok.Setter;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StrategyPhotoContext {

    private BeanFactory beanFactory;
    private Strategy strategy;
    @Setter
    private String context;

    @Autowired
    public StrategyPhotoContext(BeanFactory beanFactory) {
        this.beanFactory = beanFactory;
    }

    public Object savePhoto(String context, Integer id, InputStream photo, String title) throws FlickrException {
        determinContext(context);
        return strategy.savePhoto(id, photo, title);
    }

    private void determinContext(String context) {
        final String beanName = context + "Strategy";
        switch (context) {
            case "article":
                strategy = beanFactory.getBean(beanName, SaveArticlePhoto.class);
                break;
            case "utilisateur":
                strategy = beanFactory.getBean(beanName, SaveUtilisateurPhoto.class);
                break;
            default:
                throw new InvalidOperationException("Contexte inconnue pour l'enregistrement de la photo", ErrorCodes.UNKNOWN_CONTEXT);
        }
    }
}