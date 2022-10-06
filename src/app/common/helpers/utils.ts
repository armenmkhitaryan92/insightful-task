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

export const getTImeDiffByHours2 = (time1: string, time2: string) => {
  const totalHours = getTImeDiffByHours(time1, time2);
  const date1 = new Date(`08/05/2022 ${time1}`);

  let today = 0;
  let tomorrow = 0;

  const dayFinished = '24:00';
  const dayFinishedDate = new Date(`08/05/2022 ${dayFinished}`);

  today = Math.round((dayFinishedDate.getTime() - date1.getTime()) / 1000 / 60 / 60);
  tomorrow = totalHours - today;

  return {today, tomorrow};
};
