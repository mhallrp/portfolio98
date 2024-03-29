import { FormData, UserData, Values } from "../../../Types";
import { PASSWORD_REQUIREMENTS } from "../../../constants";
import PasswordInput from "../PasswordInput";
import UsernameInput from "../UsernameInput";
import SubmitButton from "../../Buttons/ConfirmButton";
import CancelButton from "../../Buttons/DismissButton";
import { HandleSubmit, DataCheck } from "@/Model/authLogic";
import { AddNewWindow } from "@/Model/WindowLogic";

interface InputSectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setState: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setValues: React.Dispatch<React.SetStateAction<Values[]>>;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

const AuthInputSection: React.FC<InputSectionProps> = ({ formData, setFormData, setState, setLoading, setValues, setUserData }) => {
  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const dataCheck = DataCheck(formData);
          if (dataCheck.result) {
            setLoading(true);
            const result = await HandleSubmit(e, formData, setState, setUserData);
            if (!result) {
              setLoading(false);
            }
          } else {
            AddNewWindow(setValues, "error", { title: "Error", data: dataCheck.message! });
          }
        }}
      >
        <UsernameInput formData={formData} setFormData={setFormData} />
        <div className="flex flex-col items-start justify-center">
          <PasswordInput confirm={false} setFormData={setFormData} formData={formData} labelData="Password:" />
          {formData.isRegister && <PasswordInput confirm={true} setFormData={setFormData} formData={formData} labelData="Confirm:" />}
        </div>
        <div className="flex w-full justify-end gap-2">
          <SubmitButton label={"Submit"} action={() => {}} />
          <CancelButton title="Cancel" action={() => {}} />
        </div>
      </form>
    </>
  );
};

export default AuthInputSection;
