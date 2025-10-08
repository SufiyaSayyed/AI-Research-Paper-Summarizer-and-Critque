import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="h-screen flex">
      <section className="flex flex-1 justify-center items-center flex-col py-10 px-10">
        <Outlet />
      </section>

      <img
        src="./assets/images/login.svg"
        alt="login"
        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
      />
    </main>
  );
};

export default AuthLayout;
