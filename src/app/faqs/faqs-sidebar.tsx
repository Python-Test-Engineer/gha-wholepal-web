"use client";

import { Button } from "@/components/ui/button";
import { UserTypeEnum } from "@/enums/user";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon, MessageSquareIcon } from "lucide-react";
import { supplierFAQs, wholesalerFAQs } from "./faqs-data";

const FAQsSidebar: FunctionComponent<{
  onClickQuestion: (question: FAQManagement.Question) => void;
}> = ({ onClickQuestion }) => {
  const t = useTranslations();
  const { userInfo: currentUser } = useUser();
  const userType = get(currentUser, "type", UserTypeEnum.SUPPLIER);
  const isSupplier = userType === UserTypeEnum.SUPPLIER;
  const [showQuestions, setShowQuestions] = useState(true);
  const faq = isSupplier ? supplierFAQs : wholesalerFAQs;

  const suggestedIds = isSupplier
    ? [1, 2, 3, 4, 5, 6, 7, 11, 12, 14]
    : [1, 2, 3, 4, 5, 6, 8, 9];

  const allQuestions: FAQManagement.Question[] = reduce(
    faq,
    (acc, cur) => {
      if (isEmpty(cur.questions)) {
        return acc;
      }
      return [...acc, ...cur.questions];
    },
    []
  );

  const suggestedQuestions = filter(allQuestions, ({ id }) =>
    includes(suggestedIds, id)
  );

  const renderQuestions = (): React.JSX.Element => {
    return (
      <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <MessageSquareIcon className="h-4 w-4 text-primary" />
            Suggested Questions
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setShowQuestions(!showQuestions)}
          >
            <ChevronDownIcon
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                showQuestions ? "transform rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        <AnimatePresence>
          {showQuestions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 overflow-hidden"
            >
              {suggestedQuestions.map((question) => (
                <Button
                  key={question.id}
                  variant="ghost"
                  className="w-full justify-start text-sm font-normal text-foreground/90 hover:text-foreground bg-muted/50 hover:bg-muted"
                  onClick={() => onClickQuestion(question)}
                >
                  <span className="truncate" title={question.question}>
                    {question.question}
                  </span>
                </Button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="lg:col-span-1 space-y-6"
    >
      {renderQuestions()}
    </motion.div>
  );
};

export default FAQsSidebar;
