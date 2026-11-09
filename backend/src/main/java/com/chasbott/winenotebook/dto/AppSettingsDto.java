package com.chasbott.winenotebook.dto;

import java.util.List;

/**
 * Java 21 Records for managing User Personal Profile, Web App Security,
 * Cellar Locations, and Theme preferences via the Settings API.
 */
public record AppSettingsDto(
    String theme,
    PersonalProfileDto profile,
    SecuritySettingsDto security,
    List<String> cellarLocations
) {
    public record PersonalProfileDto(
        String fullName,
        String email,
        String title,
        String location,
        String favoriteVarietal,
        String bio
    ) {}

    public record SecuritySettingsDto(
        boolean twoFactorEnabled,
        int sessionTimeoutMinutes,
        boolean requirePinForDelete,
        String securityPin,
        boolean biometricLogin,
        boolean apiCorsRestricted,
        boolean auditLogEnabled
    ) {}
}
