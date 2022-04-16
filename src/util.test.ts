import { Person } from "./Person";
import { calculateAverage } from "./util";

describe("calculateAverage", () => {
  it("same weights", () => {
    const persons: Person[] = [
      {
        id: "person 1",
        weight: 1,
        lat: 0,
        lng: 30,
      },
      {
        id: "person 2",
        weight: 1,
        lat: 40,
        lng: 10,
      },
    ];
    const { averageLat, averageLng } = calculateAverage(persons);
    expect(averageLat).toBe(20);
    expect(averageLng).toBe(20);
  });
  it("different weights", () => {
    const persons: Person[] = [
      {
        id: "person 1",
        weight: 1,
        lat: 0,
        lng: 30,
      },
      {
        id: "person 2",
        weight: 2,
        lat: 100,
        lng: 10,
      },
    ];
    const { averageLat, averageLng } = calculateAverage(persons);
    expect(averageLat).toBe(66.66667);
    expect(averageLng).toBe(16.66667);
  });
  it("three weights", () => {
    const persons: Person[] = [
      {
        id: "person 1",
        weight: 1,
        lat: 0,
        lng: 30,
      },
      {
        id: "person 2",
        weight: 1,
        lat: 100,
        lng: 10,
      },
      {
        id: "person 3",
        weight: 1,
        lat: 100,
        lng: 10,
      },
    ];
    const { averageLat, averageLng } = calculateAverage(persons);
    expect(averageLat).toBe(66.66667);
    expect(averageLng).toBe(16.66667);
  });
});
