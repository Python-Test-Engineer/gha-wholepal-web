"use client";

import * as React from "react";
import { ProductInfoTabEnum, ProductStepEnum } from "@/enums/product";
import { stepStyles, connectorStyles } from "./styled";

const Steps: FunctionComponent<{
  steps: ProductStepEnum[];
  activeStep: ProductStepEnum;
  schema: ProductManagement.ProductCategory[];
}> = ({ steps, activeStep, schema }) => {
  const t = useTranslations();

  const getLabel = (step: ProductStepEnum): string => {
    const typeBySteps = {
      [ProductStepEnum.LINE_DETAILS]: ProductInfoTabEnum.LINE_DETAILS,
      [ProductStepEnum.PRICING]: ProductInfoTabEnum.PRICING,
      [ProductStepEnum.PRODUCT_SPECIFICATIONS]:
        ProductInfoTabEnum.PRODUCT_SPECIFICATIONS,
      [ProductStepEnum.NUTRITION_VALUES]: ProductInfoTabEnum.NUTRITION_VALUES,
      [ProductStepEnum.DIETARY_INFO]: ProductInfoTabEnum.DIETARY_INFO,
    };
    return get(find(schema, { key: get(typeBySteps, step) }), "label", null);
  };

  return (
    <div className="flex gap-3">
      <div className={connectorStyles({ isActive: true })} />
      {map(steps, (step) => {
        const isLastStep = step === ProductStepEnum.DIETARY_INFO;
        const isDone = step < activeStep;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1 max-w-min">
              <div
                className={stepStyles({
                  isActive: step === activeStep,
                  isDone,
                })}
              >
                {step}
              </div>
              <span className="text-[10px] text-center text-gray-500">
                {getLabel(step)}
              </span>
            </div>
            <div className={connectorStyles({ isActive: isLastStep })} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Steps;
