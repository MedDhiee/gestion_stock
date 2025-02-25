package com.dhia.gestiondestock.config;

import com.flickr4java.flickr.Flickr;
import com.flickr4java.flickr.FlickrException;
import com.flickr4java.flickr.REST;
import com.flickr4java.flickr.RequestContext;
import com.flickr4java.flickr.auth.Auth;
import com.flickr4java.flickr.auth.Permission;
import com.github.scribejava.apis.FlickrApi;
import com.github.scribejava.apis.FlickrApi.FlickrPerm;
import com.github.scribejava.core.builder.ServiceBuilder;
import com.github.scribejava.core.model.OAuth1AccessToken;
import com.github.scribejava.core.model.OAuth1RequestToken;
import com.github.scribejava.core.oauth.OAuth10aService;
import java.io.IOException;
import java.util.Scanner;
import java.util.concurrent.ExecutionException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//flickr est une api fourni par yahoo pour stocker les photos en utilisant leur api qui supporte plusieurs langages(comme gallerie de photos sur cloud)

//@Configuration // Cette annotation indique à Spring que cette classe contient des méthodes de configuration des beans.
public class FlickrConfiguration {

    //@value est utilisée pour injecter les valeurs des propriétés dans le fichier de configuration "application.yml"
    @Value("${flickr.apiKey}")
    private String apiKey;

    @Value("${flickr.apiSecret}")
    private String apiSecret;
    @Value("${flickr.appKey}")
    private String appKey;

    @Value("${flickr.appSecret}")
    private String appSecret;

    /* @Bean
    public Flickr getFlickr() throws InterruptedException, ExecutionException, IOException, FlickrException {
        Flickr flickr = new Flickr(apiKey, apiSecret, new REST());

        OAuth10aService service = new ServiceBuilder(apiKey)
                .apiSecret(apiSecret)
                .build(FlickrApi.instance(FlickrPerm.DELETE));

        final Scanner scanner = new Scanner(System.in);

        final OAuth1RequestToken request = service.getRequestToken();

        final String authUrl = service.getAuthorizationUrl(request);

        System.out.println(authUrl);
        System.out.println("Paste it here >> ");

        final String authVerifier = scanner.nextLine();

        OAuth1AccessToken accessToken = service.getAccessToken(request, authVerifier);

        System.out.println(accessToken.getToken());
        System.out.println(accessToken.getTokenSecret());

        Auth auth = flickr.getAuthInterface().checkToken(accessToken);

        System.out.println("---------------------------");
        System.out.println(auth.getToken());
        System.out.println(auth.getTokenSecret());

        return flickr;
    }*/

    //les beans dans Spring sont comme les ateliers dans une usine :
    //ils sont responsables de créer et de gérer différentes parties de votre application, facilitent la gestion des dépendances et de la configuration
    //Injection de dépendances : Supposons que l'atelier de fabrication des voitures ait besoin des moteurs et des roues pour assembler une voiture complète.
    // Au lieu de fabriquer ces pièces eux-mêmes, ils dépendent des ateliers spécialisés (les beans) pour les fournir. C'est ce que fait Spring : il gère automatiquement les dépendances entre les différentes parties de votre application.
    @Bean
    public Flickr getFlickr2() {    //Cette méthode est annotée avec @Bean, ce qui signifie qu'elle retourne un bean géré par Spring.
        //pour acceder à mon api ,on crée un flickr :
        Flickr flickr = new Flickr(apiKey, apiSecret, new REST());
        Auth auth = new Auth();
        auth.setPermission(Permission.READ);
        ///pour securiser mon api ,on crée un token :
        auth.setToken(appKey);
        auth.setTokenSecret(appSecret);
        RequestContext requestContext = RequestContext.getRequestContext();
        requestContext.setAuth(auth);
        flickr.setAuth(auth);
        return flickr;
    }
}
