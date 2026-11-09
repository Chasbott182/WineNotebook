package com.chasbott.winenotebook.config;

import com.chasbott.winenotebook.model.Wine;
import com.chasbott.winenotebook.repository.WineRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    @Profile("dev")
    public CommandLineRunner initDatabase(WineRepository wineRepository) {
        return args -> {
            if (wineRepository.count() == 0) {
                Wine wine1 = new Wine(
                    null,
                    "Reserve Cabernet Sauvignon",
                    "Cabernet Sauvignon",
                    "Stags Leap District",
                    "Napa Valley, California",
                    14.5,
                    "2019",
                    "Dry",
                    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80",
                    "Ripe black currant, dark chocolate, tobacco leaf, and subtle French oak spices with velvety structure.",
                    "Blackberry compote, cassis, cedarwood, and graphite.",
                    "Full",
                    "Firm & Polished",
                    "Medium+",
                    95.0,
                    "$$$$",
                    "Main Cellar - Rack A1"
                );

                Wine wine2 = new Wine(
                    null,
                    "Dundee Hills Pinot Noir",
                    "Pinot Noir",
                    "Domaine Serene",
                    "Willamette Valley, Oregon",
                    13.8,
                    "2021",
                    "Dry",
                    "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&auto=format&fit=crop&q=80",
                    "Silky red cherries, cranberry, forest floor, and delicate baking spices.",
                    "Bing cherry, violets, damp earth, and tea leaf.",
                    "Medium",
                    "Silky",
                    "Vibrant",
                    65.0,
                    "$$$",
                    "Wine Fridge (55°F)"
                );

                Wine wine3 = new Wine(
                    null,
                    "Les Monts Damnés Sancerre",
                    "Sauvignon Blanc",
                    "Henri Bourgeois",
                    "Loire Valley, France",
                    13.0,
                    "2022",
                    "Crisp Dry",
                    "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=800&auto=format&fit=crop&q=80",
                    "Chalky limestone minerality, grapefruit zest, lemongrass, flinty precision.",
                    "Crushed stone, lime blossom, white peach, and wet slate.",
                    "Medium-Light",
                    "None",
                    "High & Electric",
                    48.0,
                    "$$",
                    "Wine Fridge (55°F)"
                );

                Wine wine4 = new Wine(
                    null,
                    "Tradizione Barolo",
                    "Nebbiolo",
                    "Marchesi di Barolo",
                    "Piedmont, Italy",
                    14.0,
                    "2018",
                    "Dry",
                    "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&auto=format&fit=crop&q=80",
                    "Dried red cherry, tar, leather, savory herbs, and structured grippy finish.",
                    "Rose petals, tar, dried orange peel, and truffles.",
                    "Full",
                    "High & Grippy",
                    "High",
                    80.0,
                    "$$$$",
                    "Aging Vault"
                );

                wineRepository.saveAll(List.of(wine1, wine2, wine3, wine4));
            }
        };
    }
}
