"use client";

import { Layout } from "@/components/Layout";
import FAQsSidebar from "./faqs-sidebar";
import FAQsContent from "./faqs-content";
import { UserTypeEnum } from "@/enums/user";
import { supplierFAQs, wholesalerFAQs } from "./faqs-data";

const FAQs: FunctionComponent = () => {
  const t = useTranslations();
  const { userInfo: currentUser } = useUser();
  const userType = get(currentUser, "type", UserTypeEnum.SUPPLIER);
  const isSupplier = userType === UserTypeEnum.SUPPLIER;
  const faqs = isSupplier ? supplierFAQs : wholesalerFAQs;
  const [activeId, setActiveId] = useState(null);
  const scrollRef = useRef(null);

  const onClickQuestion = (question: FAQManagement.Question): void => {
    setActiveId(question.id);

    setTimeout(() => {
      const target = scrollRef.current?.view.querySelector(
        `#question-${question.id}`
      );
      if (target) {
        const offset = target.offsetTop;
        scrollRef.current.view.scrollTo({
          top: offset,
          behavior: "smooth",
        });
      }
    }, 400);
  };

  const renderHeader = (): React.JSX.Element => {
    const description = isSupplier
      ? t("supplier_faqs_description")
      : t("wholesaler_faqs_description");

    return (
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("faqs")}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    );
  };

  return (
    <Layout>
      <div className="bg-background min-h-[calc(100vh-14rem)]">
        {renderHeader()}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <FAQsContent
            faqs={faqs}
            activeId={activeId}
            scrollRef={scrollRef}
            setActiveId={setActiveId}
          />
          <FAQsSidebar onClickQuestion={onClickQuestion} />
        </div>
      </div>
    </Layout>
  );
};

export default FAQs;
