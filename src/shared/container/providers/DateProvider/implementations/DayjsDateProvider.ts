import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IDateProvider } from '../IDateProvider';

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  dateNow(): Date {
    return dayjs().toDate();
  }

  compareInHours(start_date: Date, end_date: Date): number {
    const start_date_utc = this.converToUTC(start_date);
    const end_date_utc = this.converToUTC(end_date);

    return dayjs(end_date_utc).diff(start_date_utc, 'hours');
  }

  converToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }
}

export { DayjsDateProvider };
