declare namespace FAQManagement {
  interface Question {
    id: number;
    question: string;
    content: string;
  }

  interface Section {
    id: string;
    title: string;
    description?: string;
    questions?: Question[];
  }
}
