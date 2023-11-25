import moment, { Moment } from "moment";

export const formatDate = (date: Date | Moment, format: string) =>
  moment(date).format(format);

export const getDayByIndex = (index: number) => {
  const mapper: any = {
    0: "Monday",
    1: "Tuesday",
    2: "Wednesday",
    3: "Thursday",
    4: "Friday",
    5: "Saturday",
    6: "Sunday",
  };

  return mapper[index] || "";
};
