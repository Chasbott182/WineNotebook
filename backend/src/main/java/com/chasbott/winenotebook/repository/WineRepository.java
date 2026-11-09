package com.chasbott.winenotebook.repository;

import com.chasbott.winenotebook.model.Wine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Wine entity persistence.
 * Adheres to DIP by providing an abstraction that decouples service logic from the DB.
 */
@Repository
public interface WineRepository extends JpaRepository<Wine, Long> {

    Optional<Wine> findByName(String name);

    List<Wine> findByBrand(String brand);

    List<Wine> findByVarietal(String varietal);

    List<Wine> findByCellarLocation(String cellarLocation);
}
