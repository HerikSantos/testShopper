import { type Customer } from "../../../database/entities/Customer";
import { type Measure } from "../../../database/entities/Measure";
import { compareDate } from "../../../utils/compareDate";

function verifyMeasureTimeIsGreat30Days(
    customerVerificationDatetime: Customer,
): Measure[] {
    // eslint-disable-next-line
    let arrayForReceiveMasureIfDatetime: Measure[] = [];

    if (
        customerVerificationDatetime.measures &&
        customerVerificationDatetime.measures.length > 0
    ) {
        customerVerificationDatetime.measures.map((mea) => {
            if (compareDate(mea.measure_datetime) < 30) {
                console.log(compareDate(mea.measure_datetime));
                arrayForReceiveMasureIfDatetime.push(mea);
            }

            return mea;
        });
    }

    return arrayForReceiveMasureIfDatetime;
}

export { verifyMeasureTimeIsGreat30Days };
