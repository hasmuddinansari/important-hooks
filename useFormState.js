const { useState } = require("react");

const checkEmail = (email) => {
  return !email.includes("@");
};

const checkName = (name) => {
  return name.length <= 5;
};

const checkMobile = (mobile) => {
  return mobile.length !== 10;
};

const checkDefault = (otherString) => {
  return !Boolean(otherString);
};

const validation = {
  email: checkEmail,
  name: checkName,
  mobile: checkMobile,
  other: checkDefault
};

export const useFormState = (initial) => {
  const [form, setForm] = useState(initial);

  const onChange = (event) => {
    const { name, value } = event.target ?? {};
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const checkVaidation = (form) => {
    const newForm = { ...form };
    delete newForm["errors"];
    const errors = Object.keys(newForm).reduce((errorForm, key) => {
      const validationFunction = validation[key];
      if (validationFunction) {
        errorForm[key] = validationFunction(form[key]);
      } else {
        errorForm[key] = validation["other"](form[key]);
      }
      return errorForm;
    }, {});
    const isValid = !Object.values(errors).some(Boolean);
    return { errors, isValid };
  };

  const onSubmit = (event, callBack) => {
    event.preventDefault();
    event.stopPropagation();
    const { errors, isValid } = checkVaidation(form);
    if (isValid) {
      callBack();
    }
    setForm((prev) => ({ ...prev, errors }));
  };

  const resetState = () => {
    setForm(initial);
  };

  return {
    onSubmit,
    onChange,
    form,
    resetState,
    errors: form.errors
  };
};
