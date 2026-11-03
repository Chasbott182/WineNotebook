package com.chasbott.winenotebook.exception;

/**
 * Domain exception thrown when a requested wine is not found.
 */
public class WineNotFoundException extends RuntimeException {
    public WineNotFoundException(Long id) {
        super("Wine with ID " + id + " was not found");
    }

    public WineNotFoundException(String message) {
        super(message);
    }
}
