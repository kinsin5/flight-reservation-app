[Link do repozytorium i branch z sprawozdania 6:](https://github.com/kinsin5/flight-reservation-app/tree/sprawozdania/6)

Nowy kod:
```
src/
    errors.ts
    logger.ts
    validators.ts
```
    
Modyfikacja:

```
src/
    services.ts
```

# Sprawozdanie 6 – Strategie obsługi błędów

## 1. Wielopoziomowe logowanie

W projekcie został dodany moduł **Logger**, odpowiedzialny za rejestrowanie zdarzeń aplikacji. Zaimplementowano trzy poziomy logowania:
- info
- warn
- error

Logowanie zostało wykorzystane w kluczowych elementach aplikacji, takich jak:
- wyszukiwanie lotów
- tworzenie rezerwacji
- anulowanie rezerwacji
- przetwarzanie płatności
- wysyłanie powiadomień

Przyklad:

```ts
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
```

## 2. Obsługa błędów

W aplikacji wprowadzono kontrolowane wyjątki oraz spójną obsługę błędów z wykorzystaniem instrukcji 
```js
try...catch
```

Dodano własne klasy błędów:
- ValidationError
- DomainError
- InfrastructureError

Błędy są przechwytywane oraz logowane przy pomocy modułu Logger.

## 3. Walidacja danych

Dodano moduł validators.ts, w którym umieszczono wspólne funkcje walidacyjne:
- validateId
- validateCardNumber
- validateCVV

Pozwoliło to ograniczyć duplikację kodu oraz zwiększyć spójność projektu.

## 4. Eliminacja duplikacji kodu

Powtarzające się fragmenty logiki zostały przeniesione do wspólnych modułów pomocniczych:
- walidacja danych została wydzielona do validators.ts
- logowanie zostało wydzielone do logger.ts
- klasy błędów zostały wydzielone do errors.ts

Dzięki temu kod stał się bardziej modularny czytelny oraz łatwiejszy w utrzymaniu.

Przyklad validators.ts:

```ts
export function validateCVV(cvv: string): void {
  if (cvv.length !== 3) {
    throw new ValidationError(
      "CVV musi mieć 3 cyfry"
    );
  }
}
```
## 5. Podsumowanie

Wprowadzone zmiany poprawiły jakość projektu poprzez, ujednolicenie obsługi wyjątków, zwiększenie czytelności kodu, ograniczenie duplikacji, łatwiejsze diagnozowanie błędów dzięki logowaniu, zwiększenie spójności modułów aplikacji.