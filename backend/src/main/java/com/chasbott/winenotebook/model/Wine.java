package com.chasbott.winenotebook.model;

import jakarta.persistence.*;
import java.io.Serializable;

/**
 * JPA Entity representing a Wine entry in the notebook.
 * Adheres to SRP by strictly encapsulating persistence state and identity.
 */
@Entity
@Table(name = "wines")
public class Wine implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String varietal;

    @Column(nullable = false)
    private String brand;

    private String place;
    private double alcohol;
    private String vintage;
    private String drysweet;
    private String imageUrl;

    @Column(length = 1000)
    private String palate;

    @Column(length = 1000)
    private String nose;

    private String body;
    private String tannin;
    private String acidity;
    private double price;
    private String priceRange;

    public Wine() {
    }

    public Wine(Long id, String name, String varietal, String brand, String place,
                double alcohol, String vintage, String drysweet, String imageUrl,
                String palate, String nose, String body, String tannin,
                String acidity, double price, String priceRange) {
        this.id = id;
        this.name = name;
        this.varietal = varietal;
        this.brand = brand;
        this.place = place;
        this.alcohol = alcohol;
        this.vintage = vintage;
        this.drysweet = drysweet;
        this.imageUrl = imageUrl;
        this.palate = palate;
        this.nose = nose;
        this.body = body;
        this.tannin = tannin;
        this.acidity = acidity;
        this.price = price;
        this.priceRange = priceRange;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getVarietal() { return varietal; }
    public void setVarietal(String varietal) { this.varietal = varietal; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getPlace() { return place; }
    public void setPlace(String place) { this.place = place; }

    public double getAlcohol() { return alcohol; }
    public void setAlcohol(double alcohol) { this.alcohol = alcohol; }

    public String getVintage() { return vintage; }
    public void setVintage(String vintage) { this.vintage = vintage; }

    public String getDrysweet() { return drysweet; }
    public void setDrysweet(String drysweet) { this.drysweet = drysweet; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getPalate() { return palate; }
    public void setPalate(String palate) { this.palate = palate; }

    public String getNose() { return nose; }
    public void setNose(String nose) { this.nose = nose; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public String getTannin() { return tannin; }
    public void setTannin(String tannin) { this.tannin = tannin; }

    public String getAcidity() { return acidity; }
    public void setAcidity(String acidity) { this.acidity = acidity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getPriceRange() { return priceRange; }
    public void setPriceRange(String priceRange) { this.priceRange = priceRange; }
}
