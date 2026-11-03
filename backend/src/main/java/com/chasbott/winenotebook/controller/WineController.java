package com.chasbott.winenotebook.controller;

import com.chasbott.winenotebook.dto.WineRequest;
import com.chasbott.winenotebook.dto.WineResponse;
import com.chasbott.winenotebook.service.WineService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing Wine Notebook endpoints.
 * Adheres to SRP by handling HTTP request mapping, validation status, and response encapsulation.
 * Adheres to DIP by relying on the abstract WineService interface.
 */
@RestController
@RequestMapping("/wine")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4200", "http://localhost:5173"})
public class WineController {

    private final WineService wineService;

    public WineController(WineService wineService) {
        this.wineService = wineService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<WineResponse>> getAllWine() {
        List<WineResponse> wines = wineService.findAllWines();
        return ResponseEntity.ok(wines);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<WineResponse> getWineById(@PathVariable("id") Long id) {
        WineResponse wine = wineService.findWineById(id);
        return ResponseEntity.ok(wine);
    }

    @PostMapping("/add")
    public ResponseEntity<WineResponse> addWine(@Valid @RequestBody WineRequest wineRequest) {
        WineResponse createdWine = wineService.addWine(wineRequest);
        return new ResponseEntity<>(createdWine, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<WineResponse> updateWine(@Valid @RequestBody WineRequest wineRequest) {
        WineResponse updatedWine = wineService.updateWine(wineRequest);
        return ResponseEntity.ok(updatedWine);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteWine(@PathVariable("id") Long id) {
        wineService.deleteWine(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<WineResponse>> getWinesByBrand(@PathVariable("brand") String brand) {
        return ResponseEntity.ok(wineService.findByBrand(brand));
    }

    @GetMapping("/varietal/{varietal}")
    public ResponseEntity<List<WineResponse>> getWinesByVarietal(@PathVariable("varietal") String varietal) {
        return ResponseEntity.ok(wineService.findByVarietal(varietal));
    }
}
