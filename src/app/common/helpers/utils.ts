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
