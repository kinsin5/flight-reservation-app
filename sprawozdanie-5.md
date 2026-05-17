# Sprawozdanie 5 – Implementacja logiki aplikacji

[Link do repozytorium](https://github.com/kinsin5/flight-reservation-app)

## 1. Implementacja logiki aplikacji

Na podstawie wcześniej przygotowanych klas, interfejsów oraz typów zaimplementowano logikę aplikacji do rezerwacji biletów lotniczych w języku TypeScript. Projekt został podzielony na warstwy zgodnie z zasadami wysokiej spójności i niskiego sprzężenia.

Zaimplementowano:
- encje lotów i rezerwacji,
- repozytoria przechowujące dane,
- serwisy odpowiedzialne za logikę biznesową,
- przypadki użycia (use cases).

## 2. Implementacja przepływu danych

Każda klasa realizuje jedno, jasno określone zadanie:
- repozytoria odpowiadają za dostęp do danych,
- serwisy realizują logikę biznesową,
- use case’y obsługują główne operacje systemu.

Komunikacja pomiędzy modułami odbywa się poprzez interfejsy, co ogranicza zależności między komponentami aplikacji.

## 3. Przypadki użycia

Zaimplementowano następujące przypadki użycia:
- wyszukiwanie lotów,
- tworzenie rezerwacji,
- wyświetlanie szczegółów rezerwacji,
- anulowanie rezerwacji,
- obsługę płatności,
- wysyłanie powiadomień.

Aplikacja została uruchomiona w trybie konsolowym z przykładowymi danymi testowymi.

## 4. Wnioski

Projekt został przygotowany w sposób modularny i czytelny. Poszczególne elementy systemu są logicznie powiązane wewnątrz modułów, a zależności pomiędzy warstwami zostały ograniczone poprzez zastosowanie interfejsów i oddzielenie odpowiedzialności klas.

