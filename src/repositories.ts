import { ILot, IRezerwacja, IUzytkownik } from "./interfaces";

export class FlightRepository {
  constructor(private flights: ILot[] = []) {}

  findAll(): ILot[] {
    return this.flights;
  }

  findById(id: string): ILot | null {
    return this.flights.find(flight => flight.id === id) ?? null;
  }

  save(flight: ILot): void {
    this.flights.push(flight);
  }
}

export class ReservationRepository {
  constructor(private reservations: IRezerwacja[] = []) {}

  findAll(): IRezerwacja[] {
    return this.reservations;
  }

  findById(id: string): IRezerwacja | null {
    return this.reservations.find(reservation => reservation.id === id) ?? null;
  }

  save(reservation: IRezerwacja): void {
    this.reservations.push(reservation);
  }

  update(updatedReservation: IRezerwacja): void {
    const index = this.reservations.findIndex(
      reservation => reservation.id === updatedReservation.id
    );

    if (index === -1) {
      throw new Error("Nie znaleziono rezerwacji do aktualizacji.");
    }

    this.reservations[index] = updatedReservation;
  }
}

export class UserRepository {
  constructor(private users: IUzytkownik[] = []) {}

  findById(id: string): IUzytkownik | null {
    return this.users.find(user => user.id === id) ?? null;
  }

  save(user: IUzytkownik): void {
    this.users.push(user);
  }
}