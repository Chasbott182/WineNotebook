package com.chasbott.winenotebook.controller;

import com.chasbott.winenotebook.dto.AppSettingsDto;
import com.chasbott.winenotebook.dto.AppSettingsDto.PersonalProfileDto;
import com.chasbott.winenotebook.dto.AppSettingsDto.SecuritySettingsDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for managing application settings:
 * - Personal user information
 * - Web application security policies
 * - Adding and removing cellar locations
 * - Light / Dark theme preference
 */
@RestController
@RequestMapping("/wine")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4200", "http://localhost:5173"})
public class SettingsController {

    private String theme = "dark";

    private PersonalProfileDto profile = new PersonalProfileDto(
        "Charles Bott",
        "chasman182@gmail.com",
        "Certified Sommelier & Collector",
        "Napa Valley, CA",
        "Cabernet Sauvignon",
        "Curating structured reds and mineral-driven whites across temperature-controlled cellar zones."
    );

    private SecuritySettingsDto security = new SecuritySettingsDto(
        true,
        30,
        false,
        "1820",
        true,
        true,
        true
    );

    private final List<String> cellarLocations = new ArrayList<>(List.of(
        "Main Cellar - Rack A1",
        "Wine Fridge (55°F)",
        "Aging Vault",
        "Dining Room Credenza"
    ));

    @GetMapping("/settings")
    public ResponseEntity<AppSettingsDto> getSettings() {
        return ResponseEntity.ok(new AppSettingsDto(theme, profile, security, cellarLocations));
    }

    @PutMapping("/settings")
    public ResponseEntity<AppSettingsDto> updateSettings(@RequestBody AppSettingsDto updated) {
        if (updated.theme() != null) {
            this.theme = updated.theme();
        }
        if (updated.profile() != null) {
            this.profile = updated.profile();
        }
        if (updated.security() != null) {
            this.security = updated.security();
        }
        return ResponseEntity.ok(new AppSettingsDto(theme, profile, security, cellarLocations));
    }

    @GetMapping("/cellar-locations")
    public ResponseEntity<List<String>> getCellarLocations() {
        return ResponseEntity.ok(cellarLocations);
    }

    @PostMapping("/cellar-locations")
    public ResponseEntity<List<String>> addCellarLocation(@RequestBody Map<String, String> body) {
        String location = body.getOrDefault("location", "").trim();
        if (!location.isEmpty() && cellarLocations.stream().noneMatch(l -> l.equalsIgnoreCase(location))) {
            cellarLocations.add(location);
        }
        return new ResponseEntity<>(cellarLocations, HttpStatus.CREATED);
    }

    @DeleteMapping("/cellar-locations/{location}")
    public ResponseEntity<List<String>> removeCellarLocation(@PathVariable("location") String location) {
        if (cellarLocations.size() > 1) {
            cellarLocations.removeIf(l -> l.equalsIgnoreCase(location.trim()));
        }
        return ResponseEntity.ok(cellarLocations);
    }
}
