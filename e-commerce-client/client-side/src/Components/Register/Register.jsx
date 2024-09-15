import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
// import AuthProvider from "../../Provider/AuthProvider";



const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { registerUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const {
    register, 
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
      console.log(data)
      const firstName = data.firstName 
      const lastName = data.lastName 
      const email = data.email 
      const password = data.password

    const userInfo = {
      firstName,lastName,email,password
    }

    try {
      const response = await registerUser(userInfo);
      if (response.success) {
        reset();
        toast.success("User registered successfully");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Helmet>
        <title>MyShop | Register</title>
      </Helmet>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              {...register("firstName", {
                required: "First name is required",
              })}
            />
            {errors.firstName && <span>{errors.firstName.message}</span>}
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              {...register("lastName", {
                required: "Last name is required",
              })}
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
    </div>
  );
};

export default Register;
