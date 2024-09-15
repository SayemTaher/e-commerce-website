import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom"; // 'react-router-dom' is used for client-side routing
import UseAxiosPublic from "../../Axios/AxiosPublic/UseAxiosPublic";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const axioPublic = UseAxiosPublic();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const { firstName, lastName, email, password } = data;
    const userInfo = {
      firstName,
      lastName,
      email,
      password,
    };
    console.log(userInfo);

    axioPublic
      .post("/register", userInfo)
      .then((res) => {
        if (res.data.success) {
          reset();
          toast.success("User registered successfully");
          navigate('/login');
        }
      })
      .catch((error) => {
        toast.error(
          error.response ? error.response.data.message : error.message
        );
      });
  };

  return (
    <div className="flex items-center justify-center">
      {/* This is the form section */}
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="text"
              placeholder="First name"
              {...register("firstName", { required: "First name is required" })}
            />
            {errors.firstName && <span>{errors.firstName.message}</span>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Last name"
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && <span>{errors.lastName.message}</span>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <span>{errors.email.message}</span>}
          </div>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter a strong password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[a-z]).{6,}$/,
                  message:
                    "Password must have at least 6 characters and include uppercase and lowercase letters",
                },
              })}
            />
            {errors.password && <span>{errors.password.message}</span>}
            <span
              className="-ml-6 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </span>
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
      {/* Other sections can be added here */}
      <div></div>
    </div>
  );
};

export default Register;
