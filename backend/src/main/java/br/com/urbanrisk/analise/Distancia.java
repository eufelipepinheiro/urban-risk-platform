package br.com.urbanrisk.analise;

public final class Distancia {

    private static final double RAIO_DA_TERRA_KM = 6371.0088;

    private Distancia() {
    }

    public static double emKm(double latitudeA, double longitudeA, double latitudeB, double longitudeB) {
        double deltaLatitude = Math.toRadians(latitudeB - latitudeA);
        double deltaLongitude = Math.toRadians(longitudeB - longitudeA);
        double haversine = Math.pow(Math.sin(deltaLatitude / 2), 2)
                + Math.cos(Math.toRadians(latitudeA)) * Math.cos(Math.toRadians(latitudeB))
                * Math.pow(Math.sin(deltaLongitude / 2), 2);
        return 2 * RAIO_DA_TERRA_KM * Math.asin(Math.sqrt(haversine));
    }
}
