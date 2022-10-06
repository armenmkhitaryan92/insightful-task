import {Params} from '@angular/router';

export const getTImeDiffByHours = (time1: string, time2: string): number => {

  const date1 = new Date(`08/05/2022 ${time1}`);
  const date2 = new Date(`08/05/2022 ${time2}`);

  let diff = Math.round((date2.getTime() - date1.getTime()) / 1000 / 60 / 60);

  if (diff < 0) {
    diff += 24;
  }

  return diff;
};

export const cloneObject = <T = Params>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const getTimeDiffOnDays = (time1: string, time2: string) => {
  const totalHours = getTImeDiffByHours(time1, time2);
  let today = totalHours;
  let tomorrow = 0;

  const startTime = +time1.split(':')[0];

  if ((startTime + totalHours) > 24) {
    tomorrow = startTime + totalHours - 24;
    today = 24 - startTime;
  }

  return {today, tomorrow};
};
