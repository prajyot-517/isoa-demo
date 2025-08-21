import React, {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

type StepState = {
  currentStep: number;
  subStep: number;
};

type BusinessDetails = {
  insured_industry: string;
  industry_name: string;
  num_employees: string;
  total_annual_revenue: string;
  has_online_revenue: string;
  total_revenue_online: string;
  insured_contact_email: string;
  has_50PCT_overseas_revenue: string;
  description:string;
};

type BusinessDetails2 = {
  has_claim_issue: string;
  has_loss_factors: string;
  has_loss_factors_details: string;
  num_customers: string;
  sensitive_data: Array<string>;
  sensitive_data_none_details: string;
  has_malware_protection: string;
  has_regular_backups: string;
  has_software_patches: string;
  has_computer_crime_cover: string;
  has_segregated_duties_payments: string;
  has_segregated_duties_expense: string;
  has_segregated_duties_fund_txns: string;
  has_auth_limits_1K: string;
  has_social_engg_fraud_ext: string;
  has_verified_destination_bank: string;
  has_approved_vendors: string;
  insured_company_url: string;
  insured_company_url_blacklisted: boolean;
  confirm_basic_cover_blacklisted_url: boolean;
  confirm_basic_cover_nourl: boolean;
};

type BusinessDetails3 = {
  insured_contact_email: string;
  has_existing_business: string;
  existing_policy_number: string;
  contact_consent: boolean;
  referral_code: string;
};

type ContactDetails = {
  insured_contact_name: string;
  insured_contact_phone: string;
};

type FinalQuestions = {
  has_current_cyber_cover: string;
  has_current_cyber_cover_details: string;
  has_cyber_training: string;
  has_qualified_it_team: string;
  has_password_policy: string;
  has_two_factor_auth: string;
  is_trading_name_different: boolean;
  insured_company_name: string;
  insured_trading_name: string;
  insured_address_line1: string;
  insured_address_line2: string;
  insured_address_postcode: string;
  insured_address_state: string;
  policy_inception_date: string;
  policy_expiry_date: string;
  insured_address_country: string;
};

type ProductDetails = {
  quoteOptionSelected: object;
  policy_id: string;
  quote_id_for_bind: string;
  policy_inception_date: string;
  quote_option_id_for_bind: string;
  optionalExtensions: Array<any>;
};

type CancelPolicyData = {
  policy_id: string;
  cancellation_date: string;
  cancellation_comments: string;
  cancel_reason: string;
};

interface CreatePolicyData {
  upguard_score_generation_date: Date | null;
  upguard_score: number | null;
  total_invoice_amount: number | null;
  total_insured_value: number | null;
  succeeding_policy_stage: string | null;
  succeeding_policy_name: string | null;
  succeeding_policy_id: string | null;
  stamp_duty: number | null;
  sections: Section[];
  referral_reasons: string | null;
  referral_number: string | null;
  quote_option_plan_name: string | null;
  quote_option_id_for_bind: string | null;
  quote_option_id: string | null;
  quote_id_for_bind: string | null;
  quote: string | null;
  product_code: string | null;
  policy_type: string | null;
  policy_status: string | null;
  policy_stage: string | null;
  policy_number: string | null;
  policy_notes: string | null;
  policy_name: string | null;
  policy_inception_date: Date | null;
  policy_id: string | null;
  policy_expiry_date: Date | null;
  policy_documents: any[];
  policy_description: string | null;
  policy_coverages: any[];
  policy_coverage_amount: number | null;
  policy_conditions: string | null;
  platform_fee: number | null;
  parent_policy: string | null;
  net_total_payable: number | null;
  net_premium: number | null;
  last_modified_date: Date | null;
  insured_trading_name: string | null;
  insured_industry: string | null;
  insured_contact_phone: string | null;
  insured_contact_name: string | null;
  insured_contact_email: string | null;
  insured_company_url_blacklisted: boolean | null;
  insured_company_url: string | null;
  insured_company_name: string | null;
  insured_address_state: string | null;
  insured_address_postcode: string | null;
  insured_address_line2: string | null;
  insured_address_line1: string | null;
  insured_address_country: string | null;
  insured_abn: string | null;
  gst_on_platform_fee: number | null;
  gst_on_commission: number | null;
  gst_on_base_premium: number | null;
  endorsement_comment: string | null;
  effective_date: Date | null;
  decline_reasons: string | null;
  created_date: Date | null;
  cover_type: string | null;
  confirm_basic_cover_nourl: boolean | null;
  confirm_basic_cover_blacklisted_url: boolean | null;
  commission_rate: number | null;
  commission: number | null;
  closing_number: string | null;
  cancellation_date: Date | null;
  cancellation_comments: string | null;
  cancel_reason: string | null;
  business_description: string | null;
  broker_name: string | null;
  broker_contact_name: string | null;
  base_premium: number | null;
}

interface Section {
  section_name: string;
  section_index: number;
  section_id: string | null;
  section_details: SectionDetail[];
  section_code: string;
  policy_id: string | null;
}

interface SectionDetail {
  section_id: string | null;
  section_detail_index: number;
  section_detail_id: string | null;
  section_detail_code: string;
  attribute_value: any;
  attribute_type: string;
  attribute_name: string;
}

// Define the type for the context state including the step state
type AppContextType = {
  stepState: StepState;
  setStepState: React.Dispatch<React.SetStateAction<StepState>>;
  businessDetails: BusinessDetails;
  setBusinessDetails: React.Dispatch<React.SetStateAction<BusinessDetails>>;
  businessDetails2: BusinessDetails2;
  setBusinessDetails2: React.Dispatch<React.SetStateAction<BusinessDetails2>>;
  businessDetails3: BusinessDetails3;
  setBusinessDetails3: React.Dispatch<React.SetStateAction<BusinessDetails3>>;
  contactDetails: ContactDetails;
  setContactDetails: React.Dispatch<React.SetStateAction<ContactDetails>>;
  finalQuestionsDetails: FinalQuestions;
  setFinalQuestionsDetails: React.Dispatch<
    React.SetStateAction<FinalQuestions>
  >;
  toastProps: { variant: string; message: string } | null;
  setToastProps: Dispatch<
    SetStateAction<{ variant: string; message: string } | null>
  >;
  createPolicyData: CreatePolicyData;
  setProductDetails: Dispatch<SetStateAction<ProductDetails>>;
  cancelPolicyData: CancelPolicyData;
  setCancelPolicyData: Dispatch<SetStateAction<CancelPolicyData>>;
  productDetails: ProductDetails;
  resetState: any;
  countryCodeForPhoneInitialStep: string;
  setCountryCodeForPhoneInitialStep: React.Dispatch<
    React.SetStateAction<string>
  >;
  // You can add more variables here as needed
};

// Initial values

const initialValueForStepState = {
  currentStep: 1,
  subStep: 1,
};

const initialValueForBusinessDetails = {
  insured_contact_email: "",
  insured_industry: "",
  industry_name: "",
  num_employees: "",
  total_annual_revenue: "",
  has_online_revenue: "no",
  total_revenue_online: "",
  has_50PCT_overseas_revenue: "",
  description:"",
};

const initialValueForBusinessDetails2 = {
  has_claim_issue: "",
  has_loss_factors: "",
  has_loss_factors_details: "",
  num_customers: "",
  sensitive_data: [],
  sensitive_data_none_details: "",
  has_malware_protection: "",
  has_regular_backups: "",
  has_software_patches: "",
  has_computer_crime_cover: "",
  has_segregated_duties_payments: "",
  has_segregated_duties_expense: "",
  has_segregated_duties_fund_txns: "",
  has_auth_limits_1K: "",
  has_social_engg_fraud_ext: "",
  has_verified_destination_bank: "",
  has_approved_vendors: "",
  insured_company_url: "",
  insured_company_url_blacklisted: false,
  confirm_basic_cover_blacklisted_url: false,
  confirm_basic_cover_nourl: false,
};

const initialValueForBusinessDetails3 = {
  insured_contact_email: "",
  has_existing_business: "no",
  existing_policy_number: "",
  contact_consent: true,
  referral_code: "",
};

const initialValueForContactDetails = {
  insured_contact_name: "",
  insured_contact_phone: "",
};

const initialValueForProductDetails = {
  quoteOptionSelected: {},
  policy_id: "",
  quote_id_for_bind: "",
  policy_inception_date: "",
  quote_option_id_for_bind: "",
  optionalExtensions: [],
};

const initialValueForFinalQuestionQuestions = {
  has_current_cyber_cover: "", //This needs to changed in res files
  has_current_cyber_cover_details: "",
  has_cyber_training: "",
  has_qualified_it_team: "",
  has_password_policy: "",
  has_two_factor_auth: "",
  is_trading_name_different: true,
  insured_company_name: "",
  insured_trading_name: "",
  insured_address_line1: "",
  insured_address_line2: "",
  insured_address_postcode: "",
  insured_address_state: "",
  policy_inception_date: "",
  policy_expiry_date: "",
  insured_address_country: "AU",
};

const initialValueForCancelPolicyData = {
  policy_id: "",
  cancellation_date: "",
  cancellation_comments: "",
  cancel_reason: "",
};

const initialValueForCreatePolicyData = {
  upguard_score_generation_date: null,
  upguard_score: null,
  total_invoice_amount: null,
  total_insured_value: null,
  succeeding_policy_stage: null,
  succeeding_policy_name: null,
  succeeding_policy_id: null,
  stamp_duty: null,
  sections: [
    {
      section_name: "Business details",
      section_code: "business_details",
      section_index: 90,
      section_id: null,
      policy_id: null,
      section_details: [
        {
          section_id: null,
          section_detail_index: 91,
          section_detail_id: null,
          section_detail_code: "has_existing_business",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name: "Do you currently have business insurance with ISOA?",
        },
        {
          section_id: null,
          section_detail_index: 92,
          section_detail_id: null,
          section_detail_code: "existing_policy_number",
          attribute_value: null,
          attribute_type: "Text",
          attribute_name: "What is your existing Business policy number?",
        },
      ],
    },

    {
      section_name: "Revenue details",
      section_index: 100,
      section_id: null,
      section_details: [
        {
          section_id: null,
          section_detail_index: 110,
          section_detail_id: null,
          section_detail_code: "total_annual_revenue",
          attribute_value: null,
          attribute_type: "Currency",
          attribute_name: "What is your customer’s total annual revenue?",
        },
        {
          section_id: null,
          section_detail_index: 120,
          section_detail_id: null,
          section_detail_code: "has_online_revenue",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name: "Is any amount generated from online activities?",
        },
        {
          section_id: null,
          section_detail_index: 130,
          section_detail_id: null,
          section_detail_code: "total_revenue_online",
          attribute_value: null,
          attribute_type: "Currency",
          attribute_name:
            "Of the total revenue above, how much was generated from online activities? (optional)",
        },
        {
          section_id: null,
          section_detail_index: 140,
          section_detail_id: null,
          section_detail_code: "has_50PCT_overseas_revenue",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name: "Is more than 50% derived from overseas?",
        },
      ],
      section_code: "revenue_details",
      policy_id: null,
    },
    {
      section_name: "Data & Compliance",
      section_index: 200,
      section_id: null,
      section_details: [
        {
          section_id: null,
          section_detail_index: 210,
          section_detail_id: null,
          section_detail_code: "num_customers",
          attribute_value: null,
          attribute_type: "Number",
          attribute_name:
            "How many customers does your business have that you use, store, disclose or collect information from.",
        },
        {
          section_id: null,
          section_detail_index: 220,
          section_detail_id: null,
          section_detail_code: "sensitive_data",
          attribute_value: null,
          attribute_type: "MultiSelect Picklist",
          attribute_name:
            "Does your business collect, store, disclose or use any of the following categories of data?",
        },
        {
          section_id: null,
          section_detail_index: 230,
          section_detail_id: null,
          section_detail_code: "sensitive_data_none_details",
          attribute_value: null,
          attribute_type: "Text",
          attribute_name: "Please provide more details",
        },
      ],
      section_code: "data_compliance",
      policy_id: null,
    },
    {
      section_name: "Loss History",
      section_index: 300,
      section_id: null,
      section_details: [
        {
          section_id: null,
          section_detail_index: 310,
          section_detail_id: null,
          section_detail_code: "has_claim_issue",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "In the past three years, have you or any of your company's subsidiaries had any incidents, unplanned business interruptions, claims or legal actions involving unauthorised access or misuse of your network that cost more than $5,000?",
        },
        {
          section_id: null,
          section_detail_index: 320,
          section_detail_id: null,
          section_detail_code: "has_loss_factors",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "Are there any factors that you are currently aware of that may cause a loss or claim that may be covered under the ISOA Health Insurance policy you are applying for?",
        },
        {
          section_id: null,
          section_detail_index: 330,
          section_detail_id: null,
          section_detail_code: "has_loss_factors_details",
          attribute_value: null,
          attribute_type: "Text",
          attribute_name: "Please provide more details",
        },
      ],
      section_code: "loss_history",
      policy_id: null,
    },
    {
      section_name: "Info security measures",
      section_index: 400,
      section_id: null,
      section_details: [
        {
          section_id: null,
          section_detail_index: 410,
          section_detail_id: null,
          section_detail_code: "num_employees",
          attribute_value: null,
          attribute_type: "Number",
          attribute_name: "How many staff does the company currently have?",
        },
        {
          section_id: null,
          section_detail_index: 420,
          section_detail_id: null,
          section_detail_code: "has_cyber_training",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "Does the Insured provide training or education to employees to increase cyber security awareness and phishing resilience at least annually?",
        },
        {
          section_id: null,
          section_detail_index: 430,
          section_detail_id: null,
          section_detail_code: "has_qualified_it_team",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "Does your business have qualified personnel assigned to manage and secure IT systems?",
        },
        {
          section_id: null,
          section_detail_index: 440,
          section_detail_id: null,
          section_detail_code: "has_password_policy",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "Does your business enforce a password policy requiring strong and unique passwords for all accounts and devices operating?",
        },
        {
          section_id: null,
          section_detail_index: 450,
          section_detail_id: null,
          section_detail_code: "has_two_factor_auth",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "Does your business enforce implementation of two-factor authentication for all accounts where available?",
        },
        {
          section_id: null,
          section_detail_index: 460,
          section_detail_id: null,
          section_detail_code: "has_malware_protection",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "Do you use anti-malware protection for all your devices such as workstations, servers, laptops and any other applicable systems?",
        },
        {
          section_id: null,
          section_detail_index: 470,
          section_detail_id: null,
          section_detail_code: "has_regular_backups",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "Do you perform regular backups of all your business critical data and store one copy off-site?",
        },
        {
          section_id: null,
          section_detail_index: 480,
          section_detail_id: null,
          section_detail_code: "has_software_patches",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "Do you apply updates and patches to software, operating systems and applications including anti-malware protection?",
        },
      ],
      section_code: "info_security_measures",
      policy_id: null,
    },
    {
      section_name: "Optional Extensions",
      section_index: 500,
      section_id: null,
      section_details: [
        {
          section_id: null,
          section_detail_index: 510,
          section_detail_id: null,
          section_detail_code: "has_computer_crime_cover",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "Would you like to purchase the extra cover for Computer Crime?",
        },
        {
          section_id: null,
          section_detail_index: 520,
          section_detail_id: "a0Uam000001KqBsEAK",
          section_detail_code: "has_segregated_duties_expense",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "a) Do you segregate duties so that no one person can request or authorise (i) expenditure; (ii) refund monies, or (iii) refund goods?",
        },
        {
          section_id: null,
          section_detail_index: 530,
          section_detail_id: null,
          section_detail_code: "has_segregated_duties_payments",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "b) Do you segregate duties so that no one person can make payments and reconcile bank statements?",
        },
        {
          section_id: null,
          section_detail_index: 540,
          section_detail_id: null,
          section_detail_code: "has_segregated_duties_fund_txns",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "c) Do you segregate duties and system passwords so that no one person can request and authorise the release of electronic funds transfers in respect of the same transaction?",
        },
        {
          section_id: null,
          section_detail_index: 550,
          section_detail_id: null,
          section_detail_code: "has_auth_limits_1K",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "d) Do you require two or more signatories or approvers for fund transfers over $1000?",
        },
        {
          section_id: null,
          section_detail_index: 560,
          section_detail_id: null,
          section_detail_code: "has_social_engg_fraud_ext",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "Would the Insured like to purchase the Social Engineering Fraud Extension?",
        },
        {
          section_id: null,
          section_detail_index: 570,
          section_detail_id: null,
          section_detail_code: "has_verified_destination_bank",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "a) Do you have procedures for verifying destination bank accounts and/or any changes to destination bank account details, before funds are transferred?",
        },
        {
          section_id: null,
          section_detail_index: 580,
          section_detail_id: null,
          section_detail_code: "has_approved_vendors",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "b) Do you hold an approved list of vendors and suppliers, including authorised contact people and contact details, which is checked when payments are made?",
        },
      ],
      section_code: "optional_extensions",
      policy_id: null,
    },
    {
      section_name: "Insurance history",
      section_index: 600,
      section_id: null,
      section_details: [
        {
          section_id: null,
          section_detail_index: 610,
          section_detail_id: null,
          section_detail_code: "has_current_cyber_cover",
          attribute_value: null,
          attribute_type: "Yes_No",
          attribute_name:
            "Does your business currently hold or has ever held Cyber Insurance?",
        },
        {
          section_id: null,
          section_detail_index: 620,
          section_detail_id: null,
          section_detail_code: "has_current_cyber_cover_details",
          attribute_value: null,
          attribute_type: "Text",
          attribute_name: "Please input your insurance providers(s)",
        },
      ],
      section_code: "insurance_history",
      policy_id: null,
    },
  ],
  referral_reasons: null,
  referral_number: null,
  quote_option_plan_name: null,
  quote_option_id_for_bind: null,
  quote_option_id: null,
  quote_id_for_bind: null,
  quote: null,
  product_code: null,
  policy_type: null,
  policy_status: null,
  policy_stage: null,
  policy_number: null,
  policy_notes: null,
  policy_name: null,
  policy_inception_date: null,
  policy_id: null,
  policy_expiry_date: null,
  policy_documents: [],
  policy_description: null,
  policy_coverages: [],
  policy_coverage_amount: null,
  policy_conditions: null,
  platform_fee: null,
  parent_policy: null,
  net_total_payable: null,
  net_premium: null,
  last_modified_date: null,
  insured_trading_name: null,
  insured_industry: null,
  insured_contact_phone: null,
  insured_contact_name: null,
  insured_contact_email: null,
  has_existing_business: "no",
  existing_policy_number: "",
  referral_code: "",
  contact_consent: true,
  insured_company_url_blacklisted: null,
  insured_company_url: null,
  insured_company_name: null,
  insured_address_state: null,
  insured_address_postcode: null,
  insured_address_line2: null,
  insured_address_line1: null,
  insured_address_country: "AU",
  insured_abn: null,
  gst_on_platform_fee: null,
  gst_on_commission: null,
  gst_on_base_premium: null,
  endorsement_comment: null,
  effective_date: null,
  decline_reasons: null,
  created_date: null,
  cover_type: null,
  confirm_basic_cover_nourl: null,
  confirm_basic_cover_blacklisted_url: null,
  commission_rate: null,
  commission: null,
  closing_number: null,
  cancellation_date: null,
  cancellation_comments: null,
  cancel_reason: null,
  business_description: null,
  broker_name: null,
  broker_contact_name: null,
  base_premium: null,
};

// Create the context with a default undefined value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Define the provider component
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stepState, setStepState] = useState<StepState>(
    initialValueForStepState
  );

  const [toastProps, setToastProps] = useState<{
    variant: string;
    message: string;
  } | null>(null);

  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>(
    initialValueForBusinessDetails
  );

  const [businessDetails2, setBusinessDetails2] = useState<BusinessDetails2>(
    initialValueForBusinessDetails2
  );

  const [businessDetails3, setBusinessDetails3] = useState(
    initialValueForBusinessDetails3
  );
  const [contactDetails, setContactDetails] = useState<ContactDetails>(
    initialValueForContactDetails
  );

  const [productDetails, setProductDetails] = useState<ProductDetails>(
    initialValueForProductDetails
  );

  const [finalQuestionsDetails, setFinalQuestionsDetails] =
    useState<FinalQuestions>(initialValueForFinalQuestionQuestions);

  const [cancelPolicyData, setCancelPolicyData] = useState(
    initialValueForCancelPolicyData
  );

  const [createPolicyData, setCreatePolicyData] = useState(
    initialValueForCreatePolicyData
  );

  const [countryCodeForPhoneInitialStep, setCountryCodeForPhoneInitialStep] =
    useState("+91"); //Todo

  // Function to reset all state variables to their initial values
  const resetState = () => {
    setStepState(initialValueForStepState);
    setToastProps(null);
    setBusinessDetails(initialValueForBusinessDetails);
    setBusinessDetails2(initialValueForBusinessDetails2);
    setBusinessDetails3(initialValueForBusinessDetails3);
    setContactDetails(initialValueForContactDetails);
    setProductDetails(initialValueForProductDetails);
    setFinalQuestionsDetails(initialValueForFinalQuestionQuestions);
    setCancelPolicyData(initialValueForCancelPolicyData);
    setCreatePolicyData(initialValueForCreatePolicyData);
    setCountryCodeForPhoneInitialStep("+91"); //Todo
  };

  // You can add more states here as needed

  const value = {
    stepState,
    setStepState,
    businessDetails,
    setBusinessDetails,
    businessDetails2,
    setBusinessDetails2,
    contactDetails,
    setContactDetails,
    businessDetails3,
    setBusinessDetails3,
    finalQuestionsDetails,
    setFinalQuestionsDetails,
    productDetails,
    setProductDetails,
    createPolicyData,
    setCreatePolicyData,
    cancelPolicyData,
    setCancelPolicyData,
    toastProps,
    setToastProps,
    resetState,
    setCountryCodeForPhoneInitialStep,
    countryCodeForPhoneInitialStep,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

const useToast = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useToast must be used within an AppProvider");
  }
  return context;
};

export { AppProvider, useAppContext, useToast };
