"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building,
  User,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  Check,
  Construction,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import {
  CONTAINER_VARIANTS,
  ITEM_VARIANTS,
  PASSWORD_REGEX,
  EMAIL_REGEX,
  WHOLEPAL_LINKS,
} from "@/config/constants";
import Input from "@/components/form-ui/input";
import Checkbox from "@/components/form-ui/checkbox";
import { Button } from "@/components/ui/button";
import Select from "@/components/form-ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { InputTypeEnum, StatusCodeEnum } from "@/enums/app";
import { register, requestJoinCompany } from "@/api/auth";
import { UserTypeEnum } from "@/enums/user";

const Register: FunctionComponent = () => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { control, reset, watch, getValues, setError, handleSubmit } = useForm({
    defaultValues: {
      companyName: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
      userType: UserTypeEnum.SUPPLIER,
    },
  });
  const password = watch("password", "");
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [existingCompany, setExistingCompany] = useState<{
    id: string;
    name: string;
  }>();
  const [showInvitationDialog, setShowInvitationDialog] = useState(false);
  const [isRequestingInvitation, setIsRequestingInvitation] = useState(false);
  const [invitationSent, setInvitationSent] = useState(false);

  const userTypes = [
    {
      label: t("wholesaler"),
      value: UserTypeEnum.WHOLESALER,
    },
    {
      label: t("supplier"),
      value: UserTypeEnum.SUPPLIER,
    },
  ];

  const inviteToken = searchParams.get("invite-token");
  useEffect(() => {
    const type = searchParams.get("type") as UserTypeEnum;
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    if (inviteToken) {
      reset({
        companyName: name || "",
        userType: type || UserTypeEnum.SUPPLIER,
        fullName: "",
        email: email || "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
      });
    }
  }, []);

  // Password strength indicators
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return t("weak");
    if (strength <= 4) return t("medium");
    return t("strong");
  };

  const onSubmit = handleSubmit(async (formValue) => {
    setRegisterError("");
    const registrationData = {
      fullName: formValue.fullName,
      email: toLower(formValue.email),
      password: formValue.password,
      companyName: formValue.companyName,
      type: formValue.userType,
    };
    if (inviteToken) {
      set(registrationData, "inviteId", inviteToken);
    }
    try {
      setLoading(true);
      await register(registrationData);
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error: App.ResponseError) {
      if (error.status === StatusCodeEnum.Conflict) {
        setExistingCompany({
          id: get(error, "errors.companyId"),
          name: get(error, "errors.companyName") || formValue.companyName,
        });
        setError("companyName", {
          message: t("company_name_already_exists"),
        });
        setShowInvitationDialog(true);
      } else {
        setRegisterError(error.message);
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  });

  const handleRequestInvitation = async () => {
    setIsRequestingInvitation(true);
    const email = getValues("email");

    try {
      await requestJoinCompany({
        email,
        companyId: get(existingCompany, "id"),
      });
      setInvitationSent(true);
      toast.success("Invitation request sent successfully!");
    } catch (error: App.ResponseError) {
      toast.error(error.message);
    } finally {
      setIsRequestingInvitation(false);
    }
  };

  const handleChooseDifferentName = () => {
    setShowInvitationDialog(false);
    // Focus on the company name input after closing dialog
    setTimeout(() => {
      document.getElementById("companyName")?.focus();
    }, 100);
  };

  const renderLogo = (): React.JSX.Element => (
    <div className="flex justify-center mb-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        {/* Replace with your actual logo */}
        <Image src="/logo.png" alt="Wholepal Logo" width={200} height={100} />
      </motion.div>
    </div>
  );

  const renderOtherContent = (): React.JSX.Element => (
    <motion.div
      variants={ITEM_VARIANTS}
      className="mt-6 text-center text-muted-foreground"
    >
      {t.rich("already_have_an_account", {
        signin: (chunk) => (
          <Link href="/login" className="text-primary hover:underline">
            {chunk}
          </Link>
        ),
      })}
    </motion.div>
  );

  const renderTermText = (): React.JSX.Element => (
    <span className="text-sm">
      {t.rich("agree_terms", {
        terms: (chunks) => (
          <Link
            href={WHOLEPAL_LINKS.TERM}
            target="_blank"
            className="text-primary hover:underline"
          >
            {chunks}
          </Link>
        ),
        policy: (chunks) => (
          <Link
            href={WHOLEPAL_LINKS.PRIVACY}
            target="_blank"
            className="text-primary hover:underline"
          >
            {chunks}
          </Link>
        ),
      })}
    </span>
  );

  const renderForm = (): React.JSX.Element => (
    <motion.form
      variants={CONTAINER_VARIANTS}
      onSubmit={onSubmit}
      className="flex flex-col gap-4"
    >
      <Select
        control={control}
        name="userType"
        label={t("account_type")}
        options={userTypes}
        disabled={Boolean(inviteToken)}
        size="large"
      />
      <Input
        name="companyName"
        control={control}
        label={t("company_name")}
        placeholder={t("your_company")}
        size="large"
        prefixIcon={<Building />}
        rules={{ required: t("field_required", { field: t("company_name") }) }}
      />
      <Input
        name="fullName"
        control={control}
        label={t("full_name")}
        placeholder={t("john_doe")}
        size="large"
        prefixIcon={<User />}
        rules={{ required: t("field_required", { field: t("full_name") }) }}
      />
      <Input
        name="email"
        control={control}
        label={t("email")}
        placeholder={t("email_example")}
        size="large"
        prefixIcon={<Mail />}
        rules={{
          required: t("field_required", { field: t("email") }),
          pattern: { value: EMAIL_REGEX, message: t("invalid_email_format") },
        }}
      />
      <Input
        name="password"
        control={control}
        type={InputTypeEnum.PASSWORD}
        label={t("password")}
        placeholder="••••••••"
        size="large"
        prefixIcon={<Lock />}
        rules={{
          required: t("field_required", { field: t("password") }),
          pattern: { value: PASSWORD_REGEX, message: t("password_rules") },
        }}
      />
      {Boolean(password) && (
        <div className="mt-2">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-muted-foreground">
              {t("password_strength")}
            </span>
            <span className="text-xs text-muted-foreground">
              {getStrengthText(passwordStrength)}
            </span>
          </div>
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(passwordStrength / 5) * 100}%` }}
              className={`h-full ${getStrengthColor(passwordStrength)}`}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {t("password_text_help")}
          </div>
        </div>
      )}
      <Input
        name="confirmPassword"
        control={control}
        type={InputTypeEnum.PASSWORD}
        label={t("confirm_password")}
        placeholder="••••••••"
        size="large"
        prefixIcon={<Lock />}
        rules={{
          required: t("please_confirm_your_password"),
          validate: {
            value: (value) => value === password || t("passwords_do_not_match"),
          },
        }}
      />
      <Checkbox
        control={control}
        name="agreeToTerms"
        label={renderTermText()}
        className="my-1.5"
        rules={{ required: t("must_agree_terms") }}
      />
      <motion.div variants={ITEM_VARIANTS}>
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-medium"
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          {t(loading ? "creating_account" : "create_account")}
        </Button>
      </motion.div>
    </motion.form>
  );

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: 0.1,
        }}
        className="w-full max-w-md"
      >
        {renderLogo()}
        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
          className="bg-card rounded-lg p-6 shadow-lg"
        >
          <motion.h1
            variants={ITEM_VARIANTS}
            className="text-foreground text-1xl font-bold mb-6 text-start"
          >
            {t("create_your_account")}
          </motion.h1>
          {registerError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/20 border border-destructive/50 text-destructive p-3 rounded-md mb-4 flex items-center"
            >
              <AlertCircle className="mr-2 h-5 w-5" />
              {registerError}
            </motion.div>
          )}
          {renderForm()}
          {renderOtherContent()}
        </motion.div>
      </motion.div>
      {/* Company Exists Dialog */}
      <Dialog
        open={showInvitationDialog}
        onOpenChange={setShowInvitationDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("company_already_exists")}</DialogTitle>
            <DialogDescription>
              {t("company_already_exists_description")}
            </DialogDescription>
          </DialogHeader>

          {!invitationSent ? (
            <div className="p-4 space-y-4">
              <div className="bg-muted p-4 rounded-md flex items-start space-x-3">
                <Building className="h-20 w-20 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">
                    {get(existingCompany, "name")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("request_join_company_or_use_diff_company_name")}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() =>
                    toast(t("deploying_feature_please_wait"), {
                      icon: <Construction className="h-6 w-6 text-amber-500" />,
                    })
                  }
                  className="w-full"
                  disabled={isRequestingInvitation}
                >
                  {isRequestingInvitation && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("request_to_join_this_company")}
                </Button>

                <Button
                  onClick={handleChooseDifferentName}
                  variant="outline"
                  className="w-full"
                >
                  {t("choose_different_company_name")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <div className="bg-green-50 p-4 rounded-md flex items-start space-x-3">
                <Check className="h-20 w-20 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800">
                    {t("invitation_request_sent")}
                  </h3>
                  <p className="text-sm text-green-700">
                    {t("sent_request_to_join_company", {
                      companyName: get(existingCompany, "name"),
                    })}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => {
                  setShowInvitationDialog(false);
                  router.push("/login");
                }}
                className="w-full"
              >
                {t("go_to_login")}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;
