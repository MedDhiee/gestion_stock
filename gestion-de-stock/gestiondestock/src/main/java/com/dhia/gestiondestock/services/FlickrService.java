package com.dhia.gestiondestock.services;

import java.io.InputStream;

//flickr permet d'enregistrer les images sur le cloud
public interface FlickrService {
    String savePhoto(InputStream photo, String title);

}
