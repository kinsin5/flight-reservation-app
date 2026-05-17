import { FlightEntity, CharterFlight } from "./entities";

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

const loty = [
  new FlightEntity(
    "LOT-1",
    "Warszawa - Rzym",
    new Date("2026-06-01T10:00:00"),
    new Date("2026-06-01T12:30:00"),
    599,
    5
  ),
  new FlightEntity(
    "LOT-2",
    "Warszawa - Londyn",
    new Date("2026-06-03T08:00:00"),
    new Date("2026-06-03T10:15:00"),
    449,
    2
  ),
  new CharterFlight(
    "LOT-3",
    "Poznań - Barcelona",
    new Date("2026-07-10T14:00:00"),
    new Date("2026-07-10T17:00:00"),
    799,
    10,
    "TravelSun",
    "Wakacje",
    false
  ),
];

const flightRepository = new FlightRepository(loty);
const reservationRepository = new ReservationRepository();

const searchService = new SearchService(flightRepository);
const rezerwacjaService = new RezerwacjaService(
  flightRepository,
  reservationRepository
);
const powiadomienieService = new PowiadomienieService();
const platnoscService = new PlatnoscService();

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

console.log("WYSZUKIWANIE LOTÓW");

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

console.log("\nPŁATNOŚĆ");

const platnosc = platnoscService.przetworzPlatnosc(
  rezerwacja.id,
  {
    numer: "1234567812345678",
    dataWaznosci: "12/28",
    cvv: "123",
  }
);

console.log(platnosc);

console.log("\nSZCZEGÓŁY REZERWACJI");

const szczegoly =
  pobierzSzczegolyUseCase.execute(rezerwacja.id);

console.log(szczegoly);

console.log("\nANULOWANIE REZERWACJI");

const anulowano = anulujRezerwacjeUseCase.execute(
  rezerwacja.id,
  "USER-1"
);

console.log("Czy anulowano:", anulowano);

console.log("\nSZCZEGÓŁY PO ANULOWANIU");

console.log(
  pobierzSzczegolyUseCase.execute(rezerwacja.id)
);