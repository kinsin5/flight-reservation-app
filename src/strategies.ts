import {
  IPlatnosc,
  IPlatnoscStrategy,
} from "./interfaces";
import {
  DaneKarty,
  DanePlatnosci,
  DanePrzelewu,
} from "./types";
import { ValidationError } from "./errors";
import {
  validateCardNumber,
  validateCVV,
} from "./validators";

let paymentSequence = 0;

function isDaneKarty(
  danePlatnosci: DanePlatnosci
): danePlatnosci is DaneKarty {
  return (
    "numer" in danePlatnosci &&
    "dataWaznosci" in danePlatnosci &&
    "cvv" in danePlatnosci
  );
}

function isDanePrzelewu(
  danePlatnosci: DanePlatnosci
): danePlatnosci is DanePrzelewu {
  return (
    "numerRachunku" in danePlatnosci &&
    "tytul" in danePlatnosci
  );
}

function createPlatnosc(idRezerwacji: string): IPlatnosc {
  return {
    id: `PAY-${Date.now()}-${++paymentSequence}`,
    idRezerwacji,
    kwota: 0,
    status: "zaksiegowana",
    dataPlatnosci: new Date(),
  };
}

export class CardPaymentStrategy implements IPlatnoscStrategy {
  nazwa = "karta";

  przetworz(
    idRezerwacji: string,
    danePlatnosci: DanePlatnosci
  ): IPlatnosc {
    if (!isDaneKarty(danePlatnosci)) {
      throw new ValidationError(
        "Dane platnosci nie pasuja do platnosci karta."
      );
    }

    validateCardNumber(danePlatnosci.numer);
    validateCVV(danePlatnosci.cvv);

    return createPlatnosc(idRezerwacji);
  }
}

export class BankTransferPaymentStrategy
  implements IPlatnoscStrategy
{
  nazwa = "przelew";

  przetworz(
    idRezerwacji: string,
    danePlatnosci: DanePlatnosci
  ): IPlatnosc {
    if (!isDanePrzelewu(danePlatnosci)) {
      throw new ValidationError(
        "Dane platnosci nie pasuja do przelewu."
      );
    }

    if (danePlatnosci.numerRachunku.trim().length < 8) {
      throw new ValidationError(
        "Numer rachunku jest za krotki."
      );
    }

    if (danePlatnosci.tytul.trim().length === 0) {
      throw new ValidationError(
        "Tytul przelewu nie moze byc pusty."
      );
    }

    return createPlatnosc(idRezerwacji);
  }
}
