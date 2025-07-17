"use client";

import { ImageFileTypeEnum } from "@/enums/media";
import {
  isString,
  trim,
  isObject,
  mapValues,
  isDate,
  isArray,
  keys,
  reduce,
  get,
  isEmpty,
  assign,
  head,
  last,
  forEach,
  isUndefined,
  map,
  lowerCase,
  isNumber,
} from "lodash-es";

export function windowRedirect(url: string) {
  if (typeof window !== "undefined") {
    window.location.href = url;
  }
}

export function trimData<T>(data: T): T {
  if (isString(data)) {
    return trim(data) as unknown as T;
  }
  if (isObject(data) && !isDate(data) && !(data instanceof File)) {
    return mapValues(data, (data) => {
      if (isString(data)) {
        return trim(data);
      }
      if (isArray(data)) {
        return data.map((item) => trimData(item));
      }
      if (isObject(data)) {
        return trimData(data);
      }
      return data;
    }) as unknown as T;
  }
  return data;
}
export function getMessageErrors(
  messageErrors: App.MessageError,
  parentField: string = null
): { field: string; message: string }[] {
  const fields = keys(messageErrors);
  return reduce(
    fields,
    (acc, field) => {
      const error = get(messageErrors, field);
      const messages = get(assign({}, error), "messages", []);
      const children = get(error, "children");
      const currentField = parentField ? `${parentField}.${field}` : field;
      if (!isEmpty(children)) {
        return [...acc, ...getMessageErrors(children, currentField)];
      }
      return [...acc, { field: currentField, message: head(messages) }];
    },
    []
  );
}

export function dataSerialization<T>(
  data: T,
  toFormData?: FormData,
  parentKey?: string
): FormData {
  const formData = toFormData || new FormData();
  if (isObject(data) && !isDate(data) && !(data instanceof File)) {
    if (isEmpty(data) && isArray(data)) {
      formData.append(`${parentKey}[]`, "");
    } else {
      if (isArray(data) && last(data) instanceof File) {
        forEach(data, (value) => {
          formData.append(parentKey, value as string);
        });
      } else {
        forEach(keys(data), (value: string) => {
          const key = parentKey ? `${parentKey}[${value}]` : value;
          dataSerialization(get(data, [value]), formData, key);
        });
      }
    }
  } else {
    if (!isUndefined(data)) {
      formData.append(parentKey, data as string);
    }
  }
  return formData;
}

export function windowOpen(url: string) {
  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
}

export function uuidv4(): string {
  return ("" + [1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (ch) => {
    const c = Number(ch);
    return (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16);
  });
}

export function mapByUuid<T>(data: Array<T>): Array<T & { uuid: string }> {
  return map(data, (item) => ({ ...item, uuid: uuidv4() }));
}

export const downloadFile = (fileName: string, data: string): void => {
  const elDownload = document.createElement("a");
  elDownload.download = fileName.replace(/[\\\/:*?"<>|]+/g, "");
  elDownload.href = URL.createObjectURL(new Blob([data]));
  document.body.appendChild(elDownload);
  elDownload.click();
  document.body.removeChild(elDownload);
};

export function normalizeText(text: string): string {
  const normalizeRegex = /[\u0300-\u036f]/g;
  return text ? text.normalize("NFD").replace(normalizeRegex, "") : "";
}

export function normalizeAndLowerCase(text: string): string {
  return lowerCase(normalizeText(text));
}

export function formatNumber(number: number): string {
  if (isNumber(number)) {
    return Intl.NumberFormat().format(number);
  }
  return null;
}

export const isScrolledToBottom = ({
  scrollHeight,
  clientHeight,
  scrollTop,
  thresholdValue = 100,
}: Pick<App.ScrollValue, "scrollHeight" | "clientHeight" | "scrollTop"> & {
  thresholdValue?: number;
}): boolean => clientHeight + scrollTop >= scrollHeight - thresholdValue;

export function convertBlobToFile(
  blob: Blob,
  fileName: string = "image.jpeg",
  fileType: ImageFileTypeEnum = ImageFileTypeEnum.JPEG
): File {
  return new File([blob], fileName, { type: fileType });
}

export function convertCanvasToFile(canvas: HTMLCanvasElement): Promise<File> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const newImage = convertBlobToFile(blob);
      resolve(newImage);
    }, ImageFileTypeEnum.JPEG);
  });
}

export function truncateFilename(filename: string, maxLength = 500) {
  const lastDotIndex = filename.lastIndexOf(".");

  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return filename.length > maxLength
      ? filename.slice(0, maxLength)
      : filename;
  }

  const name = filename.slice(0, lastDotIndex);
  const ext = filename.slice(lastDotIndex);

  const allowedNameLength = maxLength - ext.length;

  const truncatedName =
    name.length > allowedNameLength ? name.slice(0, allowedNameLength) : name;

  return truncatedName + ext;
}
