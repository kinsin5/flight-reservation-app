import {
  ILot,
  IPlatnosc,
  IPlatnoscService,
  IPlatnoscStrategy,
  IPowiadomienie,
  IRezerwacja,
  IRezerwacjaService,
  ISearchService,
} from "./interfaces";

import {
  DanePlatnosci,
  KanalPowiadomienia,
  KryteriaWyszukiwania,
} from "./types";

import {
  FlightRepository,
  ReservationRepository,
} from "./repositories";

import { Logger } from "./logger";
import { DomainError, InfrastructureError } from "./errors";
import { validateId } from "./validators";
import { CardPaymentStrategy } from "./strategies";

export class SearchService implements ISearchService {
  constructor(private flightRepository: FlightRepository) {}

  wyszukajLoty(kryteria: KryteriaWyszukiwania): ILot[] {
    try {
      Logger.info("Rozpoczeto wyszukiwanie lotow.");

      const wyniki = this.flightRepository
        .findAll()
        .filter(lot => {
          const pasujeTrasa =
            !kryteria.trasa || lot.trasa === kryteria.trasa;

          const pasujeData =
            !kryteria.data || lot.dataWylotu >= kryteria.data;

          const pasujeLiczbaPasazerow =
            !kryteria.liczbaPasazerow ||
            lot.dostepneMiejsca >= kryteria.liczbaPasazerow;

          return (
            pasujeTrasa &&
            pasujeData &&
            pasujeLiczbaPasazerow
          );
        });

      Logger.info(`Znaleziono ${wyniki.length} lotow.`);
      return wyniki;
    } catch (error) {
      Logger.error("Blad podczas wyszukiwania lotow.", error);
      throw new InfrastructureError(
        "Nie udalo sie pobrac listy lotow."
      );
    }
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
    try {
      Logger.info("Rozpoczeto tworzenie rezerwacji.");

      validateId(idLotu, "Id lotu");
      validateId(idUzytkownika, "Id uzytkownika");

      const lot = this.flightRepository.findById(idLotu);

      if (!lot) {
        throw new DomainError("Nie znaleziono lotu.");
      }

      if (lot.dostepneMiejsca <= 0) {
        throw new DomainError(
          "Brak dostepnych miejsc na wybrany lot."
        );
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

      Logger.info(`Utworzono rezerwacje: ${rezerwacja.id}`);

      return rezerwacja;
    } catch (error) {
      Logger.error("Blad podczas tworzenia rezerwacji.", error);
      throw error;
    }
  }

  anulujRezerwacje(idRezerwacji: string): boolean {
    try {
      Logger.info("Rozpoczeto anulowanie rezerwacji.");

      validateId(idRezerwacji, "Id rezerwacji");

      const rezerwacja =
        this.reservationRepository.findById(idRezerwacji);

      if (!rezerwacja) {
        throw new DomainError("Nie znaleziono rezerwacji.");
      }

      if (rezerwacja.status === "anulowana") {
        throw new DomainError(
          "Rezerwacja zostala juz wczesniej anulowana."
        );
      }

      rezerwacja.status = "anulowana";

      const lot = this.flightRepository.findById(
        rezerwacja.idLotu
      );

      if (lot) {
        lot.dostepneMiejsca += 1;
      }

      this.reservationRepository.update(rezerwacja);

      Logger.info(`Anulowano rezerwacje: ${idRezerwacji}`);

      return true;
    } catch (error) {
      Logger.error("Blad podczas anulowania rezerwacji.", error);
      throw error;
    }
  }

  pobierzSzczegolyRezerwacji(
    idRezerwacji: string
  ): IRezerwacja | null {
    try {
      Logger.info("Pobieranie szczegolow rezerwacji.");

      validateId(idRezerwacji, "Id rezerwacji");

      return this.reservationRepository.findById(idRezerwacji);
    } catch (error) {
      Logger.error(
        "Blad podczas pobierania szczegolow rezerwacji.",
        error
      );
      throw error;
    }
  }
}

export class PlatnoscService implements IPlatnoscService {
  constructor(
    private platnoscStrategy: IPlatnoscStrategy =
      new CardPaymentStrategy()
  ) {}

  ustawStrategiePlatnosci(
    platnoscStrategy: IPlatnoscStrategy
  ): void {
    this.platnoscStrategy = platnoscStrategy;
  }

  przetworzPlatnosc(
    idRezerwacji: string,
    danePlatnosci: DanePlatnosci
  ): IPlatnosc {
    try {
      Logger.info("Rozpoczeto przetwarzanie platnosci.");

      validateId(idRezerwacji, "Id rezerwacji");

      const platnosc = this.platnoscStrategy.przetworz(
        idRezerwacji,
        danePlatnosci
      );

      Logger.info(
        `Platnosc zakonczona: ${platnosc.id}, strategia: ${this.platnoscStrategy.nazwa}`
      );

      return platnosc;
    } catch (error) {
      Logger.error("Blad podczas platnosci.", error);
      throw error;
    }
  }
}

export class PowiadomienieService {
  wyslijPowiadomienie(
    idUzytkownika: string,
    tresc: string,
    kanal: KanalPowiadomienia
  ): IPowiadomienie {
    try {
      Logger.info("Wysylanie powiadomienia.");

      validateId(idUzytkownika, "Id uzytkownika");

      return {
        id: `NOT-${Date.now()}`,
        idUzytkownika,
        tresc,
        kanal,
      };
    } catch (error) {
      Logger.error("Blad podczas wysylania powiadomienia.", error);
      throw error;
    }
  }
}
