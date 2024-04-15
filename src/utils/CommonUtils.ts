import { format, subDays } from 'date-fns';

class CommonUtils {
  private MAX_PREVIOUS_DAYS = 7;

  getPreviousDays = (selectedDate: Date) => {
    const prevDates = [];
    for(let i = 0; i < this.MAX_PREVIOUS_DAYS; i++) {
        const date = subDays(selectedDate, i);
        const formattedDate = format(date, 'yyyy-MM-dd');
        prevDates.push(formattedDate)
    }
    return prevDates;
  };

}

const commonUtils = new CommonUtils();

export default commonUtils;
