import { ILot, IRezerwacja } from "./interfaces";
import { KryteriaWyszukiwania } from "./types";
import {
  SearchService,
  RezerwacjaService,
  PowiadomienieService,
} from "./services";

export class WyszukajLotyUseCase {
  constructor(private searchService: SearchService) {}

  execute(kryteria: KryteriaWyszukiwania): ILot[] {
    return this.searchService.wyszukajLoty(kryteria);
  }
}

export class UtworzRezerwacjeUseCase {
  constructor(
    private rezerwacjaService: RezerwacjaService,
    private powiadomienieService: PowiadomienieService
  ) {}

  execute(idLotu: string, idUzytkownika: string): IRezerwacja {
    const rezerwacja =
      this.rezerwacjaService.utworzRezerwacje(
        idLotu,
        idUzytkownika
      );

    this.powiadomienieService.wyslijPowiadomienie(
      idUzytkownika,
      `Utworzono rezerwację o numerze ${rezerwacja.id}`,
      "email"
    );

    return rezerwacja;
  }
}

export class PobierzSzczegolyRezerwacjiUseCase {
  constructor(private rezerwacjaService: RezerwacjaService) {}

  execute(idRezerwacji: string): IRezerwacja | null {
    return this.rezerwacjaService.pobierzSzczegolyRezerwacji(
      idRezerwacji
    );
  }
}

export class AnulujRezerwacjeUseCase {
  constructor(
    private rezerwacjaService: RezerwacjaService,
    private powiadomienieService: PowiadomienieService
  ) {}

  execute(idRezerwacji: string, idUzytkownika: string): boolean {
    const wynik =
      this.rezerwacjaService.anulujRezerwacje(idRezerwacji);

    if (wynik) {
      this.powiadomienieService.wyslijPowiadomienie(
        idUzytkownika,
        `Anulowano rezerwację o numerze ${idRezerwacji}`,
        "email"
      );
    }

    return wynik;
  }
}