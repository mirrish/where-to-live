import { Person } from "./Person";

export const getSizeOfDot = (weight: number) => weight * 10;

export const calculateAverage = (persons: Person[]) => {
  const weights = persons.map((p) => p.weight);
  const weightsSum = persons.reduce((sum, p) => sum + p.weight, 0);
  const adjustedPersons = persons
    .map((p) => ({
      adjustedWeight: p.weight * (weights.length / weightsSum),
      ...p,
    }))
    .map((p) => ({
      weighedLat: p.lat * p.adjustedWeight,
      weightedLng: p.lng * p.adjustedWeight,
    }));
  const averageLat =
    adjustedPersons
      .map((p) => p.weighedLat)
      .reduce((sum, lat) => sum + lat, 0) / adjustedPersons.length;
  const averageLng =
    adjustedPersons
      .map((p) => p.weightedLng)
      .reduce((sum, lat) => sum + lat, 0) / adjustedPersons.length;
  return {
    averageLat: Number.parseFloat(averageLat.toPrecision(7)),
    averageLng: Number.parseFloat(averageLng.toPrecision(7)),
  };
};
