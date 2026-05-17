import { StatusRezerwacji } from "./types";
import { ILot } from "./interfaces";

export class FlightEntity implements ILot {
  constructor(
    public id: string,
    public trasa: string,
    public dataWylotu: Date,
    public dataPrzylotu: Date,
    public cena: number,
    public dostepneMiejsca: number
  ) {}

  zmniejszLiczbeMiejsc(liczbaPasazerow: number): void {
    if (this.dostepneMiejsca < liczbaPasazerow) {
      throw new Error("Brak wystarczającej liczby miejsc.");
    }

    this.dostepneMiejsca -= liczbaPasazerow;
  }

  zwiekszLiczbeMiejsc(liczbaPasazerow: number): void {
    this.dostepneMiejsca += liczbaPasazerow;
  }
}

export class CharterFlight extends FlightEntity {
  constructor(
    id: string,
    trasa: string,
    dataWylotu: Date,
    dataPrzylotu: Date,
    cena: number,
    dostepneMiejsca: number,
    public organizator: string,
    public celPodrozy: string,
    public czyPelnyWynajem: boolean = false
  ) {
    super(id, trasa, dataWylotu, dataPrzylotu, cena, dostepneMiejsca);
  }
}

export class Ticket {
  constructor(
    public id: string,
    public idLotu: string,
    public idUzytkownika: string,
    public cena: number,
    public status: StatusRezerwacji = "oczekujaca"
  ) {}

  potwierdz(): void {
    this.status = "potwierdzona";
  }

  anuluj(): void {
    this.status = "anulowana";
  }
}