package com.chasbott.winenotebook.mapper;

import com.chasbott.winenotebook.dto.WineRequest;
import com.chasbott.winenotebook.dto.WineResponse;
import com.chasbott.winenotebook.model.Wine;
import org.springframework.stereotype.Component;

/**
 * Component responsible solely for mapping between Wine Entities and DTO Records.
 * Adheres to the Single Responsibility Principle (SRP).
 */
@Component
public class WineMapper {

    public Wine toEntity(WineRequest request) {
        if (request == null) return null;
        return new Wine(
            request.id(),
            request.name(),
            request.varietal(),
            request.brand(),
            request.place(),
            request.alcohol(),
            request.vintage(),
            request.drysweet(),
            request.imageUrl(),
            request.palate(),
            request.nose(),
            request.body(),
            request.tannin(),
            request.acidity(),
            request.price(),
            request.priceRange(),
            request.cellarLocation() != null && !request.cellarLocation().isBlank()
                ? request.cellarLocation()
                : "Main Cellar"
        );
    }

    public WineResponse toResponse(Wine wine) {
        if (wine == null) return null;
        return new WineResponse(
            wine.getId(),
            wine.getName(),
            wine.getVarietal(),
            wine.getBrand(),
            wine.getPlace(),
            wine.getAlcohol(),
            wine.getVintage(),
            wine.getDrysweet(),
            wine.getImageUrl(),
            wine.getPalate(),
            wine.getNose(),
            wine.getBody(),
            wine.getTannin(),
            wine.getAcidity(),
            wine.getPrice(),
            wine.getPriceRange(),
            wine.getCellarLocation() != null && !wine.getCellarLocation().isBlank()
                ? wine.getCellarLocation()
                : "Main Cellar"
        );
    }

    public void updateEntityFromRequest(Wine wine, WineRequest request) {
        if (wine == null || request == null) return;
        wine.setName(request.name());
        wine.setVarietal(request.varietal());
        wine.setBrand(request.brand());
        wine.setPlace(request.place());
        wine.setAlcohol(request.alcohol());
        wine.setVintage(request.vintage());
        wine.setDrysweet(request.drysweet());
        wine.setImageUrl(request.imageUrl());
        wine.setPalate(request.palate());
        wine.setNose(request.nose());
        wine.setBody(request.body());
        wine.setTannin(request.tannin());
        wine.setAcidity(request.acidity());
        wine.setPrice(request.price());
        wine.setPriceRange(request.priceRange());
        if (request.cellarLocation() != null && !request.cellarLocation().isBlank()) {
            wine.setCellarLocation(request.cellarLocation());
        }
    }
}
