package com.chasbott.winenotebook.service;

import com.chasbott.winenotebook.dto.WineRequest;
import com.chasbott.winenotebook.dto.WineResponse;

import java.util.List;

/**
 * Service interface specifying wine business operations.
 * Adheres to DIP (Dependency Inversion Principle) and ISP (Interface Segregation Principle).
 */
public interface WineService {

    List<WineResponse> findAllWines();

    WineResponse findWineById(Long id);

    WineResponse addWine(WineRequest request);

    WineResponse updateWine(WineRequest request);

    void deleteWine(Long id);

    List<WineResponse> findByBrand(String brand);

    List<WineResponse> findByVarietal(String varietal);
}
