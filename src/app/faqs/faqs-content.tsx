"use client";

import { motion, AnimatePresence } from "framer-motion";
import Scrollbars from "react-custom-scrollbars-2";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQsContent: FunctionComponent<{
  faqs: FAQManagement.Section[];
  activeId: number;
  scrollRef: Ref<Scrollbars>;
  setActiveId: (id: number) => void;
}> = ({ faqs, activeId, scrollRef, setActiveId }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="lg:col-span-3 overflow-hidden"
    >
      <Scrollbars
        ref={scrollRef}
        autoHeight
        autoHeightMax={`calc(100vh - 14rem)`}
      >
        <div className="pr-6 flex flex-col gap-6">
          {map(faqs, (section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h3 className="font-semibold text-xl">{section.title}</h3>
              {section.description && (
                <p
                  className="text-base text-foreground whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: section.description,
                  }}
                />
              )}
              {!isEmpty(section.questions) && (
                <div className="flex flex-col gap-4 p-6 bg-card border border-border rounded-lg shadow-sm">
                  {map(section.questions, (question) => {
                    const isOpen = activeId === question.id;

                    return (
                      <div
                        key={question.id}
                        className="flex flex-col gap-4 [&:not(:last-child)]:pb-4 [&:not(:last-child)]:border-b"
                        id={`question-${question.id}`}
                      >
                        <p
                          className="flex items-center justify-between font-semibold text-lg cursor-pointer"
                          onClick={() =>
                            setActiveId(isOpen ? null : question.id)
                          }
                        >
                          {question.question}
                          <ChevronDownIcon
                            className={cn(
                              "w-6 h-6 transition-all duration-300 ease-in-out",
                              isOpen && "rotate-180"
                            )}
                          />
                        </p>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-base text-foreground whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{
                                __html: question.content,
                              }}
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </Scrollbars>
    </motion.div>
  );
};

export default FAQsContent;
