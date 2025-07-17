import { DATE_FORMAT } from "@/config/constants";

const useDateTime = (defaultFormat = DATE_FORMAT) => {
  const getDayjs = (
    value?: App.DateTime,
    isCurrentDateIfEmptyValue = false
  ): Dayjs => {
    if (!value) {
      return isCurrentDateIfEmptyValue ? dayjs() : null;
    }
    if (isString(value)) {
      return dayjs(value);
    }
    if (isNumber(value)) {
      return dayjs.unix(value);
    }
    return value;
  };

  const formatDate = (value: App.DateTime, format = defaultFormat): string =>
    value ? getDayjs(value).format(format) : null;

  const getTimestamp = (): number => dayjs().unix();

  const timeAgo = (timestamp: number): string =>
    dayjs.unix(timestamp).fromNow();

  return {
    formatDate,
    getTimestamp,
    timeAgo,
  };
};

export default useDateTime;
