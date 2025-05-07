import { useState, ChangeEvent, FormEvent, FocusEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import Meta from "../components/Meta";
import useAuthStore from "../store/authStore";
import { RegisterData } from "../types/User";

type FormData = RegisterData

type TouchedFields = {
  [K in keyof FormData]?: boolean;
};

function SignupPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    surname: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    gender: "",
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState<TouchedFields>({});
  const { register, clearError } = useAuthStore();

  // Clear any previous errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const isEmpty = (val: string) => val.trim() === "";

  const isInvalid = (key: keyof FormData) =>
    touched[key] && isEmpty(formData[key]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched to show validation errors
    const allTouched: TouchedFields = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    // Check if any field is empty
    const hasError = Object.entries(formData).some(([key, value]) =>
      isEmpty(value)
    );

    if (!hasError) {
      // Submit registration request
      await register({
        ...formData,
        // Making sure we use the correct field names expected by the API
        firstName: formData.firstName,
        surname: formData.surname,
        email: formData.email,
        password: formData.password,
        birthDay: formData.birthDay,
        birthMonth: formData.birthMonth,
        birthYear: formData.birthYear,
        gender: formData.gender,
      });
    }
  };

  return (
    <>
      <Meta title="Sign up for Facebook" />
      <div className="flex items-center justify-center bg-gray-200 min-h-screen">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-blue-500 font-bold text-6xl">facebook</h1>
          <div className="bg-white rounded-md w-[28rem] shadow-lg">
            <div className="p-4 border-b-2 border-gray-200">
              <h1 className="text-[28px] font-medium text-center">
                Create a new account
              </h1>
              <p className="text-sm text-gray-500 text-center">
                It's quick and easy.
              </p>
            </div>
            <form className="space-y-2 p-4" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="flex justify-between gap-4">
                <div
                  className={`group relative flex items-center border-2 w-full rounded-md ${
                    isInvalid("firstName")
                      ? "border-red-500"
                      : "border-gray-200"
                  } focus-within:border-blue-500`}
                >
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    className="w-full py-2 px-4 outline-none"
                    placeholder="First name"
                  />
                  {isInvalid("firstName") && (
                    <img
                      src="/mark.png"
                      alt="error"
                      className="absolute size-4 top-3 right-2 group-focus-within:hidden"
                    />
                  )}
                </div>
                <div
                  className={`group relative flex items-center border-2 w-full rounded-md ${
                    isInvalid("surname") ? "border-red-500" : "border-gray-200"
                  } focus-within:border-blue-500`}
                >
                  <input
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    className="w-full py-2 px-4 outline-none"
                    placeholder="Surname"
                  />
                  {isInvalid("surname") && (
                    <img
                      src="/mark.png"
                      alt="error"
                      className="absolute size-4 top-3 right-2 group-focus-within:hidden"
                    />
                  )}
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-1 mt-4">
                <div className="flex items-center gap-1">
                  <label className="text-xs text-gray-500">Date of birth</label>
                  <div className="flex items-center justify-center rounded-full bg-gray-500 size-4 cursor-pointer">
                    <span className="text-xs text-white">?</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(["birthDay", "birthMonth", "birthYear"] as const).map(
                    (key) => (
                      <select
                        key={key}
                        name={key}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={formData[key]}
                        className={`w-1/3 border rounded-md p-2 ${
                          isInvalid(key) ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        {key === "birthDay" && (
                          <>
                            <option value="">Day</option>
                            {Array.from({ length: 31 }, (_, i) => (
                              <option key={i + 1} value={String(i + 1)}>
                                {i + 1}
                              </option>
                            ))}
                          </>
                        )}
                        {key === "birthMonth" && (
                          <>
                            <option value="">Month</option>
                            {[
                              "Jan",
                              "Feb",
                              "Mar",
                              "Apr",
                              "May",
                              "Jun",
                              "Jul",
                              "Aug",
                              "Sep",
                              "Oct",
                              "Nov",
                              "Dec",
                            ].map((month, i) => (
                              <option key={i + 1} value={String(i + 1)}>
                                {month}
                              </option>
                            ))}
                          </>
                        )}
                        {key === "birthYear" && (
                          <>
                            <option value="">Year</option>
                            {Array.from({ length: 100 }, (_, i) => {
                              const year = new Date().getFullYear() - i;
                              return (
                                <option key={year} value={String(year)}>
                                  {year}
                                </option>
                              );
                            })}
                          </>
                        )}
                      </select>
                    )
                  )}
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-1 mt-4">
                <div className="flex items-center gap-1">
                  <label className="text-xs text-gray-500">Gender</label>
                  <div className="flex items-center justify-center rounded-full bg-gray-500 size-4 cursor-pointer">
                    <span className="text-xs text-white">?</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {["female", "male", "other"].map((g) => (
                    <div
                      key={g}
                      className={`flex items-center justify-between gap-2 py-2 px-4 border rounded-md w-1/3 ${
                        isInvalid("gender")
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                    >
                      <label htmlFor={g} className="capitalize">
                        {g}
                      </label>
                      <input
                        type="radio"
                        id={g}
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="accent-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div
                className={`group relative flex items-center border-2 rounded-md ${
                  isInvalid("email") ? "border-red-500" : "border-gray-200"
                } focus-within:border-blue-500`}
              >
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="text"
                  className="py-2 px-4 size-full outline-none"
                  placeholder="Mobile number or email address"
                />
                {isInvalid("email") && (
                  <img
                    src="/mark.png"
                    alt="error"
                    className="absolute size-4 top-2.5 right-2 group-focus-within:hidden"
                  />
                )}
              </div>

              {/* Password */}
              <div
                className={`group relative flex items-center border-2 rounded-md ${
                  isInvalid("password") ? "border-red-500" : "border-gray-200"
                } focus-within:border-blue-500`}
              >
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="password"
                  className="py-2 px-4 size-full outline-none"
                  placeholder="New password"
                />
                {isInvalid("password") && (
                  <img
                    src="/mark.png"
                    alt="error"
                    className="absolute size-4 top-2.5 right-2 group-focus-within:hidden"
                  />
                )}
              </div>
              <div className="space-y-3 mt-6">
                <p className="text-xs text-gray-500">
                  People who use our service may have uploaded your contact
                  information to Facebook.
                  <Link to="#" className="text-blue-500">
                    {" "}
                    Learn more
                  </Link>
                </p>
                <p className="text-xs text-gray-500">
                  By clicking Sign Up, you agree to our
                  <Link to="#" className="text-blue-500">
                    {" "}
                    Terms
                  </Link>
                  ,
                  <Link to="#" className="text-blue-500">
                    {" "}
                    Privacy Policy
                  </Link>{" "}
                  and
                  <Link to="#" className="text-blue-500">
                    {" "}
                    Cookies Policy
                  </Link>
                  . You may receive SMS notifications from us and can opt out at
                  any time.
                </p>
              </div>
              {/* Submit */}
              <div className="flex justify-center items-center mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-lg text-white font-medium cursor-pointer w-52 py-2 px-6 rounded-md hover:bg-green-700"
                >
                  Sign Up
                </button>
              </div>
              <div className="flex items-center justify-center mt-4">
                <Link to="/login" className="text-blue-500 text-lg">
                  Already have an account?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupPage;
