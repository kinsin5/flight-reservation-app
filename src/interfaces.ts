import {
  StatusRezerwacji,
  StatusPlatnosci,
  KanalPowiadomienia,
  KryteriaWyszukiwania,
  DanePlatnosci
} from "./types";

export interface ILot {
  id: string;
  trasa: string;
  dataWylotu: Date;
  dataPrzylotu: Date;
  cena: number;
  dostepneMiejsca: number;
}

export interface IRezerwacja {
  id: string;
  idLotu: string;
  idUzytkownika: string;
  status: StatusRezerwacji;
  dataRezerwacji: Date;
}

export interface IPlatnosc {
  id: string;
  idRezerwacji: string;
  kwota: number;
  status: StatusPlatnosci;
  dataPlatnosci: Date;
}

export interface IUzytkownik {
  id: string;
  imie: string;
  nazwisko: string;
  email: string;
}

export interface IPowiadomienie {
  id: string;
  idUzytkownika: string;
  kanal: KanalPowiadomienia;
  tresc: string;
}

export interface ISearchService {
  wyszukajLoty(
    kryteria: KryteriaWyszukiwania
  ): ILot[];
}

export interface IRezerwacjaService {
  utworzRezerwacje(
    idLotu: string,
    idUzytkownika: string
  ): IRezerwacja;

  anulujRezerwacje(
    idRezerwacji: string
  ): boolean;
}

export interface IPlatnoscService {
  przetworzPlatnosc(
    idRezerwacji: string,
    danePlatnosci: DanePlatnosci
  ): IPlatnosc;
}

export interface IPlatnoscStrategy {
  nazwa: string;

  przetworz(
    idRezerwacji: string,
    danePlatnosci: DanePlatnosci
  ): IPlatnosc;
}
