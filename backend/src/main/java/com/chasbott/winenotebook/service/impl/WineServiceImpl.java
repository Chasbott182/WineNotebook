package com.chasbott.winenotebook.service.impl;

import com.chasbott.winenotebook.dto.WineRequest;
import com.chasbott.winenotebook.dto.WineResponse;
import com.chasbott.winenotebook.exception.WineNotFoundException;
import com.chasbott.winenotebook.mapper.WineMapper;
import com.chasbott.winenotebook.model.Wine;
import com.chasbott.winenotebook.repository.WineRepository;
import com.chasbott.winenotebook.service.WineService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service implementation providing business logic for the Wine Notebook.
 * Adheres to SRP by managing business rules and transaction boundaries.
 * Adheres to DIP by relying on the WineRepository and WineMapper abstractions.
 */
@Service
@Transactional
public class WineServiceImpl implements WineService {

    private final WineRepository wineRepository;
    private final WineMapper wineMapper;

    // Constructor injection (Spring Boot automatically injects dependencies)
    public WineServiceImpl(WineRepository wineRepository, WineMapper wineMapper) {
        this.wineRepository = wineRepository;
        this.wineMapper = wineMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<WineResponse> findAllWines() {
        return wineRepository.findAll()
                .stream()
                .map(wineMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public WineResponse findWineById(Long id) {
        Wine wine = wineRepository.findById(id)
                .orElseThrow(() -> new WineNotFoundException(id));
        return wineMapper.toResponse(wine);
    }

    @Override
    public WineResponse addWine(WineRequest request) {
        Wine wine = wineMapper.toEntity(request);
        Wine savedWine = wineRepository.save(wine);
        return wineMapper.toResponse(savedWine);
    }

    @Override
    public WineResponse updateWine(WineRequest request) {
        if (request.id() == null) {
            throw new IllegalArgumentException("Wine ID cannot be null when updating");
        }
        Wine existingWine = wineRepository.findById(request.id())
                .orElseThrow(() -> new WineNotFoundException(request.id()));

        wineMapper.updateEntityFromRequest(existingWine, request);
        Wine updatedWine = wineRepository.save(existingWine);
        return wineMapper.toResponse(updatedWine);
    }

    @Override
    public void deleteWine(Long id) {
        if (!wineRepository.existsById(id)) {
            throw new WineNotFoundException(id);
        }
        wineRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WineResponse> findByBrand(String brand) {
        return wineRepository.findByBrand(brand)
                .stream()
                .map(wineMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<WineResponse> findByVarietal(String varietal) {
        return wineRepository.findByVarietal(varietal)
                .stream()
                .map(wineMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<WineResponse> findByCellarLocation(String cellarLocation) {
        return wineRepository.findByCellarLocation(cellarLocation)
                .stream()
                .map(wineMapper::toResponse)
                .toList();
    }
}
