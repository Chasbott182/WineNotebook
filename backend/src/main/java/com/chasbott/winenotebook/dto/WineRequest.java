package com.chasbott.winenotebook.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * Java 21 Record for incoming Wine creation & update payloads.
 * Eliminates all getter/setter/constructor boilerplate while ensuring immutability.
 */
public record WineRequest(
    Long id,
    @NotBlank(message = "Wine name is required")
    String name,
    @NotBlank(message = "Varietal is required")
    String varietal,
    @NotBlank(message = "Brand is required")
    String brand,
    String place,
    @PositiveOrZero(message = "Alcohol percentage must be non-negative")
    double alcohol,
    String vintage,
    String drysweet,
    String imageUrl,
    String palate,
    String nose,
    String body,
    String tannin,
    String acidity,
    @PositiveOrZero(message = "Price must be non-negative")
    double price,
    String priceRange,
    String cellarLocation
) {}
