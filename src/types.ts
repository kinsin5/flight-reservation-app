export type StatusRezerwacji =
  | "oczekujaca"
  | "potwierdzona"
  | "anulowana";

export type StatusPlatnosci =
  | "oczekujaca"
  | "zaksiegowana"
  | "odrzucona";

export type KanalPowiadomienia =
  | "email"
  | "sms";

export type Lot = {
  id: string;
  trasa: string;
  dataWylotu: Date;
  dataPrzylotu: Date;
  cena: number;
  dostepneMiejsca: number;
};

export type KryteriaWyszukiwania = {
  trasa?: string;
  data?: Date;
  liczbaPasazerow?: number;
};

export type DaneKarty = {
  numer: string;
  dataWaznosci: string;
  cvv: string;
};