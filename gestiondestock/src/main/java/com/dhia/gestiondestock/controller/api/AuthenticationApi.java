package com.dhia.gestiondestock.controller.api;

import com.dhia.gestiondestock.dto.auth.AuthenticationRequest;
import com.dhia.gestiondestock.dto.auth.AuthenticationResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.dhia.gestiondestock.utils.Constants.AUTHENTICATION_ENDPOINT;

@Tag(name = "Authentication", description = "Endpoints pour l'authentification")
public interface AuthenticationApi {

    @Operation(summary = "Authentifier un utilisateur")
    @CrossOrigin(origins = "http://localhost:8080")
    @PostMapping(AUTHENTICATION_ENDPOINT + "/authenticate")
    ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request);
}
