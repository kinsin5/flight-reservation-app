import {
  ILot,
  IPlatnosc,
  IRezerwacja,
  ISearchService,
  IRezerwacjaService,
  IPlatnoscService,
  IPowiadomienie,
} from "./interfaces";

import {
  DaneKarty,
  KanalPowiadomienia,
  KryteriaWyszukiwania,
} from "./types";

import {
  FlightRepository,
  ReservationRepository,
} from "./repositories";

export class SearchService implements ISearchService {
  constructor(private flightRepository: FlightRepository) {}

  wyszukajLoty(kryteria: KryteriaWyszukiwania): ILot[] {
    return this.flightRepository.findAll().filter(lot => {
      const pasujeTrasa =
        !kryteria.trasa || lot.trasa === kryteria.trasa;

      const pasujeData =
        !kryteria.data || lot.dataWylotu >= kryteria.data;

      const pasujeLiczbaPasazerow =
        !kryteria.liczbaPasazerow ||
        lot.dostepneMiejsca >= kryteria.liczbaPasazerow;

      return pasujeTrasa && pasujeData && pasujeLiczbaPasazerow;
    });
  }
}

export class RezerwacjaService implements IRezerwacjaService {
  constructor(
    private flightRepository: FlightRepository,
    private reservationRepository: ReservationRepository
  ) {}

  utworzRezerwacje(
    idLotu: string,
    idUzytkownika: string
  ): IRezerwacja {
    const lot = this.flightRepository.findById(idLotu);

    if (!lot) {
      throw new Error("Nie znaleziono lotu.");
    }

    if (lot.dostepneMiejsca <= 0) {
      throw new Error("Brak dostępnych miejsc na wybrany lot.");
    }

    lot.dostepneMiejsca -= 1;

    const rezerwacja: IRezerwacja = {
      id: `RES-${Date.now()}`,
      idLotu,
      idUzytkownika,
      status: "oczekujaca",
      dataRezerwacji: new Date(),
    };

    this.reservationRepository.save(rezerwacja);

    return rezerwacja;
  }

  anulujRezerwacje(idRezerwacji: string): boolean {
    const rezerwacja =
      this.reservationRepository.findById(idRezerwacji);

    if (!rezerwacja) {
      return false;
    }

    if (rezerwacja.status === "anulowana") {
      return false;
    }

    rezerwacja.status = "anulowana";

    const lot = this.flightRepository.findById(rezerwacja.idLotu);

    if (lot) {
      lot.dostepneMiejsca += 1;
    }

    this.reservationRepository.update(rezerwacja);

    return true;
  }

  pobierzSzczegolyRezerwacji(
    idRezerwacji: string
  ): IRezerwacja | null {
    return this.reservationRepository.findById(idRezerwacji);
  }
}

export class PlatnoscService implements IPlatnoscService {
  przetworzPlatnosc(
    idRezerwacji: string,
    daneKarty: DaneKarty
  ): IPlatnosc {
    const kartaPoprawna =
      daneKarty.numer.length === 16 &&
      daneKarty.cvv.length === 3 &&
      daneKarty.dataWaznosci.length > 0;

    return {
      id: `PAY-${Date.now()}`,
      idRezerwacji,
      kwota: 0,
      status: kartaPoprawna ? "zaksiegowana" : "odrzucona",
      dataPlatnosci: new Date(),
    };
  }
}

export class PowiadomienieService {
  wyslijPowiadomienie(
    idUzytkownika: string,
    tresc: string,
    kanal: KanalPowiadomienia
  ): IPowiadomienie {
    return {
      id: `NOT-${Date.now()}`,
      idUzytkownika,
      tresc,
      kanal,
    };
  }
}