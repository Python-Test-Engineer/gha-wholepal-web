export const supplierFAQs: FAQManagement.Section[] = [
  {
    id: "productUploadAndManagement",
    title: "Product Upload & Management",
    questions: [
      {
        id: 1,
        question: "How do I upload products?",
        content:
          '<p>Navigate to <span class="font-semibold">‘My Products’</span> and click <span class="font-semibold">‘Upload Products’</span> in the top navigation bar.</p>\n<ul class="list-disc pl-6"><li>You may upload files in PDF, Word, or Excel format.</li><li>The system currently supports up to 30 products per upload.</li><li>Once the file is uploaded, you’ll see a message stating: <span class="font-semibold">“Processing your files.”</span></li><li>When AI matching is complete, click <span class="font-semibold">‘Upload complete – click to verify your data’</span> to proceed through the data verification steps</strong></li></ul>',
      },
      {
        id: 2,
        question: "How do I amend product data during the matching steps?",
        content:
          "Our AI will pre-fill product information based on your file, but you can correct any inaccuracies during the verification process. You may also save your progress and return later, or make further edits once the product has been uploaded by accessing its individual product page.",
      },
      {
        id: 3,
        question: "What should I do if my file won’t upload?",
        content:
          'Please send the file to <a href="mailto:support@wholepal.com" class="text-primary hover:underline font-semibold">support@wholepal.com</a> with a brief explanation of the issue, and a member of our team will assist you.',
      },
      {
        id: 4,
        question: "What if there are inaccuracies in the AI-matched data?",
        content:
          'Please take a screenshot of the issue and email it to <a href="mailto:support@wholepal.com" class="text-primary hover:underline font-semibold">support@wholepal.com</a>. This helps us improve the platform and ensure your data is correct.',
      },
      {
        id: 5,
        question: "How do I publish a product so that wholesalers can find it?",
        content:
          "Once you have completed the matching steps and entered all required fields (e.g. SKU and product image), click <span class='font-semibold'>‘Publish Product Version’</span>. The product will then be visible to trading partners on the platform.",
      },
      {
        id: 6,
        question: "How do I amend product data for published products?",
        content:
          'To make updates to a live product, open its product page, make your changes, and click <span class="font-semibold">‘Save Changes’</span>. You will then be prompted to <span class="font-semibold">‘Publish New Version’</span> — this creates a new version, which replaces the old one and notifies your connected trading partners automatically.',
      },
      {
        id: 7,
        question:
          "Do I need to publish a new version each time I make a change?",
        content:
          "Yes. Publishing a new version ensures that all trading partners connected to your product receive the most up-to-date information and are notified of any changes.",
      },
      {
        id: 8,
        question: "Can I restore a previous version of a product?",
        content:
          "Yes. Navigate to the product’s version history and select the version you wish to restore. That version will then load for use or review",
      },
    ],
  },
  {
    id: "pricingAndComercials",
    title: "Pricing & Commercials",
    questions: [
      {
        id: 9,
        question: "Am I required to upload pricing or commercial terms?",
        content:
          "No. You may choose to leave pricing fields blank during upload. Commercials can be added at the point of connecting with a trading partner, or when generating a new line form.",
      },
      {
        id: 10,
        question: "How are commercials saved for each trading partner?",
        content:
          "When you connect with a trading partner using Click to Connect, you will be prompted to enter the relevant commercial information. These are stored per product and trading partner and can be reviewed or updated at any time.",
      },
    ],
  },
  {
    id: "documentManagement",
    title: "Document Management",
    questions: [
      {
        id: 11,
        question: "How do I use the ‘Documents’ section?",
        content:
          '<p>You may upload documents such as:</p>\n<ul class="list-disc pl-6"><li>BRC certificates</li><li>SALSA accreditations</li><li>Organic / Soil Association certificates</li><li>Signed trading terms</li><li>Any other product documents</li></ul>\n<p>Once uploaded, these documents can be shared with trading partners via the <span class="font-semibold">‘Share’</span> button on the right hand side.</p>',
      },
    ],
  },
  {
    id: "newLineForms",
    title: "New Line Forms (NLFs)",
    questions: [
      {
        id: 12,
        question: "How do I upload a new line form (NLF)?",
        content:
          '<p>Go to <span class="font-semibold">‘NLF Templates’</span> and click <span class="font-semibold">‘New NLF Template’</span>.</p>\n<ul class="list-disc pl-6"><li>Enter the name of the trading partner for clarity</li><li>Upload the NLF in Excel format only</li><li>Please ensure all hidden or instruction sheets have been removed prior to uploading</li></ul>',
      },
      {
        id: 13,
        question: "What should I do if my NLF won’t upload?",
        content:
          "Please send the NLF as an email attachment to support@wholepal.com and we’ll help resolve the issue.",
      },
      {
        id: 14,
        question: "How do I generate a completed new line form?",
        content:
          '<ul class="list-disc pl-6"><li>Ensure the relevant NLF template has been uploaded (see step 12)</li><li>Go to <span class="font-semibold">‘My Products’</span>, select the relevant product(s), and click <span class="font-semibold">‘Generate Completed New Line Form’</span></li><li>Choose the appropriate NLF template</li><li>Once generated, the completed form will be available in the <span class="font-semibold">‘Downloads’</span> tab in the left-hand navigation. You’ll also receive a notification via the bell icon</li></ul>',
      },
      {
        id: 15,
        question: "What if the generated form is inaccurate or incomplete?",
        content:
          '<p>In some cases, the AI may not populate every field correctly due to formatting differences or language variations in the NLF.</p>\n<p>Please send both:</p>\n<ul class="list-disc pl-6"><li>The original uploaded NLF</li><li>The downloaded completed version to <a href="mailto:support@wholepal.com" class="text-primary hover:underline font-semibold">support@wholepal.com</a> so our team can investigate further.</li></ul>\n<p><span class="font-semibold">Important:</span> This tool is designed to assist with NLF completion. Please review each form for accuracy before sending it externally.</p>',
      },
    ],
  },
  {
    id: "clickToConnectAndPartnerships",
    title: "Click to Connect & Partnerships",
    questions: [
      {
        id: 16,
        question:
          "What happens when a trading partner clicks to connect with one of my products?",
        content:
          '<p>You’ll receive a notification when a trading partner initiates a connection.</p>\n<ul class="list-disc pl-6"><li>Once accepted, you’ll be prompted to input commercials</li><li>The product will then be shared directly with the partner, without requiring a new line form</li><li>Any future updates to that product will automatically notify connected partners and share the new version</li></ul>',
      },
    ],
  },
  {
    id: "needHelp",
    title: "Need Help?",
    description:
      'If you encounter any issues or have questions at any point while using the platform, please don’t hesitate to contact us.\n\nTo raise a support ticket, simply email <a href="mailto:support@wholepal.com" class="text-primary hover:underline font-semibold">support@wholepal.com</a> with a brief description of the problem. One of our team members will respond as soon as possible to assist you.',
  },
];

