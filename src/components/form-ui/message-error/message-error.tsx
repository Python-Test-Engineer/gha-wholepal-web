import { AlertCircle } from "lucide-react";

const MessageError: FunctionComponent<{
  errors: FieldErrors<FieldValues>;
  name: string;
}> = ({ errors, name }) => (
  <>
    {flatten([errors]).map((error, index: number) => (
      <p
        key={index}
        className="mt-1 text-destructive text-sm flex items-center"
      >
        <AlertCircle className="mr-1 h-4 w-4" />
        {get(error, [name, "message"])}
      </p>
    ))}
  </>
);

export default MessageError;
