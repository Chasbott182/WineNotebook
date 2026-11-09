package com.chasbott.winenotebook.service;

import com.chasbott.winenotebook.dto.WineRequest;
import com.chasbott.winenotebook.dto.WineResponse;
import com.chasbott.winenotebook.mapper.WineMapper;
import com.chasbott.winenotebook.model.Wine;
import com.chasbott.winenotebook.repository.WineRepository;
import com.chasbott.winenotebook.service.impl.WineServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WineServiceTest {

    @Mock
    private WineRepository wineRepository;

    private WineMapper wineMapper;
    private WineService wineService;

    @BeforeEach
    void setUp() {
        wineMapper = new WineMapper();
        wineService = new WineServiceImpl(wineRepository, wineMapper);
    }

    @Test
    void shouldFindWineById() {
        Wine wine = new Wine(1L, "Test Wine", "Cabernet", "Test Brand", "Napa",
                14.0, "2020", "Dry", "http://img", "Palate", "Nose", "Full", "Medium", "High", 50.0, "$$", "Main Cellar - Rack A1");

        when(wineRepository.findById(1L)).thenReturn(Optional.of(wine));

        WineResponse response = wineService.findWineById(1L);

        assertNotNull(response);
        assertEquals("Test Wine", response.name());
        assertEquals("Cabernet", response.varietal());
        assertEquals("Main Cellar - Rack A1", response.cellarLocation());
        verify(wineRepository, times(1)).findById(1L);
    }

    @Test
    void shouldAddNewWine() {
        WineRequest request = new WineRequest(null, "New Wine", "Merlot", "Bordeaux Brand", "Bordeaux",
                13.5, "2021", "Dry", "http://img", "Plum notes", "Floral", "Medium", "Soft", "Medium", 40.0, "$$", "Aging Vault");

        Wine savedWine = new Wine(2L, "New Wine", "Merlot", "Bordeaux Brand", "Bordeaux",
                13.5, "2021", "Dry", "http://img", "Plum notes", "Floral", "Medium", "Soft", "Medium", 40.0, "$$", "Aging Vault");

        when(wineRepository.save(any(Wine.class))).thenReturn(savedWine);

        WineResponse response = wineService.addWine(request);

        assertNotNull(response);
        assertEquals(2L, response.id());
        assertEquals("New Wine", response.name());
        assertEquals("Aging Vault", response.cellarLocation());
        verify(wineRepository, times(1)).save(any(Wine.class));
    }
}
