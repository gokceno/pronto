import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <Outlet />
      </div>
    </div>
  );
}