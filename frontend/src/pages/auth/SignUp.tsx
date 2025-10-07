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
import { useSignupMutation } from "@/hooks/queriesAndMutation";
import { signupSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

type SignupForm = z.infer<typeof signupSchema>;

const SignUp = () => {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const { mutate, isPending, isError } = useSignupMutation();

  const onSubmit: SubmitHandler<SignupForm> = async (data) => {
    try {
      mutate(data);
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
          Create a new account
        </h2>
        <p className="md:base-regular mt-2">
          To use Paperlytic AI, Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Username</FormLabel>
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

          <Button type="submit">
            {form.formState.isSubmitting && isPending ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
          {isError && (
            <p className="text-red-600">
              Sorry something went wrong. Please try again.
            </p>
          )}

          <p className="text-center mt-2">
            Already have an account?
            <Link
              to="/login"
              className="text-primary font-semi-bold ml-1 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignUp;
