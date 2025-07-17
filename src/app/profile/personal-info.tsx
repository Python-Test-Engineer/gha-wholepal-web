import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Input from "@/components/form-ui/input";
import {
  Briefcase,
  Building,
  Edit,
  Loader2,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CONTAINER_VARIANTS, ITEM_VARIANTS } from "@/config/constants";
import { updateUserInfo } from "@/api/user";

const PersonalInfo: FunctionComponent<{
  userInfo: Auth.User;
  onSucceed: (user: Auth.User) => void;
}> = ({ userInfo, onSucceed }) => {
  const t = useTranslations();
  const { handleResponseError } = useFormValidator();
  const { control, reset, setError, clearErrors, handleSubmit } = useForm({
    defaultValues: {
      fullName: userInfo.fullName,
      email: userInfo.email,
      phoneNumber: userInfo.phoneNumber,
      company: userInfo.company.name,
      jobTitle: userInfo.jobTitle || "",
      location: userInfo.location || "",
    },
  });
  const [isEditing, setIsEditing] = useState(false);

  const updateUserInfoMutation = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: (response) => {
      onSucceed(response);
      setIsEditing(false);
      toast.success("Your profile has been updated successfully");
    },
    onError: (error: App.ResponseError) => handleResponseError(error, setError),
  });

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset();
    clearErrors();
  };

  const handleSaveProfile = handleSubmit((formValue) => {
    updateUserInfoMutation.mutate(formValue);
  });

  const renderHeader = (): React.JSX.Element => (
    <CardHeader className="pb-4 flex flex-row items-center justify-between">
      <div>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Manage your personal details and contact information
        </CardDescription>
      </div>
      {!isEditing ? (
        <Button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button
            onClick={handleCancelEdit}
            variant="outline"
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSaveProfile}
            className="flex items-center gap-2"
            disabled={updateUserInfoMutation.isPending}
          >
            {updateUserInfoMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {updateUserInfoMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </CardHeader>
  );

  const renderFormInput = (): React.JSX.Element => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        control={control}
        name="fullName"
        label={t("full_name")}
        prefixIcon={<User />}
        rules={{ required: t("field_required", { field: t("full_name") }) }}
      />
      <Input
        control={control}
        name="email"
        label={t("email_address")}
        prefixIcon={<Mail />}
        readOnly
      />
      <Input
        control={control}
        name="phoneNumber"
        label={t("phone_number")}
        placeholder="+44 7123 456 789"
        prefixIcon={<Phone />}
      />
      <Input
        control={control}
        name="company"
        label={t("company")}
        prefixIcon={<Building />}
        readOnly
      />
      <Input
        control={control}
        name="jobTitle"
        label={t("job_title")}
        prefixIcon={<Briefcase />}
      />
      <Input
        control={control}
        name="location"
        label={t("address")}
        prefixIcon={<MapPin />}
      />
    </div>
  );

  const renderInfo = (): React.JSX.Element => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
      <motion.div variants={ITEM_VARIANTS} className="space-y-1">
        <div className="flex items-center">
          <User className="h-4 w-4 text-primary mr-2" />
          <h4 className="text-sm font-medium">Full Name</h4>
        </div>
        <p className="text-foreground pl-6">{userInfo?.fullName}</p>
      </motion.div>

      <motion.div variants={ITEM_VARIANTS} className="space-y-1">
        <div className="flex items-center">
          <Mail className="h-4 w-4 text-primary mr-2" />
          <h4 className="text-sm font-medium">Email Address</h4>
        </div>
        <p className="text-foreground pl-6">{userInfo?.email}</p>
      </motion.div>

      <motion.div variants={ITEM_VARIANTS} className="space-y-1">
        <div className="flex items-center">
          <Phone className="h-4 w-4 text-primary mr-2" />
          <h4 className="text-sm font-medium">Phone Number</h4>
        </div>
        <p className="text-foreground pl-6">{userInfo?.phoneNumber || "–"}</p>
      </motion.div>

      <motion.div variants={ITEM_VARIANTS} className="space-y-1">
        <div className="flex items-center">
          <Building className="h-4 w-4 text-primary mr-2" />
          <h4 className="text-sm font-medium">Company</h4>
        </div>
        <p className="text-foreground pl-6">
          {get(userInfo, "company.name", "–")}
        </p>
      </motion.div>

      <motion.div variants={ITEM_VARIANTS} className="space-y-1">
        <div className="flex items-center">
          <Briefcase className="h-4 w-4 text-primary mr-2" />
          <h4 className="text-sm font-medium">Job Title</h4>
        </div>
        <p className="text-foreground pl-6">{userInfo?.jobTitle || "–"}</p>
      </motion.div>

      <motion.div variants={ITEM_VARIANTS} className="space-y-1">
        <div className="flex items-center">
          <MapPinned className="h-4 w-4 text-primary mr-2" />
          <h4 className="text-sm font-medium">Address</h4>
        </div>
        <p className="text-foreground pl-6">
          {userInfo?.location ? userInfo.location : "–"}
        </p>
      </motion.div>
    </div>
  );

  return (
    <Card>
      {renderHeader()}
      <CardContent>
        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
        >
          {isEditing ? renderFormInput() : renderInfo()}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;
