[Link do repozytorium i branch z sprawozdania 8:](https://github.com/kinsin5/flight-reservation-app/tree/sprawozdania/8)

Nowy kod:

```
src/
    strategies.ts
```

Modyfikacja:

```
src/
    interfaces.ts
    main.ts
    services.ts
    types.ts
```

# Sprawozdanie 8 - Wzorce strukturalne i behawioralne

## 1. Cel zadania

Celem zadania bylo zidentyfikowanie fragmentu aplikacji, w ktorym wspolpraca obiektow lub sposob wykonywania logiki moze utrudniac dalsza rozbudowe. Nastepnie nalezalo zastosowac wzorzec strukturalny albo behawioralny, aby zmniejszyc zaleznosci miedzy klasami i poprawic czytelnosc kodu.

W aplikacji rezerwacji lotow wybrano wzorzec behawioralny **Strategia**.

## 2. Problem przed zmianami

Przed refaktoryzacja logika przetwarzania platnosci znajdowala sie bezposrednio w klasie `PlatnoscService`.

Serwis:

- walidowal dane karty,
- tworzyl obiekt platnosci,
- decydowal, jak platnosc zostanie przetworzona.

Przyklad poprzedniego podejscia:

```ts
validateCardNumber(daneKarty.numer);
validateCVV(daneKarty.cvv);

const platnosc: IPlatnosc = {
  id: `PAY-${Date.now()}`,
  idRezerwacji,
  kwota: 0,
  status: "zaksiegowana",
  dataPlatnosci: new Date(),
};
```

Takie rozwiazanie bylo wystarczajace dla jednej metody platnosci, ale w przypadku dodania kolejnych metod, np. przelewu, BLIK-a albo platnosci odroczonej, klasa `PlatnoscService` musialaby byc ciagle rozbudowywana. Prowadziloby to do wielu instrukcji warunkowych i silnego powiazania serwisu z konkretnymi sposobami platnosci.

## 3. Zastosowany wzorzec

Zastosowano wzorzec **Strategia**. Pozwala on wydzielic zmienny algorytm do osobnych klas i wymieniac go bez zmiany glownego serwisu.

Dodano interfejs `IPlatnoscStrategy`, ktory okresla wspolny kontrakt dla wszystkich strategii platnosci:

```ts
export interface IPlatnoscStrategy {
  nazwa: string;

  przetworz(
    idRezerwacji: string,
    danePlatnosci: DanePlatnosci
  ): IPlatnosc;
}
```

Nastepnie dodano dwie konkretne strategie:

- `CardPaymentStrategy` - obsluguje platnosc karta,
- `BankTransferPaymentStrategy` - obsluguje platnosc przelewem.

## 4. Stan po refaktoryzacji

Po zmianach PlatnoscService nie zna szczegolow konkretnej metody platnosci. Serwis pelni role kontekstu strategii: przechowuje aktualna strategie i deleguje do niej wykonanie platnosci.

```ts
const platnosc = this.platnoscStrategy.przetworz(
  idRezerwacji,
  danePlatnosci
);
```

Strategie mozna rowniez wymienic w czasie dzialania programu:

```ts
platnoscService.ustawStrategiePlatnosci(
  new BankTransferPaymentStrategy()
);
```

W pliku `main.ts` pokazano uzycie dwoch strategii:

- najpierw platnosc karta,
- potem zmiane strategii i platnosc przelewem.

## 5. Korzysci

Zastosowanie wzorca Strategia przynioslo nastepujace korzysci:

- zmniejszenie odpowiedzialnosci klasy `PlatnoscService`,
- usuniecie zaleznosci serwisu od szczegolow konkretnej metody platnosci,
- latwiejsze dodawanie nowych metod platnosci,
- brak potrzeby rozbudowywania serwisu o kolejne instrukcje `if/else` albo `switch`,

## 6. Podsumowanie

W ramach zadania zastosowano wzorzec behawioralny **Strategia** do obslugi platnosci. Problemem byla mozliwa rozbudowa klasy `PlatnoscService` o wiele roznych sposobow platnosci. Po refaktoryzacji kazdy sposob platnosci zostal przeniesiony do osobnej klasy strategii.

Dzieki temu aplikacja jest bardziej elastyczna i latwiejsza w utrzymaniu. Dodanie kolejnej metody platnosci wymaga teraz utworzenia nowej klasy implementujacej IPlatnoscStrategy, bez modyfikowania glownej logiki serwisu platnosci.
