import {Params} from '@angular/router';

export const getTImeDiffByHours = (time1: string, time2: string): number => {
  const date1 = new Date(`08/05/2022 ${time1}`);
  const date2 = new Date(`08/06/2022 ${time2}`);

  const diff = date2.getTime() - date1.getTime();
  return Math.round(diff / 1000 / 60 / 60);
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

  console.log('totalHours', totalHours);
  console.log('today', today);
  console.log('tomorrow', tomorrow);

  return {today, tomorrow};
};

