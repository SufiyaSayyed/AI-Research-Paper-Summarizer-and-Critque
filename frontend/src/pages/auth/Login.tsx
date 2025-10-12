import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/hooks/queriesAndMutation";
import { loginSchema } from "@/lib/validations";
import type { LoginRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isError, isPending } = useLoginMutation();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const loginRequest: LoginRequest = {
        email: data.email,
        password: data.password,
      };
      mutate(loginRequest);
    } catch (error) {
      form.setError("root", { message: "Server error" });
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <div className=" flex-center flex-col">
        {/* <img src="/assets/images/logo.svg" alt="logo" /> */}

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="md:base-regular mt-2">
          Welcome back! Please enter your details.
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="">
            {form.formState.isSubmitting && isPending ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Log In"
            )}
          </Button>
          {isError && <p className="text-red-600">Invalid Credentials</p>}
          <p className="text-center mt-2">
            Don&apos;t have an account?
            <Link
              to="/sign-up"
              className="text-primary font-semi-bold ml-1 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default Login;
