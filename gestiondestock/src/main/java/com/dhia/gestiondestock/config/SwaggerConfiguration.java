package com.dhia.gestiondestock.config;


import java.util.Collections;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfiguration {
    public static final String AUTHORIZATION_HEADER = "Authorization";

    @Bean
    public Docket api() {//C'est une méthode publique qui retourne un objet de type Docket.
        // Docket est une classe fournie par Swagger pour configurer la génération de la documentation de l'API.
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(
                        new ApiInfoBuilder()
                                .description("Gestion de stock API documentation")
                                .title("Gestion de stock REST API")
                                .build()
                )
                .groupName("REST API V1")
                //les requetes sont besoin d'une authentification pour qu'ils s'executent
                .securityContexts(Collections.singletonList(securityContext()))
                .securitySchemes(Collections.singletonList(apiKey()))
                .useDefaultResponseMessages(false)
                //commence la configuration des règles de sélection des endpoints à documenter.
                .select()
                //Cela spécifie que seuls les endpoints situés dans le package "com.dhia.gestiondestock" seront documentés.
                .apis(RequestHandlerSelectors.basePackage("com.dhia.gestiondestock"))
                //Cela spécifie que tous les endpoints seront inclus dans la documentation sans filtre.
                .paths(PathSelectors.any())
                .build();
    }
    private ApiKey apiKey() {
        return new ApiKey("JWT", AUTHORIZATION_HEADER, "header");
    }

    private SecurityContext securityContext() {
        return SecurityContext.builder()
                .securityReferences(defaultAuth())
                .build();
    }

    List<SecurityReference> defaultAuth() {
        AuthorizationScope authorizationScope
                = new AuthorizationScope("global", "accessEverything");
        AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
        authorizationScopes[0] = authorizationScope;
        return Collections.singletonList(
                new SecurityReference("JWT", authorizationScopes));
    }

}
