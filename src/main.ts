import { FlightBuilder } from "./builders";

import {
  FlightRepository,
  ReservationRepository,
} from "./repositories";

import {
  SearchService,
  RezerwacjaService,
  PowiadomienieService,
  PlatnoscService,
} from "./services";

import {
  WyszukajLotyUseCase,
  UtworzRezerwacjeUseCase,
  PobierzSzczegolyRezerwacjiUseCase,
  AnulujRezerwacjeUseCase,
} from "./usecases";

import {
  BankTransferPaymentStrategy,
  CardPaymentStrategy,
} from "./strategies";

const loty = [
  FlightBuilder.create("LOT-1")
    .withRoute("Warszawa - Rzym")
    .withDeparture(new Date("2026-06-01T10:00:00"))
    .withArrival(new Date("2026-06-01T12:30:00"))
    .withPrice(599)
    .withSeats(5)
    .buildRegular(),
  FlightBuilder.create("LOT-2")
    .withRoute("Warszawa - Londyn")
    .withDeparture(new Date("2026-06-03T08:00:00"))
    .withArrival(new Date("2026-06-03T10:15:00"))
    .withPrice(449)
    .withSeats(2)
    .buildRegular(),
  FlightBuilder.create("LOT-3")
    .withRoute("Poznan - Barcelona")
    .withDeparture(new Date("2026-07-10T14:00:00"))
    .withArrival(new Date("2026-07-10T17:00:00"))
    .withPrice(799)
    .withSeats(10)
    .buildCharter("TravelSun", "Wakacje"),
];

const flightRepository = new FlightRepository(loty);
const reservationRepository = new ReservationRepository();

const searchService = new SearchService(flightRepository);
const rezerwacjaService = new RezerwacjaService(
  flightRepository,
  reservationRepository
);
const powiadomienieService = new PowiadomienieService();
const platnoscService = new PlatnoscService(
  new CardPaymentStrategy()
);

const wyszukajLotyUseCase =
  new WyszukajLotyUseCase(searchService);

const utworzRezerwacjeUseCase =
  new UtworzRezerwacjeUseCase(
    rezerwacjaService,
    powiadomienieService
  );

const pobierzSzczegolyUseCase =
  new PobierzSzczegolyRezerwacjiUseCase(
    rezerwacjaService
  );

const anulujRezerwacjeUseCase =
  new AnulujRezerwacjeUseCase(
    rezerwacjaService,
    powiadomienieService
  );

console.log("WYSZUKIWANIE LOTOW");

const znalezioneLoty = wyszukajLotyUseCase.execute({
  trasa: "Warszawa - Rzym",
  liczbaPasazerow: 1,
});

console.log(znalezioneLoty);

console.log("\nTWORZENIE REZERWACJI");

const rezerwacja = utworzRezerwacjeUseCase.execute(
  "LOT-1",
  "USER-1"
);

console.log(rezerwacja);

console.log("\nPLATNOSC KARTA");

const platnoscKarta = platnoscService.przetworzPlatnosc(
  rezerwacja.id,
  {
    numer: "1234567812345678",
    dataWaznosci: "12/28",
    cvv: "123",
  }
);

console.log(platnoscKarta);

console.log("\nPLATNOSC PRZELEWEM");

platnoscService.ustawStrategiePlatnosci(
  new BankTransferPaymentStrategy()
);

const platnoscPrzelewem = platnoscService.przetworzPlatnosc(
  rezerwacja.id,
  {
    numerRachunku: "12345678901234567890123456",
    tytul: `Rezerwacja ${rezerwacja.id}`,
  }
);

console.log(platnoscPrzelewem);

console.log("\nSZCZEGOLY REZERWACJI");

const szczegoly =
  pobierzSzczegolyUseCase.execute(rezerwacja.id);

console.log(szczegoly);

console.log("\nANULOWANIE REZERWACJI");

const anulowano = anulujRezerwacjeUseCase.execute(
  rezerwacja.id,
  "USER-1"
);

console.log("Czy anulowano:", anulowano);

console.log("\nSZCZEGOLY PO ANULOWANIU");

console.log(
  pobierzSzczegolyUseCase.execute(rezerwacja.id)
);
