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

import { Logger } from "./logger";
import { DomainError, InfrastructureError } from "./errors";
import {
  validateId,
  validateCardNumber,
  validateCVV,
} from "./validators";

export class SearchService implements ISearchService {
  constructor(private flightRepository: FlightRepository) {}

  wyszukajLoty(kryteria: KryteriaWyszukiwania): ILot[] {
    try {
      Logger.info("Rozpoczęto wyszukiwanie lotów.");

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

      Logger.info(`Znaleziono ${wyniki.length} lotów.`);
      return wyniki;
    } catch (error) {
      Logger.error("Błąd podczas wyszukiwania lotów.", error);
      throw new InfrastructureError(
        "Nie udało się pobrać listy lotów."
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
      Logger.info("Rozpoczęto tworzenie rezerwacji.");

      validateId(idLotu, "Id lotu");
      validateId(idUzytkownika, "Id użytkownika");

      const lot = this.flightRepository.findById(idLotu);

      if (!lot) {
        throw new DomainError("Nie znaleziono lotu.");
      }

      if (lot.dostepneMiejsca <= 0) {
        throw new DomainError(
          "Brak dostępnych miejsc na wybrany lot."
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

      Logger.info(
        `Utworzono rezerwację: ${rezerwacja.id}`
      );

      return rezerwacja;
    } catch (error) {
      Logger.error("Błąd podczas tworzenia rezerwacji.", error);
      throw error;
    }
  }

  anulujRezerwacje(idRezerwacji: string): boolean {
    try {
      Logger.info("Rozpoczęto anulowanie rezerwacji.");

      validateId(idRezerwacji, "Id rezerwacji");

      const rezerwacja =
        this.reservationRepository.findById(idRezerwacji);

      if (!rezerwacja) {
        throw new DomainError("Nie znaleziono rezerwacji.");
      }

      if (rezerwacja.status === "anulowana") {
        throw new DomainError(
          "Rezerwacja została już wcześniej anulowana."
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

      Logger.info(
        `Anulowano rezerwację: ${idRezerwacji}`
      );

      return true;
    } catch (error) {
      Logger.error("Błąd podczas anulowania rezerwacji.", error);
      throw error;
    }
  }

  pobierzSzczegolyRezerwacji(
    idRezerwacji: string
  ): IRezerwacja | null {
    try {
      Logger.info("Pobieranie szczegółów rezerwacji.");

      validateId(idRezerwacji, "Id rezerwacji");

      return this.reservationRepository.findById(idRezerwacji);
    } catch (error) {
      Logger.error(
        "Błąd podczas pobierania szczegółów rezerwacji.",
        error
      );
      throw error;
    }
  }
}

export class PlatnoscService implements IPlatnoscService {
  przetworzPlatnosc(
    idRezerwacji: string,
    daneKarty: DaneKarty
  ): IPlatnosc {
    try {
      Logger.info("Rozpoczęto przetwarzanie płatności.");

      validateId(idRezerwacji, "Id rezerwacji");
      validateCardNumber(daneKarty.numer);
      validateCVV(daneKarty.cvv);

      const platnosc: IPlatnosc = {
        id: `PAY-${Date.now()}`,
        idRezerwacji,
        kwota: 0,
        status: "zaksiegowana",
        dataPlatnosci: new Date(),
      };

      Logger.info(`Płatność zakończona: ${platnosc.id}`);

      return platnosc;
    } catch (error) {
      Logger.error("Błąd podczas płatności.", error);
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
      Logger.info("Wysyłanie powiadomienia.");

      validateId(idUzytkownika, "Id użytkownika");

      return {
        id: `NOT-${Date.now()}`,
        idUzytkownika,
        tresc,
        kanal,
      };
    } catch (error) {
      Logger.error("Błąd podczas wysyłania powiadomienia.", error);
      throw error;
    }
  }
}