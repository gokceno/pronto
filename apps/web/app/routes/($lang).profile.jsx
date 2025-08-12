import { useTranslation } from "react-i18next";
import Header from "../components/header.jsx";
import UserInitials from "../components/user-initials.jsx";
import {
  useLoaderData,
  Form,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { db as dbServer, schema as dbSchema } from "../utils/db.server.js";
import { eq } from "drizzle-orm";
import { authenticator } from "@pronto/auth/auth.server";
import { redirect, json } from "@remix-run/node";
import { useState, useEffect } from "react";

export const loader = async ({ params, request }) => {
  const { locale } = params;
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect(`/${locale}/login`);
  }

  // Fetch user info from DB
  const dbUser = await dbServer
    .select()
    .from(dbSchema.users)
    .where(eq(dbSchema.users.id, user.id))
    .get();

  return {
    locale,
    user: dbUser,
  };
};

export const action = async ({ request, params }) => {
  const { locale } = params;
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect(`/${locale}/login`);
  }

  const formData = await request.formData();
  const firstName = formData.get("firstName")?.toString().trim();
  const lastName = formData.get("lastName")?.toString().trim();
  const dateOfBirth = formData.get("dateOfBirth")?.toString();

  // Validation
  const errors = {};

  if (!firstName || firstName.length < 3) {
    errors.firstName = "validation.firstNameRequired";
  }

  if (!lastName || lastName.length < 3) {
    errors.lastName = "validation.lastNameRequired";
  }

  // Date of birth validation (optional but if provided, should be valid)
  if (dateOfBirth && isNaN(Date.parse(dateOfBirth))) {
    errors.dateOfBirth = "validation.validDateRequired";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors, success: false }, { status: 400 });
  }

  try {
    // Update user in database
    const userName = `${firstName} ${lastName}`;
    await dbServer
      .update(dbSchema.users)
      .set({
        userName,
        dateOfBirth: dateOfBirth || null,
      })
      .where(eq(dbSchema.users.id, user.id));

    return json({ success: true, message: "validation.profileUpdateSuccess" });
  } catch (error) {
    return json(
      { errors: { general: "validation.profileUpdateFailed" }, success: false },
      { status: 500 },
    );
  }
};

