package com.chasbott.winenotebook.dto;

/**
 * Java 21 Record for outgoing Wine responses.
 * Provides a clean, decoupled data transfer object.
 */
public record WineResponse(
    Long id,
    String name,
    String varietal,
    String brand,
    String place,
    double alcohol,
    String vintage,
    String drysweet,
    String imageUrl,
    String palate,
    String nose,
    String body,
    String tannin,
    String acidity,
    double price,
    String priceRange,
    String cellarLocation
) {}