export const wholesalerFAQs: FAQManagement.Section[] = [
  {
    id: "findingAndInvitingSuppliers",
    title: "Finding & Inviting Suppliers",
    questions: [
      {
        id: 1,
        question: "How do I find products on Wholepal?",
        content:
          '<p>Use the <span class="font-semibold">‘Supplier Products’</span> tab in the right-hand navigation to browse products listed by suppliers currently live on Wholepal. Use the main search bar to search for products my supplier name, product name, SKU code or keywords.</p>',
      },
      {
        id: 2,
        question: "How do I invite a supplier to use the platform?",
        content:
          '<p>Click the <span class="font-semibold">‘Invite Supplier’</span> button in the top-right corner of your screen. You’ll be prompted to enter thier company name and contact details — then the supplier will receive an email letting them know that <span class="font-semibold">your company</span> has invited them to list products with you via Wholepal’s AI-assisted onboarding tool.</p>',
      },
      {
        id: 3,
        question: "What happens once I’ve invited a supplier to the platform?",
        content:
          "<p>Once the supplier accepts your invitation and uploads their products, you’ll be notified via email and on-platform that their listings are now available for you to connect with.</p>",
      },
    ],
  },
  {
    id: "addingAndManagingProducts",
    title: "Adding & Managing Products",
    questions: [
      {
        id: 4,
        question: "How do I add supplier products to ‘My Products’?",
        content:
          '<p>From either the <span class="font-semibold">‘Supplier Products’</span> page or the <span class="font-semibold">‘My Products’</span> section, click <span class="font-semibold">‘Add Product’</span>. This sends a connection request to the supplier. Once accepted, the product will appear in your <span class="font-semibold">‘My Products’</span> space, where you can download the data to CSV or import it into your ERP system if connected.</p>',
      },
      {
        id: 5,
        question: "How do I download product information to CSV?",
        content:
          '<p>Select the products you want to export, then click <span class="font-semibold">‘Download to CSV’</span>. A CSV file containing the product data will be generated for you.</p>',
      },
      {
        id: 6,
        question: "Can I download multiple products to CSV?",
        content:
          'Yes - just select the products (multiple) you want to export using the left hand tick boxes, then click <span class="font-semibold">‘Download to CSV’</span>. A CSV file containing the product data will be generated for you.',
      },
      {
        id: 7,
        question: "How do I import products into my ERP?",
        content:
          '<p>If your subscription includes ERP integration, you’ll see an <span class="font-semibold">‘Import to ERP’</span> button. Click this to automatically transfer product data into your ERP system.</p>',
      },
      {
        id: 8,
        question: "How do I delete products?",
        content:
          "If you are no longer listing a product, simply delete these from ‘my products’ by using the delete icon on the right hand side of the product.",
      },
    ],
  },
  {
    id: "productUpdatesAndNotifications",
    title: "Product Updates & Notifications",
    questions: [
      {
        id: 9,
        question: "What happens if a supplier modifies a product I’ve added?",
        content:
          '<p>You will receive a notification via email and on-platform when any connected supplier updates a product.</p>\n<ul class="list-disc pl-6"><li>In <span class="font-semibold">‘My Products’</span>, a <span class="font-semibold">‘New Version Available’</span> tag will appear next to the product</li><li>Clicking this will open the product detail page, where the changes will be clearly highlighted</li><li>You will then have the option to redownload the updated product to CSV or re-import to ERP</li></ul>',
      },
    ],
  },
  {
    id: "sharedDocuments",
    title: "Shared Documents",
    questions: [
      {
        id: 10,
        question: "What is the ‘Shared Documents’ section used for?",
        content:
          '<p>This is where suppliers can upload and share important documents with you, such as:</p>\n<ul class="list-disc pl-6"><li>BRC Certificates</li><li>SALSA Accreditations</li><li>Soil Association Certifications</li><li>Signed Trading Terms</li></ul>\n<p>These are stored in a shared space for easy access and review.</p>',
      },
    ],
  },
  {
    id: "managingYourAccount",
    title: "Managing Your Account",
    questions: [
      {
        id: 11,
        question: "How can I update the detail for my account",
        content:
          '<p class="font-semibold">How do I access and manage my account details?</p><p>You can manage your account settings by clicking on the icon on the top right of the screen and selecting profile, or clicking on the ‘profile’ tab in the left hand nav at the bottom of your screen</p>\n<p>From here, you can:</p>\n<ul class="list-disc pl-6"><li>Update your name, job title, and contact details</li><li>Manage your organisation name and profile (if you have admin permissions)</li><li>View your current plan or subscription tier</li><li>Log out of the platform</li><li>Access account-related support</li></ul>\n<p>If you need to change email addresses, transfer admin rights, or request help with account access, please email <a href="mailto:support@wholepal.com" class="text-primary hover:underline font-semibold">support@wholepal.com</a> and one of our team members will assist you promptly.</p>',
      },
    ],
  },
  {
    id: "needHelp",
    title: "Need Help?",
    description:
      'If you encounter any issues or have questions while using the platform, you can raise a support ticket by emailing <a href="mailto:support@wholepal.com" class="text-primary hover:underline font-semibold">support@wholepal.com</a>.\n\nPlease include a short description of the issue. A member of our team will respond as soon as possible to assist you.',
  },
];