export default function Profile() {
  const { t } = useTranslation();
  const { locale, user } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.userName?.split(" ")[0] || "",
    lastName: user?.userName?.split(" ").slice(1).join(" ") || "",
    dateOfBirth: user?.dateOfBirth || "",
  });

  const isSubmitting = navigation.state === "submitting";

  // Reset edit mode and form data when action is successful
  useEffect(() => {
    if (actionData?.success) {
      setIsEditing(false);
      // Update form data with potentially new user data
      setFormData({
        firstName: user?.userName?.split(" ")[0] || "",
        lastName: user?.userName?.split(" ").slice(1).join(" ") || "",
        dateOfBirth: user?.dateOfBirth || "",
      });
    }
  }, [actionData?.success, user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      firstName: user?.userName?.split(" ")[0] || "",
      lastName: user?.userName?.split(" ").slice(1).join(" ") || "",
      dateOfBirth: user?.dateOfBirth || "",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div>
      <Header
        locale={locale}
        user={user}
        alwaysBlue={true}
        className="flex-shrink-0"
      />
      <div className="w-full min-h-screen py-20 pt-16 gap-10 bg-white flex items-center justify-center">
        <div className="flex flex-col bg-white w-[31.3125rem] h-auto gap-6 justify-start">
          <div className="flex flex-row gap-4 w-[20.6875rem] h-[4rem] items-center">
            <UserInitials userName={user?.userName} size="w-16 h-16" />
            <span className="font-jakarta font-semibold text-[1.5rem]/[2rem] text-[#00192C]">
              {t("welcome", {
                username: user?.userName?.split(" ")[0] || "User",
              })}
            </span>
          </div>

          <div className="flex flex-col gap-1 w-[29rem] h-[4.75rem]">
            <div className="flex flex-row justify-between items-center">
              <span className="font-jakarta font-semibold text-[1.25rem]/[1.75rem] text-[#00192C]">
                {t("userInfo")}
              </span>
            </div>
            <span className="font-jakarta font-normal text-[0.875rem]/[1.375rem] text-[#00192C]">
              {t("profileHeader")}
            </span>
          </div>

          <div className="w-full h-[0.0625rem] bg-gray-200"></div>

          {actionData?.errors?.general && (
            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-red-600 text-sm">
                {t(actionData.errors.general)}
              </span>
            </div>
          )}

          {actionData?.success && (
            <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-600 text-sm">
                {t(actionData.message)}
              </span>
            </div>
          )}

          <Form
            method="post"
            className="flex flex-col w-[31.3125rem] h-auto gap-6"
          >
            <div className="w-full h-auto gap-4 flex flex-row">
              <div className="h-full w-[15.15625rem] gap-2 flex flex-col">
                <span className="font-jakarta font-medium text-[0.875rem]/[1.375rem] text-[#02141C]">
                  {t("name")}
                </span>
                {isEditing ? (
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="w-full h-12 border border-gray-300 py-[0.25rem] px-[0.75rem] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    {actionData?.errors?.firstName && (
                      <span className="text-red-600 text-xs">
                        {t(actionData.errors.firstName)}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-12 gap-2 border border-gray-300 py-[0.25rem] px-[0.75rem] rounded-xl text-left flex items-center bg-gray-50">
                    {user?.userName?.split(" ")[0] || ""}
                  </div>
                )}
              </div>

              <div className="h-full w-[15.15625rem] gap-2 flex flex-col">
                <span className="font-jakarta font-medium text-[0.875rem]/[1.375rem] text-[#02141C]">
                  {t("surname")}
                </span>
                {isEditing ? (
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="w-full h-12 border border-gray-300 py-[0.25rem] px-[0.75rem] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    {actionData?.errors?.lastName && (
                      <span className="text-red-600 text-xs">
                        {t(actionData.errors.lastName)}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-12 gap-2 border border-gray-300 py-[0.25rem] px-[0.75rem] rounded-xl text-left flex items-center bg-gray-50">
                    {user?.userName?.split(" ").slice(1).join(" ") || ""}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full gap-4 flex flex-col">
              <span className="font-jakarta font-medium text-[0.875rem]/[1.375rem] text-[#02141C]">
                {t("dateOfBirth")}
              </span>
              {isEditing ? (
                <div className="flex flex-col gap-1">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className="w-full h-12 border border-gray-300 py-[0.25rem] px-[0.75rem] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  {actionData?.errors?.dateOfBirth && (
                    <span className="text-red-600 text-xs">
                      {t(actionData.errors.dateOfBirth)}
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-full h-12 gap-2 border border-gray-300 py-[0.25rem] px-[0.75rem] rounded-xl text-left flex items-center bg-gray-50">
                  {user?.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString()
                    : ""}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="w-full h-10 flex flex-row justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex items-center justify-center group relative disabled:opacity-50"
                >
                  <span className="font-jakarta font-semibold text-[0.875rem]/[1.375rem] text-[#167AFE]">
                    {t("cancel")}
                  </span>
                  <div className="absolute bottom-[0.0625rem] w-0 h-0.5 bg-[#167AFE] group-hover:w-full transition-all duration-300 origin-center" />
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[8.4375rem] h-10 rounded-full hover:scale-110 transition-all bg-blue-600 flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100"
                >
                  <span className="font-jakarta font-semibold text-[0.875rem]/[1.375rem] text-white">
                    {isSubmitting ? t("updating") : t("update")}
                  </span>
                </button>
              </div>
            )}
          </Form>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-start justify-start group relative w-auto"
            >
              <span className="font-jakarta font-semibold text-[0.875rem]/[1.375rem] text-[#167AFE] relative">
                {t("edit")}
                <div className="absolute left-0 bottom-0 h-0.5 bg-[#167AFE] w-0 group-hover:w-full transition-all duration-300" />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
