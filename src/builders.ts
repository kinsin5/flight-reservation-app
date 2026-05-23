import { CharterFlight, FlightEntity } from "./entities";

type FlightData = {
  id?: string;
  trasa?: string;
  dataWylotu?: Date;
  dataPrzylotu?: Date;
  cena?: number;
  dostepneMiejsca?: number;
};

export class FlightBuilder {
  private data: FlightData = {};

  static create(id: string): FlightBuilder {
    return new FlightBuilder().withId(id);
  }

  withId(id: string): this {
    this.data.id = id;
    return this;
  }

  withRoute(trasa: string): this {
    this.data.trasa = trasa;
    return this;
  }

  withDeparture(dataWylotu: Date): this {
    this.data.dataWylotu = dataWylotu;
    return this;
  }

  withArrival(dataPrzylotu: Date): this {
    this.data.dataPrzylotu = dataPrzylotu;
    return this;
  }

  withPrice(cena: number): this {
    this.data.cena = cena;
    return this;
  }

  withSeats(dostepneMiejsca: number): this {
    this.data.dostepneMiejsca = dostepneMiejsca;
    return this;
  }

  buildRegular(): FlightEntity {
    const data = this.getRequiredData();

    return new FlightEntity(
      data.id,
      data.trasa,
      data.dataWylotu,
      data.dataPrzylotu,
      data.cena,
      data.dostepneMiejsca
    );
  }

  buildCharter(
    organizator: string,
    celPodrozy: string,
    czyPelnyWynajem = false
  ): CharterFlight {
    const data = this.getRequiredData();

    return new CharterFlight(
      data.id,
      data.trasa,
      data.dataWylotu,
      data.dataPrzylotu,
      data.cena,
      data.dostepneMiejsca,
      organizator,
      celPodrozy,
      czyPelnyWynajem
    );
  }

  private getRequiredData(): Required<FlightData> {
    const requiredFields: Array<keyof FlightData> = [
      "id",
      "trasa",
      "dataWylotu",
      "dataPrzylotu",
      "cena",
      "dostepneMiejsca",
    ];

    const missingFields = requiredFields.filter(
      field => this.data[field] === undefined
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Brak wymaganych danych lotu: ${missingFields.join(", ")}`
      );
    }

    return this.data as Required<FlightData>;
  }
}
