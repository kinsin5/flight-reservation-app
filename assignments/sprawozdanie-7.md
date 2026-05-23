[Link do repozytorium i branch z sprawozdania 7:](https://github.com/kinsin5/flight-reservation-app/tree/sprawozdania/7)

Nowy kod:

```
src/
    builders.ts
```

Modyfikacja:

```
src/
    main.ts
```

# Sprawozdanie 7 - Wzorce projektowe: wzorce kreacyjne

## 1. Cel zadania

Celem zadania bylo rozszerzenie aplikacji rezerwacji lotow o mechanizm oparty na wzorcu kreacyjnym. Wybranym wzorcem jest **Builder**, poniewaz w aplikacji wystepowalo tworzenie obiektow lotow z wieloma parametrami przekazywanymi bezposrednio do konstruktora.

## 2. Problem przed zmianami

W pliku main.ts obiekty lotow byly tworzone bezposrednio przez konstruktory klas `FlightEntity` oraz `CharterFlight`.

Najwiekszy problem dotyczyl lotu czarterowego, ktory wymagal przekazania wielu argumentow w okreslonej kolejnosci:

```ts
new CharterFlight(
  "LOT-3",
  "Poznan - Barcelona",
  new Date("2026-07-10T14:00:00"),
  new Date("2026-07-10T17:00:00"),
  799,
  10,
  "TravelSun",
  "Wakacje",
  false
);
```

Takie rozwiazanie bylo mniej czytelne i podatne na bledy, poniewaz latwo bylo pomylic kolejnosc parametrow, np. cene z liczba miejsc albo date wylotu z data przylotu. Dodatkowo dodanie kolejnych danych lotu wymagaloby zmiany wielu miejsc, w ktorych tworzone sa obiekty.

## 3. Zastosowany wzorzec

Zastosowano wzorzec **Builder**. W projekcie dodano klase `FlightBuilder`, ktora odpowiada za stopniowe konfigurowanie danych lotu oraz utworzenie odpowiedniego obiektu.

Builder udostepnia metody:

- withRoute
- withDeparture
- withArrival
- withPrice
- withSeats
- buildRegular
- buildCharter

Dzieki temu proces tworzenia lotu jest bardziej opisowy i czytelny.

Przyklad po zmianach:

```ts
FlightBuilder.create("LOT-3")
  .withRoute("Poznan - Barcelona")
  .withDeparture(new Date("2026-07-10T14:00:00"))
  .withArrival(new Date("2026-07-10T17:00:00"))
  .withPrice(799)
  .withSeats(10)
  .buildCharter("TravelSun", "Wakacje");
```

## 4. Wprowadzone zmiany

W pliku `main.ts` usunieto bezposrednie wywolywanie konstruktorow przy przygotowywaniu listy lotow. Zamiast tego wykorzystano `FlightBuilder`, dzieki czemu kod inicjalizujacy dane startowe aplikacji jest bardziej czytelny.

Builder sprawdza rowniez, czy przed utworzeniem obiektu podano wszystkie wymagane dane lotu. Jesli brakuje ktoregos pola, rzucany jest blad z informacja o brakujacych danych.

## 5. Korzysci

Zastosowanie wzorca Builder przynioslo nastepujace korzysci:

- poprawa czytelnosci tworzenia obiektow lotow,
- ograniczenie ryzyka pomylenia kolejnosci argumentow konstruktora,
- oddzielenie procesu tworzenia obiektu od glownej logiki aplikacji,
- latwiejsze rozszerzanie klas lotow o nowe pola,
- jeden wspolny mechanizm tworzenia zwyklych i czarterowych lotow.

## 6. Podsumowanie

Wprowadzenie wzorca Builder rozwiazalo problem nieczytelnego i podatnego na bledy tworzenia obiektow lotow. Aplikacja stala sie bardziej elastyczna, poniewaz szczegoly konstruowania obiektow zostaly przeniesione do osobnej klasy. Dalsza rozbudowa systemu, np. o loty promocyjne, sezonowe lub biznesowe, bedzie prostsza i nie bedzie wymagac powielania skomplikowanych konstruktorow w wielu miejscach kodu.
